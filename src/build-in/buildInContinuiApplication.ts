import { ContinuiApplication } from '../continuiApplication';
import { Step,
         StepOption,
         StepOptionTypes,
         StepOptionValueMap,
         IdentifiedStepOptionMaps } from 'continui-step';
import { LoggingService, LoggingDataColorTypes, TextSecureService } from 'continui-services';
import { error } from 'util';
import { fail } from 'assert';
import { HelpGenerationService } from '../services/helpGenerationService';
import { CliArgumentsParsingService } from '../services/cliArgumentsParsingService';
import { StepFactory } from '../stepFactory';
import { ActivationCenter } from '../activationCenter';

import * as fs from 'fs';
import * as path from 'path';
import * as deepmerge from 'deepmerge';

import co from 'co';

const privateScope: WeakMap<BuildInContinuiApplication, {
  steps: Step<any>[]
  activationCenter: ActivationCenter,
  stepFactory: StepFactory,
  textSecureService: TextSecureService
  loggingService: LoggingService
  helpGenerationService: HelpGenerationService,  
  defaultIdentifiedStepOptionMaps: IdentifiedStepOptionMaps
  combinedIdentifiedStepOptionMaps: IdentifiedStepOptionMaps,
}> = new WeakMap();

/**
 * Represents a continui application.
 */
export class BuildInContinuiApplication implements ContinuiApplication {

  constructor(
    activationCenter: ActivationCenter,
    stepFactory: StepFactory,
    textSecureService: TextSecureService,
    loggingService: LoggingService,
    helpGenerationService: HelpGenerationService) {

    privateScope.set(this, {
      activationCenter,
      stepFactory,         
      textSecureService,
      loggingService,
      helpGenerationService,
      steps: [],        
      defaultIdentifiedStepOptionMaps: {},
      combinedIdentifiedStepOptionMaps: {},     
    });
  }

  private loadSteps(...steps: Step<any>[]): void {        
    const scope = privateScope.get(this);
    steps.forEach((step) => {

      if (scope.steps.find(addedStep => step.identifier === addedStep.identifier)) {
        throw new Error(`There is already an step with the identifier ${step.identifier}`);
      }

      scope.defaultIdentifiedStepOptionMaps[step.identifier] = {};
      step.options.forEach(option => 
        scope.defaultIdentifiedStepOptionMaps[step.identifier][option.key] = option.defaultValue);

      scope.steps.push(step);
    });    
  }

  /**
   * Execute the continui application and required steps base on th provided options. 
   * @param identifiedStepOptionMaps Represents the steps options.
   */
  public execute(identifiedStepOptionMaps: IdentifiedStepOptionMaps): void {
    co(function* () {
      const scope = privateScope.get(this);
      const mainIdentifier: string = 'main';      

      scope.combinedIdentifiedStepOptionMaps = 
        deepmerge.all([this.getOptionsFromRootFile(), identifiedStepOptionMaps]);

      const mainStepOptionMap: StepOptionValueMap = 
        scope.combinedIdentifiedStepOptionMaps[mainIdentifier];

      this.registerSensitiveText();

      if (!mainStepOptionMap) {
        throw new Error('Main step is missing, it looks that you are not using continui from ' +
                        'CLI, so you must provide the main step parameters.');
      }
            
      const providedStepsIdentifiers: string[] = mainStepOptionMap.steps || [];    
            
      if (providedStepsIdentifiers.length) {
        if (mainStepOptionMap.stepModule) {
          this.loadStepDefinitions(mainStepOptionMap.stepModule);
        }

        this.validateIdentifiersExistence(providedStepsIdentifiers);

        scope.combinedIdentifiedStepOptionMaps = 
         deepmerge.all([
           scope.defaultIdentifiedStepOptionMaps,
           scope.combinedIdentifiedStepOptionMaps,           
         ]);
      }

      if (mainStepOptionMap.needsVersion) {            
        this.displayVersion();
        return;
      }

      if (mainStepOptionMap.needsHelp) {
        this.displayHelp(providedStepsIdentifiers);
        return;
      }

      if (mainStepOptionMap.needsSteps) {
        this.displaySteps();
        return;
      }

      if (!providedStepsIdentifiers.length) {
        throw new Error('Must provided at least one step to run. eg. [continui mystep1 ' +
                        '--mystep1.param1 "param1value" mystep2]');
      } 

      this.validateRequiredOptionProvision(providedStepsIdentifiers);

      scope.loggingService.log(`Start steps execution`);

      const executedStepContextMaps: { step: Step<any>,
        stepOptionValueMap: StepOptionValueMap,
        context: any, 
      }[] = [];

      for (let i = 0; i < providedStepsIdentifiers.length; i = i + 1) {
        const stepIdentifier: string = providedStepsIdentifiers[i];

        // I assume that the find function will always retrieve a step because his existence is
        // previously validated by the validateStepIdentifiers function.
        const step: Step<any> = this.getStep(stepIdentifier);
        const stepOpionsMap: StepOptionValueMap = 
          scope.combinedIdentifiedStepOptionMaps[stepIdentifier];

        try {
          const toDisplayOptions = Object.keys(stepOpionsMap).map((optionKey) => { 
            const optionValue: string = stepOpionsMap[optionKey] !== undefined ? 
                                                                    stepOpionsMap[optionKey] :
                                                                    '[undefined]';
            return `${optionKey}=${optionValue}`;
          });
          scope.loggingService.log(`Executing step ${step.identifier}(${step.name}) with options.`,
                                   ...toDisplayOptions);
                    
          let context: any;

          scope.loggingService.log('Starting the from options context creation for the step ' +
                                   `${step.identifier}(${step.name})`);

          context = step.createsContextFromOptionsMap(stepOpionsMap);

          scope.loggingService.log('Starting the restauration point creation for the step ' +
                                   `${step.identifier}(${step.name})`);
          yield step.createsRestaurationPoint(stepOpionsMap, context) || [];

          executedStepContextMaps.push({ step, context, stepOptionValueMap: stepOpionsMap  });

          scope.loggingService.log(`Starting the step execution ${step.identifier}(${step.name})`);
          yield step.execute(stepOpionsMap, context) || [];
          scope.loggingService.log(`Step execution ${step.identifier}(${step.name}) ` +
                                   'ended successfully');

        } catch (error) {
          scope.loggingService.log(`Restoring steps executions due error on step ` + 
                                   `${step.identifier}(${step.name})` +
                                   error.message || error);
          yield this.restoreExecutedStep(executedStepContextMaps);
          scope.loggingService.log(`Execution fail.`);
                    
          throw error;
        }
      }
      scope.loggingService.log(`Execution done.`);     
    }.bind(this)).catch((error) => {
      console.error('\n\n',error);
      process.exit(1);
    });
  }

  private getOptionsFromRootFile(): IdentifiedStepOptionMaps {
    const filePath: string = path.resolve(__dirname, 'continui.json');
    return fs.existsSync(filePath) ? require(filePath) : {};
  }

  private registerSensitiveText() {
    const scope = privateScope.get(this);

    scope.steps.forEach((step) => {
      step.options.forEach((option) => {
        if (option.isSecure) {
          scope.textSecureService.registerSensitiveText(
            scope.combinedIdentifiedStepOptionMaps[step.identifier][option.key]);
        }
      });
    });
  }  

  private displayVersion() {
    const scope = privateScope.get(this);
    
    scope.loggingService.log('Version requested');
    scope.loggingService.log('continui version: 1.0.0'); // TODO: Must log the package version.
  }

  private displayHelp(providedStepsIdentifiers: string[]) {
    const scope = privateScope.get(this);
    const generatedHelp: string = providedStepsIdentifiers.length ? 
                                        scope.helpGenerationService
                                             .getStepsHelp(...scope.steps) :
                                        scope.helpGenerationService
                                             .getStepOptionsHelp(...this.getOptions());

    scope.loggingService.log('Help requested \n\n Help \n\n' + generatedHelp);
  }

  private displaySteps() {
    const scope = privateScope.get(this);

    scope.loggingService
         .log('Steps requested \n' +  
               scope.steps.map(step => `${step.identifier}(${step.name})`).join(' '));
  }

  private loadStepDefinitions(modules: string | string[]) {
    
    let modulesArray: string[];

    if (typeof modules === 'string') {
      modulesArray = [modules];
    }
    
    if (modules instanceof Array) {
      modulesArray = modules;
    }

    modulesArray.forEach((module) => {
      const moduleResult:any = require(module);
      privateScope.get(this).activationCenter
                            .loadStepActivationDefinitions(moduleResult['default'] || moduleResult);
    });
  }

  private getStep(stepIdentifier: string): Step<any> {
    const scope = privateScope.get(this);

    let toReturn: Step<any> = scope.steps.find(step => step.identifier === stepIdentifier);

    if (!toReturn) {
      toReturn = scope.stepFactory.createStep(stepIdentifier);
      this.loadSteps(toReturn);
    }
    
    return toReturn;
  }    

  private* restoreExecutedStep(executedStepContextMaps: { 
    step: Step<any>,
    stepOptionValueMap: StepOptionValueMap,
    context: any,
  }[]) : IterableIterator<any> {              
    const scope = privateScope.get(this);

    for (let i = executedStepContextMaps.length - 1; i >= 0; i = i - 1) {
      const executedStepContextMap = executedStepContextMaps[i];
      const step = executedStepContextMap.step;

      try {
        scope.loggingService.log(`Restoring step ${step.identifier}(${step.name})`);
        yield step.restore(executedStepContextMap.stepOptionValueMap, 
                           executedStepContextMap.context) || [];
      } catch (error) {
        scope.loggingService.log(`Error restoring step ${step.identifier}(${step.name}) ` + error);
      }            
    }
        
  }

  private getOptions(): StepOption[] {
    return [
      {
        key: 'help',
        type: StepOptionTypes.boolean,
        description: '(-h) Make the tool display the help, if steps are provided, the steps ' +
                     'help will be displayed.',
      },
      {
        key: 'version',
        type: StepOptionTypes.boolean,
        description: '(-v) Make the tool display the version.',
      },
      {
        key: 'steps',
        type: StepOptionTypes.boolean,
        description: '(-s) Make the tool display the available steps.',
      },
    ];
  }

  private validateIdentifiersExistence(stepIdentifiers: string[]) {
    const scope = privateScope.get(this);
    const generalErrors: string[] = [];      

    scope.loggingService.log('Validating steps identifiers existence');

    stepIdentifiers.forEach((stepIdentifier) => {
      try {
        this.getStep(stepIdentifier);
      } catch (e) {
        generalErrors.push(e.message || e);
      }
    });

    if (generalErrors.length) {
      throw new Error('\n' + generalErrors.join('\n'));
    }
  }

  private validateRequiredOptionProvision(stepIdentifiers: string[]) {
    const scope = privateScope.get(this);
    let errorMessage:string = '';
    const stepErrorsMaps: {
      step:Step<any>,
      errors:string[],
    }[] = [];       
        
    scope.loggingService.log('Validating steps required options provision');
        
    stepIdentifiers.forEach((stepIdentifier) => {

      let step: Step<any>;
      let stepOptionMap: StepOptionValueMap;
      const stepErrors: string[] = [];

      step = this.getStep(stepIdentifier);
      stepOptionMap = privateScope.get(this)
                                  .combinedIdentifiedStepOptionMaps[step.identifier] || {};
            
      if (step && step.options) {
        step.options.filter(option => option.isRequired).forEach((option) => {
          if (!stepOptionMap[option.key] && stepOptionMap[option.key] !== 0) {
            stepErrors.push(`The option --${step.identifier}.${option.key} was not provided and ` +
                            'is required.');
          }
        });   
      }
            
      if (stepErrors.length) {
        stepErrorsMaps.push({ step, errors: stepErrors });
      }
    });

    if (stepErrorsMaps.length) {
      stepErrorsMaps.forEach((stepErrorMap) => {
        errorMessage += `\nStep [${stepErrorMap.step.identifier}](${stepErrorMap.step.name}) ` + 
                        'can not be executed due:\n\n';

        stepErrorMap.errors.forEach(error => errorMessage += error + '\n');
      });
    }

    if (errorMessage) {
      throw new Error(errorMessage);
    }
  }
}

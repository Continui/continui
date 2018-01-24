import { ContinuiApplication } from '../domain/continuiApplication';
import { Step,
         StepOption,
         StepOptionTypes,
         StepOptionValueMap,
         IdentifiedStepOptionMaps,
} from 'continui-step';
import {
  LoggingService,
  LoggingDataColorTypes,
  TextSecureService,
} from 'continui-services';
import { ExecutionConfiguration } from '../domain/models/executionConfiguration';
import { StepProvider } from '../domain/providers/stepsProvider';
import {
  FromFileExecutionConfigurationProvider,
} from '../domain/providers/fromFileExecutionConfigurationProvider';
import {
  ExecutionConfigurationMergingService,
} from '../domain/services/executionConfigurationMergingService';

import co from 'co';

type StepExecutionContext = { 
  step: Step<any>,
  stepOptionValueMap: StepOptionValueMap,
  stepContext: any, 
};

const privateScope: WeakMap<BuildInContinuiApplication, {
  steps: Step<any>[]
  stepsProvider: StepProvider
  textSecureService: TextSecureService
  loggingService: LoggingService  
  fromFileExecutionConfigurationProvider: FromFileExecutionConfigurationProvider
  executionConfigurationMergingService: ExecutionConfigurationMergingService,
}> = new WeakMap();

/**
 * Represents a continui application.
 */
export class BuildInContinuiApplication implements ContinuiApplication {

  constructor(
    textSecureService: TextSecureService,
    stepsProvider: StepProvider,
    fromFileExecutionConfigurationProvider: FromFileExecutionConfigurationProvider,
    executionConfigurationMergingService: ExecutionConfigurationMergingService) {

    privateScope.set(this, {      
      stepsProvider,
      textSecureService,      
      fromFileExecutionConfigurationProvider,
      executionConfigurationMergingService,
      steps: [],
      loggingService: null,
    });
  }

   /**
    * Execute the continui loaded application.
    * @param executionConfiguration Represents the execution configuration for the application.
    */
  public execute(executionConfiguration: ExecutionConfiguration): void {
    const scope = privateScope.get(this); 
    const stepExecutionContexts: StepExecutionContext[] = [];

    let mergedExecutionConfiguration: ExecutionConfiguration = executionConfiguration;

    // TODO: Fix this magic str
    if (executionConfiguration.cofigurationFile !== 'ignore-file-configuration') { 
      mergedExecutionConfiguration = this.getMergedExecutionConfiguration(executionConfiguration);
    }

    if (!mergedExecutionConfiguration.steps.length) {
      throw new Error('Must provided at least one step to run. eg. [continui mystep1 ' +
                      '--mystep1.param1 "param1value" mystep2]');
    }

    if (mergedExecutionConfiguration.stepsDeinitionsModules &&
        mergedExecutionConfiguration.stepsDeinitionsModules.length) {
      this.loadSteps(
        ...scope.stepsProvider
                .getStepsFromStepModules(mergedExecutionConfiguration.stepsDeinitionsModules),
      );
    }

    this.registerSensitiveText(mergedExecutionConfiguration.stepsOptionsValues);
    this.validateIdentifiersExistence(mergedExecutionConfiguration.steps);
    this.validateRequiredOptionProvision(mergedExecutionConfiguration);

    scope.loggingService.log(`Start steps execution`);

    co(function* () {
      yield executionConfiguration.steps.map((stepIdentifier) => {
        const self: BuildInContinuiApplication = <BuildInContinuiApplication>this;
        // I assume that the find function will always retrieve a step because his existence is
        // previously validated by the validateIdentifiersExistence function.
        const step: Step<any> = self.getStep(stepIdentifier);
        const stepOpionsValueMap: StepOptionValueMap =
          executionConfiguration.stepsOptionsValues[stepIdentifier] || {};
        const stepExecutionContext: StepExecutionContext = {
          step ,
          stepOptionValueMap: stepOpionsValueMap,
          stepContext: step.createsContextFromOptionsMap(stepOpionsValueMap),
        };
        
        stepExecutionContexts.push(stepExecutionContext);

        return self.executeStep(stepExecutionContext);
      }); 
      
      scope.loggingService.log(`Execution done.`);
    }.bind(this)).catch((error) => {

      co(function* () {
        const self: BuildInContinuiApplication = <BuildInContinuiApplication>this;

        scope.loggingService.log(`Restoring steps execution` + error.message || error);

        self.restoreExecutedStep(stepExecutionContexts); 
      }.bind(this));

      console.error('\n\n',error);
      scope.loggingService.log(`Execution fail.`);
    });
  }

   /**
     * Load the provided steps to his future execution.
     * @param steps Represents the steps that will be executed.
     */
  public loadSteps(...steps: Step<any>[]): void {        
    const scope = privateScope.get(this);

    steps.forEach((step) => {
      if (scope.steps.find(addedStep => step.identifier === addedStep.identifier)) {
        throw new Error(`There is already an step with the identifier ${step.identifier}`);
      }      

      scope.steps.push(step);
    });    
  }

  /**
   * Executed and step based on the provided step execution context.
   * @param stepExecutionContext Represents the execution context of the step to be executed.
   */
  private* executeStep(stepExecutionContext: StepExecutionContext): IterableIterator<any> {
    const scope = privateScope.get(this);
    const step: Step<any> = stepExecutionContext.step;

    scope.loggingService.log('Starting the from options context creation for the step ' +
                              `${step.identifier}(${step.name})`);

    scope.loggingService.log('Starting the restauration point creation for the step ' +
                              `${step.identifier}(${step.name})`);
    yield step.createsRestaurationPoint(stepExecutionContext.stepOptionValueMap, context) || [];

    scope.loggingService.log(`Starting the step execution ${step.identifier}(${step.name})`);
    yield step.execute(stepExecutionContext.stepOptionValueMap, context) || [];
    scope.loggingService.log(`Step execution ${step.identifier}(${step.name}) ` +
                              'ended successfully');
  }

  /**
   * Performs steps restorations based on the provided step execution contexts.
   * @param stepExecutionContexts Represents the execution contexts to be restored.
   */
  private* restoreExecutedStep(stepExecutionContexts: StepExecutionContext[]):
    IterableIterator<any> {              
    const scope = privateScope.get(this);

    yield stepExecutionContexts.map((stepExecutionContext) => {
      const step = stepExecutionContext.step;

      try {
        scope.loggingService.log(`Restoring step ${step.identifier}(${step.name})`);
        return step.restore(stepExecutionContext.stepOptionValueMap, 
                            stepExecutionContext.stepContext) || [];
      } catch (error) {
        scope.loggingService.log(`Error restoring step ${step.identifier}(${step.name}) ` + error);
      } 
    });
  }

  /**
   * Return an step bases on the provided identifier.
   * @param stepIdentifier Represents the step identifier to look for.
   * @returns An Step.
   */
  private getStep(stepIdentifier: string): Step<any> {
    const step: Step<any> = privateScope.get(this)
                                        .steps
                                        .find(step => step.identifier === stepIdentifier);

    if (!step) {
      throw new Error('There is not step with the provided step idenifier ' + stepIdentifier);
    }

    return step;
  }  
  
  /**
   * Register all secure values to be secured in any application output.
   * @param identifiedStepOptionMaps Represents the step otion value map.
   */
  private registerSensitiveText(identifiedStepOptionMaps: IdentifiedStepOptionMaps): void {
    const scope = privateScope.get(this);

    scope.steps.forEach((step) => {
      step.options.forEach((option) => {
        if (option.isSecure) {
          scope.textSecureService.registerSensitiveText(
            identifiedStepOptionMaps[step.identifier][option.key],
          );
        }
      });
    });
  }  

  /**
   * Validates that all provided identifiers are loaded into the application.
   * @param stepIdentifiers Represents the step identifiers to be validated.
   */
  private validateIdentifiersExistence(stepIdentifiers: string[]): void {
    const scope = privateScope.get(this);
    
    let existanceValiationErrorMessage: string = '';      

    scope.loggingService.log('Validating steps identifiers existence');

    stepIdentifiers.forEach((stepIdentifier) => {
      try {
        this.getStep(stepIdentifier);
      } catch (e) {
        existanceValiationErrorMessage += `identifier: ${stepIdentifier} -> ${e.message || e} \n`;
      }
    });

    if (existanceValiationErrorMessage) {
      throw new Error(existanceValiationErrorMessage);
    }
  }

  /**
   * Validates that all required options by the requested steps were provided.
   * @param executionConfiguration Represetns the execution configuration.
   */
  private validateRequiredOptionProvision(executionConfiguration: ExecutionConfiguration): void {
    const scope = privateScope.get(this);

    let requiredOptiosErrorMessage: string = '';
        
    scope.loggingService.log('Validating steps required options provision');
        
    executionConfiguration.steps.forEach((stepIdentifier) => {
      const step: Step<any> = this.getStep(stepIdentifier);
      const stepOptionMap: StepOptionValueMap = 
        executionConfiguration.stepsOptionsValues[step.identifier] || {};
      
      let stepRequiredOptiosErrorMessage: string = '';
            
      if (step.options) {
        step.options.filter(option => option.isRequired).forEach((option) => {
          if (!stepOptionMap[option.key] && stepOptionMap[option.key] !== 0) {
            stepRequiredOptiosErrorMessage += `The option --${step.identifier}.${option.key} was` +
                                              ' not provided and is required. \n';
          }
        });   
      }
            
      if (stepRequiredOptiosErrorMessage) {
        requiredOptiosErrorMessage += `Step [${step.identifier}](${step.name}) can not be ` +
                                      'executed due:\n\n' + stepRequiredOptiosErrorMessage + '\n';
      }
    });

    if (requiredOptiosErrorMessage) {
      throw new Error(requiredOptiosErrorMessage);
    }
  }

  /**
   * Returns the provided execution configuration merged with the file execution configuration.
   * @param unmergedExecutionConfiguration Represents the provided execution configuration.
   * @returns And execution configuration.
   */
  private getMergedExecutionConfiguration(unmergedExecutionConfiguration: ExecutionConfiguration):
    ExecutionConfiguration {

    const scope = privateScope.get(this); 
    const fromFileExecutionConfiguration : ExecutionConfiguration =
      scope.fromFileExecutionConfigurationProvider.getExecutionConfigrationFromFile(
        unmergedExecutionConfiguration.cofigurationFile,
      );
    const mergedExecutionConfiguration: ExecutionConfiguration = 
      scope.executionConfigurationMergingService
           .mergeExecutionConfigurations(fromFileExecutionConfiguration,
                                         unmergedExecutionConfiguration);

    return mergedExecutionConfiguration;
  }
}

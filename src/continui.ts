import { Step } from "./step";

import * as fs from 'fs'
import * as path from 'path'
import co from 'co'

import { StepOption } from "./stepOption"
import { StepOptionValueMap, IdentifiedStepOptionMaps } from "./types"
import { CliStepOptionParsingService } from "./services/cliStepOptionParsingService";
import { LoggingService } from "./services/loggingService";
import { error } from "util";
import { TextSecureService } from "./services/textSecureService";

//let pkg = require('../package.json')

let privateScope: WeakMap<Continui, {
    steps: Step<any>[]
    defaultIdentifiedStepOptionMaps: IdentifiedStepOptionMaps
    combinedIdentifiedStepOptionMaps: IdentifiedStepOptionMaps
    cliStepOptionParsingService: CliStepOptionParsingService
    textSecureService: TextSecureService
    loggingService: LoggingService
}> = new WeakMap();

export class Continui {

    constructor(stepList: Step<any>[],
        cliStepOptionParsingService: CliStepOptionParsingService,
        textSecureService: TextSecureService,
        loggingService: LoggingService) {

        privateScope.set(this, {
            steps: [],
            defaultIdentifiedStepOptionMaps: {},
            combinedIdentifiedStepOptionMaps: {},
            cliStepOptionParsingService: cliStepOptionParsingService,
            textSecureService: textSecureService,
            loggingService: loggingService
        })

        this.loadSteps(...stepList);
    }

    public loadSteps(...steps: Step<any>[]): void {        
        let scope = privateScope.get(this);
        steps.forEach(step => {
            scope.defaultIdentifiedStepOptionMaps[step.identifier] = {} // TODO: do not allow same step identifier.
            step.options.forEach(option => {
                scope.defaultIdentifiedStepOptionMaps[step.identifier][option.key] = option.defaultValue                          
            })

            scope.steps.push(step)
        })
    }

    public executeFromCli(cliArguments: any[]): void {
        let scope = privateScope.get(this);

        scope.loggingService.log('Executing continui from CLI')

        this.execute(scope.cliStepOptionParsingService.parse(cliArguments, scope.steps.map(step => step.identifier)))
    }

    public execute(identifiedStepOptionMaps: IdentifiedStepOptionMaps): void {
        co(function*() {
            let scope = privateScope.get(this);

            let mainIdentifier: string = 'main';
            scope.combinedIdentifiedStepOptionMaps = this.getCombinedIdentifiedStepOptionMaps(scope.defaultIdentifiedStepOptionMaps,
                                                                                              this.getOptionsFromRootFile(),
                                                                                              identifiedStepOptionMaps);

            this.registerSensitiveText()

            let mainStepOptionMap: StepOptionValueMap = scope.combinedIdentifiedStepOptionMaps[mainIdentifier];

            if (!mainStepOptionMap) {
                throw new Error('Main step is missing, it looks that you are not using continui from CLI, so you must provide the main step parameters.');
            }
            
            let toRunSteps: string[] = mainStepOptionMap.steps || [];

            if (mainStepOptionMap.needsVersion) {            
                this.displayVersion();
                return;
            }   

            if (mainStepOptionMap.needsHelp) {
                this.displayHelp();
                return;
            }

            this.validateStepIdentifiers(toRunSteps)

            scope.loggingService.log(`Start steps execution`);

            let executedStepContextMaps: { step: Step<any>, stepOptionValueMap: StepOptionValueMap, context: any }[] = []

            for (let i = 0; i < toRunSteps.length; i++) {
                let stepIdentifier: string = toRunSteps[i];

                // I assume that the find function will always retrieve a step because his existence is
                // previously validated by the validateStepIdentifiers function.
                let step: Step<any> = this.getStep(stepIdentifier);
                let stepOpionsMap: StepOptionValueMap = scope.combinedIdentifiedStepOptionMaps[stepIdentifier]

                try {
                    let toDisplayOoptions = Object.keys(stepOpionsMap).map(optionKey => { 
                        return `${optionKey}=${stepOpionsMap[optionKey] !== undefined ? stepOpionsMap[optionKey] : '[undefined]'}`
                    })
                    scope.loggingService.log(`Executing step ${step.identifier}(${step.name}) with options.`, ...toDisplayOoptions)
                    
                    let context: any

                    scope.loggingService.log(`Starting the from options context creation for the step ${step.identifier}(${step.name})`);
                    context = step.createsNewContextFromOptionsMap(stepOpionsMap)

                    scope.loggingService.log(`Starting the restauration point creation for the step ${step.identifier}(${step.name})`);
                    yield step.createsRestaurationPoint(stepOpionsMap, context) || []

                    executedStepContextMaps.push({step: step, stepOptionValueMap: stepOpionsMap, context: context})

                    scope.loggingService.log(`Starting the step execution ${step.identifier}(${step.name})`);
                    yield step.execute(stepOpionsMap, context) || []
                    scope.loggingService.log(`Step execution ${step.identifier}(${step.name}) ended successfully`);

                } catch (error) {
                    scope.loggingService.log(`Restoring steps executions due error on step ${step.identifier}(${step.name})`, 
                                            error.message || error);
                    yield this.restoreExecutedStep(executedStepContextMaps)
                    scope.loggingService.log(`Execution fail.`);
                    
                    throw error
                }
            }
            scope.loggingService.log(`Execution done.`);
        }.bind(this)).catch(error => {
            console.error('\n\n',error);
            process.exit(1)
        })
    }

    private getOptionsFromRootFile(): IdentifiedStepOptionMaps {
        let filePath: string = path.resolve(__dirname, 'continui.json')
        return fs.existsSync(filePath) ? require(filePath) : {};
    }

    private registerSensitiveText() {

    }

    private getCombinedIdentifiedStepOptionMaps(...identifiedStepOptionMaps: IdentifiedStepOptionMaps[]): IdentifiedStepOptionMaps {
        if (!identifiedStepOptionMaps.length) {
           return {};     
        }

        let toReturnidentifiedStepOptionMap: IdentifiedStepOptionMaps = {}
        let stepIdentifiers: string[] = [];

        identifiedStepOptionMaps.forEach(identifiedStepOptionMap => {
            for (let identifier in identifiedStepOptionMap) {
                if (identifiedStepOptionMap.hasOwnProperty(identifier) && stepIdentifiers.indexOf(identifier) < 0) {
                    stepIdentifiers.push(identifier)                     
                }
            }
        })

        stepIdentifiers.forEach(identifier => {
            toReturnidentifiedStepOptionMap[identifier] = 
                Object.assign({}, ...identifiedStepOptionMaps.map(identifiedStepOptionMap => identifiedStepOptionMap[identifier] || {}))
        })

        return toReturnidentifiedStepOptionMap;
    }

    private displayVersion() {
        let scope = privateScope.get(this);

        scope.loggingService.log('Version requested')
        scope.loggingService.log('continui version: 1.0.0'); // TODO: Must log the package version.
    }

    private displayHelp() {
        let scope = privateScope.get(this);
        
        scope.loggingService.log('Help requested')
        scope.loggingService.log('Help is not implemented.') // TODO: Must implement the help generator and catching
    }

    private getStep(stepIdentifier: string): Step<any> {
        let toReturn: Step<any> = privateScope.get(this).steps.find(step => step.identifier == stepIdentifier)

        if (toReturn) {
            return toReturn
        } else {
            throw new Error(`There is not any step with the identifier ${stepIdentifier}`)
        } 
    }    

    private* restoreExecutedStep(executedStepContextMaps: { step: Step<any>, stepOptionValueMap: StepOptionValueMap, context: any }[]) : IterableIterator<any> {              
        let scope = privateScope.get(this)

        for (let i = executedStepContextMaps.length - 1; i >= 0; i--) {
            let executedStepContextMap = executedStepContextMaps[i]

            try {
                scope.loggingService.log(`Restoring step ${executedStepContextMap.step.identifier}(${executedStepContextMap.step.name})`)
                yield executedStepContextMap.step.restore(executedStepContextMap.stepOptionValueMap, executedStepContextMap.context) || []
            } catch(error) {
                scope.loggingService.log(`Error restoring step ${executedStepContextMap.step.identifier}(${executedStepContextMap.step.name})`,
                                        error.message || error)
            }            
        }
        
    }

    private validateStepIdentifiers(stepIdentifiers: string[]) {
        if (!stepIdentifiers.length) {
            throw new Error('Must provided at least one step to run. eg. [continui mystep1 --mystep1.param1 "param1value" mystep2]')
        }  

        let scope = privateScope.get(this)

        let errorMessage:string = ''
        let generalErrors: string[] = []
        let stepErrorsMaps: {
            step:Step<any>,
            errors:string[]
        }[] = [] 

        scope.loggingService.log('Validating steps')

        stepIdentifiers.forEach(stepIdentifier => {

            let step: Step<any>;
            let stepOptionMap: StepOptionValueMap;
            let stepErrors: string[] = [];
            
            try {
                step = this.getStep(stepIdentifier);
                stepOptionMap = privateScope.get(this).combinedIdentifiedStepOptionMaps[step.identifier] || {};
            } catch(e) {
                generalErrors.push(e.message || e)
            }
            
            if (step && step.options) {
                step.options.filter(option => option.isRequired).forEach(option => {
                    if (!stepOptionMap[option.key] && stepOptionMap[option.key] != 0) {
                        stepErrors.push(`The option --${step.identifier}.${option.key} was not provided and is required.`)
                    }
                })   
            }    
            
            if (stepErrors.length) {
                stepErrorsMaps.push({step: step, errors: stepErrors});
            }
        })

        if (generalErrors.length) {
            errorMessage += '\nGeneral Errors \n' +  generalErrors.join('\n') + '\n'
        }

        if (stepErrorsMaps.length) {
            stepErrorsMaps.forEach(stepErrorMap => {
                errorMessage += `\nStep [${stepErrorMap.step.identifier}](${stepErrorMap.step.name}) can not be executed due:\n\n`;

                stepErrorMap.errors.forEach(error => errorMessage += error + '\n')
            })
        }

        if (errorMessage) {
            throw new Error(errorMessage);
        }
    }
}
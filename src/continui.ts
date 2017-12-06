import { Step } from "./step";

import * as fs from 'fs'
import * as path from 'path'

import { StepOption } from "./stepOption"
import { StepOptionValueMap, IdentifiedStepOptionMaps } from "./types"
import { CliStepOptionParsingService } from "./services/cliStepOptionParsingService";
import { LoggingService } from "./services/loggingService";

//let pkg = require('../package.json')

let privateScope: WeakMap<Continui, {
    steps: Step<any>[]
    defaultIdentifiedStepOptionMaps: IdentifiedStepOptionMaps
    combinedIdentifiedStepOptionMaps: IdentifiedStepOptionMaps
    cliStepOptionParsingService: CliStepOptionParsingService
    loggingService: LoggingService
}> = new WeakMap();

export class Continui {

    constructor(stepList: Step<any>[],
        cliStepOptionParsingService: CliStepOptionParsingService,
        loggingService: LoggingService) {

        privateScope.set(this, {
            steps: [],
            defaultIdentifiedStepOptionMaps: {},
            combinedIdentifiedStepOptionMaps: {},
            cliStepOptionParsingService: cliStepOptionParsingService,
            loggingService: loggingService
        })

        this.loadSteps(...stepList);
    }

    public loadSteps(...steps: Step<any>[]): void {
        
        let scope = privateScope.get(this);

        steps.forEach(step => {

            scope.steps.push(step)
        })
    }

    public executeFromCli(cliArguments: any[]): void {
        let scope = privateScope.get(this);

        scope.loggingService.log('Executing continui from CLI')

        this.execute(scope.cliStepOptionParsingService.parse(cliArguments, scope.steps.map(step => step.identifier)))
    }

    public execute(identifiedStepOptionMaps: IdentifiedStepOptionMaps): void {
        let scope = privateScope.get(this);

        let mainIdentifier: string = 'main';
        scope.combinedIdentifiedStepOptionMaps = this.getCombinedIdentifiedStepOptionMaps(scope.defaultIdentifiedStepOptionMaps,
                                                                                          this.getOptionsFromRootFile(),
                                                                                          identifiedStepOptionMaps);

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

        let executedStepContextMaps: { step: Step<any>, stepOptionValueMap: StepOptionValueMap, context: any }[] = [];

        for (let i = 0; i < toRunSteps.length; i++) {
            let stepIdentifier: string = toRunSteps[i];

            // I assume that the find function will always retrieve a step because his existence is
            // previously validated by the validateStepIdentifiers function.
            let step: Step<any> = this.getStep(stepIdentifier);
            let stepOpionsMap: StepOptionValueMap = scope.combinedIdentifiedStepOptionMaps[stepIdentifier];

            let context: any = step.createsNewContextFromOptionsMap(stepOpionsMap)

            step.createsRestaurationPoint(stepOpionsMap, context)

            try {
                executedStepContextMaps.push({step: step, stepOptionValueMap: stepOpionsMap, context: context});
                step.execute(stepOpionsMap, context)
                
            } catch (error) {
                this.restoreExecutedStep(executedStepContextMaps)
                break;
            }
        }
    }

    private getOptionsFromRootFile(): IdentifiedStepOptionMaps {
        let filePath: string = path.resolve(__dirname, 'continui.json')
        return fs.existsSync(filePath) ? require(filePath) : {};
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
        //console.log(pkg.version);
    }

    private displayHelp() {
        // TODO: Must implement the help generator and catching
        console.log('Help is not implemented.');
    }

    private getStep(stepIdentifier: string): Step<any> | any {
        let toReturn: Step<any> = privateScope.get(this).steps.find(step => step.identifier == stepIdentifier);

        if (toReturn) {
            return toReturn
        } else {
            throw new Error(`There is not any step with the identifier ${stepIdentifier}`)
        } 
    }

    private restoreExecutedStep(executedStepContextMaps: { step: Step<any>, stepOptionValueMap: StepOptionValueMap, context: any }[]) {
        for (let i = executedStepContextMaps.length - 1; i >= 0; i--) {
            let executedStepContextMap = executedStepContextMaps[i];

            try {
                executedStepContextMap.step.restore(executedStepContextMap.stepOptionValueMap, executedStepContextMap.context);
            } catch(error) {}            
        }
    }

    private validateStepIdentifiers(stepIdentifiers: string[]) {
        if (!stepIdentifiers.length) {
            throw new Error('Must provided at least one step to run. eg. [continui mystep1 --mystep1.param1 "param1value" mystep2]')
        }  

        let errorMessage:string = '';
        let generalErrors: string[] = [];
        let stepErrorsMaps: {
            step:Step<any>,
            errors:string[]
        }[] = [] 

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
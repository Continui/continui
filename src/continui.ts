import { Step } from "./step";

import * as fs from 'fs'
import * as path from 'path'

import { CliStepOptionParser } from "./cliStepOptionParser";
import { StepOption } from "./stepOption";
import { StepOptionMap, IdentifiedStepOptionMaps } from "./types";

let privateScope: WeakMap<Continui, {
    steps: Step<any>[]
    defaultIdentifiedStepOptionMaps: IdentifiedStepOptionMaps
    cliStepOptionParser: CliStepOptionParser
}> = new WeakMap();

export class Continui {

    constructor(stepList: Step<any>[],
        cliStepOptionParser: CliStepOptionParser) {

        privateScope.set(this, {
            steps: [],
            defaultIdentifiedStepOptionMaps: {},
            cliStepOptionParser: cliStepOptionParser
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
        this.execute(privateScope.get(this).cliStepOptionParser.parse(cliArguments))
    }

    public execute(identifiedStepOptionMaps: IdentifiedStepOptionMaps): void {
        let scope = privateScope.get(this);

        let mainIdentifier: string = 'main';
        let fromFileIdentifiedStepOptionMap: IdentifiedStepOptionMaps = this.getidentifiedStepOptionKeyValueMapFromRoot()
        let combinedIdentifiedStepOptionMaps = Object.assign(scope.defaultIdentifiedStepOptionMaps || {},
                                                             fromFileIdentifiedStepOptionMap || {},
                                                             identifiedStepOptionMaps || {})
        let mainStepOptionMap = combinedIdentifiedStepOptionMaps[mainIdentifier];

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

        toRunSteps.forEach(stepIdentifier => {

            let stepOpionsMap: StepOptionMap = combinedIdentifiedStepOptionMaps[stepIdentifier];

            // I assume that the find function will always retrieve a step because his existence is
            // previously validated by the validateStepIdentifiers function.
            let step: Step<any> = scope.steps.find(step => step.identifier == stepIdentifier);

            let context: any = step.createsNewContextFromOptionsMap(stepOpionsMap)

            step.createsRestaurationPoint(context)

            try {
                step.execute(context)
            } catch (error) {
                step.restore(context)
            }
        });
    }

    private getidentifiedStepOptionKeyValueMapFromRoot(): IdentifiedStepOptionMaps {
        let filePath: string = path.resolve(__dirname, 'continui.json')
        return fs.existsSync(filePath) ? require(filePath) : {};
    }

    private displayVersion() {
        
    }

    private displayHelp() {

    }

    private hasStepWithIdentifier(stepIdentifier: string) {

    }

    private validateStepIdentifiers(stepIdentifiers: string[]) {
        if (!stepIdentifiers.length) {
            throw new Error('Must provided at least one step to run. eg. [continui mystep1 --mystep1.param1 "param1value" mystep2]')
        }  

        let stepErrorsMaps: {
            stepIdentifier:string,
            errors:string[]
        }[] = [] 
    

        stepIdentifiers.forEach(stepIdentifier => {

            let stepErrors: string[] = [];

            if (!this.hasStepWithIdentifier(stepIdentifier)) {
                stepErrors.push(`There is not any step with the identifier ${stepIdentifier}`)
            }

            
        })
    }
}
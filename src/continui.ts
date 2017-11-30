import { Step } from "./step";
import { StepOptionKeyValueMap } from "./stepOptionKeyValueMap";

import * as fs from 'fs'
import * as path from 'path'
import { StepOptionDefinerFactory } from "./stepOptionDefinerFactory";

let privateScope = new WeakMap<Continui, {
    steps:Step<any>[]
    stepOptionDefinerFactory: StepOptionDefinerFactory
}>();

export class Continui {

    constructor(stepList: Step<any>[], stepOptionDefinerFactory: StepOptionDefinerFactory) {
        privateScope.set(this, {
            steps: stepList,
            stepOptionDefinerFactory: stepOptionDefinerFactory
        })
    }

    public loadSteps(...steps: Step<any>[]): void {

        let scope = privateScope.get(this);

        steps.forEach(step => {            
            step.defineOptions(scope.stepOptionDefinerFactory.getOptionDefinerForStep(step))
            scope.steps.push(step)
        })
    }

    public execute(identifiedStepOptionKeyValueMap:{[stepIdentifier:string]:StepOptionKeyValueMap}): void {
        privateScope.get(this).steps.forEach(step => {
            let stepOpionsMap: StepOptionKeyValueMap = Object.assign({},
                                                                                                                         
                                                             identifiedStepOptionKeyValueMap[step.identifier])

            let context: any = step.createsNewContextFromOptionsMap(stepOpionsMap)

            step.createsRestaurationPoint(context)

            try
            {
                step.execute(context)
            } catch(error) {
                step.restore(context)
            }
        });
    }

    private getidentifiedStepOptionKeyValueMapFromRoot(): {[stepIdentifier:string]:StepOptionKeyValueMap} {
        let filePath: string = path.resolve(__dirname, 'continui.json')
        return fs.existsSync(filePath) ? require(filePath) : {};
    }
}
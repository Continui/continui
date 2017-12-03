import { Step } from "./step";

import * as fs from 'fs'
import * as path from 'path'
import { StepOptionDefinerFactory } from "./stepOptionDefinerFactory";
import { CliStepOptionParser } from "./cliStepOptionParser";
import { KeyValueMap } from "./keyValueMap";

let privateScope = new WeakMap<Continui, {
    steps: Step<any>[]
    stepOptionDefinerFactory: StepOptionDefinerFactory
    cliStepOptionParser: CliStepOptionParser
}>();

export class Continui {

    constructor(stepList: Step<any>[],
                stepOptionDefinerFactory: StepOptionDefinerFactory,
                cliStepOptionParser: CliStepOptionParser) {
        privateScope.set(this, {
            steps: stepList,
            stepOptionDefinerFactory: stepOptionDefinerFactory,
            cliStepOptionParser: cliStepOptionParser
        })
    }

    public loadSteps(...steps: Step<any>[]): void {

        let scope = privateScope.get(this);

        steps.forEach(step => {            
            step.defineOptions(scope.stepOptionDefinerFactory.getOptionDefinerForStep(step))
            scope.steps.push(step)
        })
    }

    public executeFromCli(cliArguments: any[]): void {
        this.execute(privateScope.get(this).cliStepOptionParser.parse(cliArguments))
    }

    public execute(identifiedStepOptionKeyValueMap:KeyValueMap<KeyValueMap<any>>): void {

        let  fileIdentifiedStepOptionKeyValueMap:KeyValueMap<KeyValueMap<any>> = this.getidentifiedStepOptionKeyValueMapFromRoot();


        privateScope.get(this).steps.forEach(step => {
            let stepOpionsMap: KeyValueMap<any> = Object.assign({},
                                                             fileIdentifiedStepOptionKeyValueMap[step.identifier],                                                           
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

    private getidentifiedStepOptionKeyValueMapFromRoot(): KeyValueMap<KeyValueMap<any>> {
        let filePath: string = path.resolve(__dirname, 'continui.json')
        return fs.existsSync(filePath) ? require(filePath) : {};
    }
}
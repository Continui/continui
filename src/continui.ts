import { Step } from "./step";
import { StepOptionMap } from "./stepOptionMap";

let privateScope = new WeakMap<Continui, {
    steps:Step<any>[]
}>();

export class Continui {

    constructor(stepList: Step<any>[]) {
        privateScope.set(this, {
            steps: stepList
        })        
        
        this.loadSteps(...stepList);
    }

    public loadSteps(...steps: Step<any>[]): void {
        steps.forEach(step => privateScope.get(this).steps.push(step))
    }

    public execute(identifiedStepOptionMap:{[stepIdentifier:string]:StepOptionMap}): void {
        privateScope.get(this).steps.forEach(step => {
            let stepOpionsMap: StepOptionMap = Object.assign({},                                                             
                                                             identifiedStepOptionMap[step.identifier])

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
}
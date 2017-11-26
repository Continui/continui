import { Step } from "./step";
import { StepOptionMap } from "./stepOptionMap";

let privateScope = new WeakMap<Continui, {
    steps:Step<any>[],
    buildInSteps:Step<any>[]
}>();

export class Continui {

    constructor(stepList: Step<any>[]) {
        privateScope.set(this, {
            steps: [],
            buildInSteps: stepList
        })        
    }

    public loadSteps(...steps: Step<any>[]): void {
        steps.forEach(step => privateScope.get(this).steps.push(step))
    }

    public loadBuilInSteps(): void {
        this.loadSteps(...privateScope.get(this).buildInSteps);
    }

    public executeProccess(identifiedStepOptionMap:{[stepIdentifier:string]:StepOptionMap}): void {
        privateScope.get(this).steps.forEach(step => {     
            
            let stepOpionsMap: StepOptionMap = Object.assign({}, 
                                                             step.getDefaultOptionMap(),
                                                             identifiedStepOptionMap[step.identifier])
                                                             
            step.execute(stepOpionsMap);
        });
    }
}
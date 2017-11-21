import { Step } from "./step";
import { StepOptionMap } from "./stepOptionMap";
import { GitStep } from "./build-in-steps/gitStep";
import { GitHubStep } from "./build-in-steps/gitHubStep";
import { NpmStep } from "./build-in-steps/npmStep";

let privateScope: WeakMap<ContinuiProccess, {steps:Step[]}> = new WeakMap<ContinuiProccess, {steps:Step[]}>();

export class ContinuiProccess {

    constructor() {
        privateScope.set(this, {
            steps: []
        })
    }

    public loadSteps(...steps: Step[]): void {
        steps.forEach(step => privateScope.get(this).steps.push(step))
    }

    public loadBuilInSteps(): void {
        this.loadSteps(new GitStep(), new GitHubStep(), new NpmStep());
    }

    public executeProccess(identifiedStepOptionMap:{[stepIdentifier:string]:StepOptionMap}): void {
        privateScope.get(this).steps.forEach(step => {           
            step.execute(identifiedStepOptionMap[step.identifier]);
        });
    }
}
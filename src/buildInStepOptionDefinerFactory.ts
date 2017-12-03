import { Step } from "./step";
import { StepOptionDefiner } from "./stepOptionDefiner";
import { StepOptionDefinerFactory } from "./stepOptionDefinerFactory";

/**
 * Represens a factory to produce option definer.
 */
export class BuildInStepOptionDefinerFactory implements StepOptionDefinerFactory {
    /**
     * Returns a oprion definer for the given step.
     * @param step Represents the step that will define the options.
     * @returns An step option definer.
     */
    public getOptionDefinerForStep(step: Step<any>): StepOptionDefiner {
        return null;
    }
}
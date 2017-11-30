import { Step } from "./step";
import { StepOptionDefiner } from "./stepOptionDefiner";

/**
 * Represens a factory to produce option definer.
 */
export interface StepOptionDefinerFactory {
    /**
     * Returns a oprion definer for the given step.
     * @param step Represents the step that will define the options.
     * @returns An step option definer.
     */
    getOptionDefinerForStep(step: Step<any>): StepOptionDefiner;
}
import { Step } from "../step";
import { StepOption } from "../stepOption";

/**
 * Represents a service that generate help.
 */
export interface HelpGenerationService {
    /**
     * Returns help generated based on the provided steps and his options.
     * @param steps Represenst the steps.
     * @returns The generated help.
     */
    getStepsHelp(...steps: Step<any>[]): string

    /**
     * Returns help generated based on the provided steps options.
     * @param stepsOption Represenst the steps options.
     * @returns The generated help.
     */
    getStepOptionsHelp(...stepsOption: StepOption[]): string
}
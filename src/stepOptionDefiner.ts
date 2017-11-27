import { StepOption } from "./stepOption";

/**
 * Represents an option definer to define step options.
 */
export interface StepOptionDefiner {

    /**
     * Define an option that can be provided to an step execution.
     * @param stepOption Represenst the option to define.
     * @returns An option definer to fluently define options.
     */
    define(stepOption: StepOption): StepOptionDefiner;
}
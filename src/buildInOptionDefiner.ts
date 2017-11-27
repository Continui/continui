import { StepOption } from "./stepOption";
import { StepOptionDefiner } from "./stepOptionDefiner";

/**
 * Represents an option definer to define step options.
 */
export class BuildInStepOptionDefiner implements StepOptionDefiner {

    /**
     * Define an option that can be provided to an step execution.
     * @param stepOption Represenst the option to define.
     * @returns An option definer to fluently define options.
     */
    public define(stepOption: StepOption): StepOptionDefiner {

        


        return this;
    }
}
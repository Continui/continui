import { StepOptionMap } from "./stepOptionMap";

/**
 * Represents an step that can be performed in pipeline.
 */
export interface Step {

    /**
     * Represents the step denifier.
     */
    identifier: string;

    /**
     * Represents the step name.
     */
    name: string;

    /**
     * Represents the step description.
     */
    description: string;

    /**
     * Execute the step base on the given options.
     */
    execute(stepOptionsMap: StepOptionMap): void | Promise<void>;
}
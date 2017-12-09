import { StepOption } from "./stepOption";
import { StepOptionValueMap } from "./types";

/**
 * Represents an step that can be performed in pipeline.
 */
export interface Step<Context> {

    /**
     * Get the step denifier.
     */
    identifier: string;

    /**
     * Get the step name.
     */
    name: string;

    /**
     * Get the step description.
     */
    description: string;

    /**
     * Represents the step otions used to execute the step.
     */
    options: StepOption[];

    /**
     * Creates a restoration point based on the step to rollback the changes in case that the pipe flow breaks.
     * @param stepOptionsValueMap Represents the options values provided to run the step.
     * @param context Represents the step execution context.
     */
    createsRestaurationPoint(stepOptionValueMap: StepOptionValueMap, context: Context): void | Promise<void> | IterableIterator<any>

    /**
     * Execute the step base on the given options and context.
     * @param stepOptionsValueMap Represents the options values provided to run the step.
     * @param context Represents the step execution context.
     */
    execute(stepOptionValueMap: StepOptionValueMap, context: Context): void | Promise<void> | IterableIterator<any>;
    
    /**
     * Restore the step base on the given options and context.
     * @param stepOptionsValueMap Represents the options values provided to run the step.
     * @param context Represents the step execution context.
     */
    restore(stepOptionValueMap: StepOptionValueMap, context: Context): void | Promise<void> | IterableIterator<any>;    

    /**
     * Creates and return an new context bases on the provided options.
     * @param stepOptionsValueMap Represents the options values provided to run the step.
     * @returns A new execution context bases on the provided options.
     */
    createsNewContextFromOptionsMap(stepOptionKeyValueMap: StepOptionValueMap): Context 
}
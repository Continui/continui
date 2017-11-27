import { StepOptionDefiner } from "./stepOptionDefiner";
import { StepOptionKeyValueMap } from "./stepOptionKeyValueMap";

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
     * Creates a restoration point based on the step to rollback the changes in case that the pipe flow breaks.
     * @param context Represents the step execution context.
     */
    createsRestaurationPoint(context: Context): void

    /**
     * Asynchronously creates a restoration point based on the step to rollback the changes in case that the pipe flow breaks.
     * @param context Represents the step execution context.
     */
    createsRestaurationPointAsync(context: Context): Promise<void>

    /**
     * Execute the step base on the given options and context.
     * @param context Represents the step execution context.
     */
    execute(context: Context): void;

    /**
     * Asynchronously execute the step base on the given options and context.     
     * @param context Represents the step execution context.
     */
    executeAsync(context: Context): Promise<void>;
    
    /**
     * Restore the step base on the given options and context.
     * @param context Represents the step execution context.
     */
    restore(context: Context): void;
    
    /**
     * Asynchronously restore the step base on the given options and context.     
     * @param context Represents the step execution context.
     */
    restoreAsync(context: Context): Promise<void>;

    /**
     * Defines the step options with the provided definer.
     * @param stepOptionDefiner Represents a step option definer to define the step options.
     */
    defineOptions(stepOptionDefiner: StepOptionDefiner): void;

    /**
     * Creates and return an new context bases on the provided options.
     * @param stepOptionKeyValueMap Represents the options map provided to run the step.
     * @returns A new execution context bases on the provided options.
     */
    createsNewContextFromOptionsMap(stepOptionKeyValueMap: StepOptionKeyValueMap): Context 
}
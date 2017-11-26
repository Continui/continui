import { StepOptionMap } from "./stepOptionMap";

/**
 * Represents an step that can be performed in pipeline.
 */
export interface Step<Context> {

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
     * @param stepOptionsMap Represents the options provided to run the step.
     * @param context Represents the step execution context.
     */
    execute(stepOptionsMap: StepOptionMap, context: Context): void;

    /**
     * Asynchronously execute the step base on the given options and context.
     * @param stepOptionsMap Represents the options provided to run the step.     
     * @param context Represents the step execution context.
     */
    executeAsync(stepOptionsMap: StepOptionMap, context: Context): Promise<void>;
    
    /**
     * Restore the step base on the given options and context.
     * @param stepOptionsMap Represents the options provided to run the step.
     * @param context Represents the step execution context.
     */
    restore(stepOptionsMap: StepOptionMap, context: Context): void;
    
    /**
     * Asynchronously restore the step base on the given options and context.
     * @param stepOptionsMap Represents the options provided to run the step.     
     * @param context Represents the step execution context.
     */
    restoreAsync(stepOptionsMap: StepOptionMap, context: Context): Promise<void>;

    /**
     * Retuns the step default option map.
     * @returns The default step option map.
     */
    getDefaultOptionMap(): StepOptionMap;

    /**
     * Creates and return an new context bases on the provided options.
     * @param stepOptionsMap Represents the options provided to run the step.
     * @returns A new execution context bases on the provided options.
     */
    createsNewContext(stepOptionsMap: StepOptionMap): Context 
}
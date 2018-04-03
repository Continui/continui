import { ActionOption } from './actionOption';
import { ActionOptionValueMap } from './types';
import { EventEmitter } from 'events';

/**
 * Represents an action that can be performed in pipeline.
 */
export abstract class Action<Context> extends EventEmitter {

    /**
     * Get the action denifier.
     */
  abstract identifier: string;

    /**
     * Get the action name.
     */
  abstract name: string;

    /**
     * Get the action description.
     */
  abstract description: string;

    /**
     * Represents the action otions used to execute the action.
     */
  abstract options: ActionOption[];

    /**
     * Creates a restoration point based on the action to rollback the changes in case that the pipe
     * flow breaks.
     * @param actionOptionsValueMap Represents the options values provided to run the action.
     * @param context Represents the action execution context.
     */
  abstract createsRestaurationPoint(actionOptionValueMap: ActionOptionValueMap,
                                    context: Context): void | Promise<void> | IterableIterator<any>;

    /**
     * Execute the action base on the given options and context.
     * @param actionOptionsValueMap Represents the options values provided to run the action.
     * @param context Represents the action execution context.
     */
  abstract execute(actionOptionValueMap: ActionOptionValueMap,
                   context: Context): void | Promise<void> | IterableIterator<any>;
    
    /**
     * Restore the action base on the given options and context.
     * @param actionOptionsValueMap Represents the options values provided to run the action.
     * @param context Represents the action execution context.
     */
  abstract restore(actionOptionValueMap: ActionOptionValueMap,
                   context: Context): void | Promise<void> | IterableIterator<any>;    

    /**
     * Creates and return an new context bases on the provided options.
     * @param actionOptionsValueMap Represents the options values provided to run the action.
     * @returns A new execution context bases on the provided options.
     */
  abstract createsContextFromOptionsMap(actionOptionKeyValueMap: ActionOptionValueMap): Context; 
}

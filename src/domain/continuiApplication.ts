import { IdentifiedActionOptionMaps, Action } from 'continui-action';
import { ExecutionConfiguration } from './models/executionConfiguration';
import { EventEmitter } from 'events';

/**
* Represents a continui application.
*/
export abstract class ContinuiApplication extends EventEmitter  {

    /**
    * Execute the continui loaded application.
    * @param executionConfiguration Represents the execution configuration for the application.
    */
  abstract execute(executionConfiguration: ExecutionConfiguration): void;

    /**
     * Load the provided actions to his future execution.
     * @param actions Represents the actions that will be executed.
     */
  abstract loadActions(...actions: Action<any>[]): void;
}

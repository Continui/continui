import { IdentifiedStepOptionMaps, Step } from 'continui-step';
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
     * Load the provided steps to his future execution.
     * @param steps Represents the steps that will be executed.
     */
  abstract loadSteps(...steps: Step<any>[]): void;
}

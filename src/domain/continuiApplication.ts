import { IdentifiedStepOptionMaps, Step } from 'continui-step';
import { ExecutionConfiguration } from './models/executionConfiguration';

/**
* Represents a continui application.
*/
export interface ContinuiApplication {

    /**
    * Execute the continui loaded application.
    * @param executionConfiguration Represents the execution configuration for the application.
    */
  execute(executionConfiguration: ExecutionConfiguration): void;

    /**
     * Load the provided steps to his future execution.
     * @param steps Represents the steps that will be executed.
     */
  loadSteps(...steps: Step<any>[]): void;
}

import { IdentifiedStepOptionMaps, Step } from 'continui-step';

/**
* Represents a continui application.
*/
export interface ContinuiApplication {

    /**
    * Execute the continui loaded application.
    */
  execute(): void;

    /**
     * Load the provided steps to his future execution.
     * @param steps Represents the steps that will be executed.
     */
  loadSteps(...steps: Step<any>[]): void
}

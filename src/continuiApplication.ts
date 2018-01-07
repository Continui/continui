import { IdentifiedStepOptionMaps } from 'continui-step';

/**
* Represents a continui application.
*/
export interface ContinuiApplication {

    /**
    * Execute the continui application and required steps base on th provided options. 
    * @param identifiedStepOptionMaps Represents the steps options.
    */
  execute(identifiedStepOptionMaps: IdentifiedStepOptionMaps): void;
}

import { Activator } from './activator';
import { StepActivationDefinition } from 'continui-step';

/**
 * Represents an activation center that allows easily manage steps dependencies.
 */
export interface ActivationCenter {

  /**
   * Represents the activator that will be activating dependencies.
   */
  activator: Activator;

  /**
   * Loads provided step definitions.
   * @param stepActivationDefinitions Represents the step definitions to load.
   */
  loadStepActivationDefinitions(...stepActivationDefinitions: StepActivationDefinition[]): void;
}

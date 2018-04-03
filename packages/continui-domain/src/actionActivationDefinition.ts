import { Action } from './action';
import { ActionActivationContext } from './actionActivationContext';

/**
 * Represents a action activation definition that allows the continui activation center to resolve
 * the action and his dependencies when needs to be used.
 */
export interface ActionActivationDefinition {

    /**
     * Represents the action identifier.
     */
  identifier: string;

    /**
     * Represents the action funtion that will be available for continui for instantiation.
     */
  action: Function;

    /**
     * Register the stp dependencies into the provided containerized kernel.
     * @param ActionActivationContext Reresents the activation context.
     */
  registerDependencies(actionActivationContext: ActionActivationContext): void;
}

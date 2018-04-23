import { Action } from 'continui-action';

/**
 * Represents a provider that provides the available actions based on diferent criterias.
 */
export interface ActionsProvider {

    /**
     * Return a list of actions based on the provided action modules.
     * @param actionModules Represents the action modules where the definitions will be load from.
     * @returns A list of actions.
     */
  getActionsFromActionModules(actionModules: string[]): Action<any>[];
}

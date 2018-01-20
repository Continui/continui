import { Step } from 'continui-step';

/**
 * Represents a provider that provides the available steps based on diferent criterias.
 */
export interface StepProvider {

    /**
     * Return a list of steps based on the provided step modules.
     * @param stepModules Represents the step modules where the step definitions will be load from.
     * @returns A list of steps.
     */
  getStepsFromStepModules(stepModules: string[]): Step<any>[];
}

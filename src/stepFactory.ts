import { Step } from 'continui-step';

/**
 * Represents a factory that allows the creation of steps based on the step identifiers.
 */
export interface StepFactory {

    /**
     * Creates an step based on the provided identifiers.
     * @param stepIdentifier Represents the identifier of the step that wants to be created.
     * @returns An step.
     */
  createStep(stepIdentifier: string): Step<any>;
}

import { Step } from 'continui-step';
import { ActivationCenter } from './activationCenter';

const privateScope:WeakMap<StepFactory, {
  activationCenter:ActivationCenter,
}> = new WeakMap();

/**
 * Represents a factory that allows the creation of steps based on the step identifiers.
 */
export class StepFactory {

  constructor(activationCenter: ActivationCenter) {
    privateScope.set(this, { activationCenter });
  }

    /**
     * Creates an step based on the provided identifiers.
     * @param stepIdentifier Represents the identifier of the step that wants to be created.
     * @returns An step.
     */
  createStep(stepIdentifier: string): Step<any> {
    try {
      return privateScope.get(this)
                            .activationCenter
                            .activator
                            .resolveWithContext('step', stepIdentifier);
    } catch (error) {
      throw new Error(`Can not create step with the identifier (${stepIdentifier}) ` +
                      'please be sure that the step is loaded into continui. \n ' + error);
    }
  }
}

import { ActivationCenter } from '../domain/activationCenter';
import { Activator } from '../domain/activator';
import { BuildInActivator } from './buildInActivator';
import { 
  Step,
  StepActivationDefinition,
  StepActivationReference,
  StepActivationReferenceMode,
  StepActivationReferenceType,
} from 'continui-step';


const privateScope: WeakMap<BuildInActivationCenter, {
  activator: Activator
  stepActivationDefinitions: StepActivationDefinition[],
}> = new WeakMap();

/**
 * Represents an activation center that allows easily manage steps dependencies.
 */
export class BuildInActivationCenter implements ActivationCenter {

  constructor() {
    privateScope.set(this, {
      activator: new BuildInActivator(),
      stepActivationDefinitions: [],
    });
  }

  /**
   * Represents the activator that will be activating dependencies.
   */
  public get activator(): Activator {
    return privateScope.get(this).activator;
  }

  /**
   * Loads provided step definitions.
   * @param stepActivationDefinitions Represents the step definitions to load.
   */
  public loadStepActivationDefinitions(...stepActivationDefinitions: StepActivationDefinition[],
  ): void {
    const scope = privateScope.get(this);

    stepActivationDefinitions.forEach((stepActivationDefinition) => {

      if (!stepActivationDefinition.identifier) {
        throw new Error('One of the suplied step activation definition doesn\'t have the ' + 
                        'identifier.');
      }

      if (!stepActivationDefinition.step) {
        throw new Error('The suplied step activation definition with identifier [' +
                         stepActivationDefinition.identifier + '] doesn\'t have an step.');
      }

      if (scope.stepActivationDefinitions.find(storedStepActivationDefinition =>
        storedStepActivationDefinition.identifier === stepActivationDefinition.identifier)) {
        throw new Error('There is already an step activation definition with the provided step ' +
                        'identifier ' + stepActivationDefinition.identifier);
      }

      scope.stepActivationDefinitions.push(stepActivationDefinition);
      this.loadStepActivationDefinitionIntoActivator(stepActivationDefinition);
    });
  }

  /**
   * Loads provided step definitions into the activator.
   * @param stepActivationDefinitions Represents the step definitions to load.
   */
  private loadStepActivationDefinitionIntoActivator(
    stepActivationDefinition: StepActivationDefinition) {

    this.activator.registerReferenceWithContext({
      alias: 'step',
      target: stepActivationDefinition.step
    }, stepActivationDefinition.identifier);
    
    stepActivationDefinition.activationReferences.forEach(activationReference =>
      this.activator.registerReferenceWithContext(activationReference,
                                                  stepActivationDefinition.identifier),
    );
  }
}

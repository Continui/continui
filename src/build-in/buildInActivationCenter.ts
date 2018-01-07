import { ActivationCenter } from '../activationCenter';
import { Activator } from '../activator';
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
  stepActivationDefinitions: StepActivationDefinition[]
  activatorAndStepActivationDefinitionsMap: {
    activator: Activator,
    StepActivationDefinition: StepActivationDefinition[],
  }[],
}> = new WeakMap();

/**
 * Represents an activation center that allows easily manage steps dependencies.
 */
export class BuildInActivationCenter implements ActivationCenter {

  constructor() {
    const buildInActivator: Activator = new BuildInActivator();

    privateScope.set(this, {
      activator: buildInActivator,
      stepActivationDefinitions: [],
      activatorAndStepActivationDefinitionsMap: [],
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
      if (!stepActivationDefinition.step) {
        throw new Error('One of the suplied step activation definition doesn\'t have an step.');
      }

      if (scope.stepActivationDefinitions.find(storedStepActivationDefinition =>
        storedStepActivationDefinition.identifier === stepActivationDefinition.identifier)) {
        throw new Error('There is already an step activation definition with the provided step ' +
                        'identifier ' + stepActivationDefinition.identifier);
      }

      scope.stepActivationDefinitions.push(stepActivationDefinition);
      this.loadStepActivationDefinitionsIntoActivator(stepActivationDefinition);
    });
  }

  /**
   * Loads provided step definitions into the activator.
   * @param stepActivationDefinitions Represents the step definitions to load.
   */
  private loadStepActivationDefinitionsIntoActivator(...definitions: StepActivationDefinition[]) {
    const scope = privateScope.get(this);

    let activatorAndStepActivationDefinitionsMap = scope.activatorAndStepActivationDefinitionsMap
            .find(activatorAndStepActivationDefinitionsMap =>
                  activatorAndStepActivationDefinitionsMap.activator === this.activator);

    if (!activatorAndStepActivationDefinitionsMap) {
      activatorAndStepActivationDefinitionsMap = {
        activator: this.activator,
        StepActivationDefinition: [],
      };
      scope.activatorAndStepActivationDefinitionsMap.push(activatorAndStepActivationDefinitionsMap);
    }

    definitions.forEach((storedStepActivationDefinition) => {

      const storeStepIdentifier: string = storedStepActivationDefinition.identifier;

      if (!activatorAndStepActivationDefinitionsMap
              .StepActivationDefinition
              .find(stepActivationDefinition => 
                    stepActivationDefinition.identifier === storeStepIdentifier)) {

        activatorAndStepActivationDefinitionsMap.StepActivationDefinition
                                                .push(storedStepActivationDefinition);
        this.activator.registerReference({
          alias: 'step',
          target: storedStepActivationDefinition.step,
          context: storedStepActivationDefinition.identifier,
        });
        
        storedStepActivationDefinition.activationReferences.forEach((activationReference) => {
          activationReference.context = storedStepActivationDefinition.identifier;
          this.activator.registerReference(activationReference);
        });
      }
    });
  }
}

import { Activator } from './activator';
import { BuildInActivator } from './build-in/buildInActivator';
import { 
  Step,
  StepActivationDefinition,
  StepActivationReference,
  StepActivationReferenceMode,
  StepActivationReferenceType,
} from 'continui-step';

const privateScope: WeakMap<ActivationCenter, {
  activator: Activator
  stepActivationDefinitions: StepActivationDefinition[]
  activatorAndStepActivationDefinitionsMap: {
    activator: Activator,
    StepActivationDefinition: StepActivationDefinition[],
  }[],
}> = new WeakMap();

export class ActivationCenter {

  constructor() {
    const buildInActivator: Activator = new BuildInActivator();

    privateScope.set(this, {
      activator: buildInActivator,
      stepActivationDefinitions: [],
      activatorAndStepActivationDefinitionsMap: [],
    });
  }

  public get activator(): Activator {
    return privateScope.get(this).activator;
  }

  public addStepActivationDefinitions(...stepActivationDefinitions: StepActivationDefinition[],
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

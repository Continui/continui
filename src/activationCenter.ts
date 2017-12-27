import { Activator } from './activator';
import { BuildInActivator } from './build-in/buildInActivator';
import { Step, StepActivationDefinition, StepActivationReference } from 'continui-step';

const privateScope: WeakMap<ActivationCenter, {
  defaultActivator: Activator,
  currentActivator: Activator,
  activationReferences: StepActivationReference[]
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
      defaultActivator: buildInActivator,
      currentActivator: buildInActivator,
      activationReferences: [],
      stepActivationDefinitions: [],
      activatorAndStepActivationDefinitionsMap: [],
    });
  }

  public get defaultActivator(): Activator {
    return privateScope.get(this).defaultActivator;
  }

  public get currentActivator(): Activator {
    return privateScope.get(this).currentActivator;
  }

  public useActivator(activator: Activator): void {
    this.setupActivator(activator);
    privateScope.get(this).currentActivator = activator;
  }

  public useDefaultActivator(): void {
    this.useActivator(this.defaultActivator);
  }

  public addActivatorReferences(...activationReferences: StepActivationReference[]): void {
    activationReferences.forEach((activationReference) => {
      privateScope.get(this).activationReferences.push(activationReference);
    });

    this.loadReferencesIntoActivator(this.currentActivator, ...activationReferences);
  }

  public addStepActivationDefinitions(
    ...stepActivationDefinitions: StepActivationDefinition[],
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
      this.loadStepActivationDefinitionsIntoActivator(this.currentActivator,
                                                      stepActivationDefinition);
    });
  }

  private setupActivator(activator: Activator): void {
    const scope = privateScope.get(this);
    this.loadReferencesIntoActivator(activator, ...scope.activationReferences);
    this.loadStepActivationDefinitionsIntoActivator(activator, ...scope.stepActivationDefinitions);
  }

  private loadReferencesIntoActivator(activator: Activator,
                                      ...references: StepActivationReference[]) {
    references.forEach((activationReference) => {
      if (!activator.hasAlias(activationReference.alias)) {
        activator.registerReference(activationReference);
      }
    });
  }

  private loadStepActivationDefinitionsIntoActivator(activator: Activator,
                                                     ...definitions: StepActivationDefinition[]) {
    const scope = privateScope.get(this);

    let activatorAndStepActivationDefinitionsMap = scope.activatorAndStepActivationDefinitionsMap
            .find(activatorAndStepActivationDefinitionsMap =>
                  activatorAndStepActivationDefinitionsMap.activator === activator);

    if (!activatorAndStepActivationDefinitionsMap) {
      activatorAndStepActivationDefinitionsMap = {
        activator,
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
        activator.registerReference({
          alias: 'step',
          target: storedStepActivationDefinition.step,
          context: storedStepActivationDefinition.identifier,
        });
        
        storedStepActivationDefinition.activationReferences.forEach((activationReference) => {
          activationReference.context = storedStepActivationDefinition.identifier;
          activator.registerReference(activationReference);
        });
      }
    });
  }
}

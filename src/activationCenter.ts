import { Activator } from './activator';
import { BuildInActivator } from './build-in/buildInActivator';
import { StepActivationDefinition } from './stepActivationDefinition';
import { ActivatorReference } from './activatorReference';

let privateScope: WeakMap<ActivationCenter, {
    defaultActivator: Activator,
    currentActivator: Activator,
    activationReferences: ActivatorReference[]
    stepActivationDefinitions: StepActivationDefinition[]
    activatorAndStepActivationDefinitionsMap: {
        activator: Activator,
        StepActivationDefinition: StepActivationDefinition[]
    }[]
}> = new WeakMap()

export class ActivationCenter {

    constructor() {
        let buildInActivator: Activator = new BuildInActivator()

        privateScope.set(this, {
            defaultActivator: buildInActivator,
            currentActivator: buildInActivator,
            activationReferences: [],
            stepActivationDefinitions: [],
            activatorAndStepActivationDefinitionsMap: []
        })
    }

    public get defaultActivator(): Activator {
        return privateScope.get(this).defaultActivator
    }

    public get currentActivator(): Activator {
        return privateScope.get(this).currentActivator
    }

    public useActivator(activator: Activator): void {
        this.setupActivator(activator)
        privateScope.get(this).currentActivator = activator
    }

    public useDefaultActivator(): void {
        this.useActivator(this.defaultActivator)
    }

    public addActivatorReferences(...activationReferences: ActivatorReference[]): void {
        activationReferences.forEach(activationReference => {
            privateScope.get(this).activationReferences.push(activationReference);
        })
    }

    public addStepActivationDefinitions(...stepActivationDefinitions: StepActivationDefinition[]): void {
        let scope = privateScope.get(this)

        stepActivationDefinitions.forEach(stepActivationDefinition => {

            if (!stepActivationDefinition.step) {
                throw new Error('One of the suplied step activation definition doesn\'t have an step.')
            }

            if (scope.stepActivationDefinitions.find(storedStepActivationDefinition => storedStepActivationDefinition.step.identifier == stepActivationDefinition.step.identifier)) {
                throw new Error('There is already an step activation definition with the provided step identifier ' + stepActivationDefinition.step.identifier)
            }

            scope.stepActivationDefinitions.push(stepActivationDefinition)
        })
    }

    private setupActivator(activator: Activator): void {
        this.loadReferencesIntoActivator(activator)
        this.loadStepActivationDefinitionsIntoActivator(activator)
    }

    private loadReferencesIntoActivator(activator: Activator) {
        privateScope.get(this).activationReferences.forEach(activationReference => {
            if (!activator.hasAlias(activationReference.alias)) {
                activator.registerReference(activationReference)
            }
        })
    }

    private loadStepActivationDefinitionsIntoActivator(activator: Activator) {
        let scope = privateScope.get(this)

        let activatorAndStepActivationDefinitionsMap = scope.activatorAndStepActivationDefinitionsMap
            .find(activatorAndStepActivationDefinitionsMap =>
                  activatorAndStepActivationDefinitionsMap.activator === activator)

        if (!activatorAndStepActivationDefinitionsMap) {
            scope.activatorAndStepActivationDefinitionsMap.push({
                activator: activator,
                StepActivationDefinition: []
            })
        }

        scope.stepActivationDefinitions.forEach(storedStepActivationDefinition => {
            if (!activatorAndStepActivationDefinitionsMap.StepActivationDefinition
                                                         .find(stepActivationDefinition => 
                                                               stepActivationDefinition.step.identifier == storedStepActivationDefinition.step.identifier)) {
                activatorAndStepActivationDefinitionsMap.StepActivationDefinition.push(storedStepActivationDefinition)                                   
                activator.registerReference({
                    alias: 'step',
                    target: storedStepActivationDefinition.step,
                    context: storedStepActivationDefinition.step.identifier
                })
                storedStepActivationDefinition.activationReferences.forEach(activationReference => {
                    activationReference.context = storedStepActivationDefinition.step.identifier
                    activator.registerReference(activationReference)
                })
            }
        })
    }
}
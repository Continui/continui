import { Step } from "./step";
import { ActivatorReference } from "./activatorReference";

/**
 * Represents a step activation definition that allows the continui activation center to resolve the step and his dependencies when needs to be used.
 */
export interface StepActivationDefinition {
    /**
     * Represents the step that will be available for continui.
     */
    step: Step<any>

    /**
     * Represents the step activation references, also called dependency references.
     */
    activationReferences: ActivatorReference[]
}
/**
 * Represents the reference used by the activator to resolve dependencies.
 */
export interface ActivatorReference {
    /**
     * Represents the dependency alias.
     */
    alias: string

    /**
     * Represents the dependency.
     */
    target: any

    /**
     * Represents a boolean value specifying if the target will be delivered once per rsolution.
     */
    perResolution: boolean 
}
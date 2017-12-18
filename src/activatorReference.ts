/**
 * Represents the reference used by the activator to resolve dependencies.
 */
export interface ActivatorReference {
    /**
     * Get or set the dependency alias.
     */
    alias: string

    /**
     * Get or set the dependency.
     */
    target: any

    /**
     * Get or set a boolean value specifying if the target will be delivered once per rsolution.
     */
    perResolution?: boolean

    /**
     * Get or set the context of the reference, if provided the dependency only will be available if is requested in the provided context.
     */
    context?: string
}
import { ActivatorReference } from "./activatorReference";

/**
 * Represenst an activator that can register and solve depencencies.
 */
export interface Activator {
    /**
     * Register dependencies with the provided alias.
     * @param reference Represents the reference that will be registered.
     * @returns The activator instance to fluently register dependencies.
     */
    registerReference(reference: ActivatorReference) : Activator 

    /**
     * Resolve the dependency with the provided alias.
     * @param alias Represents the dependency alias.
     * @returns The activator instance to fluently register dependencies.
     */
    resolveReference<DependencyType>(aliasOrTarget: any) : DependencyType;

    /**
     * Returns a boolean value specifying if the activation has a dependency registered with the provided alias.
     * @param alias Represents the alias to look for.
     * @returns A boolean value.
     */
    hasReference(alias: string): boolean;
}
import { ActivatorReference } from './activatorReference';

/**
 * Represenst an activator that can register and solve depencencies.
 */
export interface Activator {
    /**
     * Register dependencies with the provided alias.
     * @param reference Represents the reference that will be registered.
     * @returns The activator instance to fluently register dependencies.
     */
  registerReference(reference: ActivatorReference) : Activator; 

    /**
     * Resolve the dependency with the provided alias.
     * @param aliasOrTarget Represents the dependency to be resolved.
     * @returns A resolved dependency.
     */
  resolve<DependencyType>(aliasOrTarget: any) : DependencyType;

    /**
     * Resolve the dependency with the provided alias, if is registered with the provided context.
     * @param aliasOrTarget Represents the dependency to be resolved.
     * @param context Represents the where the resolution will occurs.
     * @returns A resolved dependency.
     */
  resolveWithContext<DependencyType>(aliasOrTarget: any, context: string);

    /**
     * Returns a boolean value specifying if the activation has a dependency registered with the
     * provided alias.
     * @param alias Represents the alias to look for.
     * @returns A boolean value.
     */
  hasAlias(alias: string): boolean;
}

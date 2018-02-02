import { ActionActivationReference } from 'continui-action';

/**
 * Represenst an activator that can register and solve depencencies.
 */
export interface Activator {
    /**
     * Register dependencies with the provided alias.
     * @param reference Represents the reference that will be registered.
     * @returns The activator instance to fluently register dependencies.
     */
  registerReference(reference: ActionActivationReference) : Activator; 

    /**
     * Register dependencies with the provided alias, in the provided context.
     * @param reference Represents the reference that will be registered.
     * @param context Represents the where the registration will occurs.
     * @returns The activator instance to fluently register dependencies.
     */
  registerReferenceWithContext(reference: ActionActivationReference, context: string) : Activator; 

    /**
     * Resolve the dependency with the provided alias.
     * @param aliasOrTarget Represents the dependency to be resolved.
     * @returns A resolved dependency.
     */
  resolve<DependencyType>(aliasOrTarget: any) : DependencyType;

    /**
     * Resolve the dependency with the provided alias, in the provided context.
     * @param aliasOrTarget Represents the dependency to be resolved.
     * @param context Represents the where the resolution will occurs.
     * @returns A resolved dependency.
     */
  resolveWithContext<DependencyType>(aliasOrTarget: any, context: string);
}

/**
 * Represenst an activator that can register and solve depencencies.
 */
export interface Activator {
    /**
     * Register dependencies with the provided alias.
     * @param alias Represents the dependency alias.
     * @param target Represents the dependency.
     * @returns The activator instance to fluently register dependencies.
     */
    register(alias:string, target: any) : Activator 

    /**
     * Resolve the dependency with the provided alias.
     * @param alias Represents the dependency alias.
     * @returns The activator instance to fluently register dependencies.
     */
    resolve<DependencyType>(aliasOrTarget: any) : DependencyType;
}
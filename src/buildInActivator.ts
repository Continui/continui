import { Activator } from './activator';
import { createKernel, Kernel } from '@jems/di'
import { ActivatorReference } from './activatorReference';

let privateScope:WeakMap<BuildInActivator, {
    kernel: Kernel
}> = new WeakMap();

/**
 * Represenst an activator that can register and solve depencencies.
 */
export class BuildInActivator implements Activator {

    constructor() {
        privateScope.set(this, {
            kernel: createKernel()
        })
    }

    /**
     * Register dependencies with the provided alias.
     * @param reference Represents the reference that will be registered.
     * @returns The activator instance to fluently register dependencies.
     */
    public registerReference(reference: ActivatorReference) : Activator {
        let bind =  privateScope.get(this).kernel.bind(reference.alias).to(reference.target)
        
        if (reference.perResolution) {
            bind.inPerResolutionMode()
        }

        return this;
    }
    
    /**
     * Resolve the dependency with the provided alias.
     * @param alias Represents the dependency alias.
     * @returns The activator instance to fluently register dependencies.
     */
    public resolveReference<DependencyType>(aliasOrTarget: any) : DependencyType {
        return <DependencyType>privateScope.get(this).kernel.resolve(aliasOrTarget)
    }

    /**
     * Returns a boolean value specifying if the activation has a dependency registered with the provided alias.
     * @param alias Represents the alias to look for.
     * @returns A boolean value.
     */
    public hasReference(alias: string): boolean {
        return privateScope.get(this).kernel.canResolve(alias)
    }
}
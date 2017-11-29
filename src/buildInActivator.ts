import { Activator } from './activator';
import { createKernel, Kernel } from '@jems/di'

let privateScope:WeakMap<BuildInActivator, {
    kernel: Kernel
}>

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
     * @param alias Represents the dependency alias.
     * @param target Represents the dependency.
     * @returns The activator instance to fluently register dependencies.
     */
    public register(alias:string, target: any) : Activator {
        privateScope.get(this).kernel.bind(alias).to(target)

        return this;
    }

    /**
     * Resolve the dependency with the provided alias.
     * @param alias Represents the dependency alias.
     * @returns The activator instance to fluently register dependencies.
     */
    public  resolve<DependencyType>(aliasOrTarget:any) : DependencyType {
        return <DependencyType>privateScope.get(this).kernel.resolve(aliasOrTarget)
    }
}
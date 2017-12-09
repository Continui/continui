import { Activator } from './activator';
import { createKernel, Kernel } from '@jems/di'
import { fail } from 'assert';

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
     * @param alias Represents the dependency alias.
     * @param target Represents the dependency.
     * @param perResolution Represents a boolean value specifying if the target will be delivered once per rsolution.
     * @returns The activator instance to fluently register dependencies.
     */
    register(alias:string, target: any, perResolution: boolean = false) : Activator  {
        let bind =  privateScope.get(this).kernel.bind(alias).to(target)

        if (perResolution) {
            bind.inPerResolutionMode()
        }

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
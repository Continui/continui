import { Activator } from './activator';
import { BuildInActivator } from './buildInActivator';

let privateScope: WeakMap<ActivationCenter, {    
    defaultActivator: Activator,
    currentActivator: Activator,
}> = new WeakMap()

export class ActivationCenter {

    constructor() {
        let buildInActivator: Activator = new BuildInActivator()

        privateScope.set(this, {
            defaultActivator: buildInActivator,
            currentActivator: buildInActivator,
        })
    }
    
    public get defaultActivator() : Activator {
        return privateScope.get(this).defaultActivator
    }

    public get currentActivator() : Activator {
        return privateScope.get(this).currentActivator
    }

    public useActivator(activator: Activator): void {
        this.loadRegistrarsIntoActivator(activator)
        privateScope.get(this).currentActivator = activator
    }

    public useDefaultActivator(): void {
        this.loadRegistrarsIntoActivator(this.defaultActivator)
        privateScope.get(this).currentActivator = this.defaultActivator
    }
        
    private loadRegistrarsIntoActivator(activator: Activator) {
        privateScope.get(this).registrars.forEach(registrar => {
            registrar.getReferences().forEach(reference => {
                if (!activator.hasReference(reference.alias)) {
                    activator.registerReference(reference)
                }
            });
        })
    }
}
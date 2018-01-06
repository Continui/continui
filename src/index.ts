import { ActivationCenter } from './activationCenter';
import { BuildInDependenciesRegistrar } from './build-in/buildInDependenciesRegistrar';
import { ContinuiApplicationFactory } from './continuiApplicationFactory';

const activationCenter: ActivationCenter = new ActivationCenter();

const buildInActivationRegistrar: BuildInDependenciesRegistrar = new BuildInDependenciesRegistrar();
buildInActivationRegistrar.registerBuilInReferencesIntoActivator(activationCenter);

const continuiApplicationFactory: ContinuiApplicationFactory = 
 activationCenter.activator.resolve(ContinuiApplicationFactory);

/**
 * Represents an factory that allows the creation of continui applications.
 */
export { continuiApplicationFactory as continuiApplicationFactory };

/**
 * Represents an activation center that allows the dependency managment.
 */
export { activationCenter as activationCenter };

export * from './activator';

import { ActivationCenter } from './domain/activationCenter';
import { ContinuiApplicationFactory } from './domain/continuiApplicationFactory';

import { BuildInActivationCenter } from './build-in/buildInActivationCenter';
import { BuildInDependenciesRegistrar } from './build-in/buildInDependenciesRegistrar';
import { BuildInContinuiApplicationFactory } from './build-in/buildInContinuiApplicationFactory';

const activationCenter: ActivationCenter = new BuildInActivationCenter();

const buildInActivationRegistrar: BuildInDependenciesRegistrar = new BuildInDependenciesRegistrar();
buildInActivationRegistrar.registerBuilInReferencesIntoActivator(activationCenter);

const continuiApplicationFactory: ContinuiApplicationFactory = 
 activationCenter.activator.resolve(BuildInContinuiApplicationFactory);

/**
 * Represents an factory that allows the creation of continui applications.
 */
export { continuiApplicationFactory as continuiApplicationFactory };

/**
 * Represents an activation center that allows the dependency managment.
 */
export { activationCenter as activationCenter };

export * from './domain/activator';
export * from './domain/activationCenter';
export * from './domain/continuiApplication';
export * from './domain/continuiApplicationFactory';

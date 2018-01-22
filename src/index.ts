import { Activator } from './domain/activator';
import { BuildInActivator } from './build-in/buildInActivator';

import { ContinuiApplicationFactory } from './domain/continuiApplicationFactory';

import { BuildInDependenciesRegistrar } from './dependenciesRegistrar';
import { BuildInContinuiApplicationFactory } from './build-in/buildInContinuiApplicationFactory';


const activator: Activator = new BuildInActivator();

const buildInActivationRegistrar: BuildInDependenciesRegistrar = new BuildInDependenciesRegistrar();
buildInActivationRegistrar.registerBuilInReferencesIntoActivator(activator);

const continuiApplicationFactory: ContinuiApplicationFactory = 
    activator.resolve(BuildInContinuiApplicationFactory);

/**
 * Represents an factory that allows the creation of continui applications.
 */
export { continuiApplicationFactory as continuiApplicationFactory };

/**
 * Represents an activation center that allows the dependency managment.
 */
export { activator as activator };

export * from './domain/activator';
export * from './domain/continuiApplication';
export * from './domain/continuiApplicationFactory';

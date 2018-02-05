import { ContinuiApplicationFactory } from './domain/continuiApplicationFactory';

import { BuildInDependenciesRegistrar } from './dependenciesRegistrar';
import { BuildInContinuiApplicationFactory } from './build-in/buildInContinuiApplicationFactory';
import { Kernel, createKernel } from '@jems/di';
import {
    BuildInContinuiDependenciesSevice,
} from './build-in/services/buildInContinuiDependenciesService';
import { ContinuiDependenciesService } from './domain/services/continuiDependenciesService';

const kernel: Kernel = createKernel();
const continuiDependenciesService: ContinuiDependenciesService =
    new BuildInContinuiDependenciesSevice(kernel);

const buildInActivationRegistrar: BuildInDependenciesRegistrar =
    new BuildInDependenciesRegistrar();
buildInActivationRegistrar.registerBuilInReferencesIntoActivator(kernel);

const continuiApplicationFactory: ContinuiApplicationFactory =
    continuiDependenciesService.resolve(BuildInContinuiApplicationFactory);

/**
 * Represents an factory that allows the creation of continui applications.
 */
export { continuiApplicationFactory as continuiApplicationFactory };

/**
 * Represents a sevice that allow resolve continui default dependencies.
 */
export { continuiDependenciesService as continuiDependenciesService };

export * from './domain/continuiApplication';
export * from './domain/continuiApplicationFactory';
export * from './domain/services/continuiDependenciesService';

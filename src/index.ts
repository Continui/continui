import { Continui } from './continui';
import { ActivationCenter } from './activationCenter';
import { BuildInDependenciesRegistrar } from './build-in/buildInDependenciesRegistrar';

const activationCenter: ActivationCenter = new ActivationCenter();
const buildInActivationRegistrar: BuildInDependenciesRegistrar = new BuildInDependenciesRegistrar();

buildInActivationRegistrar.registerBuilInReferencesIntoActivator(activationCenter.activator);

/**
 * Returns a new continui application ready to be executed.
 * @returns A new continui application.
 */
export function createContinuiApplication(): Continui {
  return activationCenter.activator.resolve(Continui);
}

/**
 * Represents an activation center that allows facilitate the dependency managment.
 */
export { activationCenter as activationCenter };

export * from './activator';

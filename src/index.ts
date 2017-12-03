import { Continui } from './continui';
import { Activator } from './activator';
import { BuildInActivator } from './buildInActivator';
import { GitHubReleaseStep } from './build-in-steps/gitHub/release/gitHubReleaseStep';


let activator: Activator = new BuildInActivator()
activator.register('step', GitHubReleaseStep)

/**
 * Returns a new continui application ready to be executed.
 * @returns A new continui application.
 */
export function createContinuiApplication(): Continui {
    return <Continui>activator.resolve(Continui);
}

export { activator as activator }


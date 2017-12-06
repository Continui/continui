import { Continui } from './continui';
import { Activator } from './activator';
import { BuildInActivator } from './buildInActivator';
import { GitHubReleaseStep } from './build-in-steps/gitHub/release/gitHubReleaseStep';
import { BuildInTextTemplateService } from './services/buildInTextTemplateService';
import { BuildInCliStepOptionParsingService } from './services/buildInCliStepOptionParsingService';
import { BuildInLoggingService } from './services/buildInLoggingService';


let activator: Activator = new BuildInActivator()
activator.register('step', GitHubReleaseStep)
activator.register('loggingService', BuildInLoggingService)
activator.register('textTemplateService', BuildInTextTemplateService)
activator.register('cliStepOptionParsingService', BuildInCliStepOptionParsingService)

/**
 * Returns a new continui application ready to be executed.
 * @returns A new continui application.
 */
export function createContinuiApplication(): Continui {
    return <Continui>activator.resolve(Continui);
}

export { activator as activator }


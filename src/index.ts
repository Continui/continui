import { Continui } from './continui';
import { Activator } from './activator';
import { BuildInActivator } from './buildInActivator';
import { GitHubReleaseStep } from './build-in-steps/gitHub/release/gitHubReleaseStep';
import { BuildInTextTemplateService } from './services/buildInTextTemplateService';
import { BuildInCliStepOptionParsingService } from './services/buildInCliStepOptionParsingService';
import { BuildInLoggingService } from './services/buildInLoggingService';
import { BuildInTextSecureService } from './services/buidInTextSecureService';


let activator: Activator = new BuildInActivator()
activator.register('step', GitHubReleaseStep)
         .register('loggingService', BuildInLoggingService)
         .register('textTemplateService', BuildInTextTemplateService)
         .register('cliStepOptionParsingService', BuildInCliStepOptionParsingService)
         .register('textSecureService', BuildInTextSecureService, true)

/**
 * Returns a new continui application ready to be executed.
 * @returns A new continui application.
 */
export function createContinuiApplication(): Continui {
    return <Continui>activator.resolve(Continui);
}

export { activator as activator }


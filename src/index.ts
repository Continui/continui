import { Continui } from './continui';


import { GitHubReleaseStep } from './build-in-steps/github-release/gitHubReleaseStep';
import { BuildInTextTemplateService } from './services/buildInTextTemplateService';
import { BuildInCliStepOptionParsingService } from './services/buildInCliStepOptionParsingService';
import { BuildInLoggingService } from './services/buildInLoggingService';
import { BuildInTextSecureService } from './services/buidInTextSecureService';
import { BuildInHelpGenerationService } from './services/buildInHelpGenerationService'

let defaultActivator: Activator = new BuildInActivator()
let currentActivator: Activator = defaultActivator

/**
 * Returns a new continui application ready to be executed.
 * @returns A new continui application.
 */
export function createContinuiApplication(): Continui {
    return gerCurrentActivator().resolve(Continui);
}



gerCurrentActivator().register('step', GitHubReleaseStep) 
                     .register('loggingService', BuildInLoggingService)
                     .register('textTemplateService', BuildInTextTemplateService)
                     .register('cliStepOptionParsingService', BuildInCliStepOptionParsingService)
                     .register('helpGenerationService', BuildInHelpGenerationService)
                     .register('textSecureService', BuildInTextSecureService, true)
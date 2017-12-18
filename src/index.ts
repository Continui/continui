import { Continui } from './continui';
import { ActivationCenter } from './activationCenter';

import { GitHubReleaseStep } from './build-in-steps/github-release/gitHubReleaseStep';
import { BuildInTextTemplateService } from './services/buildInTextTemplateService';
import { BuildInCliStepOptionParsingService } from './services/buildInCliStepOptionParsingService';
import { BuildInLoggingService } from './services/buildInLoggingService';
import { BuildInTextSecureService } from './services/buidInTextSecureService';
import { BuildInHelpGenerationService } from './services/buildInHelpGenerationService'

let activationCenter: ActivationCenter = new ActivationCenter()

/**
 * Returns a new continui application ready to be executed.
 * @returns A new continui application.
 */
export function createContinuiApplication(): Continui {
    return activationCenter.currentActivator.resolve(Continui);
}

/**
 * Represents an activation center that allows facilitate the dependency managment.
 */
export { activationCenter as activationCenter }


activationCenter.addActivatorReferences({
        alias: 'step', 
        target: GitHubReleaseStep
    },
    {
        alias: 'loggingService', 
        target:  BuildInLoggingService
    },
    {
        alias: 'textTemplateService', 
        target:  BuildInTextTemplateService
    },
    {
        alias: 'cliStepOptionParsingService', 
        target:  BuildInCliStepOptionParsingService
    },
    {
        alias: 'helpGenerationService', 
        target:  BuildInHelpGenerationService
    },
    {
        alias: 'textSecureService', 
        target:  BuildInTextSecureService, 
        perResolution:  true
    })
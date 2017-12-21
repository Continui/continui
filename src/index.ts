import { Continui } from './continui';
import { ActivationCenter } from './activationCenter';
import { BuildInLoggingService } from './build-in/services/buildInLoggingService';
import { BuildInTextTemplateService } from './build-in/services/buildInTextTemplateService';
import { BuildInCliStepOptionParsingService } from 
  './build-in/services/buildInCliStepOptionParsingService';
import { BuildInHelpGenerationService } from './build-in/services/buildInHelpGenerationService';
import { BuildInTextSecureService } from './build-in/services/buidInTextSecureService';

const activationCenter: ActivationCenter = new ActivationCenter();

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
export { activationCenter as activationCenter };



activationCenter.addActivatorReferences(...[{
  alias: 'loggingService', 
  target:  BuildInLoggingService,
},
{
  alias: 'textTemplateService',
  target:  BuildInTextTemplateService,
},
{
  alias: 'cliStepOptionParsingService',
  target:  BuildInCliStepOptionParsingService,
},
{
  alias: 'helpGenerationService',
  target:  BuildInHelpGenerationService,
},
{
  alias: 'textSecureService',
  target:  BuildInTextSecureService, 
  perResolution:  true,
}]);

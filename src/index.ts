import { Continui } from './continui';
import { ActivationCenter } from './activationCenter';
import { BuildInLoggingService } from './build-in/services/buildInLoggingService';
import { BuildInTextTemplateService } from './build-in/services/buildInTextTemplateService';
import { BuildInCliArgumentsParsingService } from 
  './build-in/services/buildInCliArgumentsParsingService';
import { BuildInHelpGenerationService } from './build-in/services/buildInHelpGenerationService';
import { BuildInTextSecureService } from './build-in/services/buidInTextSecureService';
import { StepFactory } from './stepFactory';

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

export * from './activator';

activationCenter.addActivatorReferences(...[{
  alias: 'activationCenter', 
  target:  activationCenter,
  asConstant: true,
},{
  alias: 'loggingService', 
  target:  BuildInLoggingService,
}, {
  alias: 'textTemplateService',
  target:  BuildInTextTemplateService,
},{
  alias: 'cliArgumentsParsingService',
  target:  BuildInCliArgumentsParsingService,
},{
  alias: 'helpGenerationService',
  target:  BuildInHelpGenerationService,
},{
  alias: 'stepFactory',
  target: StepFactory,
},{
  alias: 'textSecureService',
  target:  BuildInTextSecureService, 
  perResolution:  true,
}]);

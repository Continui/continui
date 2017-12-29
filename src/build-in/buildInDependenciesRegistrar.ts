import { Activator } from '../index';
import { BuildInLoggingService } from './services/buildInLoggingService';
import { BuildInTextTemplateService } from './services/buildInTextTemplateService';
import { BuildInCliArgumentsParsingService } from 
  './services/buildInCliArgumentsParsingService';
import { BuildInHelpGenerationService } from './services/buildInHelpGenerationService';
import { BuildInTextSecureService } from './services/buildInTextSecureService';
import { StepFactory } from '../stepFactory';
import {
  StepActivationReference,
  StepActivationReferenceType,
  StepActivationReferenceMode,
} from 'continui-step';

const buildInStepReferences: StepActivationReference[] = [{
  alias: 'activationCenter',       
  target:  this,
  type: StepActivationReferenceType.constant,
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
  mode: StepActivationReferenceMode.singelton,
}];

export class BuildInDependenciesRegistrar {
  public registerBuilInReferencesIntoActivator(activator: Activator) {
    buildInStepReferences.forEach(reference => activator.registerReference(reference));
  }
}

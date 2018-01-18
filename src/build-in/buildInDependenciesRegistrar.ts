import { BuildInLoggingService } from './services/buildInLoggingService';
import { BuildInTextTemplateService } from './services/buildInTextTemplateService';
import { BuildInCliArgumentsParsingService } from 
  './services/buildInCliArgumentsParsingService';
import { BuildInHelpGenerationService } from './services/buildInHelpGenerationService';
import { BuildInTextSecureService } from './services/buildInTextSecureService';
import {
  StepActivationReference,
  StepActivationReferenceType,
  StepActivationReferenceMode,
} from 'continui-step';
import { BuildInTextTemplateContextProvider } from './services/buildInTextTemplateContextProvider';
import { ActivationCenter } from '../domain/activationCenter';
import { BuildInStepFactory } from './buildInStepFactory';

const buildInStepReferences: StepActivationReference[] = [{
  alias: 'loggingService', 
  target:  BuildInLoggingService,
}, {
  alias: 'textTemplateService',
  target:  BuildInTextTemplateService,
},{
  alias: 'textTemplateContextProvider',
  target: BuildInTextTemplateContextProvider,
  mode: StepActivationReferenceMode.singelton,
},{
  alias: 'cliArgumentsParsingService',
  target:  BuildInCliArgumentsParsingService,
},{
  alias: 'helpGenerationService',
  target:  BuildInHelpGenerationService,
},{
  alias: 'stepFactory',
  target: BuildInStepFactory,
},{
  alias: 'textSecureService',
  target:  BuildInTextSecureService,
  mode: StepActivationReferenceMode.singelton,
}];

export class BuildInDependenciesRegistrar {
  public registerBuilInReferencesIntoActivator(activationCenter: ActivationCenter) {
    
    activationCenter.activator.registerReference({
      alias: 'activationCenter',       
      target:  activationCenter,
      type: StepActivationReferenceType.constant,
    });

    buildInStepReferences.forEach(reference => activationCenter.activator
                                                               .registerReference(reference));
  }
}

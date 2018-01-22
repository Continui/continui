import { BuildInLoggingService } from './build-in/services/buildInLoggingService';
import { BuildInTextTemplateService } from './build-in/services/buildInTextTemplateService';
import { BuildInTextSecureService } from './build-in/services/buildInTextSecureService';
import {
  StepActivationReference,
  StepActivationReferenceType,
  StepActivationReferenceMode,
} from 'continui-step';
import { BuildInTextTemplateContextProvider } from './build-in/services/buildInTextTemplateContextProvider';
import { BuildInStepsProvider } from './build-in/providers/buildInStepsProvider';
import { Activator } from './index';


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
  alias: 'stepsProvider',
  target: BuildInStepsProvider,
},{
  alias: 'textSecureService',
  target:  BuildInTextSecureService,
  mode: StepActivationReferenceMode.singelton,
}];

export class BuildInDependenciesRegistrar {
  public registerBuilInReferencesIntoActivator(activator: Activator) {
    
    activator.registerReference({
      alias: 'activator',       
      target:  activator,
      type: StepActivationReferenceType.constant,
    });

    buildInStepReferences.forEach(reference => activator.registerReference(reference));
  }
}

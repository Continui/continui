import { Activator } from './domain/activator';
import { BuildInLoggingService } from './build-in/services/buildInLoggingService';
import { BuildInTextTemplateService } from './build-in/services/buildInTextTemplateService';
import { BuildInTextSecureService } from './build-in/services/buildInTextSecureService';
import {
  StepActivationReference,
  StepActivationReferenceType,
  StepActivationReferenceMode,
} from 'continui-step';
import {
  BuildInTextTemplateContextProvider,
} from './build-in/services/buildInTextTemplateContextProvider';
import { BuildInStepsProvider } from './build-in/providers/buildInStepsProvider';
import {
  BuildInExecutionConfigurationMergingService,
} from './build-in/services/buildInExecutionConfigurationMergingService';
import {
  BuildInFromFileExecutionConfigurationProvider,
} from './build-in/providers/buildInFromFileExecutionConfigurationProvider';
import {
  BuildInCliExecutionConfigurationParsingService,
} from './build-in/cli/buildIncliExecutionConfigurationParsingService';


export class BuildInDependenciesRegistrar {
  public registerBuilInReferencesIntoActivator(activator: Activator) {    
    activator.registerReference({
      alias: 'activator',       
      target:  activator,
      type: StepActivationReferenceType.constant,
    });

    this.registerServicesIntoActivator(activator);
    this.registerProvidersIntoActivator(activator);
    this.registerCliDependenciesIntoActivator(activator);
  }  

  private registerServicesIntoActivator(activator: Activator) {
    activator.registerReference({
      alias: 'executionConfigurationMergingService',
      target: BuildInExecutionConfigurationMergingService,
    }).registerReference({
      alias: 'loggingService', 
      target:  BuildInLoggingService,
    }).registerReference({
      alias: 'textSecureService',
      target:  BuildInTextSecureService,
      mode: StepActivationReferenceMode.singelton,
    }).registerReference({
      alias: 'textTemplateContextProvider',
      target: BuildInTextTemplateContextProvider,
      mode: StepActivationReferenceMode.singelton,
    }).registerReference({
      alias: 'textTemplateService',
      target:  BuildInTextTemplateService,
    });
  }

  private registerProvidersIntoActivator(activator: Activator) {
    activator.registerReference({
      alias: 'fromFileExecutionConfigurationProvider',
      target: BuildInFromFileExecutionConfigurationProvider,
    }).registerReference({
      alias: 'stepsProvider',
      target: BuildInStepsProvider,
    });
  }

  private registerCliDependenciesIntoActivator(activator: Activator) {
    activator.registerReference({
      alias: 'cliExecutionConfigurationParsingService',
      target: BuildInCliExecutionConfigurationParsingService,
    });
  }
}

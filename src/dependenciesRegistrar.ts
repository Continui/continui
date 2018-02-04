import { Activator } from './domain/activator';
import { BuildInLoggingService } from './build-in/services/buildInLoggingService';
import { BuildInTextTemplateService } from './build-in/services/buildInTextTemplateService';
import { BuildInTextSecureService } from './build-in/services/buildInTextSecureService';
import {
  ActionActivationReference,
  ActionActivationReferenceType,
  ActionActivationReferenceMode,
} from 'continui-action';
import {
  BuildInTextTemplateContextProvider,
} from './build-in/services/buildInTextTemplateContextProvider';
import { BuildInActionsProvider } from './build-in/providers/buildInActionsProvider';
import {
  BuildInExecutionConfigurationMergingService,
} from './build-in/services/buildInExecutionConfigurationMergingService';
import {
  BuildInFromFileExecutionConfigurationProvider,
} from './build-in/providers/buildInFromFileExecutionConfigurationProvider';
import {
  BuildInCliExecutionConfigurationParsingService,
} from './build-in/cli/services/buildIncliExecutionConfigurationParsingService';
import { HelpCliRenderer } from './build-in/cli/rederers/helpCliRenderer';
import { VersionCliRenderer } from './build-in/cli/rederers/versionCliRenderer';
import { ActionsCliRenderer } from './build-in/cli/rederers/actionsCliRenderer';
import { BuildInCommandExecutionService } from './build-in/services/buildInCommandExecutionService';


export class BuildInDependenciesRegistrar {
  public registerBuilInReferencesIntoActivator(activator: Activator) {
    activator.registerReference({
      alias: 'activator',
      target: activator,
      type: ActionActivationReferenceType.constant,
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
      target: BuildInLoggingService,
    }).registerReference({
      alias: 'textSecureService',
      target: BuildInTextSecureService,
      mode: ActionActivationReferenceMode.singelton,
    }).registerReference({
      alias: 'textTemplateContextProvider',
      target: BuildInTextTemplateContextProvider,
      mode: ActionActivationReferenceMode.singelton,
    }).registerReference({
      alias: 'textTemplateService',
      target: BuildInTextTemplateService,
    }).registerReference({
      alias: 'commandExecutionService',
      target: BuildInCommandExecutionService,
    });
  }

  private registerProvidersIntoActivator(activator: Activator) {
    activator.registerReference({
      alias: 'fromFileExecutionConfigurationProvider',
      target: BuildInFromFileExecutionConfigurationProvider,
    }).registerReference({
      alias: 'actionsProvider',
      target: BuildInActionsProvider,
      mode: ActionActivationReferenceMode.singelton,
    });
  }

  private registerCliDependenciesIntoActivator(activator: Activator) {
    activator.registerReference({
      alias: 'cliExecutionConfigurationParsingService',
      target: BuildInCliExecutionConfigurationParsingService,
    }).registerReference({
      alias: 'cliRenderer',
      target: HelpCliRenderer,
    }).registerReference({
      alias: 'cliRenderer',
      target: VersionCliRenderer,
    }).registerReference({
      alias: 'cliRenderer',
      target: ActionsCliRenderer,
    });
  }
}

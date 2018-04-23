import { BuildInLoggingService } from './build-in/services/buildInLoggingService';
import { BuildInTextTemplateService } from './build-in/services/buildInTextTemplateService';
import { BuildInTextSecureService } from './build-in/services/buildInTextSecureService';
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
import { Kernel } from '@jems/di';
import { BuildInContinuiApplicationFactory } from './build-in/buildInContinuiApplicationFactory';


export class BuildInDependenciesRegistrar {
  public registerBuilInReferencesIntoActivator(kernel: Kernel) {

    kernel.bind('kernel')
          .to(kernel)
          .asConstant()
          .whenInjectedIntoTypes(
            BuildInActionsProvider,
            BuildInContinuiApplicationFactory,
          );

    this.registerServicesIntoActivator(kernel);
    this.registerProvidersIntoActivator(kernel);
    this.registerCliDependenciesIntoActivator(kernel);
  }

  private registerServicesIntoActivator(kernel: Kernel) {
    kernel.bind('executionConfigurationMergingService')
          .to(BuildInExecutionConfigurationMergingService);

    kernel.bind('loggingService')
          .to(BuildInLoggingService);

    kernel.bind('textSecureService')
          .to(BuildInTextSecureService)
          .inSingletonMode();
          
    kernel.bind('textTemplateContextProvider')
          .to(BuildInTextTemplateContextProvider)
          .inSingletonMode();
          
    kernel.bind('textTemplateService')
          .to(BuildInTextTemplateService);

    kernel.bind('commandExecutionService')
          .to(BuildInCommandExecutionService);
  }

  private registerProvidersIntoActivator(kernel: Kernel) {
    kernel.bind('fromFileExecutionConfigurationProvider')
          .to(BuildInFromFileExecutionConfigurationProvider);

    kernel.bind('actionsProvider')
          .to(BuildInActionsProvider)
          .inSingletonMode();
  }

  private registerCliDependenciesIntoActivator(kernel: Kernel) {
    kernel.bind('cliExecutionConfigurationParsingService')
          .to(BuildInCliExecutionConfigurationParsingService);

    kernel.bind('cliRenderer')
          .to(HelpCliRenderer);

    kernel.bind('cliRenderer')
          .to(VersionCliRenderer);

    kernel.bind('cliRenderer')
          .to(ActionsCliRenderer);
  }
}

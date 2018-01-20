import { ContinuiApplicationFactory } from '../domain/continuiApplicationFactory';
import { ContinuiApplication } from '../domain/continuiApplication';
import { ActivationCenter } from '../domain/activationCenter';
import { BuildInContinuiApplication } from './buildInContinuiApplication';
import { ExecutionConfiguration } from '../domain/models/executionConfiguration';
import { StepProvider } from '../domain/providers/stepsProvider';
import {
  FromFileExecutionConfigurationProvider
} from '../domain/providers/fromFileExecutionConfigurationProvider';
import {
  ExecutionConfigurationMergingService
} from '../domain/services/executionConfigurationMergingService';

const privateScope: WeakMap<BuildInContinuiApplicationFactory, {
  activationCenter: ActivationCenter,
  stepProvider: StepProvider,
  fromFileExecutionConfigurationProvider: FromFileExecutionConfigurationProvider,
  executionConfigurationMergingService: ExecutionConfigurationMergingService
}> = new WeakMap();

/**
 * Represents a factory that allows the creation of continui applications.
 */
export class BuildInContinuiApplicationFactory implements ContinuiApplicationFactory {

  constructor(activationCenter: ActivationCenter,
              stepProvider: StepProvider,
              fromFileExecutionConfigurationProvider: FromFileExecutionConfigurationProvider,
              executionConfigurationMergingService: ExecutionConfigurationMergingService) {
    privateScope.set(this, {
      activationCenter,
      stepProvider,
      fromFileExecutionConfigurationProvider,
      executionConfigurationMergingService
    });
  }

    /**
     * Returns a new continui application ready to be executed.
     * @param executionConfiguration Represents the execution configuration for the application.
     * @returns A new continui application.
     */
  public createsContinuiApplication(executionConfiguration: ExecutionConfiguration): 
    ContinuiApplication {

    const scope = privateScope.get(this);    
    const continuiApplication: ContinuiApplication = scope.activationCenter
                                                          .activator
                                                          .resolve(BuildInContinuiApplication);

    let mergedExecutionConfiguration: ExecutionConfiguration = executionConfiguration;

    // TODO: Fix this magic str
    if (executionConfiguration.cofigurationFile != 'ignore-file-configuration') { 
      mergedExecutionConfiguration = this.getMergedExecutionConfiguration(executionConfiguration)
    }

    if (mergedExecutionConfiguration.stepsDeinitionsModules &&
        mergedExecutionConfiguration.stepsDeinitionsModules.length) {
          continuiApplication.loadSteps(
            ...scope.stepProvider
                    .getStepsFromStepModules(mergedExecutionConfiguration.stepsDeinitionsModules)
          );
        }

    return continuiApplication;
  }

  private getMergedExecutionConfiguration(unmergedExecutionConfiguration: ExecutionConfiguration):
    ExecutionConfiguration {
      
    const scope = privateScope.get(this); 

    const fromFileExecutionConfiguration : ExecutionConfiguration = 
      // TODO: Fix this magic str
      scope.fromFileExecutionConfigurationProvider.getFileExecutionConfigration(
        unmergedExecutionConfiguration.cofigurationFile || './continui.json'
      );

    const executionConfiguration: ExecutionConfiguration = 
      scope.executionConfigurationMergingService
           .mergeExecutionConfigurations(fromFileExecutionConfiguration,
                                         unmergedExecutionConfiguration);

    return executionConfiguration;
  }
}

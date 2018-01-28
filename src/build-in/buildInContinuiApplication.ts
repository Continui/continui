import { ContinuiApplication } from '../domain/continuiApplication';
import {
  Step,
  StepOption,
  StepOptionTypes,
  StepOptionValueMap,
  IdentifiedStepOptionMaps,
} from 'continui-step';
import {
  LoggingService,
  LoggingDataColorTypes,
  TextSecureService,
} from 'continui-services';
import { ExecutionConfiguration } from '../domain/models/executionConfiguration';
import { StepsProvider } from '../domain/providers/stepsProvider';
import {
  FromFileExecutionConfigurationProvider,
} from '../domain/providers/fromFileExecutionConfigurationProvider';
import {
  ExecutionConfigurationMergingService,
} from '../domain/services/executionConfigurationMergingService';
import { ExecutionProgressInformation } from '../domain/models/executionProgressInformation';

import co from 'co';

import * as continuiApplicationEvents from '../domain/constants/continuiApplicationEvents';

type StepExecutionContext = {
  step: Step<any>,
  stepOptionValueMap: StepOptionValueMap,
  stepContext: any,
};

const privateScope: WeakMap<BuildInContinuiApplication, {
  steps: Step<any>[]
  stepsProvider: StepsProvider
  textSecureService: TextSecureService
  fromFileExecutionConfigurationProvider: FromFileExecutionConfigurationProvider
  executionConfigurationMergingService: ExecutionConfigurationMergingService,
}> = new WeakMap();

/**
 * Represents a continui application.
 */
export class BuildInContinuiApplication extends ContinuiApplication {

  constructor(
    stepsProvider: StepsProvider,
    textSecureService: TextSecureService,
    fromFileExecutionConfigurationProvider: FromFileExecutionConfigurationProvider,
    executionConfigurationMergingService: ExecutionConfigurationMergingService) {

    super();

    privateScope.set(this, {
      stepsProvider,
      textSecureService,
      fromFileExecutionConfigurationProvider,
      executionConfigurationMergingService,
      steps: [],
    });
  }

  /**
   * Execute the continui loaded application.
   * @param executionConfiguration Represents the execution configuration for the application.
   */
  public execute(executionConfiguration: ExecutionConfiguration): void {
    const scope = privateScope.get(this);
    const stepExecutionContexts: StepExecutionContext[] = [];

    let mergedExecutionConfiguration: ExecutionConfiguration = executionConfiguration;

    // TODO: Fix this magic str
    if (executionConfiguration.cofigurationFile !== 'ignore-file-configuration') {
      mergedExecutionConfiguration = this.getMergedExecutionConfiguration(executionConfiguration);
    }

    if (!mergedExecutionConfiguration.steps.length) {
      throw new Error('Must provided at least one step to run. eg. [continui mystep1 ' +
        '--mystep1.param1 "param1value" mystep2]');
    }

    this.emitProgressChanged(0, `Starting execution`);

    if (mergedExecutionConfiguration.stepsDeinitionsModules &&
      mergedExecutionConfiguration.stepsDeinitionsModules.length) {

      const modulesToLoadCount =
        mergedExecutionConfiguration.stepsDeinitionsModules.length;

      this.emitProgressChanged(10, `Loading ${modulesToLoadCount} steps definitions modules`);

      this.loadSteps(
        ...scope.stepsProvider
          .getStepsFromStepModules(mergedExecutionConfiguration.stepsDeinitionsModules),
      );
      this.loadDefaultStepValuesInExecutionContext(mergedExecutionConfiguration);

      this.emitProgressChanged(20, `steps definitions modules loaded`);
    }

    this.emitProgressChanged(30, `${scope.steps.length} steps recognized`);

    this.emitProgressChanged(35, `Registering sensitive data for secure outputs.`);
    this.registerSensitiveText(mergedExecutionConfiguration.stepsOptionsValues);

    this.emitProgressChanged(40, `Validating required steps existance`);
    this.validateIdentifiersExistence(mergedExecutionConfiguration.steps);

    this.emitProgressChanged(45, `Validating required options provision`);
    this.validateRequiredOptionProvision(mergedExecutionConfiguration);

    co(function* () {
      const self: BuildInContinuiApplication = <BuildInContinuiApplication>this;

      yield mergedExecutionConfiguration.steps.map((stepIdentifier, index) => {
        // I assume that the find function will always retrieve a step because his existence is
        // previously validated by the validateIdentifiersExistence function.
        const step: Step<any> = self.getStep(stepIdentifier);
        const stepOpionsValueMap: StepOptionValueMap =
          mergedExecutionConfiguration.stepsOptionsValues[stepIdentifier] || {};
        const stepProgressRepresentation: number =
          50 + ((50 / mergedExecutionConfiguration.steps.length) * index);

        self.emitProgressChanged(stepProgressRepresentation,
                                 `Working with ${step.identifier}(${step.name})`);

        const toDisplayOptions = Object.keys(stepOpionsValueMap).map((optionKey) => {
          const optionValue: string = stepOpionsValueMap[optionKey] !== undefined ?
                                                          stepOpionsValueMap[optionKey] :
                                                          '[undefined]';
          return `${optionKey}=${optionValue}`;
        });

        this.emitInformationAvailable(`Step ${step.identifier}(${step.name}) will be executed` +
                                      'with options.\n' + toDisplayOptions.join('\n'));



        const stepExecutionContext: StepExecutionContext = {
          step,
          stepOptionValueMap: stepOpionsValueMap,
          stepContext: step.createsContextFromOptionsMap(stepOpionsValueMap),
        };

        stepExecutionContexts.push(stepExecutionContext);

        return self.executeStep(stepExecutionContext);
      });

      self.emitProgressChanged(100, `Execution done.`);
    }.bind(this)).catch((error) => {
      console.error(error);

      co(function* () {
        const self: BuildInContinuiApplication = <BuildInContinuiApplication>this;

        self.emitInformationAvailable(`Restoring steps execution due error: ` + error);
        yield self.restoreExecutedStep(stepExecutionContexts);
      }.bind(this));

      this.emitProgressChanged(0, `Execution fail.`);
    });
  }

  /**
    * Load the provided steps to his future execution.
    * @param steps Represents the steps that will be executed.
    */
  public loadSteps(...steps: Step<any>[]): void {
    const scope = privateScope.get(this);

    steps.forEach((step) => {
      if (scope.steps.find(addedStep => step.identifier === addedStep.identifier)) {
        throw new Error(`There is already an step with the identifier ${step.identifier}`);
      }

      scope.steps.push(step);
    });
  }

  /**
   * Loads default values into the provided execution configuration.
   * @param executionConfiguration Represents the execution configuration.
   */
  private loadDefaultStepValuesInExecutionContext(executionConfiguration: ExecutionConfiguration):
    void {
    privateScope.get(this).steps.forEach((step) => {
      step.options
        .filter(option => option.defaultValue !== undefined)
        .forEach((option) => {

          const steOptionValueMap: StepOptionValueMap =
            executionConfiguration.stepsOptionsValues[step.identifier];

          if (steOptionValueMap[option.key] === undefined) {
            steOptionValueMap[option.key] = option.defaultValue;
          }
        });
    });
  }

  /**
   * Executed and step based on the provided step execution context.
   * @param stepExecutionContext Represents the execution context of the step to be executed.
   */
  private * executeStep(stepExecutionContext: StepExecutionContext): IterableIterator<any> {
    const scope = privateScope.get(this);
    const step: Step<any> = stepExecutionContext.step;

    this.emitInformationAvailable('Starting the restauration point creation for the step ' +
      `${step.identifier}(${step.name})`);
    yield step.createsRestaurationPoint(stepExecutionContext.stepOptionValueMap,
                                        stepExecutionContext.stepContext) || [];
    this.emitInformationAvailable('Restauration point creation ended for the step ' +
      `${step.identifier}(${step.name})`);

    this.emitInformationAvailable(`Starting the step execution ${step.identifier}(${step.name})`);
    yield step.execute(stepExecutionContext.stepOptionValueMap,
                       stepExecutionContext.stepContext) || [];
    this.emitInformationAvailable(`Step execution ${step.identifier}(${step.name}) ` +
      'ended successfully');
  }

  /**
   * Performs steps restorations based on the provided step execution contexts.
   * @param stepExecutionContexts Represents the execution contexts to be restored.
   */
  private * restoreExecutedStep(stepExecutionContexts: StepExecutionContext[]):
    IterableIterator<any> {
    const scope = privateScope.get(this);

    yield stepExecutionContexts.map((stepExecutionContext) => {
      const step = stepExecutionContext.step;

      try {
        this.emitInformationAvailable(`Restoring step ${step.identifier}(${step.name})`);
        return step.restore(stepExecutionContext.stepOptionValueMap,
                            stepExecutionContext.stepContext) || [];
      } catch (error) {
        this.emitInformationAvailable(`Error restoring step ${step.identifier}(${step.name}) ` +
          error);
      }
    });
  }

  /**
   * Return an step bases on the provided identifier.
   * @param stepIdentifier Represents the step identifier to look for.
   * @returns An Step.
   */
  private getStep(stepIdentifier: string): Step<any> {
    const step: Step<any> = privateScope.get(this)
      .steps
      .find(step => step.identifier === stepIdentifier);

    if (!step) {
      throw new Error('There is not step with the provided step idenifier ' + stepIdentifier);
    }

    return step;
  }

  /**
   * Register all secure values to be secured in any application output.
   * @param identifiedStepOptionMaps Represents the step otion value map.
   */
  private registerSensitiveText(identifiedStepOptionMaps: IdentifiedStepOptionMaps): void {
    const scope = privateScope.get(this);

    scope.steps.forEach((step) => {
      step.options.forEach((option) => {
        if (option.isSecure) {
          scope.textSecureService.registerSensitiveText(
            identifiedStepOptionMaps[step.identifier][option.key],
          );
        }
      });
    });
  }

  /**
   * Validates that all provided identifiers are loaded into the application.
   * @param stepIdentifiers Represents the step identifiers to be validated.
   */
  private validateIdentifiersExistence(stepIdentifiers: string[]): void {
    const scope = privateScope.get(this);

    let existanceValiationErrorMessage: string = '';

    stepIdentifiers.forEach((stepIdentifier) => {
      try {
        this.getStep(stepIdentifier);
      } catch (e) {
        existanceValiationErrorMessage += `identifier: ${stepIdentifier} -> ${e.message || e} \n`;
      }
    });

    if (existanceValiationErrorMessage) {
      throw new Error(existanceValiationErrorMessage);
    }
  }

  /**
   * Validates that all required options by the requested steps were provided.
   * @param executionConfiguration Represetns the execution configuration.
   */
  private validateRequiredOptionProvision(executionConfiguration: ExecutionConfiguration): void {
    const scope = privateScope.get(this);

    let requiredOptiosErrorMessage: string = '';

    executionConfiguration.steps.forEach((stepIdentifier) => {
      const step: Step<any> = this.getStep(stepIdentifier);
      const stepOptionMap: StepOptionValueMap =
        executionConfiguration.stepsOptionsValues[step.identifier] || {};

      let stepRequiredOptiosErrorMessage: string = '';

      if (step.options) {
        step.options
          .filter(option => option.isRequired && option.defaultValue === undefined)
          .forEach((option) => {

            if (!stepOptionMap[option.key] && stepOptionMap[option.key] !== 0) {
              stepRequiredOptiosErrorMessage += `The option --${step.identifier}.${option.key}` +
                ' was not provided and is required. \n';
            }
          });
      }

      if (stepRequiredOptiosErrorMessage) {
        requiredOptiosErrorMessage += `Step [${step.identifier}](${step.name}) can not be ` +
          'executed due:\n\n' + stepRequiredOptiosErrorMessage + '\n';
      }
    });

    if (requiredOptiosErrorMessage) {
      throw new Error(requiredOptiosErrorMessage);
    }
  }

  /**
   * Returns the provided execution configuration merged with the file execution configuration.
   * @param unmergedExecutionConfiguration Represents the provided execution configuration.
   * @returns And execution configuration.
   */
  private getMergedExecutionConfiguration(unmergedExecutionConfiguration: ExecutionConfiguration):
    ExecutionConfiguration {

    const scope = privateScope.get(this);
    const fromFileExecutionConfiguration: ExecutionConfiguration =
      scope.fromFileExecutionConfigurationProvider.getExecutionConfigrationFromFile(
        unmergedExecutionConfiguration.cofigurationFile,
      );
    const mergedExecutionConfiguration: ExecutionConfiguration =
      scope.executionConfigurationMergingService
        .mergeExecutionConfigurations(fromFileExecutionConfiguration,
                                      unmergedExecutionConfiguration);

    return mergedExecutionConfiguration;
  }

  /**
   * Emit an event notifying the progress.
   * @param progress Represents the progress to inform.
   * @param friendlyStatus Represents a friendly status relate to the progress.
   */
  private emitProgressChanged(progress: number, friendlyStatus: string) {
    const executionProgressInformation: ExecutionProgressInformation = {
      progress,
      friendlyStatus,
    };

    this.emit(continuiApplicationEvents.PROGRESS_CHANGED, executionProgressInformation);
  }

  /**
   * Emit an event notifying the available information.
   * @param information Represents the information that is available.
   */
  private emitInformationAvailable(information: string) {
    this.emit(continuiApplicationEvents.INFORMATION_AVAILABLE, information);
  }
}

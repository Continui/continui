import { ContinuiApplication } from '../domain/continuiApplication';
import {
  Action,
  ActionOption,
  ActionOptionTypes,
  ActionOptionValueMap,
} from 'continui-action';
import {
  LoggingService,
  LoggingDataColorTypes,
  TextSecureService,
} from 'continui-services';
import { ExecutionConfiguration } from '../domain/models/executionConfiguration';
import { ActionsProvider } from '../domain/providers/actionsProvider';
import {
  FromFileExecutionConfigurationProvider,
} from '../domain/providers/fromFileExecutionConfigurationProvider';
import {
  ExecutionConfigurationMergingService,
} from '../domain/services/executionConfigurationMergingService';
import { ExecutionProgressInformation } from '../domain/models/executionProgressInformation';

import co from 'co';

import * as continuiApplicationEvents from '../domain/constants/continuiApplicationEvents';
import { ExecutionStep } from '../domain/models/executionStep';

type ActionExecutionContext = {
  action: Action<any>,
  actionOptionValueMap: ActionOptionValueMap,
  actionContext: any,
};

const privateScope: WeakMap<BuildInContinuiApplication, {
  actions: Action<any>[]
  actionsProvider: ActionsProvider
  textSecureService: TextSecureService
  fromFileExecutionConfigurationProvider: FromFileExecutionConfigurationProvider
  executionConfigurationMergingService: ExecutionConfigurationMergingService,
}> = new WeakMap();

/**
 * Represents a continui application.
 */
export class BuildInContinuiApplication extends ContinuiApplication {

  constructor(
    actionsProvider: ActionsProvider,
    textSecureService: TextSecureService,
    fromFileExecutionConfigurationProvider: FromFileExecutionConfigurationProvider,
    executionConfigurationMergingService: ExecutionConfigurationMergingService) {

    super();

    privateScope.set(this, {
      actionsProvider,
      textSecureService,
      fromFileExecutionConfigurationProvider,
      executionConfigurationMergingService,
      actions: [],
    });
  }

  /**
   * Execute the continui loaded application.
   * @param executionConfiguration Represents the execution configuration for the application.
   */
  public execute(executionConfiguration: ExecutionConfiguration): void {
    const scope = privateScope.get(this);
    const actionExecutionContexts: ActionExecutionContext[] = [];

    let mergedExecutionConfiguration: ExecutionConfiguration = executionConfiguration;

    // TODO: Fix this magic str
    if (executionConfiguration.cofigurationFile !== 'ignore-file-configuration') {
      mergedExecutionConfiguration = this.getMergedExecutionConfiguration(executionConfiguration);
    }

    if (!mergedExecutionConfiguration.steps.length) {
      throw new Error('Must provided at least one step to run. eg. [continui --step.mystep1.run ' +
        '--step.mystep1.param1 "param1value" --step.mystep2.run]');
    }

    this.emitProgressChanged(0, `Starting execution`);

    const modulesToLoadCount =
        mergedExecutionConfiguration.actionsDeinitionsModules ?
          mergedExecutionConfiguration.actionsDeinitionsModules.length : 0;

    this.emitProgressChanged(10, `Loading ${modulesToLoadCount} actions definitions modules`);

    if (modulesToLoadCount) {
      this.loadActions(
        ...scope.actionsProvider
          .getActionsFromActionModules(mergedExecutionConfiguration.actionsDeinitionsModules),
      );
      this.loadDefaultActionValuesInExecutionContext(mergedExecutionConfiguration);

      this.emitProgressChanged(20, `actions definitions modules loaded`);
    }

    this.emitProgressChanged(30, `${scope.actions.length} actions recognized`);

    this.emitProgressChanged(35, `Registering sensitive data for secure outputs.`);
    this.registerSensitiveText(mergedExecutionConfiguration.steps);

    this.emitProgressChanged(40, `Validating required actions existance`);
    this.validateActionsIdentifiersExistence(
      mergedExecutionConfiguration.steps.map(step => step.actionIdentifier),
    );

    this.emitProgressChanged(45, `Validating required options provision`);
    this.validateActionsRequiredOptionProvision(mergedExecutionConfiguration);

    co(function* () {
      const self: BuildInContinuiApplication = <BuildInContinuiApplication>this;

      yield mergedExecutionConfiguration.steps.map((step, index) => {
        // I assume that the find function will always retrieve a action because his existence is
        // previously validated by the validateActionsIdentifiersExistence function.
        const action: Action<any> = self.getAction(step.actionIdentifier);
        const actionOpionsValueMap: ActionOptionValueMap = step.actionOptionsValueMap || {};
        const actionProgressRepresentation: number =
          50 + ((50 / mergedExecutionConfiguration.steps.length) * index);

        self.emitProgressChanged(
          actionProgressRepresentation,
          `Working with step [${step.key}] ${action.identifier}(${action.name})`,
        );

        const toDisplayOptions = Object.keys(actionOpionsValueMap).map((optionKey) => {
          const optionValue: string = actionOpionsValueMap[optionKey] !== undefined ?
                                                          actionOpionsValueMap[optionKey] :
                                                          '[undefined]';
          return `${optionKey}=${optionValue}`;
        });

        this.emitInformationAvailable(`Action ${action.identifier}(${action.name}) will be ` +
                                      'executed with options.\n' + toDisplayOptions.join('\n'));

        const actionExecutionContext: ActionExecutionContext = {
          action,
          actionOptionValueMap: actionOpionsValueMap,
          actionContext: action.createsContextFromOptionsMap(actionOpionsValueMap),
        };

        actionExecutionContexts.push(actionExecutionContext);

        return self.executeAction(actionExecutionContext);
      });

      self.emitProgressChanged(100, `Execution done.`);
    }.bind(this)).catch((error) => {
      co(function* () {
        const self: BuildInContinuiApplication = <BuildInContinuiApplication>this;

        self.emitInformationAvailable(`Restoring actions execution due error in step: \n` +
                                      ` ${error.stack || (error + '\n Stack not provided')}`);
        yield self.restoreExecutedAction(actionExecutionContexts);
      }.bind(this));

      this.emitProgressChanged(0, `Execution fail.`);
      this.emitExecutionFailure(error);
    });
  }

  /**
    * Load the provided actions to his future execution.
    * @param actions Represents the actions that will be executed.
    */
  public loadActions(...actions: Action<any>[]): void {
    const scope = privateScope.get(this);

    actions.forEach((action) => {
      if (scope.actions.find(addedAction => action.identifier === addedAction.identifier)) {
        throw new Error(`There is already an action with the identifier ${action.identifier}`);
      }

      scope.actions.push(action);
    });
  }

  /**
   * Loads default values into the provided execution configuration.
   * @param executionConfiguration Represents the execution configuration.
   */
  private loadDefaultActionValuesInExecutionContext(executionConfiguration: ExecutionConfiguration):
    void {
    privateScope.get(this).actions.forEach((action) => {
      const actionExecutionSteps: ExecutionStep[] =
        executionConfiguration.steps.filter(step => step.actionIdentifier === action.identifier);

      if (actionExecutionSteps.length) {
        action.options
          .filter(option => option.defaultValue !== undefined)
          .forEach((option) => {

            actionExecutionSteps.forEach((executionStep) => {
              if (executionStep.actionOptionsValueMap[option.key] === undefined) {
                executionStep.actionOptionsValueMap[option.key] = option.defaultValue;
              }
            });
          });
      }
    });
  }

  /**
   * Executed and action based on the provided action execution context.
   * @param actionExecutionContext Represents the execution context of the action to be executed.
   */
  private * executeAction(actionExecutionContext: ActionExecutionContext): IterableIterator<any> {
    const scope = privateScope.get(this);
    const action: Action<any> = actionExecutionContext.action;

    this.emitInformationAvailable('Starting the restauration point creation for the action ' +
      `${action.identifier}(${action.name})`);
    yield action.createsRestaurationPoint(actionExecutionContext.actionOptionValueMap,
                                          actionExecutionContext.actionContext) || [];
    this.emitInformationAvailable('Restauration point creation ended for the action ' +
      `${action.identifier}(${action.name})`);

    this.emitInformationAvailable(`Starting the action execution ${action.identifier}` + 
                                  `(${action.name})`);
    yield action.execute(actionExecutionContext.actionOptionValueMap,
                         actionExecutionContext.actionContext) || [];
    this.emitInformationAvailable(`Action execution ${action.identifier}(${action.name}) ` +
      'ended successfully');
  }

  /**
   * Performs actions restorations based on the provided action execution contexts.
   * @param actionExecutionContexts Represents the execution contexts to be restored.
   */
  private * restoreExecutedAction(actionExecutionContexts: ActionExecutionContext[]):
    IterableIterator<any> {
    const scope = privateScope.get(this);

    yield actionExecutionContexts.map((actionExecutionContext) => {
      const action = actionExecutionContext.action;

      try {
        this.emitInformationAvailable(`Restoring action ${action.identifier}(${action.name})`);
        return action.restore(actionExecutionContext.actionOptionValueMap,
                              actionExecutionContext.actionContext) || [];
      } catch (error) {
        this.emitInformationAvailable(`Error restoring action ${action.identifier}` + 
                                      `(${action.name}) ` + error);
      }
    });
  }

  /**
   * Return an action bases on the provided identifier.
   * @param actionIdentifier Represents the action identifier to look for.
   * @returns An Action.
   */
  private getAction(actionIdentifier: string): Action<any> {
    const action: Action<any> = privateScope.get(this)
      .actions
      .find(action => action.identifier === actionIdentifier);

    if (!action) {
      throw new Error('There is not action with the provided action idenifier ' + actionIdentifier);
    }

    return action;
  }

  /**
   * Register all secure values to be secured in any application output.
   * @param executionSteps Represents the steps to be executed.
   */
  private registerSensitiveText(executionSteps: ExecutionStep[]): void {
    const scope = privateScope.get(this);

    scope.actions.forEach((action) => {
      const actionExecutionSteps: ExecutionStep[] =
        executionSteps.filter(step => step.actionIdentifier === action.identifier);

      if (actionExecutionSteps.length) {
        action.options.forEach((option) => {
          if (option.isSecure) {

            actionExecutionSteps.forEach((executionStep) => {
              scope.textSecureService.registerSensitiveText(
                executionStep.actionOptionsValueMap[option.key],
              );
            });
          }
        });
      }
    });
  }

  /**
   * Validates that all provided identifiers are loaded into the application.
   * @param actionIdentifiers Represents the action identifiers to be validated.
   */
  private validateActionsIdentifiersExistence(actionIdentifiers: string[]): void {
    const scope = privateScope.get(this);

    let existanceValiationErrorMessage: string = '';

    actionIdentifiers.forEach((actionIdentifier) => {
      try {
        this.getAction(actionIdentifier);
      } catch (e) {
        existanceValiationErrorMessage += `identifier: ${actionIdentifier} -> ${e.message || e} \n`;
      }
    });

    if (existanceValiationErrorMessage) {
      throw new Error(existanceValiationErrorMessage);
    }
  }

  /**
   * Validates that all required options by the requested actions were provided.
   * @param executionConfiguration Represetns the execution configuration.
   */
  private validateActionsRequiredOptionProvision(executionConfiguration: ExecutionConfiguration):
    void {
      
    const scope = privateScope.get(this);

    let requiredOptiosErrorMessage: string = '';

    executionConfiguration.steps.forEach((step) => {
      const action: Action<any> = this.getAction(step.actionIdentifier);
      const actionOptionMap: ActionOptionValueMap = step.actionOptionsValueMap || {};

      let actionRequiredOptiosErrorMessage: string = '';

      if (action.options) {
        action.options
          .filter(option => option.isRequired && option.defaultValue === undefined)
          .forEach((option) => {

            if (!actionOptionMap[option.key] && actionOptionMap[option.key] !== 0) {
              actionRequiredOptiosErrorMessage += 
                `The option --${action.identifier}.${option.key}` +
                ' was not provided and is required. \n';
            }
          });
      }

      if (actionRequiredOptiosErrorMessage) {
        requiredOptiosErrorMessage += `Action [${action.identifier}](${action.name}) can not be ` +
          'executed due:\n\n' + actionRequiredOptiosErrorMessage + '\n';
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
    const scope = privateScope.get(this);

    
    const executionProgressInformation: ExecutionProgressInformation = {
      progress,
      friendlyStatus: scope.textSecureService.parse(friendlyStatus),
    };

    this.emit(continuiApplicationEvents.PROGRESS_CHANGED, executionProgressInformation);
  }

  /**
   * Emit an event notifying the available information.
   * @param information Represents the information that is available.
   */
  private emitInformationAvailable(information: string) {
    const scope = privateScope.get(this);

    this.emit(continuiApplicationEvents.INFORMATION_AVAILABLE,
              scope.textSecureService.parse(information));
  }

  /**
   * Emit an event notifying the execution failure.
   * @param error Represents the error.
   */
  private emitExecutionFailure(error: Error) {
    const scope = privateScope.get(this);

    this.emit(continuiApplicationEvents.EXECUTION_FAILURE,
              error);
  }
}

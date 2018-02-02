import { CliRenderers } from '../../../domain/cli/cliRenderer';
import { ExecutionConfiguration } from '../../../domain/models/executionConfiguration';
import { Action, ActionOption } from 'continui-action';
import { ActionsProvider } from '../../../domain/providers/actionsProvider';
import { LoggingService } from 'continui-services';

const privateScope: WeakMap<ActionsCliRenderer, {
  actionsProvider: ActionsProvider,
  loggingService: LoggingService,
}> = new WeakMap();

/**
 * Represents a cli renderer that display informatio in a CLI.
 */
export class ActionsCliRenderer implements CliRenderers {

  constructor(actionsProvider: ActionsProvider, loggingService: LoggingService) {
    privateScope.set(this, {
      actionsProvider,
      loggingService,
    });
  }

  /**
   * Gets the keys which the cli renderer will be identified.
   */
  public get keys(): string[] { return ['s', 'actions']; }

  /**
   * Renders information into a CLI.
   * @param executionConfiguration Represents the execution configuraion.
   */
  public render(executionConfiguration: ExecutionConfiguration): void {
    const scope = privateScope.get(this);

    let actions: Action<any>[] = [];

    if (executionConfiguration.actionsDeinitionsModules &&
        executionConfiguration.actionsDeinitionsModules.length) {

      actions = scope.actionsProvider
                   .getActionsFromActionModules(executionConfiguration.actionsDeinitionsModules);
    }

    scope.loggingService.log(
      'Actions requested\n\n' + 
        (actions.length ?
          actions.map(s => `Action ${s.identifier}(${s.name}) - ${s.description}`).join('\n') :
          'There are not actions available'),
    );
  }
}

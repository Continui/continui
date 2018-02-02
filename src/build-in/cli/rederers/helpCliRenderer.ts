import { CliRenderers } from '../../../domain/cli/cliRenderer';
import { ExecutionConfiguration } from '../../../domain/models/executionConfiguration';
import { Action, ActionOption, ActionOptionTypes } from 'continui-action';
import { ActionsProvider } from '../../../domain/providers/actionsProvider';
import { LoggingService } from 'continui-services';


const privateScope: WeakMap<HelpCliRenderer, {
  actionsProvider: ActionsProvider,
  loggingService: LoggingService,
}> = new WeakMap();

/**
 * Represents a cli renderer that display informatio in a CLI.
 */
export class HelpCliRenderer implements CliRenderers {

  constructor(actionsProvider: ActionsProvider, loggingService: LoggingService) {
    privateScope.set(this, {
      actionsProvider,
      loggingService,
    });
  }


  /**
   * Gets the keys which the cli renderer will be identified.
   */
  public get keys(): string[] { return ['h', 'help']; }

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


    scope.loggingService.log('Help requested\n\n' + 
                              (actions.length ? this.getActionsHelp(...actions) : 
                                              this.getActionOptionsHelp(...this.mainOption)));
  }

  /**
   * Returns help generated based on the provided actions and his options.
   * @param actions Represenst the actions.
   * @returns The generated help.
   */
  private getActionsHelp(...actions: Action<any>[]): string {
    let generatedHelp: string = '';

    actions.forEach((action) => {
      if (generatedHelp) {
        generatedHelp += '\n';
      }

      generatedHelp += `Help for action ${action.identifier}(${action.name}):\n\n`;
      generatedHelp += 'Description:\n';
      generatedHelp += `${action.description}\n\n`;
      generatedHelp += 'Options:\n';
      generatedHelp += this.getActionOptionsHelp(...action.options);
    });

    return generatedHelp;
  }

  /**
   * Returns help generated based on the provided actions options.
   * @param actionsOption Represenst the actions options.
   * @returns The generated help.
   */
  private getActionOptionsHelp(...actionsOption: ActionOption[]): string {
    let generatedHelp: string = '';

    actionsOption.forEach((option) => {
      if (generatedHelp) {
        generatedHelp += '\n';
      }

      generatedHelp += ` --${option.key} (${option.type})`;
      generatedHelp += option.defaultValue ? ` default:${option.defaultValue}` : '';
      generatedHelp += option.isRequired ? ` [Required]` : '';
      generatedHelp += option.isSecure ? ` [Secure]` : '';
      generatedHelp += option.isTemplated ? ` [Templated]` : '';
      generatedHelp += ' ' + option.description;
    });

    return generatedHelp;
  }

  private mainOption = [
    {
      key: 'help',
      type: ActionOptionTypes.boolean,
      description: '(-h) Make the tool display the help, if actions are provided, the actions ' +
        'help will be displayed.',
    },
    {
      key: 'version',
      type: ActionOptionTypes.boolean,
      description: '(-v) Make the tool display the version.',
    },
    {
      key: 'actions',
      type: ActionOptionTypes.boolean,
      description: '(-s) Make the tool display the available actions.',
    },
  ];
}

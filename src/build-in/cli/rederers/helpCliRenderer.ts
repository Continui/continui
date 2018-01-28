import { CliRenderers } from '../../../domain/cli/cliRenderer';
import { ExecutionConfiguration } from '../../../domain/models/executionConfiguration';
import { Step, StepOption, StepOptionTypes } from 'continui-step';
import { StepsProvider } from '../../../domain/providers/stepsProvider';
import { LoggingService } from 'continui-services';


const privateScope: WeakMap<HelpCliRenderer, {
  stepsProvider: StepsProvider,
  loggingService: LoggingService,
}> = new WeakMap();

/**
 * Represents a cli renderer that display informatio in a CLI.
 */
export class HelpCliRenderer implements CliRenderers {

  constructor(stepsProvider: StepsProvider, loggingService: LoggingService) {
    privateScope.set(this, {
      stepsProvider,
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

    let steps: Step<any>[] = [];

    if (executionConfiguration.stepsDeinitionsModules &&
        executionConfiguration.stepsDeinitionsModules.length) {

      steps = scope.stepsProvider
                   .getStepsFromStepModules(executionConfiguration.stepsDeinitionsModules);
    }

    if (executionConfiguration.steps &&
        executionConfiguration.steps.length) {

      executionConfiguration.steps.forEach((stepidentifier) => {
        if (!steps.find(step => step.identifier === stepidentifier)) {
          throw new Error(`Can not load step ${stepidentifier} to generate help`);
        }
      });      
    }

    scope.loggingService.log('Help requested\n\n' + 
                              (steps.length ? this.getStepsHelp(...steps) : 
                                              this.getStepOptionsHelp(...this.mainOption)));
  }

  /**
   * Returns help generated based on the provided steps and his options.
   * @param steps Represenst the steps.
   * @returns The generated help.
   */
  private getStepsHelp(...steps: Step<any>[]): string {
    let generatedHelp: string = '';

    steps.forEach((step) => {
      if (generatedHelp) {
        generatedHelp += '\n';
      }

      generatedHelp += `Help for step ${step.identifier}(${step.name}):\n\n`;
      generatedHelp += 'Description:\n';
      generatedHelp += `${step.description}\n\n`;
      generatedHelp += 'Options:\n';
      generatedHelp += this.getStepOptionsHelp(...step.options);
    });

    return generatedHelp;
  }

  /**
   * Returns help generated based on the provided steps options.
   * @param stepsOption Represenst the steps options.
   * @returns The generated help.
   */
  private getStepOptionsHelp(...stepsOption: StepOption[]): string {
    let generatedHelp: string = '';

    stepsOption.forEach((option) => {
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
      type: StepOptionTypes.boolean,
      description: '(-h) Make the tool display the help, if steps are provided, the steps ' +
        'help will be displayed.',
    },
    {
      key: 'version',
      type: StepOptionTypes.boolean,
      description: '(-v) Make the tool display the version.',
    },
    {
      key: 'steps',
      type: StepOptionTypes.boolean,
      description: '(-s) Make the tool display the available steps.',
    },
  ];
}

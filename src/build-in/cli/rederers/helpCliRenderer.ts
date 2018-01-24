import { CliRenderers } from '../../../domain/cli/cliRenderer';
import { ExecutionConfiguration } from '../../../domain/models/executionConfiguration';
import { Step, StepOption } from 'continui-step';

/**
 * Represents a cli renderer that display informatio in a CLI.
 */
export class HelpCliRenderer implements CliRenderers {
  /**
   * Gets the keys which the cli renderer will be identified.
   */
  public get keys(): string[] { return ['h', 'help']; }

  /**
   * Renders information into a CLI.
   * @param executionConfiguration Represents the execution configuraion.
   */
  public render(executionConfiguration: ExecutionConfiguration): void {
    console.log('The help');
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
  private  getStepOptionsHelp(...stepsOption: StepOption[]): string {
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
}

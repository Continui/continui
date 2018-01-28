import { CliRenderers } from '../../../domain/cli/cliRenderer';
import { ExecutionConfiguration } from '../../../domain/models/executionConfiguration';
import { Step, StepOption } from 'continui-step';
import { StepsProvider } from '../../../domain/providers/stepsProvider';
import { LoggingService } from 'continui-services';

const privateScope: WeakMap<StepsCliRenderer, {
  stepsProvider: StepsProvider,
  loggingService: LoggingService,
}> = new WeakMap();

/**
 * Represents a cli renderer that display informatio in a CLI.
 */
export class StepsCliRenderer implements CliRenderers {

  constructor(stepsProvider: StepsProvider, loggingService: LoggingService) {
    privateScope.set(this, {
      stepsProvider,
      loggingService,
    });
  }

  /**
   * Gets the keys which the cli renderer will be identified.
   */
  public get keys(): string[] { return ['s', 'steps']; }

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

    scope.loggingService.log(
      'Steps requested\n\n' + 
        (steps.length ?
          steps.map(s => `Step ${s.identifier}(${s.name}) - ${s.description}`).join('\n') :
          'There are not steps available'),
    );
  }
}

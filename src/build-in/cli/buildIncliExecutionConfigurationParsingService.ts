import {
  CliExecutionConfigurationParsingService,
} from '../../domain/cli/cliExecutionConfigurationParsingService';
import { ExecutionConfiguration } from '../../domain/models/executionConfiguration';
import { IdentifiedActionOptionMaps } from 'continui-action';
import { ExecutionStep } from '../../domain/models/executionStep';
import { normalize } from 'path';

const minimist = require('minimist');

/**
 * Represents a parser that parse the cli arguments and extract the execution configuration.
 */
export class BuildInCliExecutionConfigurationParsingService 
  implements CliExecutionConfigurationParsingService {
  /**
   * Parse cli arguments and extract the execution configuration.
   * @param cliArguments Represents the cli arguments.
   * @returns An execution configuration.
   */
  public parse(cliArguments: any[]): ExecutionConfiguration {
    const minimistParsedArguments = minimist(cliArguments.slice(2));
    const actionDefinitionModules: string[] = 
      this.getNormalizedArrayArgument<string>(minimistParsedArguments.actionDefinitionModule);      

    return {
      steps: this.getExecutionStepsFromParsedArguments(minimistParsedArguments),
      actionsDeinitionsModules: actionDefinitionModules,
      cofigurationFile: minimistParsedArguments.cofigurationFile,
    };
  }

  /**
   * Returns the actions options values based on the provided parsed arguments.
   * @param parsedArguments Represents the parsed cli arguments
   * @returns actions options values
   */
  private getExecutionStepsFromParsedArguments(parsedArguments: any) 
    : ExecutionStep[] {

    const stepKeys: string[] = Object.keys(parsedArguments.step || {});

    return stepKeys.map((stepKey) => {
      const unparsedStepExecution: any = parsedArguments.step[stepKey];

      if (!unparsedStepExecution.run) {
        return;
      }

      const executionStep: ExecutionStep = {
        key: stepKey,
        actionIdentifier: unparsedStepExecution.actionIdentifier,
        actionOptionsValueMap: unparsedStepExecution,
      };

      delete unparsedStepExecution.run;
      delete unparsedStepExecution.actionIdentifier;

      return executionStep;
    }).filter(executionStep => !!executionStep);
  }

  private getNormalizedArrayArgument<T>(arrayArgument: any): T[] {
    return arrayArgument instanceof Array ?
            arrayArgument :
            arrayArgument ? 
              [arrayArgument] : [];
  }
}


import {
  CliExecutionConfigurationParsingService,
} from '../../domain/cli/cliExecutionConfigurationParsingService';
import { ExecutionConfiguration } from '../../domain/models/executionConfiguration';
import { IdentifiedStepOptionMaps } from 'continui-step';

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

    return {
      steps: minimistParsedArguments._,
      stepsDeinitionsModules: minimistParsedArguments.stepDefinitionModule,
      stepsOptionsValues: this.getStepsOptionsValuesFromParsedArguments(minimistParsedArguments),
      cofigurationFile: minimistParsedArguments.cofigurationFile,
    };
  }

  /**
   * Returns the steps options values based on the provided parsed arguments.
   * @param parsedArguments Represents the parsed cli arguments
   * @returns steps options values
   */
  private getStepsOptionsValuesFromParsedArguments(parsedArguments: any) 
    : IdentifiedStepOptionMaps {

    const identifiedStepOptionMap: IdentifiedStepOptionMaps = {};

    parsedArguments._.forEach((stepIdentifier) => {
      const stepOptions = parsedArguments[stepIdentifier];

      if (stepOptions) {
        if (typeof stepOptions !== 'object') {
          throw new Error(`The provided options for step ${stepIdentifier} are not valid.`);
        }

        identifiedStepOptionMap[stepIdentifier] = parsedArguments[stepIdentifier];
      } else {
        identifiedStepOptionMap[stepIdentifier] = {};
      }
    });

    return identifiedStepOptionMap;
  }
}


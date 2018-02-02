import {
  CliExecutionConfigurationParsingService,
} from '../../domain/cli/cliExecutionConfigurationParsingService';
import { ExecutionConfiguration } from '../../domain/models/executionConfiguration';
import { IdentifiedActionOptionMaps } from 'continui-action';

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
    const actionDefinitionModules =
      minimistParsedArguments.actionDefinitionModule instanceof Array ?
        minimistParsedArguments.actionDefinitionModule :
        minimistParsedArguments.actionDefinitionModule ? 
          [minimistParsedArguments.actionDefinitionModule] : [];   

    const fromArgumentsActionsOptionsValues = 
      this.getActionsOptionsValuesFromParsedArguments(minimistParsedArguments);

    return {
      actions: minimistParsedArguments._,
      actionsDeinitionsModules: actionDefinitionModules,
      actionsOptionsValues: fromArgumentsActionsOptionsValues,
      cofigurationFile: minimistParsedArguments.cofigurationFile,
    };
  }

  /**
   * Returns the actions options values based on the provided parsed arguments.
   * @param parsedArguments Represents the parsed cli arguments
   * @returns actions options values
   */
  private getActionsOptionsValuesFromParsedArguments(parsedArguments: any) 
    : IdentifiedActionOptionMaps {

    const identifiedActionOptionMap: IdentifiedActionOptionMaps = {};

    parsedArguments._.forEach((actionIdentifier) => {
      const actionOptions = parsedArguments[actionIdentifier];

      if (actionOptions) {
        if (typeof actionOptions !== 'object') {
          throw new Error(`The provided options for action ${actionIdentifier} are not valid.`);
        }

        identifiedActionOptionMap[actionIdentifier] = parsedArguments[actionIdentifier];
      } else {
        identifiedActionOptionMap[actionIdentifier] = {};
      }
    });

    return identifiedActionOptionMap;
  }
}


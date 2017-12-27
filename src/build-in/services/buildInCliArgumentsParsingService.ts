import { CliArgumentsParsingService } from '../../services/cliArgumentsParsingService';
import { IdentifiedStepOptionMaps } from 'continui-step';

const minimist = require('minimist');

/**
 * Represens a parser that parse from cli arguments to identified step options map. 
 */
export class BuildInCliArgumentsParsingService implements CliArgumentsParsingService {
    /**
     * Parse cli arguments into identified step option map.
     * @param cliArguments Represents the cli arguments.
     * @returns An identified step option map.
     */
  public parse(cliArguments: any[]) : IdentifiedStepOptionMaps {
    const minimistParsedArguments = minimist(cliArguments.slice(2));
    const identifiedStepOptionMap: IdentifiedStepOptionMaps = {};

    identifiedStepOptionMap['main'] = {
      steps: minimistParsedArguments._,
      needsVersion: !!(minimistParsedArguments.v || minimistParsedArguments.version),
      needsHelp: !!(minimistParsedArguments.h || minimistParsedArguments.help),
      needsSteps: !!(minimistParsedArguments.s || minimistParsedArguments.steps),
      stepModule: minimistParsedArguments.stepModule,
    };

    minimistParsedArguments._.forEach((stepIdentifier) => {
      const stepOptions = minimistParsedArguments[stepIdentifier];
            
      if (stepOptions) {
        if (typeof stepOptions !== 'object') {
          throw new Error(`The provided options for step ${stepIdentifier} are not valid.`);
        }

        identifiedStepOptionMap[stepIdentifier] = minimistParsedArguments[stepIdentifier];
      } else {
        identifiedStepOptionMap[stepIdentifier] = {};
      }
    });

    return identifiedStepOptionMap;
  }
}

import { CliStepOptionParser } from "./cliStepOptionParser";
import { IdentifiedStepOptionMaps } from "./types";

import * as minimist from 'minimist'

/**
 * Represens a parser that parse from cli arguments to identified step options map. 
 */
export class BuildInCliStepOptionParser implements CliStepOptionParser {
    /**
     * Parse cli arguments into identified step option map.
     * @param cliArguments Represents the cli arguments.
     * @returns An identified step option map.
     */
    public parse(cliArguments: any[]) : IdentifiedStepOptionMaps {
        let minimistParsedArguments = minimist(cliArguments.slice(2))
        let identifiedStepOptionMap: IdentifiedStepOptionMaps = {};

        identifiedStepOptionMap['main'] = {
            steps: minimistParsedArguments._
        }

        // TODO: parce arguments to options.

        return identifiedStepOptionMap;
    }
}
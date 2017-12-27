import { IdentifiedStepOptionMaps } from 'continui-step';


/**
 * Represens a parser that parse from cli arguments to identified step options map. 
 */
export interface CliArgumentsParsingService {
    /**
     * Parse cli arguments into identified step option map.
     * @param cliArguments Represents the cli arguments.
     * @returns An identified step option map.
     */
  parse(cliArguments: any[]) : IdentifiedStepOptionMaps;
}

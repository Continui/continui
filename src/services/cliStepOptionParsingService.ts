import { IdentifiedStepOptionMaps } from "../types";


/**
 * Represens a parser that parse from cli arguments to identified step options map. 
 */
export interface CliStepOptionParsingService {
    /**
     * Parse cli arguments into identified step option map.
     * @param cliArguments Represents the cli arguments.
     * @param stepIdentifiers Represens the steps identifiers.
     * @returns An identified step option map.
     */
    parse(cliArguments: any[], stepIdentifiers: string[]) : IdentifiedStepOptionMaps;
}
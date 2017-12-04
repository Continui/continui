import { KeyValueMap } from "./keyValueMap";

/**
 * Represens a parser that parse from cli arguments to identified step options map. 
 */
export interface CliStepOptionParser {
    /**
     * Parse cli arguments into identified step option map.
     * @param cliArguments Represents the cli arguments.
     * @returns An identified step option map.
     */
    parse(cliArguments: any[]) : KeyValueMap<KeyValueMap<any>>;
}
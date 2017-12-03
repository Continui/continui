/**
 * Represens a parser that parse to step options 
 */
export interface CliStepOptionParser {
    parse(cliArguments: any[]);
}
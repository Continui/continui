/**
 * Represens a parser that parse to step options 
 */
export interface StepOptionParser {
    parseFromCliArguments(cliArguments: any[]);
}
import { ExecutionConfiguration } from '../models/executionConfiguration';

/**
 * Represents a parser that parse the cli arguments and extract the execution configuration.
 */
export interface CliExecutionConfigurationParsingService {
    /**
     * Parse cli arguments and extract the execution configuration.
     * @param cliArguments Represents the cli arguments.
     * @returns An execution configuration.
     */
  parse(cliArguments: any[]) : ExecutionConfiguration;
}

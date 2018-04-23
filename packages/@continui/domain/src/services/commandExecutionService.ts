import { CommandExecutionOptions } from '../models/commandExecutionOptions';

/**
 * Represents a service that allows command executions.
 */
export interface CommandExecutionService {
    /**
     * Returns the execution output of the provided command with the provided options. 
     */
  executeCommand(command: string,
                 commandExecutionOptions?: CommandExecutionOptions): Promise<string>;
}

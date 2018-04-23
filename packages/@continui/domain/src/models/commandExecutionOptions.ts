/**
 * Represents te execution option for a command.
 */
export interface CommandExecutionOptions {
    /**
     * Represents the director path where the command will be executed.
     */
  directory?: string;

    /**
     * Represents the enviroment context that will be added to the command execution.
     */
  enviroment?: {[variableName: string]: any};
}

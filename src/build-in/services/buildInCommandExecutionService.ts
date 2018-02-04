import { CommandExecutionService, CommandExecutionOptions } from 'continui-services';
import { exec, ExecOptions } from 'child_process';

/**
 * Represents a service that allows command executions.
 */
export class BuildInCommandExecutionService implements CommandExecutionService {
    /**
     * Returns the execution output of the provided command with the provided options.
     */
  public executeCommand(command: string,
                        commandExecutionOptions?: CommandExecutionOptions): Promise<string> {
    return new Promise<string>((resolve, reject) => {

      let options: ExecOptions;

      if (commandExecutionOptions) {
        options = {
          cwd: commandExecutionOptions.directory,
          env: commandExecutionOptions.enviroment,
        };
      }

      exec(command, options, (error: Error, stdout: string, strerr: string) => {
        if (error) {
          let errorMessage: string;
          errorMessage = stdout ? `\n\n${stdout}\n` : '';
          errorMessage += strerr ? `ErrorOutput: \n${stdout}\n` : '';
          errorMessage += error;

          reject(new Error(errorMessage));
        }
        resolve(stdout);
      });
    });
  }
}

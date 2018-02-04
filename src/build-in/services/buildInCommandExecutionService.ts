import { CommandExecutionService, CommandExecutionOptions } from 'continui-services';
import { exec } from 'child_process';

/**
 * Represents a service that allows command executions.
 */
export class BuildInCommandExecutionService implements CommandExecutionService {
    /**
     * Returns the execution output of the provided command with the provided options.
     */
    public excuteCommand(command: string,
                         commandExecutionOptions?: CommandExecutionOptions): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            exec(command, (error: Error, stdout: string, strerr: string) => {
                if (error) {
                    reject(error);
                }
                resolve(stdout);
            });
        });
    }
}

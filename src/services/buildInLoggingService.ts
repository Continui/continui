import { LoggingService } from "./loggingService";

/**
 * Represents a service that allow log data.
 */
export class BuildInLoggingService implements LoggingService {
    /**
     * Logs data.
     * @param data Represents the data that will be logged.
     */
    public log(...data: string[]): void {
        data.forEach(toLogData => console.log(toLogData))
    }
}
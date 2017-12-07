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
        let date: string = new Date().toTimeString().substr(0, 8)
        data.forEach((toLogData, index) => console.log((index > 0 ? '  ' : `[${date}]`) + ` ${toLogData}`))
    }
}
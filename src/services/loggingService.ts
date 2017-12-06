/**
 * Represents a service that allow log data.
 */
export interface LoggingService {
    /**
     * Logs data.
     * @param data Represents the data that will be logged.
     */
    log(...data: string[]): void;
}
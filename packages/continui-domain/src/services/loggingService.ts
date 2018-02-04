import { LoggingData } from '../models/loggingData';
/**
 * Represents a service that allow log data.
 */
export interface LoggingService {
    /**
   * Logs data.
   * @param data Represents the data that will be logged.
   */
  log(data: string): void;
  /**
   * Logs data.
   * @param data Represents the data that will be logged.
   */
  log(data: string[]): void;
  /**
   * Logs data.
   * @param data Represents the data that will be logged.
   */
  log(data: LoggingData): void;
  /**
   * Logs data.
   * @param data Represents the data that will be logged.
   */
  log(data: LoggingData[]): void;
}

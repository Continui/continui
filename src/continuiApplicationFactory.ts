import { ContinuiApplication } from './continuiApplication';

/**
 * Represents a factory that allows the creation of continui applications.
 */
export interface ContinuiApplicationFactory {

    /**
     * Returns a new continui application ready to be executed.
     * @returns A new continui application.
     */
  createsContinuiApplication(): ContinuiApplication;
}

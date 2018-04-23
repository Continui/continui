import { ExecutionConfiguration } from '../models/executionConfiguration';

/**
 * Represents a provider that provide the configuration from a continui configuration file.
 */
export interface FromFileExecutionConfigurationProvider {
    /**
     * Returns the continui configuration from the provided continui configuration file.
     * @param filePath Represents the path where the configuration file is located.
     * @returns An execution configuration.
     */
  getExecutionConfigrationFromFile(filePath: string): ExecutionConfiguration;
}

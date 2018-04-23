import { ExecutionConfiguration } from '../models/executionConfiguration';

/**
 * Represents a services that allows execution configurations mergings.
 */
export interface ExecutionConfigurationMergingService
{
    /**
     * Returns an execution configuration based on the merge with the providd ones.
     * @param executionConfiguration Represents the execution configurations to be merged.
     * @returns An execution configuration.
     */
  mergeExecutionConfigurations(...executionConfigurations: ExecutionConfiguration[])
        : ExecutionConfiguration;
}

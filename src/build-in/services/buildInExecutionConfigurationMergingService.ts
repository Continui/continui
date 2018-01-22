import { ExecutionConfigurationMergingService } from '../../domain/services/executionConfigurationMergingService';
import { ExecutionConfiguration } from '../../domain/models/executionConfiguration';

import * as deepmerge from 'deepmerge';

/**
 * Represents a services that allows execution configurations mergings.
 */
export class BuildInExecutionConfigurationMergingService 
    implements ExecutionConfigurationMergingService
{
    /**
     * Returns an execution configuration based on the merge with the providd ones.
     * @param executionConfiguration Represents the execution configurations to be merged.
     * @returns An execution configuration.
     */
  mergeExecutionConfigurations(...executionConfigurations: ExecutionConfiguration[])
        : ExecutionConfiguration {
    return  deepmerge.all(executionConfigurations);
  }
}

import { ExecutionConfiguration } from "../models/executionConfiguration";

export interface ExecutionConfigurationMergingService
{
    mergeExecutionConfigurations(...executionConfiguration: ExecutionConfiguration[])
        : ExecutionConfiguration;
}
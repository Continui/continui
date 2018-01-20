import { ExecutionConfiguration } from "../models/executionConfiguration";

export interface FromFileExecutionConfigurationProvider {
    getFileExecutionConfigration(filePath: string): ExecutionConfiguration;
}
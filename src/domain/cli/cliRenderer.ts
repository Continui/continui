import { ExecutionConfiguration } from "../models/executionConfiguration";

export interface CliRenderers {
    keys: string[]
    render(executionConfiguration: ExecutionConfiguration)
}
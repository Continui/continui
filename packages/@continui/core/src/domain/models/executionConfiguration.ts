import { ExecutionStep } from './executionStep';

export interface ExecutionConfiguration {
  steps: ExecutionStep[];
  actionsDeinitionsModules?: string[];  
  cofigurationFile?: string;
}

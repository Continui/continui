import { ExecutionConfiguration } from '../models/executionConfiguration';

/**
 * Represents a cli renderer that display informatio in a CLI.
 */
export interface CliRenderers {
  /**
   * Gets the keys which the cli renderer will be identified.
   */
  keys: string[];

  /**
   * Renders information into a CLI.
   * @param executionConfiguration Represents the execution configuraion.
   */
  render(executionConfiguration: ExecutionConfiguration): void;
}

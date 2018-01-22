import { FromFileExecutionConfigurationProvider } from '../../domain/providers/fromFileExecutionConfigurationProvider';
import { ExecutionConfiguration } from '../../domain/models/executionConfiguration';

import * as fs from 'fs';
import * as path from 'path';

/**
 * Represents a provider that provide the configuration from a continui configuration file.
 */
export class BuildInFromFileExecutionConfigurationProvider 
  implements FromFileExecutionConfigurationProvider {
    /**
     * Returns the continui configuration from the provided continui configuration file.
     * @param filePath Represents the path where the configuration file is located.
     * @returns An execution configuration.
     */
  public getExecutionConfigrationFromFile(filePath: string): ExecutionConfiguration {

    if (filePath === 'ignore-file-configuration') {
      return <any>{};
    }


    const resolvedFilePath: string = path.resolve(__dirname, filePath || 'continui.json');
    return fs.existsSync(resolvedFilePath) ? require(resolvedFilePath) : {};
  }
} 

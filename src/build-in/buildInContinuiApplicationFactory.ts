import { ContinuiApplicationFactory } from '../domain/continuiApplicationFactory';
import { ContinuiApplication } from '../domain/continuiApplication';
import { BuildInContinuiApplication } from './buildInContinuiApplication';
import { ExecutionConfiguration } from '../domain/models/executionConfiguration';
import {
  FromFileExecutionConfigurationProvider,
} from '../domain/providers/fromFileExecutionConfigurationProvider';
import {
  ExecutionConfigurationMergingService,
} from '../domain/services/executionConfigurationMergingService';
import { Activator } from '../domain/activator';

const privateScope: WeakMap<BuildInContinuiApplicationFactory, {
  activator: Activator,
}> = new WeakMap();

/**
 * Represents a factory that allows the creation of continui applications.
 */
export class BuildInContinuiApplicationFactory implements ContinuiApplicationFactory {

  constructor(activator: Activator) {
    privateScope.set(this, {
      activator,
    });
  }

    /**
     * Returns a new continui application ready to be executed.
     * @returns A new continui application.
     */
  public createsContinuiApplication(): ContinuiApplication {
    return privateScope.get(this).activator
                                 .resolve(BuildInContinuiApplication);
  }
}

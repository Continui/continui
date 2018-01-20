import { ContinuiApplicationFactory } from '../domain/continuiApplicationFactory';
import { ContinuiApplication } from '../domain/continuiApplication';
import { ActivationCenter } from '../domain/activationCenter';
import { BuildInContinuiApplication } from './buildInContinuiApplication';
import { ExecutionConfiguration } from '../domain/models/executionConfiguration';

const privateScope: WeakMap<BuildInContinuiApplicationFactory, {
  activationCenter: ActivationCenter,
}> = new WeakMap();

/**
 * Represents a factory that allows the creation of continui applications.
 */
export class BuildInContinuiApplicationFactory implements ContinuiApplicationFactory {

  constructor(activationCenter: ActivationCenter) {
    privateScope.set(this, {
      activationCenter,
    });
  }

    /**
     * Returns a new continui application ready to be executed.
     * @param executionConfiguration Represents the execution configuration for the application.
     * @returns A new continui application.
     */
  public createsContinuiApplication(executionConfiguration: ExecutionConfiguration): ContinuiApplication {

    


    return  privateScope.get(this).activationCenter.activator.resolve(BuildInContinuiApplication);
  }
}

import { ContinuiApplicationFactory } from '../continuiApplicationFactory';
import { ContinuiApplication } from '../continuiApplication';
import { ActivationCenter } from '../activationCenter';
import { BuildInContinuiApplication } from './buildInContinuiApplication';

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
     * @returns A new continui application.
     */
  public createsContinuiApplication(): ContinuiApplication {
    return  privateScope.get(this).activationCenter.activator.resolve(BuildInContinuiApplication);
  }
}

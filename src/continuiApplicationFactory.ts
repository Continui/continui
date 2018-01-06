import { ContinuiApplication } from './continuiApplication';
import { ActivationCenter } from './activationCenter';

const privateScope: WeakMap<ContinuiApplicationFactory, {
  activationCenter: ActivationCenter,
}> = new WeakMap();

export class ContinuiApplicationFactory {

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
    return  privateScope.get(this).activationCenter.activator.resolve(ContinuiApplication);
  }
}

import { ContinuiDependenciesService } from '../../domain/services/continuiDependenciesService';
import { Kernel } from '@jems/di';

const privateScope: WeakMap<BuildInContinuiDependenciesSevice, {
  kernel: Kernel,
}> = new WeakMap();

/**
 * Represents a sevice that allow resolve continui default dependencies.
 */
export class BuildInContinuiDependenciesSevice implements ContinuiDependenciesService {

  constructor(kernel: Kernel) {
    privateScope.set(this, {
      kernel,
    });
  }

    /**
     * Return the result of the resolution of the provided target.
     * @param targer Represents the target to resolve.
     * @returns Resolve target.
     */
  public resolve<T>(target: any): T {
    return privateScope.get(this).kernel.resolve(target);
  }
}

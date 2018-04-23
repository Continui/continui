/**
 * Represents a sevice that allow resolve continui default dependencies.
 */
export interface ContinuiDependenciesService {
    /**
     * Return the result of the resolution of the provided target.
     * @param targer Represents the target to resolve.
     * @returns Resolve target.
     */
  resolve<T>(target: any): T;
}

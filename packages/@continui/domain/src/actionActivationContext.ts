import { ContainerizedKernel } from '@jems/di';

/**
 * Represents the context of the activation.
 */
export interface ActionActivationContext {
    /**
     * Gets the containerized kenel that will resolve action dependencies.
     */
  containerizedKernel: ContainerizedKernel;
}

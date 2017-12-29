import { Activator } from '../activator';
import { createKernel, Kernel } from '@jems/di';
import { StepActivationReference,
         StepActivationReferenceMode,
         StepActivationReferenceType, 
} from 'continui-step';

const privateScope:WeakMap<BuildInActivator, {
  kernel: Kernel,
}> = new WeakMap();

/**
 * Represenst an activator that can register and solve depencencies.
 */
export class BuildInActivator implements Activator {

  constructor() {
    privateScope.set(this, {
      kernel: createKernel(),
    });
  }

    /**
     * Register dependencies with the provided alias.
     * @param reference Represents the reference that will be registered.
     * @returns The activator instance to fluently register dependencies.
     */
  public registerReference(reference: StepActivationReference) : Activator {
    const kernel: Kernel = privateScope.get(this).kernel;
    const bind =  kernel.bind(reference.alias);
        
    if (reference.context) {
      if (!kernel.hasContainer(reference.context)) {
        kernel.createContainer(reference.context, ['default']);
      }

      bind.inside(reference.context);
    }
        
    const bindBehavior = bind.to(reference.target);


    switch (reference.type) {      
      case StepActivationReferenceType.constant:
        bindBehavior.asConstant();
        break;
      case StepActivationReferenceType.executableFunction:
        bindBehavior.asBuilderFunction();
        break;
      case StepActivationReferenceType.instance:
      default:
        bindBehavior.asInstance();
        break;
    }
    
    switch (reference.mode) {      
      case StepActivationReferenceMode.perResolution:
        bindBehavior.inPerResolutionMode();
        break;
      case StepActivationReferenceMode.singelton:
        bindBehavior.inSingletonMode();
        break;
      case StepActivationReferenceMode.each:
      default:
        bindBehavior.inPerCallMode();
        break;
    }

    return this;
  }
    
    /**
     * Resolve the dependency with the provided alias.
     * @param aliasOrTarget Represents the dependency to be resolved.
     * @returns A resolved dependency.
     */
  public resolve<DependencyType>(aliasOrTarget: any) : DependencyType {
    return <DependencyType>privateScope.get(this).kernel.resolve(aliasOrTarget);
  }

    /**
     * Resolve the dependency with the provided alias, if is registered with the provided context.
     * @param aliasOrTarget Represents the dependency to be resolved.
     * @param context Represents the where the resolution will occurs.
     * @returns A resolved dependency.
     */
  public resolveWithContext<DependencyType>(aliasOrTarget: any, context: string) {
    return <DependencyType>privateScope.get(this).kernel.usingContainer(context)
                                                        .resolve(aliasOrTarget);
  }

    /**
     * Returns a boolean value specifying if the activation has a dependency registered with the
     * provided alias.
     * @param alias Represents the alias to look for.
     * @returns A boolean value.
     */
  public hasAlias(alias: string): boolean {
    return privateScope.get(this).kernel.canResolve(alias);
  }
}

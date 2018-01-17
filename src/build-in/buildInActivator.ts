import { Activator } from '../activator';
import { createKernel, Kernel } from '@jems/di';
import { 
  StepActivationReference,
  StepActivationReferenceMode,
  StepActivationReferenceType, 
} from 'continui-step';
import { AsAndInAndWhenSyntax } from '@jems/di/dist/fluent-syntaxes/asAndInAndWhenSyntax';
import { connect } from 'tls';

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
    const bind = this.getKernelBind(reference.alias);        
    const bindBehavior = bind.to(reference.target);
    
    this.configureBindReferenceType(bindBehavior, reference.type);
    this.configureBindReferenceMode(bindBehavior, reference.mode);

    return this;
  }

  /**
   * Register dependencies with the provided alias, in the provided context.
   * @param reference Represents the reference that will be registered.
   * @param context Represents the where the registration will occurs.
   * @returns The activator instance to fluently register dependencies.
   */
  public registerReferenceWithContext(reference: StepActivationReference,
                                      context: string) : Activator {
    if (!context) {
      throw Error('Must provided a valid context');
    }

    const kernel: Kernel = privateScope.get(this).kernel;
    const bind = this.getKernelBind(reference.alias); 
    
    if (!kernel.hasContainer(context)) {
      kernel.createContainer(context, ['default']);
    }

    bind.inside(context);
    
    const bindBehavior = bind.to(reference.target);
    
    this.configureBindReferenceType(bindBehavior, reference.type);
    this.configureBindReferenceMode(bindBehavior, reference.mode);

    return this;
  }

  /**
   * Returns a bind syntax with the providd alias.
   * @param alias Represents the bind alias
   */
  private getKernelBind(alias: string) {
    const kernel: Kernel = privateScope.get(this).kernel;
    return kernel.bind(alias);
  }

  /**
   * Configures the provided bind with the provided step activation reference type.
   * @param syntax Represents the syntax to fluently configure the bind.
   * @param stepActivationReferenceType Represetns the activation reference type to be configured.
   */
  private configureBindReferenceType(syntax: AsAndInAndWhenSyntax,
                                     stepActivationReferenceType: StepActivationReferenceType) {
    switch (stepActivationReferenceType) {      
      case StepActivationReferenceType.constant:
        syntax.asConstant();
        break;
      case StepActivationReferenceType.executableFunction:
        syntax.asBuilderFunction();
        break;
      case StepActivationReferenceType.instance:
      default:
        syntax.asInstance();
        break;
    }
  }

  /**
   * Configures the provided bind with the provided step activation reference mode.
   * @param syntax Represents the syntax to fluently configure the bind.
   * @param stepActivationReferenceMode Represetns the activation reference mode to be configured.
   */
  private configureBindReferenceMode(syntax: AsAndInAndWhenSyntax,
                                     stepActivationReferenceMode: StepActivationReferenceMode) {
    switch (stepActivationReferenceMode) {      
      case StepActivationReferenceMode.perResolution:
        syntax.inPerResolutionMode();
        break;
      case StepActivationReferenceMode.singelton:
        syntax.inSingletonMode();
        break;
      case StepActivationReferenceMode.each:
      default:
        syntax.inPerCallMode();
        break;
    }
  } 
    
    /**
     * Resolve the dependency with the provided alias.
     * @param aliasOrTarget Represents the dependency to be resolved.
     * @returns A resolved dependency.
     */
  public resolve<DependencyType>(aliasOrTarget: any) : DependencyType {
    return <DependencyType>privateScope.get(this)
                                       .kernel
                                       .resolve(aliasOrTarget);
  }

    /**
     * Resolve the dependency with the provided alias, in the provided context.
     * @param aliasOrTarget Represents the dependency to be resolved.
     * @param context Represents the where the resolution will occurs.
     * @returns A resolved dependency.
     */
  public resolveWithContext<DependencyType>(aliasOrTarget: any, context: string) {
    return <DependencyType>privateScope.get(this)
                                       .kernel
                                       .usingContainer(context)
                                       .resolve(aliasOrTarget);
  }
}

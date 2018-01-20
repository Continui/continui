import { Step, StepActivationDefinition } from 'continui-step';
import { StepProvider } from '../../domain/providers/stepsProvider';
import { Activator } from '../../domain/activator';
import { connect } from 'http2';

const privateScope: WeakMap<BuildInStepProvider, {
  stepsModulesMap: { [stepIentifier: string]: string },
  stepsLoadedModules: string[],
  activator: Activator,
}> = new WeakMap();

/**
 * Represents a provider that provides the available steps based on diferent criterias.
 */
export class BuildInStepProvider implements StepProvider {

  constructor(activator: Activator) {
    privateScope.set(this, {
      stepsModulesMap: {},
      stepsLoadedModules: [],
      activator
    });
  }

  /**
   * Return a list of steps based on the provided step modules.
   * @param stepModules Represents the step modules where the step definitions will be load from.
   * @returns A list of steps.
   */
  public getStepsFromStepModules(stepModules: string[]): Step<any>[] {

    const scope = privateScope.get(this);

    stepModules.forEach(stepModule => {
      if (scope.stepsLoadedModules.indexOf(stepModule) < 0) {
        this.registerStepDefinitionInModule(stepModule);
      }
    });

    return stepModules.map(stepModule => {
      try {
        return scope.activator.resolveWithContext('step', stepModule);
      } catch (error) {
        throw new Error(`Can not create step from module ${stepModule}\n ` + error);
      }
    });
  }

  private registerStepDefinitionInModule(module: string): void {
    const scope = privateScope.get(this);
    const moduleResult:any = require(module);
    const stepActivationDefinition: StepActivationDefinition = moduleResult['default'] ||
                                                               moduleResult;
    
    if (!stepActivationDefinition.identifier) {
      throw new Error(`The suplied step activation definition in module ${module} doesn\'t have ` + 
                      'the identifier.');
    }

    if (!stepActivationDefinition.step) {
      throw new Error(`The suplied step activation definition in module ${module} with identifier` +
                      ` ${stepActivationDefinition.identifier} doesn\'t have an step.`);
    }

    const storedModuleWithStepIdentifier: string = 
      scope.stepsModulesMap[stepActivationDefinition.identifier];

    if (storedModuleWithStepIdentifier) {
      throw new Error('The suplied step activation definition identifier ' +
                      `${stepActivationDefinition.identifier} in module ${module} already exists` +
                      `in module ${storedModuleWithStepIdentifier}.`);
    }

    scope.activator.registerReferenceWithContext({
      alias: 'step',
      target: stepActivationDefinition.step
    }, module);
    
    stepActivationDefinition.activationReferences.forEach(activationReference =>
      scope.activator.registerReferenceWithContext(activationReference,
                                                   module),
    );

    scope.stepsLoadedModules.push(module);
    scope.stepsModulesMap[stepActivationDefinition.identifier] = module;
  }



}
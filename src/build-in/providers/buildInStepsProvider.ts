import { Step, StepActivationDefinition } from 'continui-step';
import { StepProvider } from '../../domain/providers/stepsProvider';
import { Activator } from '../../domain/activator';

import * as path from 'path';

const privateScope: WeakMap<BuildInStepsProvider, {
  stepsModulesMap: { [stepIentifier: string]: string },
  loadedModules: string[],
  activator: Activator,
}> = new WeakMap();

/**
 * Represents a provider that provides the available steps based on diferent criterias.
 */
export class BuildInStepsProvider implements StepProvider {

  constructor(activator: Activator) {
    privateScope.set(this, {
      activator,
      stepsModulesMap: {},
      loadedModules: [],      
    });
  }

  /**
   * Return a list of steps based on the provided step modules.
   * @param stepModules Represents the step modules where the step definitions will be load from.
   * @returns A list of steps.
   */
  public getStepsFromStepModules(stepModules: string[]): Step<any>[] {

    const scope = privateScope.get(this);

    stepModules.forEach((stepModule) => {
      if (scope.loadedModules.indexOf(stepModule) < 0) {
        const moduleResult:any = require(path.resolve(process.cwd(), stepModule));
        const stepActivationDefinition: StepActivationDefinition = moduleResult['default'] ||
                                                                   moduleResult;

        this.validateStepActivationDefinition(stepActivationDefinition, stepModule);
        this.registerActivationStepDefinition(stepActivationDefinition, stepModule);

        scope.loadedModules.push(stepModule);
        scope.stepsModulesMap[stepActivationDefinition.identifier] = stepModule;
      }
    });

    return stepModules.map((stepModule) => {
      try {
        return scope.activator.resolveWithContext('step', stepModule);
      } catch (error) {
        throw new Error(`Can not create step from module ${stepModule}\n ` + error);
      }
    });
  }

  /**
   * Validates the provided step activation definition.
   * @param stepActivationDefinition Represetns the step activation definition to validate.
   * @param stepModule Represents the step module where the step activation definition was loaded.
   */
  private validateStepActivationDefinition(stepActivationDefinition: StepActivationDefinition,
                                           stepModule: string): void {

    if (!stepActivationDefinition.identifier) {
      throw new Error(`The suplied step activation definition in module ${stepModule} doesn\'t ` +
                      'have the identifier.');
    }
  
    if (!stepActivationDefinition.step) {
      throw new Error(`The suplied step activation definition in module ${stepModule} with ` +
                      `identifier ${stepActivationDefinition.identifier} doesn\'t have an step.`);
    }
  
    const loadedModuleWithStepIdentifier: string = 
         privateScope.get(this).stepsModulesMap[stepActivationDefinition.identifier];
  
    if (loadedModuleWithStepIdentifier) {
      throw new Error('The suplied step activation definition identifier ' +
                      `${stepActivationDefinition.identifier} in module ${stepModule} already ` +
                      `exists in module ${loadedModuleWithStepIdentifier}.`);
    }
  }
  /**
   * Rgister the provided step activation definition.
   * @param stepActivationDefinition Represetns the step activation definition to register.
   * @param stepModule Represents the step module where the step activation definition was loaded.
   */
  private registerActivationStepDefinition(stepActivationDefinition: StepActivationDefinition,
                                           stepModule: string): void {

    const scope = privateScope.get(this);

    scope.activator.registerReferenceWithContext({
      alias: 'step',
      target: stepActivationDefinition.step,
    },                                           stepModule);
    
    stepActivationDefinition.activationReferences.forEach(activationReference =>
      scope.activator.registerReferenceWithContext(activationReference,
                                                   stepModule),
    );
  }
}

import { Action, ActionActivationDefinition } from 'continui-action';
import { ActionsProvider } from '../../domain/providers/actionsProvider';
import { Kernel } from '@jems/di';

import * as path from 'path';


const privateScope: WeakMap<BuildInActionsProvider, {
  actionsModulesMap: { [actionIentifier: string]: string },
  loadedModules: string[],
  kernel: Kernel,
}> = new WeakMap();

/**
 * Represents a provider that provides the available actions based on diferent criterias.
 */
export class BuildInActionsProvider implements ActionsProvider {

  constructor(kernel: Kernel) {
    privateScope.set(this, {
      kernel,
      actionsModulesMap: {},
      loadedModules: [],      
    });
  }

  /**
   * Return a list of actions based on the provided action modules.
   * @param actionModules Represents the action modules where the definitions will be load from.
   * @returns A list of actions.
   */
  public getActionsFromActionModules(actionModules: string[]): Action<any>[] {

    const scope = privateScope.get(this);

    actionModules.forEach((actionModule) => {
      if (scope.loadedModules.indexOf(actionModule) < 0) {
        const moduleResult:any = require(path.resolve(process.cwd(), actionModule));
        const actionActivationDefinition: ActionActivationDefinition = moduleResult['default'] ||
                                                                   moduleResult;

        this.validateActionActivationDefinition(actionActivationDefinition, actionModule);
        this.registerActivationActionDefinition(actionActivationDefinition, actionModule);

        scope.loadedModules.push(actionModule);
        scope.actionsModulesMap[actionActivationDefinition.identifier] = actionModule;
      }
    });

    return actionModules.map((actionModule) => {
      try {
        return scope.kernel.usingContainer(actionModule).resolve('action');
      } catch (error) {
        throw new Error(`Can not create action from module ${actionModule}\n ` + error);
      }
    });
  }

  /**
   * Validates the provided action activation definition.
   * @param actionActivationDefinition Represetns the action activation definition to validate.
   * @param actionModule Represents the action module where the activation definition was loaded.
   */
  private validateActionActivationDefinition(actionActivationDefinition: ActionActivationDefinition,
                                             actionModule: string): void {

    if (!actionActivationDefinition.identifier) {
      throw new Error(`The suplied action activation definition in module ${actionModule} ` +
                      'doesn\'t have the identifier.');
    }
  
    if (!actionActivationDefinition.action) {
      throw new Error(`The suplied action activation definition in module ${actionModule} with ` +
                      `identifier ${actionActivationDefinition.identifier} doesn\'t have an ` +
                      'action.');
    }
  
    const loadedModuleWithActionIdentifier: string = 
         privateScope.get(this).actionsModulesMap[actionActivationDefinition.identifier];
  
    if (loadedModuleWithActionIdentifier) {
      throw new Error('The suplied action activation definition identifier ' +
                      `${actionActivationDefinition.identifier} in module ${actionModule} ` +
                      `already exists in module ${loadedModuleWithActionIdentifier}.`);
    }
  }
  /**
   * Rgister the provided action activation definition.
   * @param actionActivationDefinition Represetns the action activation definition to register.
   * @param actionModule Represents the action module where the activation definition was loaded.
   */
  private registerActivationActionDefinition(actionActivationDefinition: ActionActivationDefinition,
                                             actionModule: string): void {

    const scope = privateScope.get(this);

    scope.kernel.createContainer(actionModule, ['default']);
    
    scope.kernel.usingContainer(actionModule)
                .bind('action')
                .to(actionActivationDefinition.action);
                
    actionActivationDefinition.registerDependencies({
      containerizedKernel: scope.kernel.usingContainer(actionModule),
    });
  }
}

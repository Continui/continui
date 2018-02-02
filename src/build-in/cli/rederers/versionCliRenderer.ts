import { CliRenderers } from '../../../domain/cli/cliRenderer';
import { ExecutionConfiguration } from '../../../domain/models/executionConfiguration';
import { Action, ActionOption } from 'continui-action';
import { LoggingService } from 'continui-services';


const privateScope: WeakMap<VersionCliRenderer, {
  loggingService: LoggingService,
}> = new WeakMap();


/**
 * Represents a cli renderer that display informatio in a CLI.
 */
export class VersionCliRenderer implements CliRenderers {

  constructor(loggingService: LoggingService) {
    privateScope.set(this, {
      loggingService,
    });
  }

  /**
   * Gets the keys which the cli renderer will be identified.
   */
  public get keys(): string[] { return ['v', 'vesion']; }

  /**
   * Renders information into a CLI.
   * @param executionConfiguration Represents the execution configuraion.
   */
  public render(executionConfiguration: ExecutionConfiguration): void {
    let pkg;

    try {
      pkg = require('../package.json');
    } catch (error) {
      pkg = {};
    }

    privateScope.get(this)
                .loggingService
                .log('Version requested\n\n' + `Version ${pkg.version || 'not defined'}`);
  }
}

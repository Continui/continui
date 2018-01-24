import { TextTemplateContextProvider, TextTemplateContext } from 'continui-services';
import * as path from 'path';

const privateScope: WeakMap<BuildInTextTemplateContextProvider, {
  context: any,
}> = new WeakMap();

/**
 * Represents a provider that can provided text templates 
 */
export class BuildInTextTemplateContextProvider implements TextTemplateContextProvider {

  constructor() {
    privateScope.set(this, {
      context: null,
    });
  }

    /**
     * Returns the text template context.
     */
  public getTextTemplateContext(): TextTemplateContext {
    const scope = privateScope.get(this);

    if (!scope.context) {
      scope.context = require(path.resolve(process.cwd(), './package.json'));

      if (!scope.context) {
        throw new Error('The template context to be provided is invalid.');
      }
    }
    
    return scope.context;
  }
}

import { TextTemplateContextProvider, TextTemplateContext } from 'continui-services';

const privateScope: WeakMap<BuildInTextTemplateContextProvider, {
  context: any,
}> = new WeakMap();

/**
 * Represents a provider that can provided text templates 
 */
export class BuildInTextTemplateContextProvider implements TextTemplateContextProvider {

    /**
     * Returns the text template context.
     */
  public getTextTemplateContext(): TextTemplateContext {
    const scope = privateScope.get(this);

    if (!scope.context) {
      scope.context = require('./pakage.json');
    }

    return scope.context;
  }
}

import { TextTemplateService, TextTemplateContextProvider } from 'continui-services';
import * as ejs from 'ejs';

const privateScope: WeakMap<BuildInTextTemplateService, {
  textTemplateContextProvider: TextTemplateContextProvider,
}> = new WeakMap();
/**
 * Represents a template service for text that can parse text using placeholders.
 */
export class BuildInTextTemplateService implements TextTemplateService {

  constructor(textTemplateContextProvider: TextTemplateContextProvider) {
    privateScope.set(this, {
      textTemplateContextProvider,
    });
  }

    /**
     * Return a parsed text template.
     * @returns A parsed text template.
     */
  public parse(textTemplate: string): string {
    return ejs.render(textTemplate, privateScope.get(this)
                                                .textTemplateContextProvider
                                                .getTextTemplateContext());
  }
}

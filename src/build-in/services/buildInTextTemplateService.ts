import { TextTemplateService } from 'continui-services';

/**
 * Represents a template service for text that can parse text using placeholders.
 */
export class BuildInTextTemplateService implements TextTemplateService {

    /**
     * Return a parsed text template.
     * @returns A parsed text template.
     */
  public parse(textTemplate: string): string {
    return textTemplate; // TODO: parse the text.
  }
}

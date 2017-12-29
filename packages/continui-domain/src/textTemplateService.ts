/**
 * Represents a template service for text that can parse text using placeholders.
 */
export interface TextTemplateService {
    /**
     * Return a pased text.
     * @param text Represents the text that will be parsed.
     * @returns A parsed text.
     */
  parse(text: string): string;
}

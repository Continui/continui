/**
 * Represents a template service for text that can tranform text using placeholders.
 */
export interface TextTemplateService {
    /**
     * Return a transformed text template.
     * @returns A transformed text template.
     */
  tranform(textTemplate: string): string;
}

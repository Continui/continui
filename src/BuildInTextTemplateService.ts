import { TextTemplateService } from "./TextTemplateService";

/**
 * Represents a template service for text that can tranform text using placeholders.
 */
export class BuildInTextTemplateService implements TextTemplateService {
    /**
     * Return a transformed text template.
     * @returns A transformed text template.
     */
    public tranform(textTemplate: string): string {
        return textTemplate; // TODO: Transform the text.
    }
}
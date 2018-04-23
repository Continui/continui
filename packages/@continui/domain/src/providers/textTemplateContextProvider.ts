import { TextTemplateContext } from '../models/textTemplateContext';

/**
 * Represents a provider that can provided text templates 
 */
export interface TextTemplateContextProvider {

    /**
     * Returns the text template context.
     */
  getTextTemplateContext(): TextTemplateContext;
}

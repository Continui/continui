import { TextTemplateContext } from './textTemplateContext';

/**
 * Represents a provider that can provided text templates 
 */
export interface TextTemplateProvider {

    /**
     * Returns the text template context.
     */
  getTextTemplateContext(): TextTemplateContext;
}

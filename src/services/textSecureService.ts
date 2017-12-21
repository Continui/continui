/**
 * Represents a service for transform text that can contain sensitive information that doesn't want
 * to be displayed.
 */
export interface TextSecureService {

    /**
     * Register sensitive text to remove those on transformations.
     * @param sensitiveText Represents a sensitive text.
     */
  registerSersitiveText(sensitiveText: string): void;

    /**
     * Return a secure transformed text.
     * @param insecureText Represents a insecure text that want to be transformed into a secur one.
     * @returns A secure transformed text.
     */
  tranform(insecureText: string): string;
}

/**
 * Represents a service for transform text that can contain sensitive information that doesn't want
 * to be displayed.
 */
export interface TextSecureService {

    /**
     * Register sensitive text to remove those on parsings.
     * @param sensitiveText Represents a sensitive text.
     */
  registerSensitiveText(sensitiveText: string): void;

    /**
     * Return a secure parsed text.
     * @param insecureText Represents a insecure text that want to be parsed into a secure one.
     * @returns A secure parsed text.
     */
  parse(insecureText: string): string;
}

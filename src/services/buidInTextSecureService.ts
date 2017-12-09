import { error } from "util";
import { TextSecureService } from "./textSecureService";

let privateScope: WeakMap<BuildInTextSecureService, {
    sensitiveText: string[]
}> = new WeakMap();

/**
 * Represents a service for transform text that can contain sensitive information that doesn't want to be displayed.
 */
export class BuildInTextSecureService implements TextSecureService {    

    constructor() {
        privateScope.set(this, {
            sensitiveText: []
        })
    }

    /**
     * Register sensitive text to remove those on transformations.
     * @param sensitiveText Represents a sensitive text.
     */
    public registerSersitiveText(sensitiveText: string): void {
        if (sensitiveText) {
            privateScope.get(this).sensitiveText.push(sensitiveText);
        }   
    }

    /**
     * Return a secure transformed text.
     * @param insecureText Represents a insecure text that want to be transformed into a secur one.
     * @returns A secure transformed text.
     */
    public tranform(insecureText: string): string {
        privateScope.get(this).sensitiveText.forEach(sensitiveText => insecureText = insecureText.replace(new RegExp(sensitiveText,"g"), '[secure]'))
        return insecureText;
    }
}
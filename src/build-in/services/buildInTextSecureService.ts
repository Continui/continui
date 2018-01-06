import { error } from 'util';
import { TextSecureService } from 'continui-services';

const privateScope: WeakMap<BuildInTextSecureService, {
  sensitiveText: string[],
}> = new WeakMap();

/**
 * Represents a service for parse text that can contain sensitive information that doesn't want
 * to be displayed.
 */
export class BuildInTextSecureService implements TextSecureService {    

  constructor() {
    privateScope.set(this, {
      sensitiveText: [],
    });
  }

    /**
     * Register sensitive text to remove those on parsings.
     * @param sensitiveText Represents a sensitive text.
     */
  public registerSensitiveText(sensitiveText: string): void {
    if (sensitiveText) {
      privateScope.get(this).sensitiveText.push(sensitiveText);
    }   
  }

    /**
     * Return a secure parsed text.
     * @param insecureText Represents a insecure text that want to be parsed into a secure one.
     * @returns A secure parsed text.
     */
  public parse(insecureText: string): string {
    let securetext = insecureText;
    
    privateScope.get(this).sensitiveText.forEach(sensitiveText => 
      securetext = securetext.replace(new RegExp(sensitiveText,'g'), '[secure]'));
      
    return securetext;
  }
}

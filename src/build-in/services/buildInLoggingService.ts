import {
  LoggingService,
  LoggingData,
  TextSecureService,
  LoggingDataColorTypes,
} from 'continui-services';
import chalk, { Chalk } from 'chalk';

const privateScope: WeakMap<BuildInLoggingService, {
  textSecureService: TextSecureService,
}> = new WeakMap();

/**
 * Represents a service that allow log data.
 */
export class BuildInLoggingService implements LoggingService {

  constructor(textSecureService: TextSecureService) {
    privateScope.set(this, {
      textSecureService,
    });
  }

   /**
   * Logs data.
   * @param data Represents the data that will be logged.
   */
  public log(data: string): void;
  /**
   * Logs data.
   * @param data Represents the data that will be logged.
   */
  public log(data: string[]): void;
  /**
   * Logs data.
   * @param data Represents the data that will be logged.
   */
  public log(data: LoggingData): void;
  /**
   * Logs data.
   * @param data Represents the data that will be logged.
   */
  public log(data: LoggingData[]): void;
  public log(data: any): void {
    const scope = privateScope.get(this);
    const unnormalizedLoggingDataList: any[] = data instanceof Array ? data : [data];
    let parsedText: string = '';

    unnormalizedLoggingDataList.forEach((unnormalizedLoggingData) => {
      let normalizedLoggingData: LoggingData;

      if (typeof unnormalizedLoggingData === 'string') {
        normalizedLoggingData = {
          text: unnormalizedLoggingData,
        };
      } else if (typeof unnormalizedLoggingData === 'object' && unnormalizedLoggingData['text']) {
        normalizedLoggingData = unnormalizedLoggingData;
      } else {
        throw Error('Can not log provided data \n\n' + unnormalizedLoggingData);
      }

      parsedText += scope.textSecureService
                         .parse(this.parseLoggingData(normalizedLoggingData, !!parsedText));
    });

    console.log(parsedText);
  }

  /**
   * Parse the data to apply styles and colors defined in the logging data.
   * @param loggingData Represents the data that will be logged.
   * @param isConcatenating Represents a boolean value specifying if the result text will be concat
   */
  private parseLoggingData(loggingData: LoggingData, isConcatenating?: boolean): string {
    const scope = privateScope.get(this);
    const date: string = new Date().toTimeString().substr(0, 8);

    let chalkSetup: Chalk = chalk;
    chalkSetup = this.getChalkSetupForText(chalkSetup, loggingData);
    chalkSetup = this.getChalkSetupForBackgound(chalkSetup, loggingData);
    
    const parsedText: string = 
     (isConcatenating ? '' : `[${chalk.gray(date)}] `) + `${chalkSetup(loggingData.text)}`;
    
    return parsedText;
  }

  /**
   * Returns a fomatted chalk instance for text based on the provided logging data.
   * @param chalk Represents the chalk instance which the formated will be based.
   * @param loggingData Represents th logging data.
   */
  private getChalkSetupForText(chalk: Chalk, loggingData: LoggingData): Chalk {

    let configuredChalk: Chalk = chalk;

    if (configuredChalk[loggingData.style]) {
      configuredChalk = configuredChalk[loggingData.style]; 
    }

    if (loggingData.textColor) {
      switch (loggingData.textColorType) {
        default:
        case LoggingDataColorTypes.name:
          configuredChalk = configuredChalk.keyword(loggingData.textColor);
          break;
        case LoggingDataColorTypes.hex:
          configuredChalk = configuredChalk.hex(loggingData.textColor);
          break;
        case LoggingDataColorTypes.rgb:
          const rgbCollection: number[] = 
          loggingData.textColor.split(',').map(rgbColletionItem => parseInt(rgbColletionItem, 10));
          configuredChalk = configuredChalk.rgb(rgbCollection[0],
                                                rgbCollection[1],
                                                rgbCollection[2]);
          break;
      }
    }

    return configuredChalk;
  }

  /**
   * Returns a fomatted chalk instance for text background based on the provided logging data.
   * @param chalk Represents the chalk instance which the formated will be based.
   * @param loggingData Represents th logging data.
   */
  private getChalkSetupForBackgound(chalk: Chalk, loggingData: LoggingData): Chalk {

    let configuredChalk: Chalk = chalk;

    if (loggingData.backColor) {      
      switch (loggingData.backColorType) {
        default:
        case LoggingDataColorTypes.name:
          configuredChalk = configuredChalk.bgKeyword(loggingData.backColor);
          break;
        case LoggingDataColorTypes.hex:
          configuredChalk = configuredChalk.bgHex(loggingData.backColor);
          break;
        case LoggingDataColorTypes.rgb:
          const rgbCollection: number[] = 
          loggingData.backColor.split(',').map(rgbColletionItem => parseInt(rgbColletionItem, 10));
          configuredChalk = configuredChalk.bgRgb(rgbCollection[0],
                                                  rgbCollection[1],
                                                  rgbCollection[2]);
          break;
      }
    }

    return configuredChalk;
  }
}

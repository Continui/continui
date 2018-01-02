import {
  LoggingService,
  LoggingData,
  TextSecureService,
  LoggingDataColorTypes
} from 'continui-services';
import chalk, { Chalk } from 'chalk'

type Services = {
  textSecureService: TextSecureService,
};

const privateScope: WeakMap<BuildInLoggingService, {
  services: Services
  functions: {
    parseLoggingData: (loggingData: LoggingData, indented?: boolean) => string,
    setupDefaultLoggingDataValues: (loggingData: LoggingData) => void,
    getConfiguredChalk: (loggingData: LoggingData) => Chalk,   
  },
}> = new WeakMap();

/**
 * Represents a service that allow log data.
 */
export class BuildInLoggingService implements LoggingService {

  constructor(textSecureService: TextSecureService) {
    privateScope.set(this, {
      services: {
      textSecureService,
      },
      functions: {
        parseLoggingData: parseLoggingData.bind(this),
        setupDefaultLoggingDataValues: setupDefaultLoggingDataValues.bind(this),
        getConfiguredChalk: getConfiguredChalk.bind(this)
      },
    })
  }

    /**
     * Logs data.
     * @param data Represents the data that will be logged.
     */
  public log(...data: string[]): void;
    /**
     * Logs data.
     * @param data Represents the data that will be logged.
     */
  public log(...data: LoggingData[]): void;
  public log(data: any): void {
    const scope = privateScope.get(this); 
    
    const unnormalizedLoggingDataList: any[] = data instanceof Array ? data : [data];

    unnormalizedLoggingDataList.forEach((unnormalizedLoggingData, index) => {
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

      console.log(scope.services
                       .textSecureService
                       .parse(scope.functions
                                   .parseLoggingData(normalizedLoggingData, index > 0)));
    });
  }
}

function parseLoggingData(loggingData: LoggingData, indented?: boolean) : string { 
  const scope = privateScope.get(this);
  const date: string = new Date().toTimeString().substr(0, 8); 

  scope.functions.setupDefaultLoggingDataValues(loggingData)

  let chalkSetup = scope.functions.getConfiguredChalk(loggingData);
  let parsedText: string = indented ? '' : `[${chalk.gray(date)}] ${chalkSetup(loggingData.text)}`;

  return parsedText;
}

function setupDefaultLoggingDataValues(loggingData: LoggingData) {
  loggingData.textColor = loggingData.textColor || 'black';
  loggingData.textColorType = loggingData.textColorType || LoggingDataColorTypes.name;
  loggingData.backColor = loggingData.backColor || 'black';
  loggingData.backColorType = loggingData.backColorType || LoggingDataColorTypes.name;
  loggingData.style = loggingData.style || 'reset';
}

function SetupChalkForText(Chalk,  loggingData: LoggingData) : Chalk {

  let configuredChalk: Chalk = chalk;

  switch(loggingData.textColorType) {

  }

  return configuredChalk;
}

import { LoggingService, LoggingData, TextSecureService } from 'continui-services';

type Services = {
  textSecureService: TextSecureService,
};

const privateScope: WeakMap<BuildInLoggingService, {
  services: Services
  functions: {
    parseLoggingData: (loggingData: LoggingData, indented?: boolean) => string,
  },
}> = new WeakMap();

/**
 * Represents a service that allow log data.
 */
export class BuildInLoggingService implements LoggingService {

  constructor(textSecureService: TextSecureService) {
    setupPrivateScope(this, {
      textSecureService,
    });
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

function setupPrivateScope(instance: BuildInLoggingService, services: Services) {
  privateScope.set(instance, {
    services,
    functions: {
      parseLoggingData: parseLoggingData.bind(this),
    },
  });
}

function parseLoggingData(loggingData: LoggingData, indented?: boolean) : string { 
  const date: string = new Date().toTimeString().substr(0, 8);

  // typeof toLogData === 'string' ? toLogData : JSON.stringify(toLogData);
  return (indented ? '  ' : `[${date}]`) + ` ${loggingData.text}`;
}

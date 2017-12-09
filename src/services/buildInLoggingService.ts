import { LoggingService } from "./loggingService";
import { TextSecureService } from "./textSecureService";

let privateScope: WeakMap<BuildInLoggingService, {
    textSecureService: TextSecureService
}> = new WeakMap()

/**
 * Represents a service that allow log data.
 */
export class BuildInLoggingService implements LoggingService {

    constructor(textSecureService: TextSecureService) {
        privateScope.set(this, {
            textSecureService: textSecureService
        })
    }

    /**
     * Logs data.
     * @param data Represents the data that will be logged.
     */
    public log(...data: string[]): void {
        let date: string = new Date().toTimeString().substr(0, 8)
        data.forEach((toLogData, index) => {
            let toDisplayText: string = typeof toLogData === 'string' ? toLogData : JSON.stringify(toLogData)
            toDisplayText = privateScope.get(this)
                                        .textSecureService
                                        .tranform(toDisplayText)

            console.log((index > 0 ? '  ' : `[${date}]`) + ` ${toDisplayText}`)
        })
    }
}
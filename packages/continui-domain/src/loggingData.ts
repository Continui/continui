import { LoggingDataColorTypes } from './loggingDataColorTypes';

export interface LoggingData {
    /**
     * Represents the text to be logged.
     */
  text: string;

    /**
     * Represents the color in which the text will be displayed.
     */
  textColor?: string | number[];

    /**
     * Represents the color type given in the text color.
     */
  textColorType?: LoggingDataColorTypes;

    /**
     * Represents the color in which the text backgound will be displayed.
     */
  backColor?: string;

    /**
     * Represents the color type given in the text backgound color.
     */
  backColorType?: LoggingDataColorTypes;

    /**
     * Represents the style in which the text will be displayed.
     */
  style?: string;
}

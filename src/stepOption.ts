import { fail } from "assert";

/**
 * Represents an step option to be used on the step execution.
 */
export interface StepOption {
    /**
     * Represents a short key for the option.
     */
    shortKey?:string

    /**
     * Represents a long key for the option.
     */
    longKey:string

    /**
     * Represents a description for the option.
     */
    description:string

    /**
     * Represents the option default value.
     */
    defaultValue:string

    /**
     * Represents a boolean value specifying if the option is required.
     */
    isRequired:boolean

    /**
     * Represents a boolean value specifying if the option is templated and can be transformed.
     */
    isTemplated:boolean

    /**
     * Represents the option primary type
     */
    primaryType:string

    /**
     * Represents the option primary type
     */
    secondaryType?:string
}
import { Step } from "../step";
import { StepOptionMap } from "../stepOptionMap";

/**
 * Represents a npm step that can manage the versioning and publishing of npm package.
 */
export class NpmStep implements Step {
    /**
     * Represents the step identifier.
     */
    public get identifier(): string { return 'npm' };
    
    /**
     * Represents the step name.
     */
    public get name(): string { return 'NPM' };

    /**
     * Represents the step description.
     */
    public get description(): string { return 'Represents a npm step that can manage the versioning and publishing of npm package.' };

    /**
     * Execute the step base on the given options.
     */
    public execute(stepOptionsMap: StepOptionMap): void | Promise<void> {

    }
}
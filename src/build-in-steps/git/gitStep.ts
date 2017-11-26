import { Step } from "../step";
import { StepOptionMap } from "../stepOptionMap";

/**
 * Represents a git step that can commit, tag and push changes perfomed in a git repository in the pipeline.
 */
export class GitStep implements Step {
    /**
     * Represents the step identifier.
     */
    public get identifier(): string { return 'git' };
    
    /**
     * Represents the step name.
     */
    public get name(): string { return 'Git ' };

    /**
     * Represents the step description.
     */
    public get description(): string { return 'Represents a git step that can commit, tag and push changes perfomed in a git repository in the pipeline.' };

    /**
     * Execute the step base on the given options.
     */
    public execute(stepOptionsMap: StepOptionMap): void | Promise<void> {

    }

    /**
     * Retuns the step default option map.
     */
    public getDefaultOptionMap(): StepOptionMap {
        return {};
    }
}
import { Step } from "../step";
import { StepOptionMap } from "../stepOptionMap";

/**
 * Represents a git hub step that can create well defined releases on Git Hub in the pipeline.
 */
export class GitHubStep implements Step {
    /**
     * Represents the step identifier.
     */
    public get identifier(): string { return 'git-hub' };
    
    /**
     * Represents the step name.
     */
    public get name(): string { return 'Git Hub' };

    /**
     * Represents the step description.
     */
    public get description(): string { return 'Represents a git hub step that can create well defined releases on Git Hub in pipeline.' };

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
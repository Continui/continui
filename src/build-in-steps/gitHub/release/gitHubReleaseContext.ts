import { GitHubReleaseDefinition } from "./gitHubReleaseDefinition";
import { GitHubReleaseInformation } from "./gitHubReleaseInformation";

/**
 * Represents the git hub release step context that contain arguments and parameter that define the flow of the process.
 */
export class GitHubReleaseContext {
    releaseDefinition: GitHubReleaseDefinition
    releaseInformation: GitHubReleaseInformation
}
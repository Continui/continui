export class GitHubReleaseDefinition {
    /**
     * Get or set the git hub token to comunicate with the API.
     */
    public gitHubToken: string

    /**
     * Get or set the owner name of the repository.
     */
    public owner: string

    /**
     * Get or set the repository that will be released.
     */
    public repository: string

    /**
     * [Templated] Get or set the name of the tag where the release will be based on.
     */
    public tagName:string
    
    /**
     * [Templated] Get or set the target were the tag will be based on, if the tag already exist must not be provided.
     */
    public target?: string

    /**
     * [Templated] Get or ser the release name.
     */
    public name: string

    /**
     * [Templated] Get or set the release description. 
     */
    public description: string

    /**
     * Get or set a boolean value specifying if the release is a draft.
     */
    public isDraft: boolean

    /**
     * Get or set a boolean value specifying if the release is a pre-release.
     */
    public isPreRelease: boolean

    /**
     * [Templated] Get or set the release assets paths.
     */
    public assetsPath: string | string[];
}
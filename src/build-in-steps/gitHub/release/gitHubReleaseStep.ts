
import { Step } from "../../../step"
import { StepOption } from "../../../stepOption";
import { StepOptionDefiner } from "../../../stepOptionDefiner";
import { StepOptionKeyValueMap } from "../../../stepOptionKeyValueMap"
import { TextTemplateService } from "../../../textTemplateService";
import { GitHubReleaseContext } from "./gitHubReleaseContext"
import { GitHubReleaseDefinition } from "./gitHubReleaseDefinition";
import { GitHubReleaseInformation } from "./gitHubReleaseInformation";
import * as stepOptionType from "../../../stepOptionType"

import * as fs from 'fs'
import * as path from 'path'
import * as FormData from 'form-data'

import axios from 'axios'
import co from 'co'

let privateScope = new WeakMap<GitHubReleaseStep, {
    textTemplateService: TextTemplateService
}>()

/**
 * Represents a git hub release step that can create well defined releases on Git Hub.
 */
export class GitHubReleaseStep implements Step<GitHubReleaseContext> {

    constructor(textTemplateService: TextTemplateService) {
        privateScope.set(this, {
            textTemplateService: textTemplateService
        })
    }

    /**
     * Get the step identifier.
     */
    public get identifier(): string { return 'ghr' }
    
    /**
     * Get the step name.
     */
    public get name(): string { return 'Git Hub Release' }

    /**
     * Get the step description.
     */
    public get description(): string { return 'Represents a git hub release step that can create well defined releases on Git Hub.' }

    /**
     * Creates a restoration point based on the step to rollback the changes in case that the pipe flow breaks.
     * @param context Represents the step execution context.
     */
    public createsRestaurationPoint(context: GitHubReleaseContext): void {
       // NOTHING to do here.
    }
    
    /**
     * Asynchronously creates a restoration point based on the step to rollback the changes in case that the pipe flow breaks.
     * @param context Represents the step execution context.
     */
    public createsRestaurationPointAsync(context: GitHubReleaseContext): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.createsRestaurationPoint(context)
                resolve()
            } catch(error) {
                reject(error)
            }
        })    
    }

    /**
     * Execute the step base on the given options and context.
     * @param context Represents the step execution context.
     */
    public execute(context: GitHubReleaseContext): void {

        let textTemplateService: TextTemplateService = privateScope.get(this).textTemplateService;

        co(function* () {

            let assets:string[] = this.getNormalizedAssetsPaths(context.releaseDefinition.assetsPath)

            yield axios.post(`https://api.github.com/repos/${context.releaseDefinition.owner}/${context.releaseDefinition.repository}/releases?access_token=${context.releaseDefinition.gitHubToken}`, {
                tag_name:  textTemplateService.tranform(context.releaseDefinition.tagName),
                target_commitish: textTemplateService.tranform(context.releaseDefinition.target),
                name: textTemplateService.tranform(context.releaseDefinition.name),
                body: textTemplateService.tranform(context.releaseDefinition.description),
                draft: context.releaseDefinition.isDraft,
                prerelease: context.releaseDefinition.isPreRelease
            }).then(response => {
                context.releaseInformation.id = response.data.id
                context.releaseInformation.uploadURL = response.data.upload_url
            })

            yield assets.map(asset => {
                let formData:FormData = new FormData(undefined)
                formData.append('data-binary', fs.createReadStream(asset))

                return axios.post(context.releaseInformation.uploadURL.replace('{?name,label}', '?name=' + path.basename(asset)), formData, {
                    headers: formData.getHeaders()
                })
            })
        })           
    }

    /**
     * Asynchronously execute the step base on the given options and context.     
     * @param context Represents the step execution context.
     */
    public executeAsync(context: GitHubReleaseContext): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.execute(context)
                resolve()
            } catch(error) {
                reject(error)
            }
        })    
    }
    
    /**
     * Restore the step base on the given options and context.
     * @param context Represents the step execution context.
     */
    public restore(context: GitHubReleaseContext): void {
        if (context.releaseInformation.id) {
            co(function*() {
                yield axios.delete(`https://api.github.com/repos/${context.releaseDefinition.owner}/${context.releaseDefinition.repository}/` + context.releaseInformation.id)
            })          
        }
    }
    
    /**
     * Asynchronously restore the step base on the given options and context.     
     * @param context Represents the step execution context.
     */
    public restoreAsync(context: GitHubReleaseContext): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.restore(context)
                resolve()
            } catch(error) {
                reject(error)
            }
        })
    }

    /**
     * Defines the step options with the provided definer.
     * @param stepOptionDefiner Represents a step option definer to define the step options.
     */
    public defineOptions(stepOptionDefiner: StepOptionDefiner): void {

        stepOptionDefiner.define({
            longKey: 'token',
            description: 'Represents the git hub token to comunicate with the API',
            defaultValue: null,
            isRequired: true,
            isTemplated: false,
            primaryType: stepOptionType.text
        }).define({
            longKey: 'owner',
            description: 'Represents the owner name of the repository.',
            defaultValue: null,
            isRequired: true,
            isTemplated: false,
            primaryType: stepOptionType.text
        }).define({
            longKey: 'repository',
            description: 'Represents the repository that will be released.',
            defaultValue: null,
            isRequired: true,
            isTemplated: false,
            primaryType: stepOptionType.text
        }).define({
            longKey: 'tag',
            description: 'Represents the tag where the release will be based on.',
            defaultValue: null,
            isRequired: false,
            isTemplated: true,
            primaryType: stepOptionType.text
        }).define({
            longKey: 'target',
            description: 'Represents the target were the tag will be based on, if the tag already exist must not be provided.',
            defaultValue: null,
            isRequired: false,
            isTemplated: true,
            primaryType: stepOptionType.text
        }).define({
            longKey: 'name',
            description: 'Represents the release name.',
            defaultValue: null,
            isRequired: true,
            isTemplated: true,
            primaryType: stepOptionType.text
        }).define({
            longKey: 'description',
            description: 'Represents the release description.',
            defaultValue: null,
            isRequired: false,
            isTemplated: true,
            primaryType: stepOptionType.text
        }).define({
            longKey: 'draft',
            description: 'Represents a boolean value specifying if the release is a draft.',
            defaultValue: 'false',
            isRequired: false,
            isTemplated: false,
            primaryType: stepOptionType.boolean
        }).define({
            longKey: 'pre',
            description: 'Represents a boolean value specifying if the release is a pre-release',
            defaultValue: 'false',
            isRequired: false,
            isTemplated: false,
            primaryType: stepOptionType.boolean
        }).define({
            longKey: 'paths',
            description: 'Represents a list of paths that represents the assets that will be uploaded.',
            defaultValue: 'false',
            isRequired: false,
            isTemplated: false,
            primaryType: stepOptionType.list,
            secondaryType: stepOptionType.text
        })
        
    }
    

    /**
     * Creates and return an new context bases on the provided options.
     * @param stepOptionsMap Represents the options provided to run the step.
     * @returns A new execution context bases on the provided options.
     */
    public createsNewContextFromOptionsMap(stepOptionsMap: StepOptionKeyValueMap): GitHubReleaseContext {
        
        console.log(stepOptionsMap);

        let context:GitHubReleaseContext = new GitHubReleaseContext();
        context.releaseDefinition = new GitHubReleaseDefinition();
        context.releaseInformation = new GitHubReleaseInformation();

        return context;
    }

    private getNormalizedAssetsPaths(assets: string | string[]): string[] {
        if (typeof assets == 'string') {
            assets = [assets];
        }

        let unexistingAssets: string[] = [];

        assets.forEach(asset => {
            asset = path.resolve(asset)

            if (!fs.existsSync(asset)) {
                unexistingAssets.push(asset)
            } 
        });

        if (unexistingAssets.length) {
            throw new Error('The following assets are can not be located: \n\n' + unexistingAssets.join('\n'))
        } else {
            return assets;
        }
    }
}
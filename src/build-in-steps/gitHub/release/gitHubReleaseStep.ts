
import { Step } from "../../../step"
import { StepOption } from "../../../stepOption";
import { StepOptionValueMap } from "../../../types";
import { GitHubReleaseContext } from "./gitHubReleaseContext"
import * as stepOptionType from "../../../stepOptionType"

import * as fs from 'fs'
import * as path from 'path'
import * as FormData from 'form-data'

import axios from 'axios'
import { TextTemplateService } from "../../../services/textTemplateService";


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
    public get identifier(): string { return 'githubre' }
    
    /**
     * Get the step name.
     */
    public get name(): string { return 'Git Hub Release' }

    /**
     * Get the step description.
     */
    public get description(): string { return 'Represents a git hub release step that can create well defined releases on Git Hub.' }

    /**
     * Represents the step otions used to execute the step.
     */
    public get options(): StepOption[] { return this.getOptions() }

    /**
     * Creates a restoration point based on the step to rollback the changes in case that the pipe flow breaks.
     * @param context Represents the step execution context.
     */
    public createsRestaurationPoint(stepOptionValueMap: StepOptionValueMap, context: GitHubReleaseContext): void | Promise<void> | IterableIterator<any> {
       // NOTHING to do here.
    }
    
    /**
     * Execute the step base on the given options and context.
     * @param context Represents the step execution context.
     */
    public* execute(stepOptionValueMap: StepOptionValueMap, context: GitHubReleaseContext): void | Promise<void> | IterableIterator<any> {

        let textTemplateService: TextTemplateService = privateScope.get(this).textTemplateService;
        let assets:string[] = this.getNormalizedAssetsPaths(stepOptionValueMap.paths || [])

        yield axios.post(`https://api.github.com/repos/${stepOptionValueMap.owner}/${stepOptionValueMap.repository}/releases?access_token=${stepOptionValueMap.token}`, {
            tag_name:  textTemplateService.tranform(stepOptionValueMap.tag),
            target_commitish: textTemplateService.tranform(stepOptionValueMap.target),
            name: textTemplateService.tranform(stepOptionValueMap.name),
            body: textTemplateService.tranform(stepOptionValueMap.description),
            draft: stepOptionValueMap.draft,
            prerelease: stepOptionValueMap.pre
        }).then(response => {
            context.id = response.data.id
            context.uploadURL = response.data.upload_url
        }).catch(error => { throw error.response.data || 'undefined error creating release' });

        yield assets.map(asset => {
            let formData:FormData = new FormData(undefined)
            formData.append('data-binary', fs.createReadStream(asset))

            return axios.post(context.uploadURL.replace('{?name,label}', '?name=' + path.basename(asset)), formData, {
                headers: formData.getHeaders()
            })
        })               
    }   
    
    /**
     * Restore the step base on the given options and context.
     * @param context Represents the step execution context.
     */
    public* restore(stepOptionValueMap: StepOptionValueMap, context: GitHubReleaseContext): void | Promise<void> | IterableIterator<any> {
        if (context.id) {           
            yield axios.delete(`https://api.github.com/repos/${stepOptionValueMap.owner}/${stepOptionValueMap.repository}/` + context.id)              
        }
    }

    /**
     * Creates and return an new context bases on the provided options.
     * @param stepOptionsMap Represents the options provided to run the step.
     * @returns A new execution context bases on the provided options.
     */
    public createsNewContextFromOptionsMap(stepOptionsMap: StepOptionValueMap): GitHubReleaseContext {
        return  new GitHubReleaseContext();
    }

    /**
     * Defines the step options with the provided definer.
     * @param stepOptionDefiner Represents a step option definer to define the step options.
     */
    private getOptions(): StepOption[] {

        return[{
            key: 'token',
            description: 'Represents the git hub token to comunicate with the API',
            isRequired: true,
            isTemplated: false,
            primaryType: stepOptionType.text
        },
        {
            key: 'owner',
            description: 'Represents the owner name of the repository.',
            isRequired: true,
            isTemplated: false,
            primaryType: stepOptionType.text
        },
        {
            key: 'repository',
            description: 'Represents the repository that will be released.',
            isRequired: true,
            isTemplated: false,
            primaryType: stepOptionType.text
        },
        {
            key: 'tag',
            description: 'Represents the tag where the release will be based on.',
            isRequired: false,
            isTemplated: true,
            primaryType: stepOptionType.text
        },
        {
            key: 'target',
            description: 'Represents the target were the tag will be based on, if the tag already exist must not be provided.',
            isRequired: false,
            isTemplated: true,
            primaryType: stepOptionType.text
        },
        {
            key: 'name',
            description: 'Represents the release name.',
            isRequired: true,
            isTemplated: true,
            primaryType: stepOptionType.text
        },
        {
            key: 'description',
            description: 'Represents the release description.',
            isRequired: false,
            isTemplated: true,
            primaryType: stepOptionType.text
        },
        {
            key: 'draft',
            description: 'Represents a boolean value specifying if the release is a draft.',
            defaultValue: 'false',
            isRequired: false,
            isTemplated: false,
            primaryType: stepOptionType.boolean
        },
        {
            key: 'pre',
            description: 'Represents a boolean value specifying if the release is a pre-release',
            defaultValue: 'false',
            isRequired: false,
            isTemplated: false,
            primaryType: stepOptionType.boolean
        },
        {
            key: 'paths',
            description: 'Represents a list of paths that represents the assets that will be uploaded.',
            isRequired: false,
            isTemplated: false,
            primaryType: stepOptionType.list
        }];        
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
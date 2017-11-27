
import { Step } from "../../../step"
import { StepOptionMap } from "../../../stepOptionMap"
import { GitHubReleaseContext } from "./gitHubReleaseContext"
import { TextTemplateService } from "../../../TextTemplateService";

import axios from 'axios'
import co from 'co'
import fs from 'fs'
import path from 'path'

import FormData from 'form-data'
import { strictEqual } from "assert";
import { contentType } from "mime-types";
import { GitHubReleaseDefinition } from "./gitHubReleaseDefinition";
import { GitHubReleaseInformation } from "./gitHubReleaseInformation";

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
    public get identifier(): string { return 'git-hub-release' }
    
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
     * Retuns the step default option map.
     * @returns The default step option map.
     */
    public getDefaultOptionMap(): StepOptionMap {
        return {}
    }

    /**
     * Creates and return an new context bases on the provided options.
     * @param stepOptionsMap Represents the options provided to run the step.
     * @returns A new execution context bases on the provided options.
     */
    public createsNewContextFromOptionsMap(stepOptionsMap: StepOptionMap): GitHubReleaseContext {
        
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
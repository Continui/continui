import { Step } from "../step";
import { StepOption } from "../stepOption";
import { HelpGenerationService } from './helpGenerationService'

/**
 * Represents a service that generate help.
 */
export class BuildInHelpGenerationService implements HelpGenerationService {
    /**
     * Returns help generated based on the provided steps and his options.
     * @param steps Represenst the steps.
     * @returns The generated help.
     */
    public getStepsHelp(...steps: Step<any>[]): string {
        let generatedHelp: string = '';

        steps.forEach(step => {
            if (generatedHelp) {
                generatedHelp += '\n'
            }

            generatedHelp += `Help for step ${step.identifier}(${step.name}):\n\n`
            generatedHelp += 'Description:\n'
            generatedHelp += `${step.description}\n\n`
            generatedHelp += 'Options:\n'
            generatedHelp += this.getStepOptionsHelp(...step.options)            
        })

        return generatedHelp;
    }

    /**
     * Returns help generated based on the provided steps options.
     * @param stepsOption Represenst the steps options.
     * @returns The generated help.
     */
    public  getStepOptionsHelp(...stepsOption: StepOption[]): string {
        let generatedHelp: string = '';

        stepsOption.forEach(option => {
            if (generatedHelp) {
                generatedHelp += '\n'
            }

            generatedHelp += ` --${option.key} (${option.type})`
            generatedHelp += option.defaultValue ? ` default:${option.defaultValue}` : ''
            generatedHelp += option.isRequired ? ` [Required]` : ''
            generatedHelp += option.isSecure ? ` [Secure]` : ''
            generatedHelp += option.isTemplated ? ` [Templated]` : ''
            generatedHelp += ' ' + option.description
        })

        return generatedHelp;
    }
}
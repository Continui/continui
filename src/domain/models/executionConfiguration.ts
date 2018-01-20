import { IdentifiedStepOptionMaps } from 'continui-step'

export interface ExecutionConfiguration {
    steps: string[]
    stepsDeinitionsModules?: string[]
    stepsOptionsValues?: IdentifiedStepOptionMaps
    cofigurationFile?: string
}
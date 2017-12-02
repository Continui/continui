// import { Step } from "../../step";
// import { StepOptionMap } from "../../stepOptionMap";

// /**
//  * Represents a npm publish step to publish npm packages.
//  */
// export class NpmPublishStep implements Step {
//     /**
//      * Represents the step identifier.
//      */
//     public get identifier(): string { return 'npm-publish' };
    
//     /**
//      * Represents the step name.
//      */
//     public get name(): string { return ' Publish' };

//     /**
//      * Represents the step description.
//      */
//     public get description(): string { return 'Represents a npm publish step to publish npm packages.' };

//     /**
//      * Execute the step base on the given options.
//      */
//     public execute(stepOptionsMap: StepOptionMap): void | Promise<void> {

//     }

//     /**
//      * Retuns the step default option map.
//      */
//     public getDefaultOptionMap(): StepOptionMap {
//         return {};
//     }
// }
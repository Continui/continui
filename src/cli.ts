#!/usr/bin/env node

import { continuiApplicationFactory, activator } from './index';
import { ExecutionConfiguration } from './domain/models/executionConfiguration';
import { CliRenderers } from './domain/cli/cliRenderer';
import {
    CliExecutionConfigurationParsingService,
} from './domain/cli/cliExecutionConfigurationParsingService';
import {
    FromFileExecutionConfigurationProvider,
} from './domain/providers/fromFileExecutionConfigurationProvider';
import {
    ExecutionConfigurationMergingService,
} from './domain/services/executionConfigurationMergingService';
import { connect } from 'http2';
import { date } from '../../continui-step/dist/definitions/stepOptionType';

const cliRenderers: CliRenderers[] = activator.resolve('cliRenderers');
const cliExecutionConfigurationParsingService: CliExecutionConfigurationParsingService =
    activator.resolve('cliExecutionConfigurationParsingService');
const fromFileExecutionConfigurationProvider: FromFileExecutionConfigurationProvider =
    activator.resolve('fromFileExecutionConfigurationProvider');
const executionConfigurationMergingService: ExecutionConfigurationMergingService = 
    activator.resolve('executionConfigurationMergingService');
                    
const cliExecutionConfiguration: ExecutionConfiguration = 
    cliExecutionConfigurationParsingService.parse(process.argv);
const fromFileExecutionConfiguration : ExecutionConfiguration = 
    fromFileExecutionConfigurationProvider.getExecutionConfigrationFromFile(
        cliExecutionConfiguration.cofigurationFile,
    );
const executionConfiguration: ExecutionConfiguration = 
    executionConfigurationMergingService.mergeExecutionConfigurations(
        fromFileExecutionConfiguration,
        cliExecutionConfiguration,
    );

executionConfiguration.cofigurationFile = 'ignore-file-configuration';

const requestedCliRenderers = cliRenderers.filter((cliRenderer) => {
  let isRendererKeyRequested: boolean = false;

  cliRenderer.keys.forEach((cliRedererKey) => {
    isRendererKeyRequested = isRendererKeyRequested ||
                            (process.argv.indexOf('-' + cliRedererKey) >= 0 ||
                             process.argv.indexOf('--' + cliRedererKey) >= 0);
  });

  return isRendererKeyRequested;
});

requestedCliRenderers.forEach(cliRenderer => cliRenderer.render(executionConfiguration));

if (!requestedCliRenderers.length) {
  continuiApplicationFactory.createsContinuiApplication()
                              .execute(executionConfiguration);
}

// [
//       {
//         key: 'help',
//         type: StepOptionTypes.boolean,
//         description: '(-h) Make the tool display the help, if steps are provided, the steps ' +
//                      'help will be displayed.',
//       },
//       {
//         key: 'version',
//         type: StepOptionTypes.boolean,
//         description: '(-v) Make the tool display the version.',
//       },
//       {
//         key: 'steps',
//         type: StepOptionTypes.boolean,
//         description: '(-s) Make the tool display the available steps.',
//       },
//     ];


// scope.loggingService.log(`Executing step ${step.identifier}(${step.name}) with options.`,
//                                ...toDisplayOptions);
// const toDisplayOptions = Object.keys(stepOpionsMap).map((optionKey) => { 
//     const optionValue: string = stepOpionsMap[optionKey] !== undefined ? 
//                                                             stepOpionsMap[optionKey] :
//                                                             '[undefined]';
//     return `${optionKey}=${optionValue}`;
//   });

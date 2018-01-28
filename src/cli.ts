#!/usr/bin/env node

import { continuiApplicationFactory, activator, ContinuiApplication } from './index';
import { ExecutionConfiguration } from './domain/models/executionConfiguration';
import { ExecutionProgressInformation } from './domain/models/executionProgressInformation';
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
import { LoggingService } from 'continui-services';

import * as continuiApplicationEvents from './domain/constants/continuiApplicationEvents';

function cliExecution(
    cliRendererList: CliRenderers[],
    loggingService: LoggingService,
    cliExecutionConfigurationParsingService: CliExecutionConfigurationParsingService,
    fromFileExecutionConfigurationProvider: FromFileExecutionConfigurationProvider,
    executionConfigurationMergingService: ExecutionConfigurationMergingService,
) {
  const cliExecutionConfiguration: ExecutionConfiguration =
        cliExecutionConfigurationParsingService.parse(process.argv);
  const fromFileExecutionConfiguration: ExecutionConfiguration =
        fromFileExecutionConfigurationProvider.getExecutionConfigrationFromFile(
            cliExecutionConfiguration.cofigurationFile,
        );
  const executionConfiguration: ExecutionConfiguration =
        executionConfigurationMergingService.mergeExecutionConfigurations(
            fromFileExecutionConfiguration,
            cliExecutionConfiguration,
        );

  executionConfiguration.cofigurationFile = 'ignore-file-configuration';

  const requestedCliRenderers = cliRendererList.filter((cliRenderer) => {
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
    const continuiApplication: ContinuiApplication =
            continuiApplicationFactory.createsContinuiApplication();

    continuiApplication.on(continuiApplicationEvents.PROGRESS_CHANGED,
                           logProgressChanged);
    continuiApplication.on(continuiApplicationEvents.INFORMATION_AVAILABLE,
                           logInformationAvailable);

    continuiApplication.execute(executionConfiguration);
  }

  function logProgressChanged(executionProgressInformation: ExecutionProgressInformation) {
    loggingService.log(executionProgressInformation.progress + '% ' +
                       executionProgressInformation.friendlyStatus);
  }

  function logInformationAvailable(informaion: string) {
    loggingService.log(informaion);
  }

}

activator.resolve(cliExecution);

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

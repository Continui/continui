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
                           onProgressChanged);
    continuiApplication.on(continuiApplicationEvents.INFORMATION_AVAILABLE,
                           onInformationAvailable);
    continuiApplication.on(continuiApplicationEvents.EXECUTION_FAILURE,
                           onExecutionFailure);

    continuiApplication.execute(executionConfiguration);
  }

  function onProgressChanged(executionProgressInformation: ExecutionProgressInformation) {
    loggingService.log(executionProgressInformation.progress + '% ' +
                       executionProgressInformation.friendlyStatus);
  }

  function onInformationAvailable(informaion: string) {
    loggingService.log(informaion);
  }

  function onExecutionFailure(error: Error) {
    process.exit(1);
  }

}

activator.resolve(cliExecution);

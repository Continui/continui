#!/usr/bin/env node

import { continuiApplicationFactory, activationCenter } from './index';
import { ExecutionConfiguration } from './domain/models/executionConfiguration';
import { CliRenderers } from './domain/cli/cliRenderer';
import {
    CliExecutionConfigurationParsingService
} from './domain/cli/cliExecutionConfigurationParsingService';
import {
    FromFileExecutionConfigurationProvider
} from './domain/providers/fromFileExecutionConfigurationProvider';
import {
    ExecutionConfigurationMergingService
} from './domain/services/executionConfigurationMergingService';
import { connect } from 'http2';
import { date } from '../../continui-step/dist/definitions/stepOptionType';



const cliRenderers: CliRenderers[] = activationCenter.activator.resolve('cliRenderers');
const cliExecutionConfigurationParsingService: CliExecutionConfigurationParsingService =
    activationCenter.activator
                    .resolve('cliExecutionConfigurationParsingService');
const fromFileExecutionConfigurationProvider: FromFileExecutionConfigurationProvider =
    activationCenter.activator
                    .resolve('fromFileExecutionConfigurationProvider');
const executionConfigurationMergingService: ExecutionConfigurationMergingService = 
    activationCenter.activator
                    .resolve('executionConfigurationMergingService');

                    
const cliExecutionConfiguration: ExecutionConfiguration = 
    cliExecutionConfigurationParsingService.parse(process.argv);
const fromFileExecutionConfiguration : ExecutionConfiguration = 
    fromFileExecutionConfigurationProvider.getFileExecutionConfigration(
        cliExecutionConfiguration.cofigurationFile || './continui.json' // TODO: Fix this magic str
    );
const executionConfiguration: ExecutionConfiguration = 
    executionConfigurationMergingService.mergeExecutionConfigurations(fromFileExecutionConfiguration,
                                                                      cliExecutionConfiguration);

executionConfiguration.cofigurationFile = 'ignore-file-configuration'; // TODO: Fix this magic str

const requestedCliRenderers = cliRenderers.filter(cliRenderer => {
    let isRendererKeyRequested: boolean = false;

    cliRenderer.keys.forEach(cliRedererKey => {
        isRendererKeyRequested = isRendererKeyRequested ||
                                (process.argv.indexOf('-' + cliRedererKey) >= 0 ||
                                 process.argv.indexOf('--' + cliRedererKey) >= 0)
    });

    return isRendererKeyRequested;
});

requestedCliRenderers.forEach(cliRenderer => cliRenderer.render(executionConfiguration) )

if (!requestedCliRenderers.length) {
    continuiApplicationFactory.createsContinuiApplication(executionConfiguration)
                              .execute();
}

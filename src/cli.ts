#!/usr/bin/env node

import { continuiApplicationFactory, activationCenter } from './index';
import { CliArgumentsParsingService } from './domain/services/cliArgumentsParsingService';

const cliArgumentsParsingService: CliArgumentsParsingService = 
    activationCenter.activator
                    .resolve('cliArgumentsParsingService');

continuiApplicationFactory.createsContinuiApplication()
                          .execute(cliArgumentsParsingService.parse(process.argv));

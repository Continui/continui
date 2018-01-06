#!/usr/bin/env node

import { continuiApplicationFactory } from './index';
import { CliArgumentsParsingService } from './services/cliArgumentsParsingService';
import {
    BuildInCliArgumentsParsingService,
} from './build-in/services/buildInCliArgumentsParsingService';

const cliArgumentsParsingService: CliArgumentsParsingService = 
 new BuildInCliArgumentsParsingService();

continuiApplicationFactory.createsContinuiApplication()
                          .execute(cliArgumentsParsingService.parse(process.argv));

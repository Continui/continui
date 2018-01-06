#!/usr/bin/env node

import { continuiApplicationFactory } from './index';

continuiApplicationFactory.createsContinuiApplication().executeInCliMode(process.argv);

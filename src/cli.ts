#!/usr/bin/env node

import { createContinuiApplication, activator } from './index'

createContinuiApplication().executeProccess(require('minimist')(process.argv.slice(2)));
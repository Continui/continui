#!/usr/bin/env node

import { createContinuiApplication } from './index'

createContinuiApplication().execute(require('minimist')(process.argv.slice(2)));
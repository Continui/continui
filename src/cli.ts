#!/usr/bin/env node

import { createContinuiApplication } from './index'

createContinuiApplication().executeFromCli(process.argv.slice(2));
#!/usr/bin/env node

import { createContinuiApplication } from './index'

import * as t from './index'

t.activator = {};

createContinuiApplication().execute(require('minimist')(process.argv.slice(2)));
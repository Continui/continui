#!/usr/bin/env node

import * as cli from 'commander'

const pkg = require('../package.json')

cli
 .version(pkg.version) 
 .option('-h', 'Qloq')
 .option('-ghr-required', 'Qloq con Qloq')
 .parse(process.argv);


console.log(cli);


console.log('you ordered a pizza with:');
if (cli.peppers) console.log('  - peppers');
if (cli.pineapple) console.log('  - pineapple');
if (cli.bbqSauce) console.log('  - bbq');
console.log('  - %s cheese', cli.cheese);
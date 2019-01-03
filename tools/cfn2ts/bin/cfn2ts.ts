#!/usr/bin/env node
import 'source-map-support/register';

import yargs = require('yargs');
import generate from '../lib';

// tslint:disable-next-line:no-unused-expression
const argv =
  yargs.usage('Usage: cfn2ts')
    .option('scope', { type: 'string', desc: 'Scope to generate TypeScript for (e.g: AWS::IAM)', required: true })
    .option('out', { type: 'string', desc: 'Path to the directory where the TypeScript files should be written', default: 'lib' })
    .option('force', { type: 'boolean', desc: 'Generate the spec even if it appears up-to-date', default: false })
    .argv;

generate(argv.scope, argv.out, argv.force).catch(err => {
  // tslint:disable:no-console
  console.error(err);
  // tslint:enable:no-console
  process.exit(1);
});

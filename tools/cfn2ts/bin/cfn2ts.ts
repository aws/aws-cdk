#!/usr/bin/env node
import fs = require('fs-extra');
import yargs = require('yargs');
import generate from '../lib';

/* eslint-disable no-console */
/* eslint-disable max-len */

async function main() {
  const argv = yargs.usage('Usage: cfn2ts')
    .option('scope', { type: 'string', array: true, desc: 'Scope to generate TypeScript for (e.g: AWS::IAM)' })
    .option('out', { type: 'string', desc: 'Path to the directory where the TypeScript files should be written', default: 'lib' })
    .epilog('if --scope is not defined, cfn2ts will try to obtain the scope from the local package.json under the "cdk-build.cloudformation" key.')
    .argv;

  if (!argv.scope) {
    argv.scope = await tryAutoDetectScope();
  }

  if (!argv.scope) {
    throw new Error(`--scope is not provided and cannot be auto-detected from package.json (under "cdk-build.cloudformation")`);
  }

  await generate(argv.scope, argv.out);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

async function tryAutoDetectScope(): Promise<undefined | string[]> {
  if (!await fs.pathExists('./package.json')) {
    return undefined;
  }

  const pkg = await fs.readJSON('./package.json');
  const value = pkg['cdk-build'] && pkg['cdk-build'].cloudformation;
  return value && (typeof value === 'string' ? [value] : value);
}

#!/usr/bin/env node
import * as path from 'path';
import * as yargs from 'yargs';
import { findPackageJsons, ValidationRule } from '../lib';

/* eslint-disable @typescript-eslint/no-shadow */
const argv = yargs
  .usage('$0 [directory]')
  .option('fix', { type: 'boolean', alias: 'f', desc: 'Fix package.json in addition to reporting mistakes' })
  .argv;

// Our version of yargs doesn't support positional arguments yet
const directory = argv._[0] || '.';

if (typeof(directory) !== 'string') {
  throw new Error(`First argument should be a string. Got: ${directory} (${typeof(directory)})`);
}

argv.directory = path.resolve(directory, process.cwd());

async function main(): Promise<void> {
  const ruleClasses = require('../lib/rules'); // eslint-disable-line @typescript-eslint/no-require-imports
  const rules: ValidationRule[] = Object.keys(ruleClasses).map(key => new ruleClasses[key]()).filter(obj => obj instanceof ValidationRule);

  const pkgs = findPackageJsons(argv.directory as string);

  for (const rule of rules) {
    for (const pkg of pkgs.filter(pkg => pkg.shouldApply(rule))) {
      rule.prepare(pkg);
    }
  }
  for (const rule of rules) {
    for (const pkg of pkgs.filter(pkg => pkg.shouldApply(rule))) {
      await rule.validate(pkg);
    }
  }

  if (argv.fix) {
    pkgs.forEach(pkg => pkg.applyFixes());
  }

  pkgs.forEach(pkg => pkg.displayReports(argv.directory as string));

  if (pkgs.some(p => p.hasReports)) {
    throw new Error('Some package.json files had errors');
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

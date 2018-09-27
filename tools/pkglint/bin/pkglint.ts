#!/usr/bin/env node
import yargs = require('yargs');
import { findPackageJsons, PackageJson, ValidationRule } from '../lib';

// tslint:disable:no-shadowed-variable
const argv = yargs
  .usage('$0 [directory]')
  .option('fix', { type: 'boolean', alias: 'f', desc: 'Fix package.json in addition to reporting mistakes'})
  .argv;

// Our version of yargs doesn't support positional arguments yet
argv.directory = argv._[0];

if (argv.directory == null) {
  argv.directory = ".";
}

async function main(): Promise<void> {
  const ruleClasses = require('../lib/rules');
  const rules: ValidationRule[] = Object.keys(ruleClasses).map(key => new ruleClasses[key]()).filter(obj => obj instanceof ValidationRule);

  const pkgs = findPackageJsons(argv.directory).filter(shouldIncludePackage);

  rules.forEach(rule => pkgs.forEach(pkg => rule.prepare(pkg)));
  rules.forEach(rule => pkgs.forEach(pkg => rule.validate(pkg)));

  if (argv.fix) {
    pkgs.forEach(pkg => pkg.applyFixes());
  }

  pkgs.forEach(pkg => pkg.displayReports());

  if (pkgs.some(p => p.hasReports)) {
    throw new Error('Some package.json files had errors');
  }
}

main().catch((e) => {
  // tslint:disable-next-line:no-console
  console.error(e);
  process.exit(1);
});

function shouldIncludePackage(pkg: PackageJson) {
  return !(pkg.json.pkglint && pkg.json.pkglint.ignore);
}

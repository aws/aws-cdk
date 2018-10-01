#!/usr/bin/env node
// Exercise all integ stacks and if they deploy, update the expected synth files
import yargs = require('yargs');
import { IntegrationTests, STATIC_TEST_CONTEXT } from '../lib/integ-helpers';

// tslint:disable:no-console

async function main() {
  const argv = yargs
    .usage('Usage: cdk-integ [TEST...]')
      .option('clean', { type: 'boolean', default: true, desc: 'Skipps stack clean up after test is completed (use --no-clean to negate)' })
      .option('verbose', { type: 'boolean', default: false, alias: 'v', desc: 'Verbose logs' })
      .argv;

  const tests = await new IntegrationTests('test').fromCliArgs(argv._);

  for (const test of tests) {
    console.error(`Trying to deploy ${test.name}`);

    // injects "--verbose" to the command line of "cdk" if we are in verbose mode
    const makeArgs = (...args: string[]) => !argv.verbose ? args : [ '--verbose', ...args ];

    try {
      await test.invoke(makeArgs('deploy'), { verbose: argv.verbose }); // Note: no context, so use default user settings!

      console.error(`Success! Writing out reference synth.`);

      // If this all worked, write the new expectation file
      const actual = await test.invoke(makeArgs('--json', 'synth'), {
        json: true,
        context: STATIC_TEST_CONTEXT,
        verbose: argv.verbose
      });

      await test.writeExpected(actual);
    } finally {
      if (argv.clean) {
        console.error(`Cleaning up.`);
        await test.invoke(['destroy', '--force']);
      } else {
        console.error('Skipping clean up (--no-clean).');
      }
    }
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

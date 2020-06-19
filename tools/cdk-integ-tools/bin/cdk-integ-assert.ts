#!/usr/bin/env node
// Verify that all integration tests still match their expected output
import { diffTemplate, formatDifferences } from '@aws-cdk/cloudformation-diff';
import { DEFAULT_SYNTH_OPTIONS, IntegrationTests } from '../lib/integ-helpers';

// tslint:disable:no-console

async function main() {
  const tests = await new IntegrationTests('test').fromCliArgs(); // always assert all tests
  const failures: string[] = [];

  for (const test of tests) {
    process.stdout.write(`Verifying ${test.name} against ${test.expectedFileName} ... `);

    if (!test.hasExpected()) {
      throw new Error(`No such file: ${test.expectedFileName}. Run 'npm run integ'.`);
    }

    const expected = await test.readExpected();

    const actual = await test.cdkSynthFast(DEFAULT_SYNTH_OPTIONS);

    const diff = diffTemplate(expected, actual);

    if (!diff.isEmpty) {
      failures.push(test.name);
      process.stdout.write('CHANGED.\n');
      formatDifferences(process.stdout, diff);
    } else {
      process.stdout.write('OK.\n');
    }
  }

  if (failures.length > 0) {
    // tslint:disable-next-line:max-line-length
    throw new Error(`Some stacks have changed. To verify that they still deploy successfully, run: 'npm run integ ${failures.join(' ')}'`);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

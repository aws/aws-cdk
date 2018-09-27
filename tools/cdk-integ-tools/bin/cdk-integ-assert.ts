#!/usr/bin/env node
// Verify that all integration tests still match their expected output
import { diffTemplate, formatDifferences } from '@aws-cdk/cloudformation-diff';
import { IntegrationTests, STATIC_TEST_CONTEXT } from '../lib/integ-helpers';

// tslint:disable:no-console

async function main() {
  const tests = await new IntegrationTests('test').fromCliArgs(); // always assert all tests
  const failures: string[] = [];

  for (const test of tests) {
    process.stdout.write(`Verifying ${test.name} against ${test.expectedFileName}... `);

    if (!test.hasExpected()) {
      throw new Error(`No such file: ${test.expectedFileName}. Run 'npm run integ'.`);
    }

    const expected = await test.readExpected();
    const actual = await test.invoke(['--json', 'synth'], { json: true, context: STATIC_TEST_CONTEXT });

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
    throw new Error(`The following integ stacks have changed: ${failures.join(', ')}. Run 'npm run integ' to verify that everything still deploys.`);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

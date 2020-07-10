#!/usr/bin/env node
// Verify that all integration tests still match their expected output
import { canonicalizeStackArtifact } from '@aws-cdk/assert';
import { diffTemplate, formatDifferences } from '@aws-cdk/cloudformation-diff';
import { DEFAULT_SYNTH_OPTIONS, IntegrationTests } from '../lib/integ-helpers';

/* eslint-disable no-console */

const IGNORE_ASSETS_PRAGMA = 'pragma:ignore-assets';

async function main() {
  const tests = await new IntegrationTests('test').fromCliArgs(); // always assert all tests
  const failures: string[] = [];

  for (const test of tests) {
    process.stdout.write(`Verifying ${test.name} against ${test.expectedFileName} ... `);

    if (!test.hasExpected()) {
      throw new Error(`No such file: ${test.expectedFileName}. Run 'npm run integ'.`);
    }

    let expected = await test.readExpected();
    let actual = await test.cdkSynthFast(DEFAULT_SYNTH_OPTIONS);

    if ((await test.pragmas()).includes(IGNORE_ASSETS_PRAGMA)) {
      expected = expected.map(canonicalizeStackArtifact);
      actual = actual.map(canonicalizeStackArtifact);
    }

    let failed = false;
    for (let i = 0; i < Math.max(expected.length, actual.length); i++) {
      const diff = diffTemplate(expected[i].template, actual[i].template);

      if (!diff.isEmpty) {
        formatDifferences(process.stdout, diff);
        failed = true;
      }
    }

    // Hydrating the 'expected' templates will have written a temporary Cloud Assembly. Clean it up.
    for (const art of expected) {
      art.assembly.delete();
    }

    if (failed) {
      failures.push(test.name);
      process.stdout.write('CHANGED.\n');
    } else {
      process.stdout.write('OK.\n');
    }
  }

  if (failures.length > 0) {
    // eslint-disable-next-line max-len
    throw new Error(`Some stacks have changed. To verify that they still deploy successfully, run: 'npm run integ ${failures.join(' ')}'`);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

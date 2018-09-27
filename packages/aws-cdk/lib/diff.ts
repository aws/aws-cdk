import cfnDiff = require('@aws-cdk/cloudformation-diff');
import cxapi = require('@aws-cdk/cx-api');
import colors = require('colors/safe');
import { print } from './logging';

/**
 * Pretty-prints the differences between two template states to the console.
 *
 * @param oldTemplate the old/current state of the stack.
 * @param newTemplate the new/target state of the stack.
 *
 * @returns the count of differences that were rendered.
 */
export function printStackDiff(oldTemplate: any, newTemplate: cxapi.SynthesizedStack): number {
  const diff = cfnDiff.diffTemplate(oldTemplate, newTemplate.template);
  if (!diff.isEmpty) {
    cfnDiff.formatDifferences(process.stderr, diff);
  } else {
    print(colors.green('There were no differences'));
  }
  return diff.count;
}

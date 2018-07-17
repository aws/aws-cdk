import { diffTemplate, formatDifferences } from '@aws-cdk/cdk-cloudformation-diff';
import { SynthesizedStack } from '@aws-cdk/cdk-cx-api';
import * as colors from 'colors/safe';
import { print } from './logging';

/**
 * Pretty-prints the differences between two template states to the console.
 *
 * @param oldTemplate the old/current state of the stack.
 * @param newTemplate the new/target state of the stack.
 *
 * @returns the count of differences that were rendered.
 */
export function printStackDiff(oldTemplate: any, newTemplate: SynthesizedStack): number {
    const diff = diffTemplate(oldTemplate, newTemplate.template);
    if (!diff.isEmpty) {
        formatDifferences(process.stderr, diff);
    } else {
        print(colors.green('There were no differences'));
    }
    return diff.count;
}

import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Verifies that MAX_RESOURCE_LIMIT is not enforced on nested stacks.
 *
 * See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cloudformation-limits.html
 */

const app = new cdk.App();

const parent = new cdk.Stack(app, 'Parent');
const child = new cdk.NestedStack(parent, 'Child');

const waitConditionHandle = new cdk.CfnWaitConditionHandle(child, 'WaitConditionHandle');

for (let i = 0; i < 510; i++) {
  new cdk.CfnWaitCondition(child, `ExampleResource-${i}`, {
    count: 0,
    handle: waitConditionHandle.ref,
    timeout: '1',
  });
}

new IntegTest(app, 'integ-nested-stack', {
  testCases: [parent],
});
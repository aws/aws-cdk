// Creates a default group, with no users and no policy attached.

import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Group } from 'aws-cdk-lib/aws-iam';

const app = new App();

const stack = new Stack(app, 'integ-iam-role-1');

new Group(stack, 'MyGroup');

new IntegTest(app, 'iam-role-1', {
  testCases: [stack],
});

app.synth();

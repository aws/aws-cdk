// Creates a default group, with no users and no policy attached.

import { App, Stack } from '../../core';
import { IntegTest } from '../../integ-tests';
import { Group } from '../lib';

const app = new App();

const stack = new Stack(app, 'integ-iam-role-1');

new Group(stack, 'MyGroup');

new IntegTest(app, 'iam-role-1', {
  testCases: [stack],
});

app.synth();

// Creates a default group, with no users and no policy attached.

import { Group } from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/core';

const app = new App();

const stack = new Stack(app, 'integ-iam-role-1');

new Group(stack, 'MyGroup');

app.synth();

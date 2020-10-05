// Creates a default group, with no users and no policy attached.

import { App, Stack } from '@aws-cdk/core';
import { Group } from '../lib';

const app = new App();

const stack = new Stack(app, 'integ-iam-role-1');

new Group(stack, 'MyGroup');

app.synth();

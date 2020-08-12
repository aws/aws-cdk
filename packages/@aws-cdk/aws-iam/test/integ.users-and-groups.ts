import { App, Stack } from '@aws-cdk/core';
import { Group, Policy, PolicyStatement, User } from '../lib';

const app = new App();

const stack = new Stack(app, 'integ-iam-role-1');

const g1 = new Group(stack, 'MyGroup');
const g2 = new Group(stack, 'YourGroup');

for (let i = 0; i < 5; ++i) {
  const user = new User(stack, `User${i + 1}`);
  user.addToGroup(g1);
  g2.addUser(user);
}

const policy = new Policy(stack, 'MyPolicy');
policy.attachToGroup(g1);
policy.addStatements(new PolicyStatement({
  resources: [g2.groupArn],
  actions: ['iam:*'],
}));

app.synth();

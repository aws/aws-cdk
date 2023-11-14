import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Group, Policy, PolicyStatement, User } from 'aws-cdk-lib/aws-iam';

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

new IntegTest(app, 'iam-role-test', {
  testCases: [stack],
});

app.synth();

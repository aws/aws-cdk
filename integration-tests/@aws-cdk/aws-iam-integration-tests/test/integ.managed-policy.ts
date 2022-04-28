import { ManagedPolicy, PolicyStatement, User } from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/core';

const app = new App();

const stack = new Stack(app, 'aws-cdk-iam-managed-policy');

const user = new User(stack, 'MyUser');

const policy = new ManagedPolicy(stack, 'OneManagedPolicy', {
  managedPolicyName: 'Default',
  description: 'My Policy',
  path: '/some/path/',
});
policy.addStatements(new PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));
policy.attachToUser(user);

const policy2 = new ManagedPolicy(stack, 'TwoManagedPolicy');
policy2.addStatements(new PolicyStatement({ resources: ['*'], actions: ['lambda:InvokeFunction'] }));
user.addManagedPolicy(policy2);

const policy3 = ManagedPolicy.fromAwsManagedPolicyName('SecurityAudit');
user.addManagedPolicy(policy3);

app.synth();

import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { AnyPrincipal, ManagedPolicy, PolicyStatement, Role } from '../lib';
import { User } from '../lib/user';

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

const role = new Role(stack, 'Role', { assumedBy: new AnyPrincipal() });
role.grantAssumeRole(policy);

new IntegTest(app, 'ManagedPolicyInteg', {
  testCases: [stack],
});

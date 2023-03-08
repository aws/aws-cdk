import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { AccountRootPrincipal, Grant, Policy, PolicyStatement, Role, User } from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-cdk-iam-policy');

const user = new User(stack, 'MyUser');

const policy = new Policy(stack, 'HelloPolicy', { policyName: 'Default' });
policy.addStatements(new PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));
policy.attachToUser(user);

const policy2 = new Policy(stack, 'GoodbyePolicy');
policy2.addStatements(new PolicyStatement({ resources: ['*'], actions: ['lambda:InvokeFunction'] }));
policy2.attachToUser(user);

const role = new Role(stack, 'Role', { assumedBy: new AccountRootPrincipal() });
role.grantAssumeRole(policy.grantPrincipal);
Grant.addToPrincipal({ actions: ['iam:*'], resourceArns: [role.roleArn], grantee: policy2 });

new IntegTest(app, 'PolicyInteg', {
  testCases: [stack],
});

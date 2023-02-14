import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { AccountRootPrincipal, OrganizationPrincipal, Policy, PolicyStatement, Role, ServicePrincipal } from '../lib';

const app = new App();

const stack = new Stack(app, 'integ-iam-role-1');

const role = new Role(stack, 'TestRole', {
  assumedBy: new ServicePrincipal('sqs.amazonaws.com'),
});

role.addToPolicy(new PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));

const policy = new Policy(stack, 'HelloPolicy', { policyName: 'Default' });
policy.addStatements(new PolicyStatement({ actions: ['ec2:*'], resources: ['*'] }));
policy.attachToRole(role);

// Role with an external ID
new Role(stack, 'TestRole2', {
  assumedBy: new AccountRootPrincipal(),
  externalIds: ['supply-me'],
});

// Role with an org
new Role(stack, 'TestRole3', {
  assumedBy: new OrganizationPrincipal('o-1234'),
});

new IntegTest(app, 'integ-iam-role', {
  testCases: [stack],
});

app.synth();

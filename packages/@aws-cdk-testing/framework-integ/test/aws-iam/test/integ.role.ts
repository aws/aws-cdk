import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AccountRootPrincipal, OrganizationPrincipal, Policy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

const app = new App();

const stack = new Stack(app, 'integ-iam-role-1');

const role = new Role(stack, 'TestRole', {
  assumedBy: new ServicePrincipal('sqs.amazonaws.com'),
});

role.addToPolicy(new PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));

const policy = new Policy(stack, 'HelloPolicy', { policyName: 'Default' });
policy.addStatements(new PolicyStatement({ actions: ['ec2:*'], resources: ['*'] }));
policy.attachToRole(role);

// Idempotent with imported roles, see https://github.com/aws/aws-cdk/issues/28101
const importedRole = Role.fromRoleArn(stack, 'TestImportedRole', role.roleArn);
policy.attachToRole(importedRole);

// Ensure immutable role is not attached to policy, see https://github.com/aws/aws-cdk/issues/38103
const role2 = new Role(stack, 'Role2', { assumedBy: new AccountRootPrincipal() });
const immutableImportedRole = Role.fromRoleArn(stack, 'ImportedRole', role2.roleArn, { mutable: false });
policy.attachToRole(immutableImportedRole);

// Role with an external ID
new Role(stack, 'TestRole2', {
  assumedBy: new AccountRootPrincipal(),
  externalIds: ['supply-me'],
});

// Role with an org
new Role(stack, 'TestRole3', {
  assumedBy: new OrganizationPrincipal('o-12345abcde'),
});

new IntegTest(app, 'integ-iam-role', {
  testCases: [stack],
});

app.synth();

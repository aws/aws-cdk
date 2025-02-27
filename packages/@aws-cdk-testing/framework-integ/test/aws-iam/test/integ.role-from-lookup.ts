import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Policy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

const app = new App();
const roleName = 'MyLookupTestRole';

const stack = new Stack(app, 'Stack', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

new Role(stack, 'Role', {
  roleName,
  assumedBy: new ServicePrincipal('sqs.amazonaws.com'),
});

const lookupStack = new Stack(app, 'LookupStack', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

const lookupRole = Role.fromLookup(lookupStack, 'LookupRole', {
  roleName,
});

const policy = new Policy(lookupStack, 'HelloPolicy', { policyName: 'Default' });
policy.addStatements(new PolicyStatement({ actions: ['ec2:*'], resources: ['*'] }));
policy.attachToRole(lookupRole);

new IntegTest(app, 'integ-iam-role-from-lookup', {
  testCases: [lookupStack],
});

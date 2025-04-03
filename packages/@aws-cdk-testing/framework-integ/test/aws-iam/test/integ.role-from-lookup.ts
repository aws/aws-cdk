import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Policy, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';

/*
 * To run this integ test, create an IAM Role with the name `MyLookupTestRole` in your AWS account beforehand.
 *
 * ```bash
 * aws iam create-role --role-name MyLookupTestRole --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"sqs.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
 * ```
 */
const roleName = 'MyLookupTestRole';

const app = new App();

const stack = new Stack(app, 'LookupRoleStack', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

const lookupRole = Role.fromLookup(stack, 'LookupRole', {
  roleName,
});

const policy = new Policy(stack, 'HelloPolicy', { policyName: 'Default' });
policy.addStatements(new PolicyStatement({ actions: ['ec2:*'], resources: ['*'] }));
policy.attachToRole(lookupRole);

new CfnOutput(stack, 'LookupRoleName', { value: lookupRole.roleName });

new IntegTest(app, 'integ-iam-role-from-lookup', {
  enableLookups: true,
  stackUpdateWorkflow: false,
  testCases: [stack],
});

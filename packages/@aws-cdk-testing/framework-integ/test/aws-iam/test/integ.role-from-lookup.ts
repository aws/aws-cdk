import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Policy, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';

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
  // create the role before the test and delete it after
  hooks: {
    preDeploy: [`aws iam create-role --role-name ${roleName} --assume-role-policy-document file://policy-document.json`],
    postDestroy: [`aws iam delete-role --role-name ${roleName}`],
  },
});

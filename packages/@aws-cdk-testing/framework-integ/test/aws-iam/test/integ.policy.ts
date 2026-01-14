import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AccountRootPrincipal, Grant, Policy, PolicyStatement, Role, User } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';

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
role.grantAssumeRole(user);

Grant.addToPrincipal({ actions: ['iam:*'], resourceArns: [role.roleArn], grantee: policy2 });

// Can be passed to grantInvoke, see https://github.com/aws/aws-cdk/issues/32980
const func = new lambda.Function(stack, 'Function', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  code: lambda.Code.fromInline('export const handler = async () => null'),
});
func.grantInvoke(policy);

new IntegTest(app, 'PolicyInteg', {
  testCases: [stack],
});

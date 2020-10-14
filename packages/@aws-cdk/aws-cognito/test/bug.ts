import { PolicyStatement } from '@aws-cdk/aws-iam';
// import { PolicyStatement } from '@aws-cdk/aws-iam';
// import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
// eslint-disable-next-line no-duplicate-imports
import { Code, Runtime } from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import { UserPool } from '../lib';

const app = new App();
const stack = new Stack(app, 'why-so-circular');

const fn = new lambda.Function(stack, 'fn', {
  code: Code.fromInline('foo'),
  runtime: Runtime.NODEJS_12_X,
  handler: 'index.handler',
});

const userpool = new UserPool(stack, 'pool', {
  lambdaTriggers: {
    postAuthentication: fn,
  },
});

const postAuthPermissionPolicy = new PolicyStatement({
  actions: ['cognito-idp:AdminDeleteUserAttributes', 'cognito-idp:AdminAddUserToGroup'],
  resources: [userpool.userPoolArn],
});
// now give the postAuthentication lambda permission to change things
fn.addToRolePolicy(postAuthPermissionPolicy);

// fn.role?.attachInlinePolicy(new Policy(stack, 'userpool-policy', {
//   statements: [new PolicyStatement({
//     actions: ['cognito-idp:DescribeUserPool'],
//     resources: [userpool.userPoolArn],
//   })],
// }));

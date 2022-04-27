import { UserPool } from '@aws-cdk/aws-cognito';
import { App, CfnOutput, RemovalPolicy, Stack } from '@aws-cdk/core';

const app = new App();
const stack = new Stack(app, 'integ-user-pool');

const userpool = new UserPool(stack, 'myuserpool', {
  userPoolName: 'MyUserPool',
  removalPolicy: RemovalPolicy.DESTROY,
});

new CfnOutput(stack, 'user-pool-id', {
  value: userpool.userPoolId,
});
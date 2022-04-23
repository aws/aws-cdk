import { App, CfnOutput, RemovalPolicy, Stack } from '@aws-cdk/core';
import { UserPool, UserPoolEmail } from '../lib';


const app = new App();
const stack = new Stack(app, 'integ-user-pool-signup-code');

const userpool = new UserPool(stack, 'myuserpool', {
  removalPolicy: RemovalPolicy.DESTROY,
  userPoolName: 'MyUserPool',
  email: UserPoolEmail.withSES({
    sesRegion: 'us-east-1',
    fromEmail: 'noreply@example.com',
    replyTo: 'support@example.com',
    sesVerifiedDomain: 'example.com',
  }),
});

new CfnOutput(stack, 'user-pool-id', {
  value: userpool.userPoolId,
});

app.synth();

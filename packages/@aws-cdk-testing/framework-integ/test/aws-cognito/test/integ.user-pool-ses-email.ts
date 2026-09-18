import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { UserPool, UserPoolEmail } from 'aws-cdk-lib/aws-cognito';

const app = new App();
const stack = new Stack(app, 'integ-user-ses-email');

const userpool = new UserPool(stack, 'myuserpool', {
  removalPolicy: RemovalPolicy.DESTROY,
  userPoolName: 'MyUserPool',
  email: UserPoolEmail.withSES({
    sesRegion: 'us-east-1',
    fromEmail: 'noreply@example.com',
    fromName: 'myname@mycompany.com',
    replyTo: 'support@example.com',
    sesVerifiedDomain: 'example.com',
  }),
});

new CfnOutput(stack, 'user-pool-id', {
  value: userpool.userPoolId,
});

// The local part ('noreply') is ASCII so it passes validation, while the
// non-ASCII (internationalized) domain — here a fully Japanese domain — is
// punycode-encoded (xn--) in the synthesized template.
const idnUserpool = new UserPool(stack, 'idnuserpool', {
  removalPolicy: RemovalPolicy.DESTROY,
  userPoolName: 'MyIdnUserPool',
  email: UserPoolEmail.withSES({
    sesRegion: 'us-east-1',
    fromEmail: 'noreply@ドメイン.テスト',
  }),
});

new CfnOutput(stack, 'idn-user-pool-id', {
  value: idnUserpool.userPoolId,
});

new IntegTest(app, 'IntegTest', { testCases: [stack] });

import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { FeaturePlan, PasskeyUserVerification, UserPool } from 'aws-cdk-lib/aws-cognito';

const app = new App();
const stack = new Stack(app, 'integ-user-pool-passwordless');

const userpool = new UserPool(stack, 'myuserpool', {
  allowedFirstAuthFactors: { emailOtp: true, passkey: true },
  passkeyRelyingPartyId: 'example.com',
  passkeyUserVerification: PasskeyUserVerification.REQUIRED,
  removalPolicy: RemovalPolicy.DESTROY,
  deletionProtection: false,
});

new UserPool(stack, 'myuserpool-disabled-passwordless', {
  allowedFirstAuthFactors: { password: true },
  featurePlan: FeaturePlan.LITE,
  removalPolicy: RemovalPolicy.DESTROY,
  deletionProtection: false,
});

new CfnOutput(stack, 'user-pool-passwordless', {
  value: userpool.userPoolId,
});

new IntegTest(app, 'IntegTest', { testCases: [stack] });

import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AdvancedSecurityMode, FeaturePlan, Mfa, UserPool, UserPoolEmail } from 'aws-cdk-lib/aws-cognito';

/**
 * Before you run test, you must set up SES email identity and set domain to domainName.
 */
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new Error('For this test you must provide your own DomainName as an env var "DOMAIN_NAME".');

const app = new App();
const stack = new Stack(app, 'integ-user-email-mfa');

const userpool = new UserPool(stack, 'myuserpool', {
  removalPolicy: RemovalPolicy.DESTROY,
  userPoolName: 'MyUserPool',
  email: UserPoolEmail.withSES({
    sesRegion: 'us-east-1',
    fromEmail: `noreply@${domainName}`,
    fromName: 'myname@mycompany.com',
    replyTo: `support@${domainName}`,
    sesVerifiedDomain: domainName,
  }),
  mfa: Mfa.REQUIRED,
  mfaSecondFactor: {
    sms: true,
    otp: false,
    email: true,
  },
  advancedSecurityMode: AdvancedSecurityMode.ENFORCED,
  featurePlan: FeaturePlan.PLUS,
});

new CfnOutput(stack, 'user-pool-id', {
  value: userpool.userPoolId,
});

new IntegTest(app, 'integ-user-email-mfa-test', {
  testCases: [stack],
  enableLookups: true,
  stackUpdateWorkflow: false,
});

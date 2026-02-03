import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { UserPool, VerificationEmailStyle } from 'aws-cdk-lib/aws-cognito';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'integ-user-pool-link-custom-placeholder');

const userpool = new UserPool(stack, 'myuserpool', {
  userPoolName: 'MyUserPool',
  removalPolicy: RemovalPolicy.DESTROY,
  deletionProtection: false,
  userVerification: {
    emailStyle: VerificationEmailStyle.LINK,
    emailSubject: 'Invite to join our awesome app!',
    emailBody: 'You have been invited to join our awesome app! {##Click here to verify your email##}',
  },
});

new CfnOutput(stack, 'user-pool-id', {
  value: userpool.userPoolId,
});

new IntegTest(app, 'user-pool-link-custom-placeholder-integ-test', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});

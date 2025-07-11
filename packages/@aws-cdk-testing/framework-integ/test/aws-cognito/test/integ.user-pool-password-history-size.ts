import { App, Stack } from 'aws-cdk-lib';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'integ-user-pool-password-history-size');

new UserPool(stack, 'Pool', {
  passwordPolicy: {
    passwordHistorySize: 3,
  },
});

new integ.IntegTest(app, 'password-history-size-test', {
  testCases: [stack],
});

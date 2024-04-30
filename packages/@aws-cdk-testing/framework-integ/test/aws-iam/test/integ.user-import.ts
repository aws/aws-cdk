import {
  App, Stack, CfnParameter,
  aws_iam as iam,
  CfnOutput,
} from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'dummy-stack');

const userArn = 'arn:aws:iam::123456789012:user/OthersExternalIamUser';

const userparam = new CfnParameter(stack, 'UserParameter', {
  default: userArn,
});

const imported = iam.User.fromUserArn(stack, 'imported-user', userArn);
const imported2 = iam.User.fromUserArn(stack, 'imported-user2', userparam.valueAsString );

// should be 123456789012
new CfnOutput(stack, 'User', { value: imported.principalAccount! });
// should be 123456789012
new CfnOutput(stack, 'User2', { value: imported2.principalAccount! });

new IntegTest(stack, 'integ-test', {
  testCases: [stack],
});
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
const imported3 = iam.User.fromUserArn(stack, 'LocalUser', new iam.User(stack, 'User').userArn);

// should be 123456789012
new CfnOutput(stack, 'UserOutput', { value: imported.principalAccount! });
// should be 123456789012
new CfnOutput(stack, 'User2Output', { value: imported2.principalAccount! });
// should be your current account
new CfnOutput(stack, 'User3Output', { value: imported3.principalAccount! });

new IntegTest(stack, 'integ-test', {
  testCases: [stack],
});

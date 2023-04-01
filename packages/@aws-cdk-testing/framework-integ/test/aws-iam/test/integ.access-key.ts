import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AccessKey, User } from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'integ-iam-access-key-1');

const user = new User(stack, 'TestUser');
const accessKey = new AccessKey(stack, 'TestAccessKey', { user });

new CfnOutput(stack, 'AccessKeyId', { value: accessKey.accessKeyId });

new IntegTest(app, 'iam-access-key-1', {
  testCases: [stack],
});

app.synth();

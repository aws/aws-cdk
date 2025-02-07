import { App, Stack } from 'aws-cdk-lib';
import { Stream } from 'aws-cdk-lib/aws-kinesis';
import { AccountPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'kinesis-resource-policy');

const stream = new Stream(stack, 'MyStream');

stream.addToResourcePolicy(new PolicyStatement({
  resources: [stream.streamArn],
  actions: [
    'kinesis:DescribeStreamSummary',
    'kinesis:GetRecords',
  ],
  principals: [new AccountPrincipal(stack.account)],
}));

new IntegTest(app, 'integ-kinesis-resource-policy', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});

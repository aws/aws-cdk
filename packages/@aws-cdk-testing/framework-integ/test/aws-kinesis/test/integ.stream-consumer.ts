import { App, Stack } from 'aws-cdk-lib';
import { Stream, StreamConsumer } from 'aws-cdk-lib/aws-kinesis';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Role, AccountRootPrincipal } from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'kinesis-stream-consumer');

const stream = new Stream(stack, 'Stream');

const streamConsumer = new StreamConsumer(stack, 'StreamConsumer', {
  streamConsumerName: 'stream-consumer',
  stream: stream,
});

const role = new Role(stack, 'Role', {
  assumedBy: new AccountRootPrincipal(),
});

streamConsumer.grantRead(role);

new IntegTest(app, 'integ-kinesis-stream-consumer', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});

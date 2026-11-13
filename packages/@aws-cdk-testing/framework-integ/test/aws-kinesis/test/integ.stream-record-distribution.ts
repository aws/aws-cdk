import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { RecordDistributionStrategy, Stream, StreamMode } from 'aws-cdk-lib/aws-kinesis';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'integ-kinesis-stream-record-distribution');

new Stream(stack, 'AutoDistributionStream', {
  streamMode: StreamMode.ON_DEMAND,
  recordDistributionStrategy: RecordDistributionStrategy.AUTO,
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'KinesisStreamRecordDistribution', {
  testCases: [stack],
});

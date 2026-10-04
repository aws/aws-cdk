import { App, Stack, RemovalPolicies } from 'aws-cdk-lib';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'kinesis-stream-shard-level-monitoring-stack');

const explicitStream = new kinesis.Stream(stack, 'ExplicitStream', {
  shardLevelMetrics: [
    kinesis.ShardLevelMetrics.INCOMING_BYTES,
    kinesis.ShardLevelMetrics.INCOMING_RECORDS,
    kinesis.ShardLevelMetrics.ITERATOR_AGE_MILLISECONDS,
    kinesis.ShardLevelMetrics.OUTGOING_BYTES,
    kinesis.ShardLevelMetrics.OUTGOING_RECORDS,
    kinesis.ShardLevelMetrics.WRITE_PROVISIONED_THROUGHPUT_EXCEEDED,
    kinesis.ShardLevelMetrics.READ_PROVISIONED_THROUGHPUT_EXCEEDED,
  ],
});

const allStream = new kinesis.Stream(stack, 'AllStream', {
  shardLevelMetrics: [kinesis.ShardLevelMetrics.ALL],
});

RemovalPolicies.of(stack).destroy();

const integ = new IntegTest(app, 'integ-kinesis-stream-consumer', {
  testCases: [stack],
});

const streams = [explicitStream, allStream];
streams.forEach((stream) => {
  integ.assertions.awsApiCall('Kinesis', 'describeStream', {
    StreamName: stream.streamName,
  }).expect(ExpectedResult.objectLike({
    StreamDescription: {
      ShardLevelMetrics: [
        'IncomingBytes',
        'IncomingRecords',
        'IteratorAgeMilliseconds',
        'OutgoingBytes',
        'OutgoingRecords',
        'WriteProvisionedThroughputExceeded',
        'ReadProvisionedThroughputExceeded',
      ],
    },
  }));
});

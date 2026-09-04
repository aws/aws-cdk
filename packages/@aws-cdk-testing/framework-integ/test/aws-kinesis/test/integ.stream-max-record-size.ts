import { App, RemovalPolicies, Size, Stack } from 'aws-cdk-lib';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'kinesis-stream-max-record-size-stack');

const provisionedStream = new kinesis.Stream(stack, 'ProvisionedStream', {
  streamMode: kinesis.StreamMode.PROVISIONED,
  shardCount: 1,
  maxRecordSize: Size.mebibytes(10),
});

// `maxRecordSize` is accepted for on-demand streams as well, and does not have to be a whole
// number of mebibytes.
const onDemandStream = new kinesis.Stream(stack, 'OnDemandStream', {
  streamMode: kinesis.StreamMode.ON_DEMAND,
  maxRecordSize: Size.kibibytes(1536),
});

RemovalPolicies.of(stack).destroy();

const integ = new IntegTest(app, 'integ-kinesis-stream-max-record-size', {
  testCases: [stack],
});

integ.assertions.awsApiCall('Kinesis', 'describeStreamSummary', {
  StreamName: provisionedStream.streamName,
}).expect(ExpectedResult.objectLike({
  StreamDescriptionSummary: {
    MaxRecordSizeInKiB: 10240,
  },
}));

integ.assertions.awsApiCall('Kinesis', 'describeStreamSummary', {
  StreamName: onDemandStream.streamName,
}).expect(ExpectedResult.objectLike({
  StreamDescriptionSummary: {
    MaxRecordSizeInKiB: 1536,
  },
}));

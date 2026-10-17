import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-firehose-dynamic-partitioning-inline');

const bucket = new s3.Bucket(stack, 'Bucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const stream = new firehose.DeliveryStream(stack, 'DeliveryStream', {
  destination: new firehose.S3Bucket(bucket, {
    bufferingInterval: cdk.Duration.seconds(60),
    dynamicPartitioning: { enabled: true },
    processors: [
      firehose.RecordDeAggregationProcessor.json(),
      firehose.MetadataExtractionProcessor.jq16({
        key1: '.foo',
        key2: '.bar.baz|ascii_upcase',
      }),
    ],
    dataOutputPrefix: 'key1=!{partitionKeyFromQuery:key1}/key2=!{partitionKeyFromQuery:key2}/',
    errorOutputPrefix: 'error-output/!{firehose:error-output-type}/',
  }),
  encryption: firehose.StreamEncryption.awsOwnedKey(),
});

const integTest = new integ.IntegTest(app, 'integ-tests', {
  testCases: [stack],
});

const records = [
  '{"foo":"recordA","bar":{"baz":"Partition1","blah":"blah"},"data":"data1"}',
  '{"foo":"recordB","bar":{"baz":"Partition2","blah":"quux"},"data":"data2"}',
  '{"data":"data3"}',
];

integTest.assertions.awsApiCall('firehose', 'putRecord', {
  DeliveryStreamName: stream.deliveryStreamName,
  Record: {
    Data: records.join(''),
  },
});

[
  'key1=recordA/key2=PARTITION1/',
  'key1=recordB/key2=PARTITION2/',
  'error-output/metadata-extraction-failed/',
].forEach((prefix) => {
  const s3ApiCall = integTest.assertions.awsApiCall('s3', 'listObjectsV2', {
    Bucket: bucket.bucketName,
    Prefix: prefix,
    MaxKeys: 1,
  }).expect(integ.ExpectedResult.objectLike({
    KeyCount: 1,
  })).waitForAssertions({
    interval: cdk.Duration.seconds(30),
    totalTimeout: cdk.Duration.minutes(10),
  });
  if (s3ApiCall instanceof integ.AwsApiCall) {
    s3ApiCall.waiterProvider?.addToRolePolicy({
      Effect: 'Allow',
      Action: ['s3:GetObject', 's3:ListBucket'],
      Resource: ['*'],
    });
  }
});

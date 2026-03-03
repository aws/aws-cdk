import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-firehose-dynamic-partitioning-lambda');

const bucket = new s3.Bucket(stack, 'Bucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const lambdaProcessor = new lambda.Function(stack, 'LambdaProcessor', {
  code: lambda.Code.fromInline(`
    exports.handler = async (event) => {
      console.log(event);
      const result = { records: [] };
      for (const record of event.records) {
        const payload = JSON.parse(Buffer.from(record.data, 'base64').toString('ascii'));
        const partitionKeys = {
          key1: payload.foo,
          key2: payload.bar?.baz?.toUpperCase(),
        };
        result.records.push({
          recordId: record.recordId,
          data: record.data,
          result: 'Ok',
          metadata: { partitionKeys },
        });
      }
      console.log(result);
      return result;
    };
  `),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_24_X,
  architecture: lambda.Architecture.ARM_64,
  loggingFormat: lambda.LoggingFormat.JSON,
});

const stream = new firehose.DeliveryStream(stack, 'DeliveryStream', {
  destination: new firehose.S3Bucket(bucket, {
    bufferingInterval: cdk.Duration.seconds(60),
    dynamicPartitioning: { enabled: true },
    processors: [
      firehose.RecordDeAggregationProcessor.json(),
      new firehose.LambdaFunctionProcessor(lambdaProcessor),
    ],
    dataOutputPrefix: 'key1=!{partitionKeyFromLambda:key1}/key2=!{partitionKeyFromLambda:key2}/',
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
  'error-output/partitioning-failed/',
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

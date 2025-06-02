#!/usr/bin/env node
import * as path from 'path';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { AwsApiCall, ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-firehose-delivery-stream-s3-all-properties');

const bucket = new s3.Bucket(stack, 'FirehoseDeliveryStreamS3AllPropertiesBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const backupBucket = new s3.Bucket(stack, 'FirehoseDeliveryStreamS3AllPropertiesBackupBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
const logGroup = new logs.LogGroup(stack, 'LogGroup', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const dataProcessorFunction = new lambdanodejs.NodejsFunction(stack, 'DataProcessorFunction', {
  entry: path.join(__dirname, 'lambda-data-processor.js'),
  timeout: cdk.Duration.minutes(1),
});

const processor = new firehose.LambdaFunctionProcessor(dataProcessorFunction, {
  bufferInterval: cdk.Duration.seconds(60),
  bufferSize: cdk.Size.mebibytes(1),
  retries: 1,
});

const key = new kms.Key(stack, 'Key', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const backupKey = new kms.Key(stack, 'BackupKey', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const deliveryStream = new firehose.DeliveryStream(stack, 'DeliveryStream', {
  destination: new firehose.S3Bucket(bucket, {
    loggingConfig: new firehose.EnableLogging(logGroup),
    processor: processor,
    compression: firehose.Compression.GZIP,
    dataOutputPrefix: 'regularPrefix',
    errorOutputPrefix: 'errorPrefix',
    fileExtension: '.log.gz',
    bufferingInterval: cdk.Duration.seconds(60),
    bufferingSize: cdk.Size.mebibytes(1),
    encryptionKey: key,
    s3Backup: {
      mode: firehose.BackupMode.ALL,
      bucket: backupBucket,
      compression: firehose.Compression.ZIP,
      dataOutputPrefix: 'backupPrefix',
      errorOutputPrefix: 'backupErrorPrefix',
      bufferingInterval: cdk.Duration.seconds(60),
      bufferingSize: cdk.Size.mebibytes(1),
      encryptionKey: backupKey,
    },
  }),
});

new firehose.DeliveryStream(stack, 'ZeroBufferingDeliveryStream', {
  destination: new firehose.S3Bucket(bucket, {
    compression: firehose.Compression.GZIP,
    dataOutputPrefix: 'regularPrefix',
    errorOutputPrefix: 'errorPrefix',
    bufferingInterval: cdk.Duration.seconds(0),
  }),
});

const testCase = new IntegTest(app, 'integ-tests', {
  testCases: [stack],
  regions: ['us-east-1'],
});

testCase.assertions.awsApiCall('Firehose', 'putRecord', {
  DeliveryStreamName: deliveryStream.deliveryStreamName,
  Record: {
    Data: 'testData123',
  },
});

const s3ApiCall = testCase.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: bucket.bucketName,
  MaxKeys: 1,
}).expect(ExpectedResult.objectLike({
  KeyCount: 1,
})).waitForAssertions({
  interval: cdk.Duration.seconds(30),
  totalTimeout: cdk.Duration.minutes(10),
});

if (s3ApiCall instanceof AwsApiCall && s3ApiCall.waiterProvider) {
  s3ApiCall.waiterProvider.addToRolePolicy({
    Effect: 'Allow',
    Action: ['s3:GetObject', 's3:ListBucket'],
    Resource: ['*'],
  });
}

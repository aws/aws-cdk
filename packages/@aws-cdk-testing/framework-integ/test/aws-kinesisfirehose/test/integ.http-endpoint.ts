#!/usr/bin/env node
import * as path from 'path';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
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

const stack = new cdk.Stack(app, 'aws-cdk-firehose-http-destination');
cdk.RemovalPolicies.of(stack).destroy();

const destinationBucket = new s3.Bucket(stack, 'DestinationBucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const destinationFunction = new lambdanodejs.NodejsFunction(stack, 'DestinationFunction', {
  entry: path.join(__dirname, 'http-endpoint-destination.js'),
  timeout: cdk.Duration.minutes(1),
  environment: { BUCKET_NAME: destinationBucket.bucketName },
});
destinationBucket.grantWrite(destinationFunction);
const destinationFunctionUrl = destinationFunction.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.NONE,
});
const destinationLogGroup = new logs.LogGroup(stack, 'DestinationLogGroup');

const backupBucket = new s3.Bucket(stack, 'BackupBucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const backupLogGroup = new logs.LogGroup(stack, 'BackupLogGroup');
const backupKey = new kms.Key(stack, 'BackupKey');

const dataProcessorFunction = new lambdanodejs.NodejsFunction(stack, 'DataProcessorFunction', {
  entry: path.join(__dirname, 'lambda-data-processor.js'),
  timeout: cdk.Duration.minutes(1),
});

const processor = new firehose.LambdaFunctionProcessor(dataProcessorFunction, {
  bufferInterval: cdk.Duration.seconds(60),
  bufferSize: cdk.Size.mebibytes(1),
  retries: 1,
});

const deliveryStream = new firehose.DeliveryStream(stack, 'DeliveryStream', {
  destination: new firehose.HttpEndpoint({
    url: destinationFunctionUrl.url,
    name: 'MyDestinationName',
    loggingConfig: new firehose.EnableLogging(destinationLogGroup),
    processors: [processor],
    bufferingInterval: cdk.Duration.seconds(60),
    bufferingSize: cdk.Size.mebibytes(1),
    s3Backup: {
      mode: firehose.BackupMode.ALL,
      bucket: backupBucket,
      loggingConfig: new firehose.EnableLogging(backupLogGroup),
      compression: firehose.Compression.ZIP,
      dataOutputPrefix: 'backupPrefix/',
      errorOutputPrefix: 'backupErrorPrefix/',
      bufferingInterval: cdk.Duration.seconds(60),
      bufferingSize: cdk.Size.mebibytes(1),
      encryptionKey: backupKey,
    },
  }),
  encryption: firehose.StreamEncryption.awsOwnedKey(),
});

const testCase = new IntegTest(app, 'integ-tests', {
  testCases: [stack],
  regions: ['us-east-1'],
});

testCase.assertions.awsApiCall('firehose', 'PutRecord', {
  DeliveryStreamName: deliveryStream.deliveryStreamName,
  Record: {
    Data: 'testData123',
  },
});

const s3ApiCallOnDestination = testCase.assertions.awsApiCall('s3', 'ListObjectsV2', {
  Bucket: destinationBucket.bucketName,
  MaxKeys: 10,
}).expect(ExpectedResult.objectLike({
  KeyCount: 1,
})).waitForAssertions({
  interval: cdk.Duration.seconds(30),
  totalTimeout: cdk.Duration.minutes(10),
});

if (s3ApiCallOnDestination instanceof AwsApiCall) {
  s3ApiCallOnDestination.waiterProvider?.addToRolePolicy({
    Effect: 'Allow',
    Action: ['s3:GetObject', 's3:ListBucket'],
    Resource: ['*'],
  });
}

const s3ApiCallOnBackup = testCase.assertions.awsApiCall('s3', 'ListObjectsV2', {
  Bucket: backupBucket.bucketName,
  MaxKeys: 10,
}).expect(ExpectedResult.objectLike({
  KeyCount: 1,
})).waitForAssertions({
  interval: cdk.Duration.seconds(30),
  totalTimeout: cdk.Duration.minutes(10),
});

if (s3ApiCallOnBackup instanceof AwsApiCall) {
  s3ApiCallOnBackup.waiterProvider?.addToRolePolicy({
    Effect: 'Allow',
    Action: ['s3:GetObject', 's3:ListBucket'],
    Resource: ['*'],
  });
}

#!/usr/bin/env node
import * as path from 'path';
import * as firehose from '@aws-cdk/aws-kinesisfirehose-alpha';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as destinations from '../lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-firehose-delivery-stream-s3-all-properties');

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const backupBucket = new s3.Bucket(stack, 'BackupBucket', {
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

const dataProcessor = new firehose.LambdaFunctionProcessor(dataProcessorFunction, {
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

new firehose.DeliveryStream(stack, 'Delivery Stream', {
  destinations: [new destinations.S3Bucket(bucket, {
    logging: true,
    logGroup: logGroup,
    processor: dataProcessor,
    compression: destinations.Compression.GZIP,
    dataOutputPrefix: 'regularPrefix',
    errorOutputPrefix: 'errorPrefix',
    bufferingInterval: cdk.Duration.seconds(60),
    bufferingSize: cdk.Size.mebibytes(1),
    encryptionKey: key,
    s3Backup: {
      mode: destinations.BackupMode.ALL,
      bucket: backupBucket,
      compression: destinations.Compression.ZIP,
      dataOutputPrefix: 'backupPrefix',
      errorOutputPrefix: 'backupErrorPrefix',
      bufferingInterval: cdk.Duration.seconds(60),
      bufferingSize: cdk.Size.mebibytes(1),
      encryptionKey: backupKey,
    },
  })],
});

new firehose.DeliveryStream(stack, 'ZeroBufferingDeliveryStream', {
  destinations: [new destinations.S3Bucket(bucket, {
    compression: destinations.Compression.GZIP,
    dataOutputPrefix: 'regularPrefix',
    errorOutputPrefix: 'errorPrefix',
    bufferingInterval: cdk.Duration.seconds(0),
  })],
});

new firehose.DeliveryStream(stack, 'DynamicPartitioningDeliveryStream', {
  destinations: [new destinations.S3Bucket(bucket, {
    dataOutputPrefix: '!{partitionKeyFromQuery:partitionKey}',
    errorOutputPrefix: 'errorPrefix',
    dynamicPartitioningConfiguration: {
      enabled: true,
      retryDuration: cdk.Duration.seconds(60),
    },
    processor: dataProcessor,
  })],
});

new integ.IntegTest(app, 'ClusterTest', {
  testCases: [stack],
});

app.synth();

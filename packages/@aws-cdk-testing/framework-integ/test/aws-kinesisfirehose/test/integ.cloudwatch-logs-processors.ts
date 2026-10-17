#!/usr/bin/env node
import * as path from 'path';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'firehose-delivery-stream-cloudwatch-logs-processors');

const bucket = new s3.Bucket(stack, 'DestinationBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const dataProcessorFunction = new lambdanodejs.NodejsFunction(stack, 'DataProcessorFunction', {
  entry: path.join(__dirname, 'lambda-data-processor.js'),
  timeout: cdk.Duration.minutes(1),
});

new firehose.DeliveryStream(stack, 'DecompressCloudWatchLogsEntry', {
  destination: new firehose.S3Bucket(bucket, {
    processors: [
      new firehose.DecompressionProcessor(),
      new firehose.AppendDelimiterToRecordProcessor(),
      new firehose.LambdaFunctionProcessor(dataProcessorFunction),
    ],
  }),
});

new firehose.DeliveryStream(stack, 'ExtractCloudWatchLogsEntry', {
  destination: new firehose.S3Bucket(bucket, {
    processors: [
      new firehose.DecompressionProcessor(),
      new firehose.CloudWatchLogProcessor({ dataMessageExtraction: true }),
      new firehose.LambdaFunctionProcessor(dataProcessorFunction),
    ],
  }),
});

new IntegTest(app, 'integ-tests', {
  testCases: [stack],
});

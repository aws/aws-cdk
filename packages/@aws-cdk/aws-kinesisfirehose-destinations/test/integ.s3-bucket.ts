#!/usr/bin/env node
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as destinations from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-firehose-delivery-stream-s3-all-properties');

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const logGroup = new logs.LogGroup(stack, 'LogGroup', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const key = new kms.Key(stack, 'Key', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new firehose.DeliveryStream(stack, 'Delivery Stream', {
  destinations: [new destinations.S3Bucket(bucket, {
    logging: true,
    logGroup: logGroup,
    compression: destinations.Compression.GZIP,
    dataOutputPrefix: 'regularPrefix',
    errorOutputPrefix: 'errorPrefix',
    bufferingInterval: cdk.Duration.seconds(60),
    bufferingSize: cdk.Size.mebibytes(1),
    encryptionKey: key,
  })],
});

app.synth();

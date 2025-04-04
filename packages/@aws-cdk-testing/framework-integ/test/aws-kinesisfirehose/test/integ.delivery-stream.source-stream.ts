#!/usr/bin/env node
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import { AwsApiCall, ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-firehose-delivery-stream-source-stream');

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
});

const mockS3Destination: firehose.IDestination = {
  bind(_scope: constructs.Construct, _options: firehose.DestinationBindOptions): firehose.DestinationConfig {
    const bucketGrant = bucket.grantReadWrite(role);
    return {
      extendedS3DestinationConfiguration: {
        bucketArn: bucket.bucketArn,
        roleArn: role.roleArn,
      },
      dependables: [bucketGrant],
    };
  },
};

const sourceStream = new kinesis.Stream(stack, 'Source Stream', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new firehose.DeliveryStream(stack, 'Delivery Stream', {
  destination: mockS3Destination,
  source: new firehose.KinesisStreamSource(sourceStream),
});

new firehose.DeliveryStream(stack, 'Delivery Stream No Source Or Encryption Key', {
  destination: mockS3Destination,
});

const integTest = new IntegTest(app, 'integ-tests', {
  testCases: [stack],
});

integTest.assertions.awsApiCall('Kinesis', 'putRecord', {
  StreamARN: sourceStream.streamArn,
  Data: 'testData123',
  PartitionKey: '1',
});

const s3ApiCall = integTest.assertions.awsApiCall('S3', 'listObjectsV2', {
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

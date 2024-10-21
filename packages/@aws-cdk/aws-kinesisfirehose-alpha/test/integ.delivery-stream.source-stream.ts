#!/usr/bin/env node
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as firehose from '../lib';
import * as source from '../lib/source';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-firehose-delivery-stream-source-stream');

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
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

const sourceStream = new kinesis.Stream(stack, 'Source Stream');

new firehose.DeliveryStream(stack, 'Delivery Stream', {
  destination: mockS3Destination,
  source: new source.KinesisStreamSource(sourceStream),
});

new firehose.DeliveryStream(stack, 'Delivery Stream No Source Or Encryption Key', {
  destination: mockS3Destination,
});

app.synth();

#!/usr/bin/env node
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as firehose from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-firehose-delivery-stream');

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

const key = new kms.Key(stack, 'Key', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new firehose.DeliveryStream(stack, 'Delivery Stream', {
  destinations: [mockS3Destination],
  encryptionKey: key,
});

new firehose.DeliveryStream(stack, 'Delivery Stream No Source Or Encryption Key', {
  destinations: [mockS3Destination],
});

app.synth();

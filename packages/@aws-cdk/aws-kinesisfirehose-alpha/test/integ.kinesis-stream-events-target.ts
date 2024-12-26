#!/usr/bin/env node
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
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

const stream = new firehose.DeliveryStream(stack, 'Delivery Stream No Source Or Encryption Key', {
  destination: mockS3Destination,
});

new events.Rule(stack, 'rule', {
  eventPattern: {
    source: ['aws.s3'],
    detail: {
      eventName: ['PutObject'],
      requestParameters: {
        bucketName: [bucket.bucketName],
      },
    },
  },
}).addTarget(new targets.KinesisFirehoseStreamV2(firehose.DeliveryStream.fromDeliveryStreamArn(stack, 'firehose', stream.deliveryStreamArn)));

new integ.IntegTest(app, 'integ-tests', {
  testCases: [stack],
});

app.synth();

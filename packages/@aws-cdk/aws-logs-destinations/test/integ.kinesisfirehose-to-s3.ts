#!/usr/bin/env node
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as firehoseDestinations from '@aws-cdk/aws-kinesisfirehose-destinations';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as dests from '../lib';

/*
 * Stack verification steps:
 * 1. `aws logs create-log-stream --log-group-name <log-group-name> --log-stream-name MyIntegTestLogStream`
 * 2. `aws logs put-log-events --log-group-name <log-group-name> --log-stream-name MyIntegTestLogStream --log-events timestamp=$(date +%s000),message=hello`
 * 3. Wait a few minutes for Kinesis to deliver log to S3
 * 4. `aws s3 ls s3://<bucket-name> --recursive` should list one object
 */

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Firehose Stream that will deliver to S3 bucket
    const bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const deliveryStream = new firehose.DeliveryStream(this, 'MyFirehose', {
      destinations: [new firehoseDestinations.S3Bucket(bucket)],
    });

    const logGroup = new logs.LogGroup(this, 'LogGroup', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // TODO: For some reason creation of this resource fails: `Subscription (Subscription391C9821) destinationArn for vendor firehose cannot be used with roleArn (Service: AWSLogs; Status Code: 400; Error Code: InvalidParameterException; Request ID: 0e598426-5fcb-4fde-b9d3-11b14c129eb6; Proxy: null)`
    new logs.SubscriptionFilter(this, 'Subscription', {
      logGroup,
      destination: new dests.KinesisFirehoseDestination(deliveryStream),
      filterPattern: logs.FilterPattern.allEvents(),
    });
  }
}

const app = new cdk.App();
new TestStack(app, 'cdk-logs-destinations-firehose-to-s3');
app.synth();

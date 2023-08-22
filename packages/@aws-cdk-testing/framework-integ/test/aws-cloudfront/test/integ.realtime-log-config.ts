import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Stream, StreamEncryption, StreamMode } from 'aws-cdk-lib/aws-kinesis';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-realtime-config');

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('cloudfront.amazonaws.com'),
});

const kinesis = new Stream(stack, 'stream', {
  streamMode: StreamMode.ON_DEMAND,
  encryption: StreamEncryption.MANAGED,
});

new cloudfront.RealtimeLogConfig(stack, 'RealtimeLog', {
  endPoints: [
    cloudfront.Endpoint.fromKinesisStream(kinesis, role),
  ],
  fields: ['timestamp'],
  realtimeLogConfigName: 'testing',
  samplingRate: 1,
});

const realtimeLogConfigImportedByArn = cloudfront.RealtimeLogConfig.fromRealtimeLogConfigArn(
  stack,
  'ImportedProfileByArn',
  'arn:aws:iam::123456789012:realtime-log-config/MyRealtimeLogConfig',
);

new cdk.CfnOutput(
  stack,
  'NameForLogConfigImportedByName',
  { value: realtimeLogConfigImportedByArn.realtimeLogConfigName },
);

new IntegTest(stack, 'realtime-log-config', {
  testCases: [stack],
});

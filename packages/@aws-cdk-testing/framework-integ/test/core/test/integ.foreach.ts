import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { ForEachResource, ForEachOutput, Fn, Token } from 'aws-cdk-lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'ForEachIntegStack');

// Create multiple S3 buckets using ForEach
const buckets = new ForEachResource(stack, 'Buckets', {
  loopName: 'Env',
  collection: ['dev', 'staging'],
  resourceType: 'AWS::S3::Bucket',
  logicalIdTemplate: 'Bucket${Env}',
  properties: {
    Tags: [{ Key: 'Environment', Value: Fn.forEachRef('Env') }],
  },
});

// Create outputs for each bucket
new ForEachOutput(stack, 'BucketArns', {
  loopName: 'Env',
  collection: ['dev', 'staging'],
  outputKeyTemplate: 'BucketArn${Env}',
  value: Token.asString(buckets.getAtt('Arn')),
  description: 'ARN of the bucket',
});

new IntegTest(app, 'ForEachIntegTest', {
  testCases: [stack],
});

app.synth();

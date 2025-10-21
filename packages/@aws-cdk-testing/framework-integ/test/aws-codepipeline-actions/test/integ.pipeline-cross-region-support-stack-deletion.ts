import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'PipelineCrossRegionSupportStackDeletionTest', {
  env: {
    account: '123456789012',
    region: 'us-east-1',
  },
});

const bucket = new s3.Bucket(stack, 'SourceBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const sourceOutput = new codepipeline.Artifact();
const sourceAction = new cpactions.S3SourceAction({
  actionName: 'S3Source',
  bucketKey: 'path/to/artifact.zip',
  bucket,
  output: sourceOutput,
});

// Create a pipeline with a cross-region action to trigger support stack creation
new codepipeline.Pipeline(stack, 'Pipeline', {
  artifactBucket: bucket,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Deploy',
      actions: [
        new cpactions.CloudFormationCreateUpdateStackAction({
          actionName: 'DeployCrossRegion',
          stackName: 'test-stack',
          templatePath: sourceOutput.atPath('template.yml'),
          adminPermissions: false,
          region: 'us-west-2', // Cross-region action triggers support stack
        }),
      ],
    },
  ],
});

new IntegTest(app, 'PipelineCrossRegionSupportStackDeletionIntegTest', {
  testCases: [stack],
  diffAssets: true,
  allowDestroy: ['AWS::CDK::Metadata'],
});

app.synth();

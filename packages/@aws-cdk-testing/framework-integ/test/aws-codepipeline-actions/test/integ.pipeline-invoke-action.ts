import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': true,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
  },
});
const stack = new cdk.Stack(app);
const pipelineName = 'testPipelineName';
const targetPipelineName = 'targetPipelineName';
const sourceOutput = new codepipeline.Artifact();
const inputArtifact = new codepipeline.Artifact();
const bucket = new s3.Bucket(stack, 'PipelineBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const key = 'key';
const trail = new cloudtrail.Trail(stack, 'CloudTrail');
trail.addS3EventSelector([{ bucket, objectPrefix: key }], { readWriteType: cloudtrail.ReadWriteType.WRITE_ONLY, includeManagementEvents: false });
const targetPipeline = new codepipeline.Pipeline(stack, 'targetPipeline', {
  pipelineName: targetPipelineName,
  crossAccountKeys: true,
  stages: [
    {
      stageName: 'source',
      actions: [
        new cpactions.S3SourceAction({
          actionName: 'Source',
          output: inputArtifact,
          bucket,
          bucketKey: key,
          trigger: cpactions.S3Trigger.EVENTS,
        }),
      ],
    },
    {
      stageName: 'build',
      actions: [
        new cpactions.CodeBuildAction({
          actionName: 'Build',
          input: inputArtifact,
          project: new codebuild.PipelineProject(stack, 'MyBuildProject'),
        }),
      ],
    },
  ],
});

const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline', {
  pipelineName,
});
pipeline.addStage({
  stageName: 'Source',
  actions: [
    new cpactions.S3SourceAction({
      actionName: 'Source',
      bucket: new s3.Bucket(stack, 'MyBucket'),
      bucketKey: 'some/path/to',
      output: sourceOutput,
    }),
  ],
});
pipeline.addStage({
  stageName: 'Build',
  actions: [
    new cpactions.CodeBuildAction({
      actionName: 'Build',
      project: new codebuild.PipelineProject(stack, 'MyProject'),
      input: sourceOutput,
    }),
    new cpactions.PipelineInvokeAction({
      actionName: 'Invoke',
      targetPipeline,
      variables: [{
        name: 'name1',
        value: 'value1',
      }],
      sourceRevisions: [{
        actionName: 'Source',
        revisionType: cpactions.RevisionType.S3_OBJECT_VERSION_ID,
        revisionValue: 'testRevisionValue',
      }],
    }),
  ],
});

const integrationTest = new IntegTest(app, 'codepipeline-integ-test', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});

const awsApiCall1 = integrationTest.assertions.awsApiCall('CodePipeline', 'getPipeline', { name: pipelineName });
awsApiCall1.assertAtPath('pipeline.name', ExpectedResult.stringLikeRegexp(pipelineName));
awsApiCall1.assertAtPath('pipeline.stages.0.name', ExpectedResult.stringLikeRegexp('Source'));
awsApiCall1.assertAtPath('pipeline.stages.1.name', ExpectedResult.stringLikeRegexp('Build'));
awsApiCall1.assertAtPath('pipeline.stages.1.actions.0.name', ExpectedResult.stringLikeRegexp('Build'));
awsApiCall1.assertAtPath('pipeline.stages.1.actions.1.name', ExpectedResult.stringLikeRegexp('Invoke'));

import { Stack } from 'aws-cdk-lib';
import { RevisionType } from 'aws-cdk-lib/aws-codepipeline-actions';
import { app } from '../../aws-appmesh/test/integ.mesh-port-match';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const stack = new Stack(app);
const pipelineName = 'testPipelineName';
const targetPipelineName = 'targetPipelineName';
const sourceOutput = new codepipeline.Artifact();

const repo = new codecommit.Repository(stack, 'MyRepo', {
  repositoryName: 'my-repo',
});

new codepipeline.Pipeline(stack, 'Pipeline', {
  pipelineName: targetPipelineName,
  crossAccountKeys: true,
  stages: [
    {
      stageName: 'source',
      actions: [
        new cpactions.CodeCommitSourceAction({
          actionName: 'source',
          repository: repo,
          output: new codepipeline.Artifact('SourceArtifact'),
        }),
      ],
    },
    {
      stageName: 'build',
      actions: [
        new cpactions.ManualApprovalAction({ actionName: 'manual' }),
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
      pipelineName: targetPipelineName,
      variables: [{
        name: 'name1',
        value: 'value1',
      }],
      sourceRevisions: [{
        actionName: 'Source',
        revisionType: RevisionType.S3_OBJECT_VERSION_ID,
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
awsApiCall1.assertAtPath('pipeline.stages.1.actions.1.name', ExpectedResult.stringLikeRegexp('Invoke'));

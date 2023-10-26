import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as cdk from 'aws-cdk-lib/core';
import { CodeBuildStep, CodePipeline, CodePipelineSource } from 'aws-cdk-lib/pipelines';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'PipelineAdditionalInputs', {});

const repo = new codecommit.Repository(stack, 'PipelineCodeCommitRepository', {
  repositoryName: 'PipelineSourceRepository',
});

const bucket = new s3.Bucket(stack, 'PipelineS3Bucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const ecrRepo = new ecr.Repository(stack, 'PipelineEcrRepository');

const pipeline1Name = 'MultiSourcePipeline1';

// in multi-input configurations all inputs should use an action name to prevent collisions
new CodePipeline(stack, 'MultiSourcePipeline1', {
  pipelineName: pipeline1Name,
  synth: new CodeBuildStep('SynthStep', {
    input: CodePipelineSource.connection('owner/repo', 'b1', {
      connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/01234567-abcd-12ab-34cdef5678gh',
      actionName: 'connection-b1',
    }),
    additionalInputs: {
      'connection-b2': CodePipelineSource.connection('owner/repo', 'b2', {
        connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/91234567-abcd-12ab-34cdef5678gh',
        actionName: 'connection-b2',
      }),
      's3-key1': CodePipelineSource.s3(bucket, 'key1', {
        actionName: 's3-key1',
      }),
      's3-key2': CodePipelineSource.s3(bucket, 'key2', {
        actionName: 's3-key2',
      }),
      'code-commit-b1': CodePipelineSource.codeCommit(repo, 'b1', {
        actionName: 'codecommit-b1',
      }),
    },
    installCommands: [
      'npm install -g aws-cdk',
    ],
    commands: [
      'npm ci',
      'npm run build',
      'cdk synth',
    ],
  }),
});

// currently a limit of 5 sources per pipeline
// can combine these pipelines into one when we enable > 5 sources

const pipeline2Name = 'MultiSourcePipeline2';

new CodePipeline(stack, 'MultiSourcePipeline2', {
  pipelineName: pipeline2Name,
  synth: new CodeBuildStep('SynthStep', {
    input: CodePipelineSource.codeCommit(repo, 'b1', {
      actionName: 'codecommit-b1',
    }),
    additionalInputs: {
      'code-commit-b2': CodePipelineSource.codeCommit(repo, 'b2', {
        actionName: 'codecommit-b2',
      }),
      'ecr': CodePipelineSource.ecr(ecrRepo),
    },
    installCommands: [
      'npm install -g aws-cdk',
    ],
    commands: [
      'npm ci',
      'npm run build',
      'cdk synth',
    ],
  }),
});

const testCase = new integ.IntegTest(app, 'PipelineAdditionalInputsTest', {
  testCases: [stack],
});

const sources1 = testCase.assertions.awsApiCall('CodePipeline', 'GetPipeline', {
  name: pipeline1Name,
});

sources1.assertAtPath('pipeline.stages.0.actions.0.name', integ.ExpectedResult.stringLikeRegexp('codecommit-b1'));
sources1.assertAtPath('pipeline.stages.0.actions.1.name', integ.ExpectedResult.stringLikeRegexp('s3-key1'));
sources1.assertAtPath('pipeline.stages.0.actions.2.name', integ.ExpectedResult.stringLikeRegexp('s3-key2'));
sources1.assertAtPath('pipeline.stages.0.actions.3.name', integ.ExpectedResult.stringLikeRegexp('connection-b1'));
sources1.assertAtPath('pipeline.stages.0.actions.4.name', integ.ExpectedResult.stringLikeRegexp('connection-b2'));

const sources2 = testCase.assertions.awsApiCall('CodePipeline', 'GetPipeline', {
  name: pipeline2Name,
});

sources2.assertAtPath('pipeline.stages.0.actions.0.name', integ.ExpectedResult.stringLikeRegexp('codecommit-b1'));
sources2.assertAtPath('pipeline.stages.0.actions.1.name', integ.ExpectedResult.stringLikeRegexp('codecommit-b2'));
sources2.assertAtPath('pipeline.stages.0.actions.2.actionTypeId.provider', integ.ExpectedResult.stringLikeRegexp('ECR'));

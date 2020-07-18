import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as cpactions from '../../lib';

/* eslint-disable quote-props */

export = {
  'BitBucket source Action': {
    'produces the correct configuration when added to a pipeline'(test: Test) {
      const stack = new Stack();

      createBitBucketAndCodeBuildPipeline(stack, {
        codeBuildCloneOutput: false,
      });

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Name': 'Source',
            'Actions': [
              {
                'Name': 'BitBucket',
                'ActionTypeId': {
                  'Owner': 'AWS',
                  'Provider': 'CodeStarSourceConnection',
                },
                'Configuration': {
                  'ConnectionArn': 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
                  'FullRepositoryId': 'aws/aws-cdk',
                  'BranchName': 'master',
                },
              },
            ],
          },
          {
            'Name': 'Build',
            'Actions': [
              {
                'Name': 'CodeBuild',
              },
            ],
          },
        ],
      }));

      test.done();
    },
  },

  'setting codeBuildCloneOutput=true adds permission to use the connection to the following CodeBuild Project'(test: Test) {
    const stack = new Stack();

    createBitBucketAndCodeBuildPipeline(stack, {
      codeBuildCloneOutput: true,
    });

    expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
      'PolicyDocument': {
        'Statement': [
          {
            'Action': [
              'logs:CreateLogGroup',
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
          },
          {},
          {},
          {},
          {},
          {
            'Action': 'codestar-connections:UseConnection',
            'Effect': 'Allow',
            'Resource': 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
          },
        ],
      },
    }));

    test.done();
  },
};

function createBitBucketAndCodeBuildPipeline(stack: Stack, props: { codeBuildCloneOutput: boolean }): void {
  const sourceOutput = new codepipeline.Artifact();
  new codepipeline.Pipeline(stack, 'Pipeline', {
    stages: [
      {
        stageName: 'Source',
        actions: [
          new cpactions.BitBucketSourceAction({
            actionName: 'BitBucket',
            owner: 'aws',
            repo: 'aws-cdk',
            output: sourceOutput,
            connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
            codeBuildCloneOutput: props.codeBuildCloneOutput,
          }),
        ],
      },
      {
        stageName: 'Build',
        actions: [
          new cpactions.CodeBuildAction({
            actionName: 'CodeBuild',
            project: new codebuild.PipelineProject(stack, 'MyProject'),
            input: sourceOutput,
            outputs: [new codepipeline.Artifact()],
          }),
        ],
      },
    ],
  });
}

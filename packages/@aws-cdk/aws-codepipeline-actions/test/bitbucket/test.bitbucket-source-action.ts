import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as cpactions from '../../lib';

// tslint:disable:object-literal-key-quotes

export = {
  'BitBucket source Action': {
    'produces the correct configuration when added to a pipeline'(test: Test) {
      const stack = new Stack();

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
              }),
            ],
          },
        ],
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
};

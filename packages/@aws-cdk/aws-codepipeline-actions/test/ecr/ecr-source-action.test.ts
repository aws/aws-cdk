import '@aws-cdk/assert-internal/jest';
import { ABSENT } from '@aws-cdk/assert-internal';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ecr from '@aws-cdk/aws-ecr';
import { Stack } from '@aws-cdk/core';
import * as cpactions from '../../lib';

/* eslint-disable quote-props */

describe('ecr source action', () => {
  describe('ECR source Action', () => {
    test('exposes variables for other actions to consume', () => {
      const stack = new Stack();

      const sourceOutput = new codepipeline.Artifact();
      const ecrSourceAction = new cpactions.EcrSourceAction({
        actionName: 'Source',
        output: sourceOutput,
        repository: ecr.Repository.fromRepositoryName(stack, 'Repo', 'repo'),
      });
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [ecrSourceAction],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'Build',
                project: new codebuild.PipelineProject(stack, 'MyProject'),
                input: sourceOutput,
                environmentVariables: {
                  ImageDigest: { value: ecrSourceAction.variables.imageDigest },
                },
              }),
            ],
          },
        ],
      });

      expect(stack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Name': 'Source',
          },
          {
            'Name': 'Build',
            'Actions': [
              {
                'Name': 'Build',
                'Configuration': {
                  'EnvironmentVariables': '[{"name":"ImageDigest","type":"PLAINTEXT","value":"#{Source_Source_NS.ImageDigest}"}]',
                },
              },
            ],
          },
        ],
      });


      expect(stack).toHaveResourceLike('AWS::Events::Rule', {
        'EventPattern': {
          'detail': {
            'requestParameters': {
              'imageTag': ['latest'],
            },
          },
        },
      });
    });

    test('watches all tags when imageTag provided as empty string', () => {
      const stack = new Stack();

      const sourceOutput = new codepipeline.Artifact();
      const ecrSourceAction = new cpactions.EcrSourceAction({
        actionName: 'Source',
        output: sourceOutput,
        repository: ecr.Repository.fromRepositoryName(stack, 'Repo', 'repo'),
        imageTag: '',
      });

      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [ecrSourceAction],
          },
          {
            stageName: 'Build',
            actions: [
              new cpactions.CodeBuildAction({
                actionName: 'Build',
                project: new codebuild.PipelineProject(stack, 'MyProject'),
                input: sourceOutput,
                environmentVariables: {
                  ImageDigest: { value: ecrSourceAction.variables.imageDigest },
                },
              }),
            ],
          },
        ],
      });

      expect(stack).toHaveResourceLike('AWS::Events::Rule', {
        'EventPattern': {
          'source': [
            'aws.ecr',
          ],
          'detail': {
            'requestParameters': {
              'imageTag': ABSENT,
            },
          },
        },
      });

      expect(stack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Name': 'Source',
            'Actions': [
              {
                'Name': 'Source',
                'Configuration': {
                  'ImageTag': ABSENT,
                },
              },
            ],
          },
        ],
      });
    });
  });
});

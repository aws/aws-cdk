import { Template, Match } from '@aws-cdk/assertions';
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

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        'Stages': Match.arrayWith([
          Match.objectLike({
            'Name': 'Source',
          }),
          Match.objectLike({
            'Name': 'Build',
            'Actions': Match.arrayWith([
              Match.objectLike({
                'Name': 'Build',
                'Configuration': {
                  'EnvironmentVariables': '[{"name":"ImageDigest","type":"PLAINTEXT","value":"#{Source_Source_NS.ImageDigest}"}]',
                },
              }),
            ]),
          }),
        ]),
      });


      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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

      Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        'EventPattern': {
          'source': [
            'aws.ecr',
          ],
          'detail': {
            'requestParameters': {
              'imageTag': Match.absent(),
            },
          },
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        'Stages': Match.arrayWith([
          Match.objectLike({
            'Name': 'Source',
            'Actions': Match.arrayWith([
              Match.objectLike({
                'Name': 'Source',
                'Configuration': {
                  'ImageTag': Match.absent(),
                },
              }),
            ]),
          }),
        ]),
      });
    });
  });
});

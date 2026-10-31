import { Template, Match } from '../../../assertions';
import * as codebuild from '../../../aws-codebuild';
import * as codepipeline from '../../../aws-codepipeline';
import * as ecr from '../../../aws-ecr';
import { Stack } from '../../../core';
import * as cpactions from '../../lib';

/* eslint-disable @stylistic/quote-props */

describe('ecr source action', () => {
  test.each(['123456789012', undefined])('registryId=%p filters only the native event account', registryId => {
    const stack = new Stack();
    const output = new codepipeline.Artifact();
    new codepipeline.Pipeline(stack, 'Pipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [new cpactions.EcrSourceAction({
            actionName: 'Source',
            output,
            repository: ecr.Repository.fromRepositoryName(stack, 'Repository', 'source-repo'),
            registryId,
          })],
        },
        {
          stageName: 'Build',
          actions: [new cpactions.CodeBuildAction({
            actionName: 'Build', input: output, project: new codebuild.PipelineProject(stack, 'Project'),
          })],
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        account: registryId === undefined ? Match.absent() : [registryId],
        'detail-type': ['ECR Image Action'],
        source: ['aws.ecr'],
        detail: {
          'repository-name': ['source-repo'],
          'image-tag': ['latest'],
          'action-type': ['PUSH'],
          result: ['SUCCESS'],
          registryId: Match.absent(),
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([Match.objectLike({
        Name: 'Source',
        Actions: [Match.objectLike({
          Configuration: { RepositoryName: 'source-repo', ImageTag: Match.absent(), RegistryId: Match.absent() },
        })],
      })]),
    });
  });

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
            'result': ['SUCCESS'],
            'repository-name': ['repo'],
            'image-tag': ['latest'],
            'action-type': ['PUSH'],
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
            'result': ['SUCCESS'],
            'repository-name': ['repo'],
            'image-tag': Match.absent(),
            'action-type': ['PUSH'],
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

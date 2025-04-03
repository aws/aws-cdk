import { Match, Template } from '../../../assertions';
import * as codepipeline from '../../../aws-codepipeline';
import * as ecr from '../../../aws-ecr';
import { Bucket } from '../../../aws-s3';
import { Stack } from '../../../core';
import * as cpactions from '../../lib';

describe('EcrBuildAndPublish Action', () => {
  let stack: Stack;
  let sourceOutput: codepipeline.Artifact;
  let repository: ecr.IRepository;
  let pipeline: codepipeline.Pipeline;

  beforeEach(() => {
    // GIVEN
    stack = new Stack();
    sourceOutput = new codepipeline.Artifact('SourceArtifact');
    repository = new ecr.Repository(stack, 'Repository');
    pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new cpactions.S3SourceAction({
          actionName: 'Source',
          bucket: new Bucket(stack, 'SourceBucket'),
          bucketKey: 'sample.zip',
          output: sourceOutput,
        }),
      ],
    });
  });

  test('pipeline with EcrBuildAndPublish action', () => {
    // WHEN
    const ecrBuildAndPublishAction = new cpactions.EcrBuildAndPublishAction({
      actionName: 'EcrBuildAndPublish',
      input: sourceOutput,
      repositoryName: repository.repositoryName,
      dockerfileDirectoryPath: './my-dir',
      imageTags: ['my-tag-1', 'my-tag-2'],
      registryType: cpactions.RegistryType.PRIVATE,
    });

    pipeline.addStage({
      stageName: 'EcrBuildAndPublish',
      actions: [ecrBuildAndPublishAction],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([
        {
          Name: 'EcrBuildAndPublish',
          Actions: [
            {
              ActionTypeId: {
                Category: 'Build',
                Owner: 'AWS',
                Provider: 'ECRBuildAndPublish',
                Version: '1',
              },
              Configuration: {
                ECRRepositoryName: {
                  Ref: 'Repository22E53BBD',
                },
                DockerFilePath: './my-dir',
                ImageTags: 'my-tag-1,my-tag-2',
                RegistryType: 'private',
              },
              InputArtifacts: [
                {
                  Name: 'SourceArtifact',
                },
              ],
              Name: 'EcrBuildAndPublish',
              RoleArn: {
                'Fn::GetAtt': [
                  'PipelineEcrBuildAndPublishCodePipelineActionRoleF90187D9',
                  'Arn',
                ],
              },
              RunOrder: 1,
            },
          ],
        },
      ]),
    });
  });

  test('can get variables', () => {
    // WHEN
    const ecrBuildAndPublishAction = new cpactions.EcrBuildAndPublishAction({
      actionName: 'EcrBuildAndPublish',
      input: sourceOutput,
      repositoryName: repository.repositoryName,
    });

    // THEN
    expect(ecrBuildAndPublishAction.variables.ecrImageDigestId).toMatch(/^#{\${Token\[TOKEN\.[0-9]*\]}.ECRImageDigestId}$/);
    expect(ecrBuildAndPublishAction.variables.ecrRepositoryName).toMatch(/^#{\${Token\[TOKEN\.[0-9]*\]}.ECRRepositoryName}$/);
  });

  describe('grant policy', () => {
    test('grant policy for private ecr', () => {
      // WHEN
      const ecrBuildAndPublishAction = new cpactions.EcrBuildAndPublishAction({
        actionName: 'EcrBuildAndPublish',
        input: sourceOutput,
        repositoryName: repository.repositoryName,
        registryType: cpactions.RegistryType.PRIVATE,
      });

      pipeline.addStage({
        stageName: 'EcrBuildAndPublish',
        actions: [ecrBuildAndPublishAction],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineEcrBuildAndPublishCodePipelineActionRoleDefaultPolicy7B81DF4D',
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: [
                'ecr:DescribeRepositories',
                'ecr:InitiateLayerUpload',
                'ecr:UploadLayerPart',
                'ecr:CompleteLayerUpload',
                'ecr:PutImage',
                'ecr:GetDownloadUrlForLayer',
                'ecr:BatchCheckLayerAvailability',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':ecr:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':repository/',
                    { Ref: 'Repository22E53BBD' },
                  ],
                ],
              },
            },
            {
              Action: 'ecr:GetAuthorizationToken',
              Effect: 'Allow',
              Resource: '*',
            },
          ]),
        },
      });
    });

    test('grant policy for public ecr', () => {
      // WHEN
      const ecrBuildAndPublishAction = new cpactions.EcrBuildAndPublishAction({
        actionName: 'EcrBuildAndPublish',
        input: sourceOutput,
        repositoryName: repository.repositoryName,
        registryType: cpactions.RegistryType.PUBLIC,
      });

      pipeline.addStage({
        stageName: 'EcrBuildAndPublish',
        actions: [ecrBuildAndPublishAction],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineEcrBuildAndPublishCodePipelineActionRoleDefaultPolicy7B81DF4D',
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: [
                'ecr-public:DescribeRepositories',
                'ecr-public:InitiateLayerUpload',
                'ecr-public:UploadLayerPart',
                'ecr-public:CompleteLayerUpload',
                'ecr-public:PutImage',
                'ecr-public:BatchCheckLayerAvailability',
              ],
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':ecr-public::',
                    { Ref: 'AWS::AccountId' },
                    ':repository/',
                    { Ref: 'Repository22E53BBD' },
                  ],
                ],
              },
            },
            {
              Action: [
                'ecr-public:GetAuthorizationToken',
                'sts:GetServiceBearerToken',
              ],
              Effect: 'Allow',
              Resource: '*',
            },
          ]),
        },
      });
    });

    test('grant policy for logs', () => {
      // WHEN
      const ecrBuildAndPublishAction = new cpactions.EcrBuildAndPublishAction({
        actionName: 'EcrBuildAndPublish',
        input: sourceOutput,
        repositoryName: repository.repositoryName,
      });

      pipeline.addStage({
        stageName: 'EcrBuildAndPublish',
        actions: [ecrBuildAndPublishAction],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineEcrBuildAndPublishCodePipelineActionRoleDefaultPolicy7B81DF4D',
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
              ],
              Effect: 'Allow',
              Resource: [
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':logs:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':log-group:/aws/codepipeline/',
                      {
                        Ref: 'PipelineC660917D',
                      },
                    ],
                  ],
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':logs:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':log-group:/aws/codepipeline/',
                      {
                        Ref: 'PipelineC660917D',
                      },
                      ':*',
                    ],
                  ],
                },
              ],
            },
          ]),
        },
      });
    });

    test('grant read policy for buckets', () => {
      // WHEN
      const ecrBuildAndPublishAction = new cpactions.EcrBuildAndPublishAction({
        actionName: 'EcrBuildAndPublish',
        input: sourceOutput,
        repositoryName: repository.repositoryName,
      });

      pipeline.addStage({
        stageName: 'EcrBuildAndPublish',
        actions: [ecrBuildAndPublishAction],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineEcrBuildAndPublishCodePipelineActionRoleDefaultPolicy7B81DF4D',
        PolicyDocument: {
          Statement: Match.arrayWith([
            {
              Action: [
                's3:GetObject*',
                's3:GetBucket*',
                's3:List*',
              ],
              Effect: 'Allow',
              Resource: [
                {
                  'Fn::GetAtt': [
                    'PipelineArtifactsBucket22248F97',
                    'Arn',
                  ],
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      {
                        'Fn::GetAtt': [
                          'PipelineArtifactsBucket22248F97',
                          'Arn',
                        ],
                      },
                      '/*',
                    ],
                  ],
                },
              ],
            },
          ]),
        },
      });
    });
  });
});

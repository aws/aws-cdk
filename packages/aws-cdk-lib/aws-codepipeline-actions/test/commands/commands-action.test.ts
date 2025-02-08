import { Match, Template } from '../../../assertions';
import * as codepipeline from '../../../aws-codepipeline';
import { Key } from '../../../aws-kms';
import { Bucket } from '../../../aws-s3';
import { Stack } from '../../../core';
import * as cpactions from '../../lib';

describe('Commands Action', () => {
  let stack: Stack;
  let sourceOutput1: codepipeline.Artifact;
  let sourceOutput2: codepipeline.Artifact;
  let pipeline: codepipeline.Pipeline;

  beforeEach(() => {
    // GIVEN
    stack = new Stack();
    sourceOutput1 = new codepipeline.Artifact('SourceArtifact');
    sourceOutput2 = new codepipeline.Artifact('SourceArtifact2');
    pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new cpactions.S3SourceAction({
          actionName: 'Source1',
          bucket: new Bucket(stack, 'SourceBucket1'),
          bucketKey: 'sample.zip',
          output: sourceOutput1,
        }),
        new cpactions.S3SourceAction({
          actionName: 'Source2',
          bucket: new Bucket(stack, 'SourceBucket2'),
          bucketKey: 'sample.zip',
          output: sourceOutput2,
        }),
      ],
    });
  });

  test('pipeline with commands action', () => {
    // WHEN
    const commandsAction = new cpactions.CommandsAction({
      actionName: 'Commands',
      commands: [
        'pwd',
        'ls -la',
      ],
      input: sourceOutput1,
      extraInputs: [sourceOutput2],
      output: new codepipeline.Artifact('CommandsArtifact'),
      outputVariables: ['MY_OUTPUT', 'CODEBUILD_BUILD_ID', 'AWS_DEFAULT_REGION'],
    });

    pipeline.addStage({
      stageName: 'Commands',
      actions: [commandsAction],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: Match.arrayWith([
        {
          Name: 'Commands',
          Actions: [
            {
              ActionTypeId: {
                Category: 'Compute',
                Owner: 'AWS',
                Provider: 'Commands',
                Version: '1',
              },
              Commands: [
                'pwd',
                'ls -la',
              ],
              InputArtifacts: [
                {
                  Name: 'SourceArtifact',
                },
                {
                  Name: 'SourceArtifact2',
                },
              ],
              Name: 'Commands',
              OutputArtifacts: [
                {
                  Name: 'CommandsArtifact',
                },
              ],
              OutputVariables: [
                'MY_OUTPUT',
                'CODEBUILD_BUILD_ID',
                'AWS_DEFAULT_REGION',
              ],
              RoleArn: {
                'Fn::GetAtt': [
                  'PipelineCommandsCodePipelineActionRole98E395B5',
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

  test('throw if commands length is lower than 1', () => {
    // THEN
    expect(() => {
      new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: [],
        input: sourceOutput1,
      });
    }).toThrow(/The length of the commands array must be between 1 and 50, got: 0/);
  });

  test('throw if commands length is greater than 50', () => {
    // THEN
    expect(() => {
      new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: new Array(51).fill('echo hello'),
        input: sourceOutput1,
      });
    }).toThrow(/The length of the commands array must be between 1 and 50, got: 51/);
  });

  test('throw if outputVariables length is lower than 1', () => {
    // THEN
    expect(() => {
      new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: [
          'echo hello',
        ],
        input: sourceOutput1,
        outputVariables: [],
      });
    }).toThrow(/The length of the outputVariables array must be between 1 and 15, got: 0/);
  });

  test('throw if outputVariables length is greater than 15', () => {
    // THEN
    expect(() => {
      new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: [
          'echo hello',
        ],
        input: sourceOutput1,
        outputVariables: [...new Array(16).keys()].map(i => `VAR${i}`),
      });
    }).toThrow(/The length of the outputVariables array must be between 1 and 15, got: 16/);
  });

  describe('grant policy', () => {
    test('grant policy for logs', () => {
      // WHEN
      const commandsAction = new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: [
          'pwd',
          'ls -la',
        ],
        input: sourceOutput1,
      });

      pipeline.addStage({
        stageName: 'Commands',
        actions: [commandsAction],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineCommandsCodePipelineActionRoleDefaultPolicy4B986788',
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
            {
              Action: 'logs:GetLogEvents',
              Effect: 'Allow',
              Resource: {
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
            },
          ]),
        },
      });
    });

    test('grant read policy for buckets if the action has input without output', () => {
      // WHEN
      const commandsAction = new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: [
          'pwd',
          'ls -la',
        ],
        input: sourceOutput1,
      });

      pipeline.addStage({
        stageName: 'Commands',
        actions: [commandsAction],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineCommandsCodePipelineActionRoleDefaultPolicy4B986788',
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

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineCommandsCodePipelineActionRoleDefaultPolicy4B986788',
        PolicyDocument: {
          // Write policy is not granted
          Statement: Match.not(
            Match.arrayWith([
              {
                Action: [
                  's3:DeleteObject*',
                  's3:PutObject',
                  's3:PutObjectLegalHold',
                  's3:PutObjectRetention',
                  's3:PutObjectTagging',
                  's3:PutObjectVersionTagging',
                  's3:Abort*',
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
          ),
        },
      });
    });

    test('grant write policy for buckets if the action has input and output', () => {
      // WHEN
      const commandsOutput = new codepipeline.Artifact('CommandsArtifact');
      const commandsAction = new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: [
          'pwd',
          'ls -la',
        ],
        input: sourceOutput1,
        output: commandsOutput,
      });

      pipeline.addStage({
        stageName: 'Commands',
        actions: [commandsAction],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'PipelineCommandsCodePipelineActionRoleDefaultPolicy4B986788',
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
            {
              Action: [
                's3:DeleteObject*',
                's3:PutObject',
                's3:PutObjectLegalHold',
                's3:PutObjectRetention',
                's3:PutObjectTagging',
                's3:PutObjectVersionTagging',
                's3:Abort*',
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

  describe('variable method', () => {
    test('can reference by variable method', () => {
      // WHEN
      const commandsOutput = new codepipeline.Artifact('CommandsArtifact');
      const commandsAction = new cpactions.CommandsAction({
        actionName: 'Commands',
        commands: [
          'export MY_OUTPUT=my-key',
        ],
        input: sourceOutput1,
        extraInputs: [sourceOutput2],
        output: commandsOutput,
        outputVariables: ['MY_OUTPUT'],
      });

      const deployBucket = new Bucket(stack, 'DeployBucket');
      const deployAction = new cpactions.S3DeployAction({
        actionName: 'DeployAction',
        extract: true,
        input: commandsOutput,
        bucket: deployBucket,
        objectKey: commandsAction.variable('MY_OUTPUT'),
      });

      pipeline.addStage({
        stageName: 'Commands',
        actions: [commandsAction],
      });
      pipeline.addStage({
        stageName: 'Deploy',
        actions: [deployAction],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        Stages: Match.arrayWith([
          {
            Name: 'Commands',
            Actions: [
              Match.objectLike({
                OutputVariables: [
                  'MY_OUTPUT',
                ],
              }),
            ],
          },
          {
            Name: 'Deploy',
            Actions: [
              Match.objectLike({
                Configuration: {
                  ObjectKey: '#{Commands_Commands_NS.MY_OUTPUT}',
                },
              }),
            ],
          },
        ]),
      });
    });
  });

  test('throw if method references a non-exported variable', () => {
    // GIVEN
    const commandsOutput = new codepipeline.Artifact('CommandsArtifact');
    const commandsAction = new cpactions.CommandsAction({
      actionName: 'Commands',
      commands: [
        'export MY_OUTPUT=my-key',
      ],
      input: sourceOutput1,
      extraInputs: [sourceOutput2],
      output: commandsOutput,
      outputVariables: ['MY_OUTPUT'],
    });
    const deployBucket = new Bucket(stack, 'DeployBucket');

    // THEN
    expect(() => {
      new cpactions.S3DeployAction({
        actionName: 'DeployAction',
        extract: true,
        input: commandsOutput,
        bucket: deployBucket,
        objectKey: commandsAction.variable('NON-EXPORTED-OUTPUT'),
      });
    }).toThrow(/Variable 'NON-EXPORTED-OUTPUT' is not exported by `outputVariables`, exported variables: MY_OUTPUT/);
  });
});

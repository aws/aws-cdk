import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';
import { Match, Template } from '../../assertions';
import { CommandsAction } from '../../aws-codepipeline-actions';
import { Key } from '../../aws-kms';
import { Secret } from '../../aws-secretsmanager';
import * as cdk from '../../core';
import * as codepipeline from '../lib';

/* eslint-disable quote-props */

describe('environment variables', () => {
  describe('plaintext environment variables', () => {
    test('can specify a plaintext environment variable in action', () => {
      const stack = new cdk.Stack();
      const sourceOutput = new codepipeline.Artifact();
      const fakeSourceAction = new FakeSourceAction({
        actionName: 'Source',
        output: sourceOutput,
      });
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [fakeSourceAction],
          },
          {
            stageName: 'Build',
            actions: [new FakeBuildAction({
              actionName: 'Build',
              input: sourceOutput,
              actionEnvironmentVariables: [
                codepipeline.EnvironmentVariable.fromPlaintext({
                  variableName: 'MY_ENV_VAR',
                  variableValue: 'my-value',
                }),
              ],
            })],
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Name': 'Source',
          },
          {
            'Name': 'Build',
            'Actions': [
              {
                'Name': 'Build',
                'EnvironmentVariables': [
                  {
                    'Name': 'MY_ENV_VAR',
                    'Value': 'my-value',
                    'Type': 'PLAINTEXT',
                  },
                ],
              },
            ],
          },
        ],
      });
    });
  });

  describe('secrets manager environment variables', () => {
    test('can specify a secrets manager environment variable in commands action', () => {
      const stack = new cdk.Stack();
      const sourceOutput = new codepipeline.Artifact();
      const fakeSourceAction = new FakeSourceAction({
        actionName: 'Source',
        output: sourceOutput,
      });

      const secret = new Secret(stack, 'Secret', {
        secretStringValue: cdk.SecretValue.unsafePlainText('my-secret-value'),
      });

      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [fakeSourceAction],
          },
          {
            stageName: 'Build',
            actions: [new CommandsAction({
              actionName: 'Commands',
              input: sourceOutput,
              commands: [
                'echo "MY_ENV_VAR:$MY_ENV_VAR"',
              ],
              actionEnvironmentVariables: [
                codepipeline.EnvironmentVariable.fromSecretsManager({
                  variableName: 'MY_ENV_VAR',
                  secret: secret,
                }),
              ],
            })],
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Name': 'Source',
          },
          {
            'Name': 'Build',
            'Actions': [
              {
                'Name': 'Commands',
                'Commands': [
                  'echo "MY_ENV_VAR:$MY_ENV_VAR"',
                ],
                'EnvironmentVariables': [
                  {
                    'Name': 'MY_ENV_VAR',
                    'Type': 'SECRETS_MANAGER',
                    'Value': {
                      'Fn::Join': [
                        '-',
                        [
                          {
                            'Fn::Select': [
                              0,
                              {
                                'Fn::Split': [
                                  '-',
                                  {
                                    'Fn::Select': [
                                      6,
                                      {
                                        'Fn::Split': [
                                          ':',
                                          {
                                            'Ref': 'SecretA720EF05',
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            'Fn::Select': [
                              1,
                              {
                                'Fn::Split': [
                                  '-',
                                  {
                                    'Fn::Select': [
                                      6,
                                      {
                                        'Fn::Split': [
                                          ':',
                                          {
                                            'Ref': 'SecretA720EF05',
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      ],
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
    });

    test('throw error when specifying a secrets manager environment variable not in commands action', () => {
      const stack = new cdk.Stack();
      const sourceOutput = new codepipeline.Artifact();
      const fakeSourceAction = new FakeSourceAction({
        actionName: 'Source',
        output: sourceOutput,
      });

      const secret = new Secret(stack, 'Secret', {
        secretStringValue: cdk.SecretValue.unsafePlainText('my-secret-value'),
      });

      expect(() => {
        new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [fakeSourceAction],
            },
            {
              stageName: 'Build',
              actions: [new FakeBuildAction({
                actionName: 'Build',
                input: sourceOutput,
                actionEnvironmentVariables: [
                  codepipeline.EnvironmentVariable.fromSecretsManager({
                    variableName: 'MY_ENV_VAR',
                    secret: secret,
                  }),
                ],
              })],
            },
          ],
        });
      }).toThrow(/Secrets Manager environment variable \('MY_ENV_VAR'\) in action 'Build' can only be used with the Commands action, got: Fake action/);
    });

    describe('IAM policy', () => {
      test('can get secret value from secrets', () => {
        const stack = new cdk.Stack();
        const sourceOutput = new codepipeline.Artifact();
        const fakeSourceAction = new FakeSourceAction({
          actionName: 'Source',
          output: sourceOutput,
        });

        const secret = new Secret(stack, 'Secret', {
          secretStringValue: cdk.SecretValue.unsafePlainText('my-secret-value'),
        });

        new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [fakeSourceAction],
            },
            {
              stageName: 'Build',
              actions: [new CommandsAction({
                actionName: 'Commands',
                input: sourceOutput,
                commands: [
                  'echo "MY_ENV_VAR:$MY_ENV_VAR"',
                ],
                actionEnvironmentVariables: [
                  codepipeline.EnvironmentVariable.fromSecretsManager({
                    variableName: 'MY_ENV_VAR',
                    secret: secret,
                  }),
                ],
              })],
            },
          ],
        });

        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              {
                'Effect': 'Allow',
                'Action': 'secretsmanager:GetSecretValue',
                'Resource': {
                  'Ref': 'SecretA720EF05',
                },
              },
            ]),
          },
          'PolicyName': 'PipelineBuildCommandsCodePipelineActionRoleDefaultPolicyEEF67069',
          'Roles': [
            {
              'Ref': 'PipelineBuildCommandsCodePipelineActionRoleCF89A175',
            },
          ],
        });
      });

      test('can get secret value from KMS encrypted secrets', () => {
        const stack = new cdk.Stack();
        const sourceOutput = new codepipeline.Artifact();
        const fakeSourceAction = new FakeSourceAction({
          actionName: 'Source',
          output: sourceOutput,
        });

        const kmsKey = new Key(stack, 'MyKey');
        const secret = new Secret(stack, 'Secret', {
          secretStringValue: cdk.SecretValue.unsafePlainText('my-secret-value'),
          encryptionKey: kmsKey,
        });

        new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [fakeSourceAction],
            },
            {
              stageName: 'Build',
              actions: [new CommandsAction({
                actionName: 'Commands',
                input: sourceOutput,
                commands: [
                  'echo "MY_ENV_VAR:$MY_ENV_VAR"',
                ],
                actionEnvironmentVariables: [
                  codepipeline.EnvironmentVariable.fromSecretsManager({
                    variableName: 'MY_ENV_VAR',
                    secret: secret,
                  }),
                ],
              })],
            },
          ],
        });

        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              {
                'Effect': 'Allow',
                'Action': 'secretsmanager:GetSecretValue',
                'Resource': {
                  'Ref': 'SecretA720EF05',
                },
              },
            ]),
          },
          'PolicyName': 'PipelineBuildCommandsCodePipelineActionRoleDefaultPolicyEEF67069',
          'Roles': [
            {
              'Ref': 'PipelineBuildCommandsCodePipelineActionRoleCF89A175',
            },
          ],
        });

        Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
          'KeyPolicy': {
            'Statement': Match.arrayWith([
              {
                'Effect': 'Allow',
                'Action': 'kms:Decrypt',
                'Condition': {
                  'StringEquals': {
                    'kms:ViaService': {
                      'Fn::Join': [
                        '',
                        [
                          'secretsmanager.',
                          {
                            'Ref': 'AWS::Region',
                          },
                          '.amazonaws.com',
                        ],
                      ],
                    },
                  },
                },
                'Principal': {
                  'AWS': {
                    'Fn::GetAtt': [
                      'PipelineBuildCommandsCodePipelineActionRoleCF89A175',
                      'Arn',
                    ],
                  },
                },
                'Resource': '*',
              },
            ]),
          },
        });
      });

      test('can get secret value from imported secrets', () => {
        const stack = new cdk.Stack();
        const sourceOutput = new codepipeline.Artifact();
        const fakeSourceAction = new FakeSourceAction({
          actionName: 'Source',
          output: sourceOutput,
        });

        const secret = Secret.fromSecretCompleteArn(
          stack,
          'ImportedSecret',
          'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret-AbCdEf',
        );

        new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [fakeSourceAction],
            },
            {
              stageName: 'Build',
              actions: [new CommandsAction({
                actionName: 'Commands',
                input: sourceOutput,
                commands: [
                  'echo "MY_ENV_VAR:$MY_ENV_VAR"',
                ],
                actionEnvironmentVariables: [
                  codepipeline.EnvironmentVariable.fromSecretsManager({
                    variableName: 'MY_ENV_VAR',
                    secret: secret,
                  }),
                ],
              })],
            },
          ],
        });

        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              {
                'Effect': 'Allow',
                'Action': 'secretsmanager:GetSecretValue',
                'Resource': 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret-AbCdEf',
              },
            ]),
          },
        });
      });

      test('can get secret value from imported secrets with partial ARN', () => {
        const stack = new cdk.Stack();
        const sourceOutput = new codepipeline.Artifact();
        const fakeSourceAction = new FakeSourceAction({
          actionName: 'Source',
          output: sourceOutput,
        });

        const secret = Secret.fromSecretPartialArn(
          stack,
          'ImportedSecret',
          'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret',
        );

        new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [fakeSourceAction],
            },
            {
              stageName: 'Build',
              actions: [new CommandsAction({
                actionName: 'Commands',
                input: sourceOutput,
                commands: [
                  'echo "MY_ENV_VAR:$MY_ENV_VAR"',
                ],
                actionEnvironmentVariables: [
                  codepipeline.EnvironmentVariable.fromSecretsManager({
                    variableName: 'MY_ENV_VAR',
                    secret: secret,
                  }),
                ],
              })],
            },
          ],
        });

        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              {
                'Effect': 'Allow',
                'Action': 'secretsmanager:GetSecretValue',
                'Resource': 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret-??????',
              },
            ]),
          },
        });
      });

      test('can get secret value from imported secrets with name', () => {
        const stack = new cdk.Stack();
        const sourceOutput = new codepipeline.Artifact();
        const fakeSourceAction = new FakeSourceAction({
          actionName: 'Source',
          output: sourceOutput,
        });

        const secret = Secret.fromSecretNameV2(
          stack,
          'ImportedSecret',
          'my-secret-name',
        );

        new codepipeline.Pipeline(stack, 'Pipeline', {
          stages: [
            {
              stageName: 'Source',
              actions: [fakeSourceAction],
            },
            {
              stageName: 'Build',
              actions: [new CommandsAction({
                actionName: 'Commands',
                input: sourceOutput,
                commands: [
                  'echo "MY_ENV_VAR:$MY_ENV_VAR"',
                ],
                actionEnvironmentVariables: [
                  codepipeline.EnvironmentVariable.fromSecretsManager({
                    variableName: 'MY_ENV_VAR',
                    secret: secret,
                  }),
                ],
              })],
            },
          ],
        });

        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          'PolicyDocument': {
            'Statement': Match.arrayWith([
              {
                'Effect': 'Allow',
                'Action': 'secretsmanager:GetSecretValue',
                'Resource': {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        'Ref': 'AWS::Partition',
                      },
                      ':secretsmanager:',
                      {
                        'Ref': 'AWS::Region',
                      },
                      ':',
                      {
                        'Ref': 'AWS::AccountId',
                      },
                      ':secret:my-secret-name-??????',
                    ],
                  ],
                },
              },
            ]),
          },
        });
      });
    });
  });

  test('can specify multiple environment variables', () => {
    const stack = new cdk.Stack();
    const sourceOutput = new codepipeline.Artifact();
    const fakeSourceAction = new FakeSourceAction({
      actionName: 'Source',
      output: sourceOutput,
    });

    const secret = new Secret(stack, 'Secret', {
      secretStringValue: cdk.SecretValue.unsafePlainText('my-secret-value'),
    });

    new codepipeline.Pipeline(stack, 'Pipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [fakeSourceAction],
        },
        {
          stageName: 'Build',
          actions: [new CommandsAction({
            actionName: 'Commands',
            input: sourceOutput,
            commands: [
              'echo "MY_ENV_VAR:$MY_ENV_VAR"',
              'echo "MY_SECRET_ENV_VAR:$MY_SECRET_ENV_VAR"',
            ],
            actionEnvironmentVariables: [
              codepipeline.EnvironmentVariable.fromPlaintext({
                variableName: 'MY_ENV_VAR',
                variableValue: 'my-value',
              }),
              codepipeline.EnvironmentVariable.fromSecretsManager({
                variableName: 'MY_SECRET_ENV_VAR',
                secret: secret,
              }),
            ],
          })],
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        {
          'Name': 'Source',
        },
        {
          'Name': 'Build',
          'Actions': [
            {
              'Name': 'Commands',
              'Commands': [
                'echo "MY_ENV_VAR:$MY_ENV_VAR"',
                'echo "MY_SECRET_ENV_VAR:$MY_SECRET_ENV_VAR"',
              ],
              'EnvironmentVariables': [
                {
                  'Name': 'MY_ENV_VAR',
                  'Type': 'PLAINTEXT',
                  'Value': 'my-value',
                },
                {
                  'Name': 'MY_SECRET_ENV_VAR',
                  'Type': 'SECRETS_MANAGER',
                  'Value': {
                    'Fn::Join': [
                      '-',
                      [
                        {
                          'Fn::Select': [
                            0,
                            {
                              'Fn::Split': [
                                '-',
                                {
                                  'Fn::Select': [
                                    6,
                                    {
                                      'Fn::Split': [
                                        ':',
                                        {
                                          'Ref': 'SecretA720EF05',
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          'Fn::Select': [
                            1,
                            {
                              'Fn::Split': [
                                '-',
                                {
                                  'Fn::Select': [
                                    6,
                                    {
                                      'Fn::Split': [
                                        ':',
                                        {
                                          'Ref': 'SecretA720EF05',
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test('can accept empty environment variables as undefined', () => {
    const stack = new cdk.Stack();
    const sourceOutput = new codepipeline.Artifact();
    const fakeSourceAction = new FakeSourceAction({
      actionName: 'Source',
      output: sourceOutput,
    });

    new codepipeline.Pipeline(stack, 'Pipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [fakeSourceAction],
        },
        {
          stageName: 'Build',
          actions: [new FakeBuildAction({
            actionName: 'Build',
            input: sourceOutput,
            actionEnvironmentVariables: [],
          })],
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        {
          'Name': 'Source',
        },
        {
          'Name': 'Build',
          'Actions': [
            {
              'Name': 'Build',
              'EnvironmentVariables': Match.absent(),
            },
          ],
        },
      ],
    });
  });

  test('throw error when specifying more than 10 environment variables', () => {
    const stack = new cdk.Stack();
    const sourceOutput = new codepipeline.Artifact();
    const fakeSourceAction = new FakeSourceAction({
      actionName: 'Source',
      output: sourceOutput,
    });

    const envVars: codepipeline.EnvironmentVariable[] = [];
    for (let i = 0; i < 11; i++) {
      envVars.push(codepipeline.EnvironmentVariable.fromPlaintext({
        variableName: `MY_ENV_VAR_${i}`,
        variableValue: `my-value-${i}`,
      }));
    }

    expect(() => {
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [fakeSourceAction],
          },
          {
            stageName: 'Build',
            actions: [new CommandsAction({
              actionName: 'Commands',
              input: sourceOutput,
              commands: [
                'echo "MY_ENV_VAR:$MY_ENV_VAR"',
              ],
              actionEnvironmentVariables: envVars,
            })],
          },
        ],
      });
    }).toThrow(/The length of \`environmentVariables\` in action 'Commands' must be less than or equal to 10, got: 11/);
  });

  test('throw error when specifying an environment variable with a variableName that is too long', () => {
    expect(() => {
      codepipeline.EnvironmentVariable.fromPlaintext({
        variableName: 'a'.repeat(129),
        variableValue: 'my-value',
      });
    }).toThrow(/The length of \`variableName\` for \`actionEnvironmentVariables\` must be less than or equal to 128, got: 129/);
  });

  test('throw error when specifying an environment variable with a variableName that does not match the regular expression', () => {
    expect(() => {
      codepipeline.EnvironmentVariable.fromPlaintext({
        variableName: 'a-b',
        variableValue: 'my-value',
      });
    }).toThrow(/The \`variableName\` for \`actionEnvironmentVariables\` must match the regular expression: \`\[A-Za-z0-9_\]\+\`, got: a-b/);
  });
});

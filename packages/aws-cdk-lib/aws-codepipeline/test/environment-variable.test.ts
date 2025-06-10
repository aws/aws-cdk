import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';
import { Match, Template } from '../../assertions';
import { CommandsAction } from '../../aws-codepipeline-actions';
import { Secret } from '../../aws-secretsmanager';
import * as cdk from '../../core';
import * as codepipeline from '../lib';

/* eslint-disable quote-props */

describe('environment variables', () => {
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
                name: 'MY_ENV_VAR',
                value: 'my-value',
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
                name: 'MY_ENV_VAR',
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
                name: 'MY_ENV_VAR',
                value: 'my-value',
              }),
              codepipeline.EnvironmentVariable.fromSecretsManager({
                name: 'MY_SECRET_ENV_VAR',
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

  test('grants read access to the secret to the pipeline role', () => {
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
                name: 'MY_ENV_VAR',
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
            'Action': [
              'secretsmanager:GetSecretValue',
              'secretsmanager:DescribeSecret',
            ],
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

  test('throw error when specifying a secrets manager environment variable not in a commands action', () => {
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
                  name: 'MY_ENV_VAR',
                  secret: secret,
                }),
              ],
            })],
          },
        ],
      });
    }).toThrow(/Secrets Manager environment variables are only supported for the Commands action, got: Fake/);
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
        name: `MY_ENV_VAR_${i}`,
        value: `my-value-${i}`,
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

  test('throw error when specifying an environment variable with a name that is too long', () => {
    const stack = new cdk.Stack();
    const sourceOutput = new codepipeline.Artifact();
    const fakeSourceAction = new FakeSourceAction({
      actionName: 'Source',
      output: sourceOutput,
    });

    expect(() => {
      codepipeline.EnvironmentVariable.fromPlaintext({
        name: 'a'.repeat(129),
        value: 'my-value',
      });
    }).toThrow(/The length of \`name\` for \`actionEnvironmentVariables\` must be less than or equal to 128, got: 129/);
  });

  test('throw error when specifying an environment variable with a name that does not match the regular expression', () => {
    const stack = new cdk.Stack();
    const sourceOutput = new codepipeline.Artifact();
    const fakeSourceAction = new FakeSourceAction({
      actionName: 'Source',
      output: sourceOutput,
    });

    expect(() => {
      codepipeline.EnvironmentVariable.fromPlaintext({
        name: 'a-b',
        value: 'my-value',
      });
    }).toThrow(/The \`name\` for \`actionEnvironmentVariables\` must match the regular expression: \`\[A-Za-z0-9_\]\+\`, got: a-b/);
  });
});

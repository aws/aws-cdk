import { Template, Match } from '../../assertions';
import * as kms from '../../aws-kms';
import * as sm from '../../aws-secretsmanager';
import * as ssm from '../../aws-ssm';
import * as cdk from '../../core';
import * as lambda from '../lib';

describe('params and secrets', () => {
  test('can provide arn to enable params and secrets with default config options', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const layerArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [layerArn],
      Environment: {
        Variables: {
          PARAMETERS_SECRETS_EXTENSION_CACHE_ENABLED: 'true',
          PARAMETERS_SECRETS_EXTENSION_CACHE_SIZE: '1000',
          PARAMETERS_SECRETS_EXTENSION_HTTP_PORT: '2773',
          PARAMETERS_SECRETS_EXTENSION_LOG_LEVEL: 'info',
          PARAMETERS_SECRETS_EXTENSION_MAX_CONNECTIONS: '3',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '0',
          SECRETS_MANAGER_TTL: '300',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '0',
          SSM_PARAMETER_STORE_TTL: '300',
        },
      },
    });
    expect(() => app.synth()).not.toThrow();
  });

  test('can provide an arn to enable params and secrets with non-default config options', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const layerArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';
    const paramsAndSecrets = lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn, {
      cacheEnabled: false,
      cacheSize: 500,
      httpPort: 8080,
      logLevel: lambda.ParamsAndSecretsLogLevel.DEBUG,
      maxConnections: 1,
      secretsManagerTimeout: cdk.Duration.seconds(10),
      secretsManagerTtl: cdk.Duration.seconds(250),
      parameterStoreTimeout: cdk.Duration.seconds(10),
      parameterStoreTtl: cdk.Duration.seconds(250),
    });

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [layerArn],
      Environment: {
        Variables: {
          PARAMETERS_SECRETS_EXTENSION_CACHE_ENABLED: 'false',
          PARAMETERS_SECRETS_EXTENSION_CACHE_SIZE: '500',
          PARAMETERS_SECRETS_EXTENSION_HTTP_PORT: '8080',
          PARAMETERS_SECRETS_EXTENSION_LOG_LEVEL: 'debug',
          PARAMETERS_SECRETS_EXTENSION_MAX_CONNECTIONS: '1',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '10000',
          SECRETS_MANAGER_TTL: '250',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '10000',
          SSM_PARAMETER_STORE_TTL: '250',
        },
      },
    });
    expect(() => app.synth()).not.toThrow();
  });

  test('can enable params and secrets from version in non-agnostic stack - x86_64', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V1_0_103),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: ['arn:aws:lambda:us-west-2:345057560386:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4'],
      Environment: {
        Variables: {
          PARAMETERS_SECRETS_EXTENSION_CACHE_ENABLED: 'true',
          PARAMETERS_SECRETS_EXTENSION_CACHE_SIZE: '1000',
          PARAMETERS_SECRETS_EXTENSION_HTTP_PORT: '2773',
          PARAMETERS_SECRETS_EXTENSION_LOG_LEVEL: 'info',
          PARAMETERS_SECRETS_EXTENSION_MAX_CONNECTIONS: '3',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '0',
          SECRETS_MANAGER_TTL: '300',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '0',
          SSM_PARAMETER_STORE_TTL: '300',
        },
      },
    });
    expect(() => app.synth()).not.toThrow();
  });

  test('can enable params and secrets from version in agnostic stack - x86_64', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V1_0_103),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [
        {
          'Fn::FindInMap': [
            'ParamsandsecretslayerMap',
            {
              Ref: 'AWS::Region',
            },
            '1x0x103xx86x64',
          ],
        },
      ],
      Environment: {
        Variables: {
          PARAMETERS_SECRETS_EXTENSION_CACHE_ENABLED: 'true',
          PARAMETERS_SECRETS_EXTENSION_CACHE_SIZE: '1000',
          PARAMETERS_SECRETS_EXTENSION_HTTP_PORT: '2773',
          PARAMETERS_SECRETS_EXTENSION_LOG_LEVEL: 'info',
          PARAMETERS_SECRETS_EXTENSION_MAX_CONNECTIONS: '3',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '0',
          SECRETS_MANAGER_TTL: '300',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '0',
          SSM_PARAMETER_STORE_TTL: '300',
        },
      },
    });
    expect(() => app.synth()).not.toThrow();
  });

  test('can enbale params and secrets from version in non-agnostic stack - arm64', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
      paramsAndSecrets: lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V1_0_103),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: ['arn:aws:lambda:us-west-2:345057560386:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:4'],
      Environment: {
        Variables: {
          PARAMETERS_SECRETS_EXTENSION_CACHE_ENABLED: 'true',
          PARAMETERS_SECRETS_EXTENSION_CACHE_SIZE: '1000',
          PARAMETERS_SECRETS_EXTENSION_HTTP_PORT: '2773',
          PARAMETERS_SECRETS_EXTENSION_LOG_LEVEL: 'info',
          PARAMETERS_SECRETS_EXTENSION_MAX_CONNECTIONS: '3',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '0',
          SECRETS_MANAGER_TTL: '300',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '0',
          SSM_PARAMETER_STORE_TTL: '300',
        },
      },
    });
    expect(() => app.synth()).not.toThrow();
  });

  test('can enable params and secrets from version in non-agnostic stack - arm64', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
      paramsAndSecrets: lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V1_0_103),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [
        {
          'Fn::FindInMap': [
            'ParamsandsecretslayerMap',
            {
              Ref: 'AWS::Region',
            },
            '1x0x103xarm64',
          ],
        },
      ],
      Environment: {
        Variables: {
          PARAMETERS_SECRETS_EXTENSION_CACHE_ENABLED: 'true',
          PARAMETERS_SECRETS_EXTENSION_CACHE_SIZE: '1000',
          PARAMETERS_SECRETS_EXTENSION_HTTP_PORT: '2773',
          PARAMETERS_SECRETS_EXTENSION_LOG_LEVEL: 'info',
          PARAMETERS_SECRETS_EXTENSION_MAX_CONNECTIONS: '3',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '0',
          SECRETS_MANAGER_TTL: '300',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '0',
          SSM_PARAMETER_STORE_TTL: '300',
        },
      },
    });
    expect(() => app.synth()).not.toThrow();
  });

  test('can enable params and secrets from version with non-default config options', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });
    const paramsAndSecrets = lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V1_0_103, {
      cacheEnabled: false,
      cacheSize: 500,
      httpPort: 8080,
      logLevel: lambda.ParamsAndSecretsLogLevel.DEBUG,
      maxConnections: 1,
      secretsManagerTimeout: cdk.Duration.seconds(10),
      secretsManagerTtl: cdk.Duration.seconds(250),
      parameterStoreTimeout: cdk.Duration.seconds(10),
      parameterStoreTtl: cdk.Duration.seconds(250),
    });

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: ['arn:aws:lambda:us-west-2:345057560386:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4'],
      Environment: {
        Variables: {
          PARAMETERS_SECRETS_EXTENSION_CACHE_ENABLED: 'false',
          PARAMETERS_SECRETS_EXTENSION_CACHE_SIZE: '500',
          PARAMETERS_SECRETS_EXTENSION_HTTP_PORT: '8080',
          PARAMETERS_SECRETS_EXTENSION_LOG_LEVEL: 'debug',
          PARAMETERS_SECRETS_EXTENSION_MAX_CONNECTIONS: '1',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '10000',
          SECRETS_MANAGER_TTL: '250',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '10000',
          SSM_PARAMETER_STORE_TTL: '250',
        },
      },
    });
    expect(() => app.synth()).not.toThrow();
  });

  // x86_64 is supported in all regions - we're just checking for arm64
  test('throws for unsupported architecture in region', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', { env: { region: 'eu-central-2' } });

    // WHEN/THEN
    expect(() => {
      new lambda.Function (stack, 'Function', {
        functionName: 'lambda-function',
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        architecture: lambda.Architecture.ARM_64,
        paramsAndSecrets: lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V1_0_103),
      });
    }).toThrow('Parameters and Secrets Extension is not supported in region eu-central-2 for arm64 architecture');
  });

  test('can enable params and secrets with a provided secret', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const secret = new sm.Secret(stack, 'Secret');
    const layerArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';

    // WHEN
    const lambdaFunction = new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn),
    });
    secret.grantRead(lambdaFunction);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [layerArn],
      Environment: {
        Variables: {
          PARAMETERS_SECRETS_EXTENSION_CACHE_ENABLED: 'true',
          PARAMETERS_SECRETS_EXTENSION_CACHE_SIZE: '1000',
          PARAMETERS_SECRETS_EXTENSION_HTTP_PORT: '2773',
          PARAMETERS_SECRETS_EXTENSION_LOG_LEVEL: 'info',
          PARAMETERS_SECRETS_EXTENSION_MAX_CONNECTIONS: '3',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '0',
          SECRETS_MANAGER_TTL: '300',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '0',
          SSM_PARAMETER_STORE_TTL: '300',
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
            ],
          ],
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'secretsmanager:GetSecretValue',
              'secretsmanager:DescribeSecret',
            ],
            Effect: 'Allow',
            Resource: {
              Ref: 'SecretA720EF05',
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'FunctionServiceRoleDefaultPolicy2F49994A',
      Roles: [
        {
          Ref: 'FunctionServiceRole675BB04A',
        },
      ],
    });
    expect(() => app.synth()).not.toThrow();
  });

  test('can enable params and secrets with a provided secret with encryption key', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const encryptionKey = new kms.Key(stack, 'Key');
    const secret = new sm.Secret(stack, 'Secret', { encryptionKey });
    const layerArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';

    // WHEN
    const lambdaFunction = new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn),
    });
    secret.grantRead(lambdaFunction);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [layerArn],
      Environment: {
        Variables: {
          PARAMETERS_SECRETS_EXTENSION_CACHE_ENABLED: 'true',
          PARAMETERS_SECRETS_EXTENSION_CACHE_SIZE: '1000',
          PARAMETERS_SECRETS_EXTENSION_HTTP_PORT: '2773',
          PARAMETERS_SECRETS_EXTENSION_LOG_LEVEL: 'info',
          PARAMETERS_SECRETS_EXTENSION_MAX_CONNECTIONS: '3',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '0',
          SECRETS_MANAGER_TTL: '300',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '0',
          SSM_PARAMETER_STORE_TTL: '300',
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'secretsmanager:GetSecretValue',
              'secretsmanager:DescribeSecret',
            ],
            Effect: 'Allow',
            Resource: {
              Ref: 'SecretA720EF05',
            },
          },
          {
            Action: 'kms:Decrypt',
            Condition: {
              StringEquals: {
                'kms:ViaService': {
                  'Fn::Join': [
                    '',
                    [
                      'secretsmanager.',
                      {
                        Ref: 'AWS::Region',
                      },
                      '.amazonaws.com',
                    ],
                  ],
                },
              },
            },
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'FunctionServiceRoleDefaultPolicy2F49994A',
      Roles: [
        {
          Ref: 'FunctionServiceRole675BB04A',
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: Match.arrayWith([
          {
            Action: 'kms:*',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':iam::',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':root',
                  ],
                ],
              },
            },
            Resource: '*',
          },
          {
            Action: [
              'kms:Decrypt',
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            Condition: {
              StringEquals: {
                'kms:ViaService': {
                  'Fn::Join': [
                    '',
                    [
                      'secretsmanager.',
                      {
                        Ref: 'AWS::Region',
                      },
                      '.amazonaws.com',
                    ],
                  ],
                },
              },
            },
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':iam::',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':root',
                  ],
                ],
              },
            },
            Resource: '*',
          },
          {
            Action: [
              'kms:CreateGrant',
              'kms:DescribeKey',
            ],
            Condition: {
              StringEquals: {
                'kms:ViaService': {
                  'Fn::Join': [
                    '',
                    [
                      'secretsmanager.',
                      {
                        Ref: 'AWS::Region',
                      },
                      '.amazonaws.com',
                    ],
                  ],
                },
              },
            },
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':iam::',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':root',
                  ],
                ],
              },
            },
            Resource: '*',
          },
        ]),
      },
    });
  });

  test('can enable params and secrets with a provided parameter', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const parameter = new ssm.StringParameter(stack, 'Parameter', {
      parameterName: 'name',
      stringValue: 'value',
    });
    const layerArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';

    // WHEN
    const lambdaFunction = new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn),
    });
    parameter.grantRead(lambdaFunction);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [layerArn],
      Environment: {
        Variables: {
          PARAMETERS_SECRETS_EXTENSION_CACHE_ENABLED: 'true',
          PARAMETERS_SECRETS_EXTENSION_CACHE_SIZE: '1000',
          PARAMETERS_SECRETS_EXTENSION_HTTP_PORT: '2773',
          PARAMETERS_SECRETS_EXTENSION_LOG_LEVEL: 'info',
          PARAMETERS_SECRETS_EXTENSION_MAX_CONNECTIONS: '3',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '0',
          SECRETS_MANAGER_TTL: '300',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '0',
          SSM_PARAMETER_STORE_TTL: '300',
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'ssm:DescribeParameters',
              'ssm:GetParameters',
              'ssm:GetParameter',
              'ssm:GetParameterHistory',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ssm:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':parameter/',
                  {
                    Ref: 'Parameter9E1B4FBA',
                  },
                ],
              ],
            },
          },
        ],
      },
      PolicyName: 'FunctionServiceRoleDefaultPolicy2F49994A',
      Roles: [
        {
          Ref: 'FunctionServiceRole675BB04A',
        },
      ],
    });
    expect(() => app.synth()).not.toThrow();
  });

  test('can enable params and secrets with a provided parameter with encryption', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const key = new kms.Key(stack, 'Key');
    // note: parameters of type SecureString cannot be created directly from a CDK application
    const parameter = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'Parameter', {
      parameterName: 'name',
      encryptionKey: key,
    });
    const layerArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';

    // WHEN
    const lambdaFunction = new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn),
    });
    parameter.grantRead(lambdaFunction);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [layerArn],
      Environment: {
        Variables: {
          PARAMETERS_SECRETS_EXTENSION_CACHE_ENABLED: 'true',
          PARAMETERS_SECRETS_EXTENSION_CACHE_SIZE: '1000',
          PARAMETERS_SECRETS_EXTENSION_HTTP_PORT: '2773',
          PARAMETERS_SECRETS_EXTENSION_LOG_LEVEL: 'info',
          PARAMETERS_SECRETS_EXTENSION_MAX_CONNECTIONS: '3',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '0',
          SECRETS_MANAGER_TTL: '300',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '0',
          SSM_PARAMETER_STORE_TTL: '300',
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'kms:Decrypt',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
          },
          {
            Action: [
              'ssm:DescribeParameters',
              'ssm:GetParameters',
              'ssm:GetParameter',
              'ssm:GetParameterHistory',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ssm:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':parameter/name',
                ],
              ],
            },
          },
        ],
      },
      PolicyName: 'FunctionServiceRoleDefaultPolicy2F49994A',
      Roles: [
        {
          Ref: 'FunctionServiceRole675BB04A',
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [
          {
            Action: 'kms:*',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':iam::',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':root',
                  ],
                ],
              },
            },
            Resource: '*',
          },
        ],
      },
    });
    expect(() => app.synth()).not.toThrow();
  });

  test('can enable params and secrets with multiple secrets and parameters', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const secrets = [
      new sm.Secret(stack, 'Secret1'),
      new sm.Secret(stack, 'Secret2'),
    ];
    const parameters = [
      new ssm.StringParameter(stack, 'Parameter1', {
        parameterName: 'name',
        stringValue: 'value',
      }),
      new ssm.StringParameter(stack, 'Parameter2', {
        parameterName: 'name',
        stringValue: 'value',
      }),
    ];
    const layerArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';

    // WHEN
    const lambdaFunction = new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn),
    });
    secrets.forEach(secret => secret.grantRead(lambdaFunction));
    parameters.forEach(parameter => parameter.grantRead(lambdaFunction));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'secretsmanager:GetSecretValue',
              'secretsmanager:DescribeSecret',
            ],
            Effect: 'Allow',
            Resource: {
              Ref: 'Secret1C2786A59',
            },
          },
          {
            Action: [
              'secretsmanager:GetSecretValue',
              'secretsmanager:DescribeSecret',
            ],
            Effect: 'Allow',
            Resource: {
              Ref: 'Secret244EA3BB5',
            },
          },
          {
            Action: [
              'ssm:DescribeParameters',
              'ssm:GetParameters',
              'ssm:GetParameter',
              'ssm:GetParameterHistory',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ssm:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':parameter/',
                  {
                    Ref: 'Parameter184B7AC48',
                  },
                ],
              ],
            },
          },
          {
            Action: [
              'ssm:DescribeParameters',
              'ssm:GetParameters',
              'ssm:GetParameter',
              'ssm:GetParameterHistory',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ssm:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':parameter/',
                  {
                    Ref: 'Parameter28A824271',
                  },
                ],
              ],
            },
          },
        ],
      },
    });
  });

  test('throws for cacheSize < 0', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const layerArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';
    const paramsAndSecrets = lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn, {
      cacheSize: -1,
    });

    // WHEN/THEN
    expect(() => {
      new lambda.Function (stack, 'Function', {
        functionName: 'lambda-function',
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        paramsAndSecrets,
      });
    }).toThrow('Cache size must be between 0 and 1000 inclusive - provided: -1');
  });

  test('throws for cacheSize > 1000', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const layerArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';
    const paramsAndSecrets = lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn, {
      cacheSize: 1001,
    });

    // WHEN/THEN
    expect(() => {
      new lambda.Function (stack, 'Function', {
        functionName: 'lambda-function',
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        paramsAndSecrets,
      });
    }).toThrow('Cache size must be between 0 and 1000 inclusive - provided: 1001');
  });

  test('throws for httpPort < 1', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const layerArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';
    const paramsAndSecrets = lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn, {
      httpPort: 0,
    });

    // WHEN/THEN
    expect(() => {
      new lambda.Function (stack, 'Function', {
        functionName: 'lambda-function',
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        paramsAndSecrets,
      });
    }).toThrow('HTTP port must be between 1 and 65535 inclusive - provided: 0');
  });

  test('throws for httpPort > 65535', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const layerArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';
    const paramsAndSecrets = lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn, {
      httpPort: 65536,
    });

    // WHEN/THEN
    expect(() => {
      new lambda.Function (stack, 'Function', {
        functionName: 'lambda-function',
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        paramsAndSecrets,
      });
    }).toThrow('HTTP port must be between 1 and 65535 inclusive - provided: 65536');
  });

  test('throws for maxConnections < 1', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const layerArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';
    const paramsAndSecrets = lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn, {
      maxConnections: 0,
    });

    // WHEN/THEN
    expect(() => {
      new lambda.Function (stack, 'Function', {
        functionName: 'lambda-function',
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        paramsAndSecrets,
      });
    }).toThrow('Maximum connections must be at least 1 - provided: 0');
  });

  test('throws for secretsManagerTtl > 300 seconds', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const layerArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';
    const paramsAndSecrets = lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn, {
      secretsManagerTtl: cdk.Duration.seconds(301),
    });

    // WHEN/THEN
    expect(() => {
      new lambda.Function (stack, 'Function', {
        functionName: 'lambda-function',
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        paramsAndSecrets,
      });
    }).toThrow('Maximum TTL for a cached secret is 300 seconds - provided: 301 seconds');
  });

  test('throws for parameterStoreTtl > 300 seconds', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const layerArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';
    const paramsAndSecrets = lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn, {
      parameterStoreTtl: cdk.Duration.seconds(301),
    });

    // WHEN/THEN
    expect(() => {
      new lambda.Function (stack, 'Function', {
        functionName: 'lambda-function',
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        paramsAndSecrets,
      });
    }).toThrow('Maximum TTL for a cached parameter is 300 seconds - provided: 301 seconds');
  });
});

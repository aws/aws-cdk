import { Template } from '../../assertions';
import * as kms from '../../aws-kms';
import * as sm from '../../aws-secretsmanager';
import * as cdk from '../../core';
import * as lambda from '../lib';

function verifyRoleHasCorrectPolicies(stack: cdk.Stack) {
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
          Action: 'secretsmanager:GetSecretValue',
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
}

describe('params and secrets', () => {
  test('can provide arn to enable params and secrets', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const secret = new sm.Secret(stack, 'Secret');
    const layerArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: {
        layerVersion: lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn),
        secrets: [secret],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [layerArn],
      Environment: {
        Variables: {
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_ENABLED: 'true',
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_SIZE: '1000',
          PARAMETERS_AND_SECRETS_EXTENSION_HTTP_PORT: '2773',
          PARAMETERS_AND_SECRETS_EXTENSION_LOG_LEVEL: 'info',
          PARAMETERS_AND_SECRETS_EXTENSION_MAX_CONNECTIONS: '3',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '0',
          SECRETS_MANAGER_TTL: '300',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '0',
          SSM_PARAMETER_STORE_TTL: '300',
        },
      },
    });
    verifyRoleHasCorrectPolicies(stack);
    expect(() => app.synth()).not.toThrow();
  });

  test('can enable params and secrets from extension in non-agnostic stack - x86-64', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', { env: { account: '123456789012', region: 'us-west-2' } });
    const secret = new sm.Secret(stack, 'Secret');

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: {
        layerVersion: lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4),
        secrets: [secret],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: ['arn:aws:lambda:us-west-2:345057560386:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4'],
      Environment: {
        Variables: {
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_ENABLED: 'true',
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_SIZE: '1000',
          PARAMETERS_AND_SECRETS_EXTENSION_HTTP_PORT: '2773',
          PARAMETERS_AND_SECRETS_EXTENSION_LOG_LEVEL: 'info',
          PARAMETERS_AND_SECRETS_EXTENSION_MAX_CONNECTIONS: '3',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '0',
          SECRETS_MANAGER_TTL: '300',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '0',
          SSM_PARAMETER_STORE_TTL: '300',
        },
      },
    });
    verifyRoleHasCorrectPolicies(stack);
    expect(() => app.synth()).not.toThrow();
  });

  test('can enable params and secrets from extension in agnostic stack - x86-64', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const secret = new sm.Secret(stack, 'Secret');

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: {
        layerVersion: lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4),
        secrets: [secret],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [{
        'Fn::FindInMap': [
          'ParamsandsecretslayerMap',
          {
            Ref: 'AWS::Region',
          },
          '4xx86x64',
        ],
      }],
      Environment: {
        Variables: {
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_ENABLED: 'true',
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_SIZE: '1000',
          PARAMETERS_AND_SECRETS_EXTENSION_HTTP_PORT: '2773',
          PARAMETERS_AND_SECRETS_EXTENSION_LOG_LEVEL: 'info',
          PARAMETERS_AND_SECRETS_EXTENSION_MAX_CONNECTIONS: '3',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '0',
          SECRETS_MANAGER_TTL: '300',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '0',
          SSM_PARAMETER_STORE_TTL: '300',
        },
      },
    });
    verifyRoleHasCorrectPolicies(stack);
    expect(() => app.synth()).not.toThrow();
  });

  test('can enable params and secrets from extension in non-agnostic stack - arm64', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', { env: { account: '123456789012', region: 'us-west-2' } });
    const secret = new sm.Secret(stack, 'Secret');

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
      paramsAndSecrets: {
        layerVersion: lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4),
        secrets: [secret],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: ['arn:aws:lambda:us-west-2:345057560386:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:4'],
      Environment: {
        Variables: {
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_ENABLED: 'true',
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_SIZE: '1000',
          PARAMETERS_AND_SECRETS_EXTENSION_HTTP_PORT: '2773',
          PARAMETERS_AND_SECRETS_EXTENSION_LOG_LEVEL: 'info',
          PARAMETERS_AND_SECRETS_EXTENSION_MAX_CONNECTIONS: '3',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '0',
          SECRETS_MANAGER_TTL: '300',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '0',
          SSM_PARAMETER_STORE_TTL: '300',
        },
      },
    });
    verifyRoleHasCorrectPolicies(stack);
    expect(() => app.synth()).not.toThrow();
  });

  test('can enable params and secrets from extension in agnostic stack - arm64', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const secret = new sm.Secret(stack, 'Secret');

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      architecture: lambda.Architecture.ARM_64,
      paramsAndSecrets: {
        layerVersion: lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4),
        secrets: [secret],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [{
        'Fn::FindInMap': [
          'ParamsandsecretslayerMap',
          {
            Ref: 'AWS::Region',
          },
          '4xarm64',
        ],
      }],
      Environment: {
        Variables: {
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_ENABLED: 'true',
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_SIZE: '1000',
          PARAMETERS_AND_SECRETS_EXTENSION_HTTP_PORT: '2773',
          PARAMETERS_AND_SECRETS_EXTENSION_LOG_LEVEL: 'info',
          PARAMETERS_AND_SECRETS_EXTENSION_MAX_CONNECTIONS: '3',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '0',
          SECRETS_MANAGER_TTL: '300',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '0',
          SSM_PARAMETER_STORE_TTL: '300',
        },
      },
    });
    verifyRoleHasCorrectPolicies(stack);
    expect(() => app.synth()).not.toThrow();
  });

  test('can configure params and secrets configuration options with arn', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack');
    const secret = new sm.Secret(stack, 'Secret');
    const layerArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';
    const layerVersion = lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn, {
      cacheEnabled: false,
      cacheSize: 200,
      httpPort: 8080,
      logLevel: lambda.ParamsAndSecretsLogLevel.DEBUG,
      maxConnections: 5,
      secretsManagerTimeout: cdk.Duration.seconds(1),
      secretsManagerTtl: cdk.Duration.seconds(150),
      parameterStoreTimeout: cdk.Duration.seconds(2),
      parameterStoreTtl: cdk.Duration.seconds(250),
    });

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: {
        layerVersion,
        secrets: [secret],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: ['arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4'],
      Environment: {
        Variables: {
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_ENABLED: 'false',
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_SIZE: '200',
          PARAMETERS_AND_SECRETS_EXTENSION_HTTP_PORT: '8080',
          PARAMETERS_AND_SECRETS_EXTENSION_LOG_LEVEL: 'debug',
          PARAMETERS_AND_SECRETS_EXTENSION_MAX_CONNECTIONS: '5',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '1000',
          SECRETS_MANAGER_TTL: '150',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '2000',
          SSM_PARAMETER_STORE_TTL: '250',
        },
      },
    });
  });

  test('can configure params and secrets configuration options with layer version from extension', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack', { env: { account: '123456789012', region: 'us-west-2' } });
    const secret = new sm.Secret(stack, 'Secret');
    const layerVersion = lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4, {
      cacheEnabled: false,
      cacheSize: 200,
      httpPort: 8080,
      logLevel: lambda.ParamsAndSecretsLogLevel.DEBUG,
      maxConnections: 5,
      secretsManagerTimeout: cdk.Duration.seconds(1),
      secretsManagerTtl: cdk.Duration.seconds(150),
      parameterStoreTimeout: cdk.Duration.seconds(2),
      parameterStoreTtl: cdk.Duration.seconds(250),
    });

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: {
        layerVersion,
        secrets: [secret],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: ['arn:aws:lambda:us-west-2:345057560386:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4'],
      Environment: {
        Variables: {
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_ENABLED: 'false',
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_SIZE: '200',
          PARAMETERS_AND_SECRETS_EXTENSION_HTTP_PORT: '8080',
          PARAMETERS_AND_SECRETS_EXTENSION_LOG_LEVEL: 'debug',
          PARAMETERS_AND_SECRETS_EXTENSION_MAX_CONNECTIONS: '5',
          SECRETS_MANAGER_TIMEOUT_MILLIS: '1000',
          SECRETS_MANAGER_TTL: '150',
          SSM_PARAMETER_STORE_TIMEOUT_MILLIS: '2000',
          SSM_PARAMETER_STORE_TTL: '250',
        },
      },
    });
  });

  test('execution role has kms:Decrypt', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack', { env: { account: '123456789012', region: 'us-west-2' } });
    const key = new kms.Key(stack, 'Key');
    const secret = new sm.Secret(stack, 'Secret', { encryptionKey: key });
    const layerVersion = lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4);

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: {
        layerVersion,
        secrets: [secret],
      },
    });

    // THEN
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
            Action: 'secretsmanager:GetSecretValue',
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
  });

  test('can provide multiple secrets', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack', { env: { account: '123456789012', region: 'us-west-2' } });
    const secret1 = new sm.Secret(stack, 'FirstSecret');
    const secret2 = new sm.Secret(stack, 'SecondSecret');
    const layerVersion = lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4);

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: {
        layerVersion,
        secrets: [secret1, secret2],
      },
    });

    // THEN
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
            Action: 'secretsmanager:GetSecretValue',
            Effect: 'Allow',
            Resource: [
              {
                Ref: 'FirstSecret68ED90E5',
              },
              {
                Ref: 'SecondSecret188EE3B6',
              },
            ],
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
  });

  test('throws for architecture in unsupported region', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack', { env: { account: '123456789012', region: 'eu-central-2' } });
    const secret = new sm.Secret(stack, 'Secret');
    const layerVersion = lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4);

    // WHEN/THEN
    expect(() => {
      new lambda.Function (stack, 'Function', {
        functionName: 'lambda-function',
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_18_X,
        paramsAndSecrets: {
          layerVersion,
          secrets: [secret],
        },
      });
    }).toThrow('Parameters and Secrets Extension is not supported in region eu-central-2 for arm64 architecture');
  });

  test('throws for cache size < 0', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack', { env: { account: '123456789012', region: 'us-west-2' } });
    const secret = new sm.Secret(stack, 'Secret');
    const layerVersion = lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4, {
      cacheSize: -1,
    });

    // WHEN/THEN
    expect(() => {
      new lambda.Function (stack, 'Function', {
        functionName: 'lambda-function',
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        paramsAndSecrets: {
          layerVersion,
          secrets: [secret],
        },
      });
    }).toThrow('Cache size must be between 0 and 1000 inclusive - provided: -1');
  });

  test('throws for cache size > 1000', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack', { env: { account: '123456789012', region: 'us-west-2' } });
    const secret = new sm.Secret(stack, 'Secret');
    const layerVersion = lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4, {
      cacheSize: 1001,
    });

    // WHEN/THEN
    expect(() => {
      new lambda.Function (stack, 'Function', {
        functionName: 'lambda-function',
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        paramsAndSecrets: {
          layerVersion,
          secrets: [secret],
        },
      });
    }).toThrow('Cache size must be between 0 and 1000 inclusive - provided: 1001');
  });

  test('throws for port number < 1', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack', { env: { account: '123456789012', region: 'us-west-2' } });
    const secret = new sm.Secret(stack, 'Secret');
    const layerVersion = lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4, {
      httpPort: 0,
    });

    // WHEN/THEN
    expect(() => {
      new lambda.Function (stack, 'Function', {
        functionName: 'lambda-function',
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        paramsAndSecrets: {
          layerVersion,
          secrets: [secret],
        },
      });
    }).toThrow('HTTP port must be between 1 and 65535 inclusive - provided: 0');
  });

  test('throws for port number > 65535', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack', { env: { account: '123456789012', region: 'us-west-2' } });
    const secret = new sm.Secret(stack, 'Secret');
    const layerVersion = lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4, {
      httpPort: 65536,
    });

    // WHEN/THEN
    expect(() => {
      new lambda.Function (stack, 'Function', {
        functionName: 'lambda-function',
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        paramsAndSecrets: {
          layerVersion,
          secrets: [secret],
        },
      });
    }).toThrow('HTTP port must be between 1 and 65535 inclusive - provided: 65536');
  });

  test('throws for max connections < 1', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack', { env: { account: '123456789012', region: 'us-west-2' } });
    const secret = new sm.Secret(stack, 'Secret');
    const layerVersion = lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4, {
      maxConnections: 0,
    });

    // WHEN/THEN
    expect(() => {
      new lambda.Function (stack, 'Function', {
        functionName: 'lambda-function',
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        paramsAndSecrets: {
          layerVersion,
          secrets: [secret],
        },
      });
    }).toThrow('Maximum connections must be at least 1 - provided: 0');
  });

  test('throws for secrets TTL > 300 seconds', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack', { env: { account: '123456789012', region: 'us-west-2' } });
    const secret = new sm.Secret(stack, 'Secret');
    const layerVersion = lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4, {
      secretsManagerTtl: cdk.Duration.seconds(301),
    });

    // WHEN/THEN
    expect(() => {
      new lambda.Function (stack, 'Function', {
        functionName: 'lambda-function',
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        paramsAndSecrets: {
          layerVersion,
          secrets: [secret],
          parameters: []
        },
      });
    }).toThrow('Maximum TTL for a cached secret is 300 seconds - provided: 301 seconds');
  });

  test('throws for parameters TTL > 300 seconds', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'Stack', { env: { account: '123456789012', region: 'us-west-2' } });
    const secret = new sm.Secret(stack, 'Secret');
    const layerVersion = lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4, {
      parameterStoreTtl: cdk.Duration.seconds(301),
    });

    // WHEN/THEN
    expect(() => {
      new lambda.Function (stack, 'Function', {
        functionName: 'lambda-function',
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        paramsAndSecrets: {
          layerVersion,
          secrets: [secret],
        },
      });
    }).toThrow('Maximum TTL for a cached parameter is 300 seconds - provided: 301 seconds');
  });
});

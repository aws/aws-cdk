import { Template } from '../../assertions';
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
      paramsAndSecrets: {
        layerVersion: lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn),
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
    expect(() => app.synth()).not.toThrow();
  });

  test('can provide an arn to enable params and secrets with non-default config options', () => {
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
      paramsAndSecrets: {
        layerVersion: lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn, {
          cacheEnabled: false,
          cacheSize: 500,
          httpPort: 8080,
          logLevel: lambda.ParamsAndSecretsLogLevel.DEBUG,
          maxConnections: 1,
          secretsManagerTimeout: cdk.Duration.seconds(10),
          secretsManagerTtl: cdk.Duration.seconds(250),
          parameterStoreTimeout: cdk.Duration.seconds(10),
          parameterStoreTtl: cdk.Duration.seconds(250),
        }),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [layerArn],
      Environment: {
        Variables: {
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_ENABLED: 'false',
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_SIZE: '500',
          PARAMETERS_AND_SECRETS_EXTENSION_HTTP_PORT: '8080',
          PARAMETERS_AND_SECRETS_EXTENSION_LOG_LEVEL: 'debug',
          PARAMETERS_AND_SECRETS_EXTENSION_MAX_CONNECTIONS: '1',
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
      paramsAndSecrets: {
        layerVersion: lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4),
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
      paramsAndSecrets: {
        layerVersion: lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4),
      },
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
            '4xx86x64',
          ],
        },
      ],
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
      paramsAndSecrets: {
        layerVersion: lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4),
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
      paramsAndSecrets: {
        layerVersion: lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4),
      },
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
            '4xarm64',
          ],
        },
      ],
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
    expect(() => app.synth()).not.toThrow();
  });

  test('can enable params and secrets from version with non-default config options', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', { env: { region: 'us-west-2' } });

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: {
        layerVersion: lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4, {
          cacheEnabled: false,
          cacheSize: 500,
          httpPort: 8080,
          logLevel: lambda.ParamsAndSecretsLogLevel.DEBUG,
          maxConnections: 1,
          secretsManagerTimeout: cdk.Duration.seconds(10),
          secretsManagerTtl: cdk.Duration.seconds(250),
          parameterStoreTimeout: cdk.Duration.seconds(10),
          parameterStoreTtl: cdk.Duration.seconds(250),
        }),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: ['arn:aws:lambda:us-west-2:345057560386:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4'],
      Environment: {
        Variables: {
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_ENABLED: 'false',
          PARAMETERS_AND_SECRETS_EXTENSION_CACHE_SIZE: '500',
          PARAMETERS_AND_SECRETS_EXTENSION_HTTP_PORT: '8080',
          PARAMETERS_AND_SECRETS_EXTENSION_LOG_LEVEL: 'debug',
          PARAMETERS_AND_SECRETS_EXTENSION_MAX_CONNECTIONS: '1',
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
        paramsAndSecrets: {
          layerVersion: lambda.ParamsAndSecretsLayerVersion.fromVersion(lambda.ParamsAndSecretsVersions.V4),
        },
      });
    }).toThrow('Parameters and Secrets Extension is not supported in region eu-central-2 for arm64 architecture');
  });
});

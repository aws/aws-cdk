import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { S3DeployAction, S3SourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { CfnDocument, StringParameter } from 'aws-cdk-lib/aws-ssm';
import {
  Application,
  HostedConfiguration,
  ConfigurationSource,
  SourcedConfiguration,
  DeploymentStrategy,
  ConfigurationType,
  ValidatorType,
  JsonSchemaValidator,
  ConfigurationContent,
  RolloutStrategy,
} from '../lib';

describe('configuration', () => {
  test('configuration with no environments and no deployTo prop', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    new HostedConfiguration(stack, 'MyHostedConfig', {
      content: ConfigurationContent.fromInlineText('This is my content'),
      application: app,
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
    });

    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Environment', 0);
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'MyHostedConfig',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'MyHostedConfigConfigurationProfile2E1A2BBC',
      },
      Content: 'This is my content',
      ContentType: 'text/plain',
    });
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 0);
  });

  test('configuration with environments and no deployTo prop', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig', {
      name: 'MyApplication',
    });
    app.addEnvironment('MyEnv1');
    app.addEnvironment('MyEnv2');
    new HostedConfiguration(stack, 'MyHostedConfig', {
      content: ConfigurationContent.fromInlineText('This is my content'),
      application: app,
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'MyHostedConfig',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'MyHostedConfigConfigurationProfile2E1A2BBC',
      },
      Content: 'This is my content',
      ContentType: 'text/plain',
    });
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Environment', 2);
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 0);
  });

  test('configuration with environments and deployTo prop', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig', {
      name: 'MyApplication',
    });
    app.addEnvironment('MyEnv1');
    const env = app.addEnvironment('MyEnv2');
    new HostedConfiguration(stack, 'MyHostedConfig', {
      content: ConfigurationContent.fromInlineText('This is my content'),
      application: app,
      deployTo: [env],
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'MyHostedConfig',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'MyHostedConfigConfigurationProfile2E1A2BBC',
      },
      Content: 'This is my content',
      ContentType: 'text/plain',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Deployment', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      EnvironmentId: {
        Ref: 'MyAppConfigMyEnv2350437D6',
      },
      ConfigurationVersion: {
        Ref: 'MyHostedConfig51D3877D',
      },
      ConfigurationProfileId: {
        Ref: 'MyHostedConfigConfigurationProfile2E1A2BBC',
      },
      DeploymentStrategyId: {
        Ref: 'MyDeploymentStrategy60D31FB0',
      },
    });
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Environment', 2);
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 1);
  });

  test('configuration with two configurations specified', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig', {
      name: 'MyApplication',
    });
    const env1 = app.addEnvironment('MyEnv1');
    const env2 = app.addEnvironment('MyEnv2');
    const bucket = new Bucket(stack, 'MyBucket');
    new HostedConfiguration(stack, 'MyHostedConfig', {
      content: ConfigurationContent.fromInlineText('This is my content'),
      application: app,
      deployTo: [env1],
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy1', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
    });
    new SourcedConfiguration(stack, 'MySourcedConfig', {
      versionNumber: '1',
      location: ConfigurationSource.fromBucket(bucket, 'path/to/object'),
      application: app,
      deployTo: [env2],
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy2', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'MyHostedConfig',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: 'hosted',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'MyHostedConfigConfigurationProfile2E1A2BBC',
      },
      Content: 'This is my content',
      ContentType: 'text/plain',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'MySourcedConfig',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: {
        'Fn::Join': [
          '',
          [
            's3://',
            { Ref: 'MyBucketF68F3FF0' },
            '/path/to/object',
          ],
        ],
      },
      RetrievalRoleArn: { 'Fn::GetAtt': ['MySourcedConfigRole249449B1', 'Arn'] },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
      Name: 'MyDeploymentStrategy1',
      DeploymentDurationInMinutes: 30,
      GrowthFactor: 15,
      ReplicateTo: 'NONE',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
      Name: 'MyDeploymentStrategy2',
      DeploymentDurationInMinutes: 30,
      GrowthFactor: 15,
      ReplicateTo: 'NONE',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Deployment', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      EnvironmentId: {
        Ref: 'MyAppConfigMyEnv1B9120FA1',
      },
      ConfigurationVersion: {
        Ref: 'MyHostedConfig51D3877D',
      },
      ConfigurationProfileId: {
        Ref: 'MyHostedConfigConfigurationProfile2E1A2BBC',
      },
      DeploymentStrategyId: {
        Ref: 'MyDeploymentStrategy178099446',
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Deployment', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      EnvironmentId: {
        Ref: 'MyAppConfigMyEnv2350437D6',
      },
      ConfigurationVersion: '1',
      ConfigurationProfileId: {
        Ref: 'MySourcedConfig5455C47C',
      },
      DeploymentStrategyId: {
        Ref: 'MyDeploymentStrategy202B80715',
      },
    });
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::ConfigurationProfile', 2);
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Environment', 2);
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 2);
  });

  test('configuration with two configurations and no deployment strategy specified', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig', {
      name: 'MyApplication',
    });
    const bucket = new Bucket(stack, 'MyBucket');
    new HostedConfiguration(stack, 'MyHostedConfig', {
      content: ConfigurationContent.fromInlineText('This is my content'),
      application: app,
    });
    new SourcedConfiguration(stack, 'MySourcedConfig', {
      versionNumber: '1',
      location: ConfigurationSource.fromBucket(bucket, 'path/to/object'),
      application: app,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
      Name: 'MyHostedConfig-DeploymentStrategy-A5936E60',
      DeploymentDurationInMinutes: 20,
      GrowthFactor: 10,
      ReplicateTo: 'NONE',
      FinalBakeTimeInMinutes: 10,
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
      Name: 'MySourcedConfig-DeploymentStrategy-7A104657',
      DeploymentDurationInMinutes: 20,
      GrowthFactor: 10,
      ReplicateTo: 'NONE',
      FinalBakeTimeInMinutes: 10,
    });
  });

  test('deploy secret with kms key', () => {
    const stack = new cdk.Stack();
    const key = new Key(stack, 'MyKey');
    const secret = new Secret(stack, 'MySecret');
    const app = new Application(stack, 'MyAppConfig');
    new SourcedConfiguration(stack, 'MySourcedConfig', {
      versionNumber: '1',
      location: ConfigurationSource.fromSecret(secret),
      deploymentKey: key,
      application: app,
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
      deployTo: [app.addEnvironment('Environment')],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Deployment', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      EnvironmentId: {
        Ref: 'MyAppConfigEnvironment833A9182',
      },
      ConfigurationVersion: '1',
      ConfigurationProfileId: {
        Ref: 'MySourcedConfig5455C47C',
      },
      DeploymentStrategyId: {
        Ref: 'MyDeploymentStrategy60D31FB0',
      },
      KmsKeyIdentifier: { 'Fn::GetAtt': ['MyKey6AB29FA6', 'Arn'] },
    });
  });

  test('default configuration from inline', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    new HostedConfiguration(stack, 'MyConfiguration', {
      application: app,
      content: ConfigurationContent.fromInlineText('This is my content'),
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
      deployTo: [app.addEnvironment('Environment')],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'MyConfiguration',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: 'hosted',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'MyConfigurationConfigurationProfileEE0ECA85',
      },
      Content: 'This is my content',
      ContentType: 'text/plain',
    });
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 1);
  });

  test('default configuration from file', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    new HostedConfiguration(stack, 'MyConfiguration', {
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
      application: app,
      content: ConfigurationContent.fromFile('test/config.json'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'MyConfiguration',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: 'hosted',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'MyConfigurationConfigurationProfileEE0ECA85',
      },
      Content: '{\n  "content": "This is the configuration content"\n}',
      ContentType: 'application/json',
    });
  });

  test('default configuration from inline octet', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    new HostedConfiguration(stack, 'MyConfiguration', {
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
      application: app,
      content: ConfigurationContent.fromInline('This should be of content type application/octet'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'MyConfiguration',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: 'hosted',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'MyConfigurationConfigurationProfileEE0ECA85',
      },
      Content: 'This should be of content type application/octet',
      ContentType: 'application/octet-stream',
    });
  });

  test('default configuration from inline yaml', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    new HostedConfiguration(stack, 'MyConfiguration', {
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
      application: app,
      content: ConfigurationContent.fromInlineYaml('This should be of content type application/x-yaml'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'MyConfiguration',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: 'hosted',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'MyConfigurationConfigurationProfileEE0ECA85',
      },
      Content: 'This should be of content type application/x-yaml',
      ContentType: 'application/x-yaml',
    });
  });

  test('configuration profile with name', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    new HostedConfiguration(stack, 'MyConfigurationProfile', {
      name: 'TestConfigProfile',
      application: app,
      content: ConfigurationContent.fromInlineText('This is my content'),
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'TestConfigProfile',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: 'hosted',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'MyConfigurationProfile33A97163',
      },
      Content: 'This is my content',
      ContentType: 'text/plain',
    });
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 0);
  });

  test('configuration profile with type', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    new HostedConfiguration(stack, 'MyConfigurationProfile', {
      name: 'TestConfigProfile',
      application: app,
      type: ConfigurationType.FEATURE_FLAGS,
      content: ConfigurationContent.fromInlineText('This is my content'),
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'TestConfigProfile',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      Type: 'AWS.AppConfig.FeatureFlags',
      LocationUri: 'hosted',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'MyConfigurationProfile33A97163',
      },
      Content: 'This is my content',
      ContentType: 'text/plain',
    });
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 0);
  });

  test('configuration profile with description', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    new HostedConfiguration(stack, 'MyConfigurationProfile', {
      name: 'TestConfigProfile',
      application: app,
      content: ConfigurationContent.fromInlineText('This is my content'),
      description: 'This is my description',
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'TestConfigProfile',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      Description: 'This is my description',
      LocationUri: 'hosted',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'MyConfigurationProfile33A97163',
      },
      Content: 'This is my content',
      ContentType: 'text/plain',
      Description: 'This is my description',
    });
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 0);
  });

  test('configuration profile with validator', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    new HostedConfiguration(stack, 'MyConfigurationProfile', {
      name: 'TestConfigProfile',
      application: app,
      content: ConfigurationContent.fromInlineText('This is my content'),
      validators: [
        {
          content: 'dummy validator',
          type: ValidatorType.JSON_SCHEMA,
        },
      ],
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'TestConfigProfile',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      Validators: [
        {
          Type: 'JSON_SCHEMA',
          Content: 'dummy validator',
        },
      ],
      LocationUri: 'hosted',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'MyConfigurationProfile33A97163',
      },
      Content: 'This is my content',
      ContentType: 'text/plain',
    });
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 0);
  });

  test('configuration profile with inline json schema validator', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    const validatorContent = `
    {
      "type": "object",
      "properties": {
        "computeResource": {
          "type": "object",
          "properties": {
            "ComputeAL1ImageId": {
              "type": "object",
              "properties": {
                "me-south-1": { "type": "string" },
                "ap-east-1": { "type": "string" },
                "ap-northeast-1": { "type": "string" },
                "ap-northeast-2": { "type": "string" },
                "ap-south-1": { "type": "string" },
                "ap-southeast-1": { "type": "string" },
                "ap-southeast-2": { "type": "string" },
                "ca-central-1": { "type": "string" },
                "cn-north-1": { "type": "string" },
                "cn-northwest-1": { "type": "string" },
                "eu-central-1": { "type": "string" },
                "eu-north-1": { "type": "string" },
                "eu-west-1": { "type": "string" },
                "eu-west-2": { "type": "string" },
                "eu-west-3": { "type": "string" },
                "sa-east-1": { "type": "string" },
                "us-east-1": { "type": "string" },
                "us-east-2": { "type": "string" },
                "us-gov-west-1": { "type": "string" },
                "us-gov-east-1": { "type": "string" },
                "us-west-1": { "type": "string" },
                "us-west-2": { "type": "string" },
                "eu-south-1": { "type": "string" },
                "ap-northeast-3": { "type": "string" },
                "af-south-1": { "type": "string" }
              }
            },
            "GPUImageId": {
              "type": "object",
              "properties": {
                "me-south-1": { "type": "string" },
                "ap-east-1": { "type": "string" },
                "ap-northeast-1": { "type": "string" },
                "ap-northeast-2": { "type": "string" },
                "ap-south-1": { "type": "string" },
                "ap-southeast-1": { "type": "string" },
                "ap-southeast-2": { "type": "string" },
                "ca-central-1": { "type": "string" },
                "cn-north-1": { "type": "string" },
                "cn-northwest-1": { "type": "string" },
                "eu-central-1": { "type": "string" },
                "eu-north-1": { "type": "string" },
                "eu-west-1": { "type": "string" },
                "eu-west-2": { "type": "string" },
                "eu-west-3": { "type": "string" },
                "sa-east-1": { "type": "string" },
                "us-east-1": { "type": "string" },
                "us-east-2": { "type": "string" },
                "us-gov-west-1": { "type": "string" },
                "us-gov-east-1": { "type": "string" },
                "us-west-1": { "type": "string" },
                "us-west-2": { "type": "string" },
                "eu-south-1": { "type": "string" },
                "ap-northeast-3": { "type": "string" },
                "af-south-1": { "type": "string" }
              }
            },
            "ARMImageId": {
              "type": "object",
              "properties": {
                "me-south-1": { "type": "string" },
                "ap-east-1": { "type": "string" },
                "ap-northeast-1": { "type": "string" },
                "ap-northeast-2": { "type": "string" },
                "ap-south-1": { "type": "string" },
                "ap-southeast-1": { "type": "string" },
                "ap-southeast-2": { "type": "string" },
                "ca-central-1": { "type": "string" },
                "cn-north-1": { "type": "string" },
                "cn-northwest-1": { "type": "string" },
                "eu-central-1": { "type": "string" },
                "eu-north-1": { "type": "string" },
                "eu-west-1": { "type": "string" },
                "eu-west-2": { "type": "string" },
                "eu-west-3": { "type": "string" },
                "sa-east-1": { "type": "string" },
                "us-east-1": { "type": "string" },
                "us-east-2": { "type": "string" },
                "us-gov-west-1": { "type": "string" },
                "us-gov-east-1": { "type": "string" },
                "us-west-1": { "type": "string" },
                "us-west-2": { "type": "string" },
                "eu-south-1": { "type": "string" },
                "ap-northeast-3": { "type": "string" },
                "af-south-1": { "type": "string" }
              }
            },
            "ComputeAL2ImageId": {
              "type": "object",
              "properties": {
                "me-south-1": { "type": "string" },
                "ap-east-1": { "type": "string" },
                "ap-northeast-1": { "type": "string" },
                "ap-northeast-2": { "type": "string" },
                "ap-south-1": { "type": "string" },
                "ap-southeast-1": { "type": "string" },
                "ap-southeast-2": { "type": "string" },
                "ca-central-1": { "type": "string" },
                "cn-north-1": { "type": "string" },
                "cn-northwest-1": { "type": "string" },
                "eu-central-1": { "type": "string" },
                "eu-north-1": { "type": "string" },
                "eu-west-1": { "type": "string" },
                "eu-west-2": { "type": "string" },
                "eu-west-3": { "type": "string" },
                "sa-east-1": { "type": "string" },
                "us-east-1": { "type": "string" },
                "us-east-2": { "type": "string" },
                "us-gov-west-1": { "type": "string" },
                "us-gov-east-1": { "type": "string" },
                "us-west-1": { "type": "string" },
                "us-west-2": { "type": "string" },
                "eu-south-1": { "type": "string" },
                "ap-northeast-3": { "type": "string" },
                "af-south-1": { "type": "string" }
              }
            }
          }
        }
      }
    }`;
    new HostedConfiguration(stack, 'MyConfiguration', {
      name: 'TestConfigProfile',
      application: app,
      validators: [
        JsonSchemaValidator.fromInline(validatorContent),
        JsonSchemaValidator.fromFile('test/schema.json'),
      ],
      content: ConfigurationContent.fromInlineText('This is my content'),
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'TestConfigProfile',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      Validators: [
        {
          Type: 'JSON_SCHEMA',
          Content: '\n    {\n      \"type\": \"object\",\n      \"properties\": {\n        \"computeResource\": {\n          \"type\": \"object\",\n          \"properties\": {\n            \"ComputeAL1ImageId\": {\n              \"type\": \"object\",\n              \"properties\": {\n                \"me-south-1\": { \"type\": \"string\" },\n                \"ap-east-1\": { \"type\": \"string\" },\n                \"ap-northeast-1\": { \"type\": \"string\" },\n                \"ap-northeast-2\": { \"type\": \"string\" },\n                \"ap-south-1\": { \"type\": \"string\" },\n                \"ap-southeast-1\": { \"type\": \"string\" },\n                \"ap-southeast-2\": { \"type\": \"string\" },\n                \"ca-central-1\": { \"type\": \"string\" },\n                \"cn-north-1\": { \"type\": \"string\" },\n                \"cn-northwest-1\": { \"type\": \"string\" },\n                \"eu-central-1\": { \"type\": \"string\" },\n                \"eu-north-1\": { \"type\": \"string\" },\n                \"eu-west-1\": { \"type\": \"string\" },\n                \"eu-west-2\": { \"type\": \"string\" },\n                \"eu-west-3\": { \"type\": \"string\" },\n                \"sa-east-1\": { \"type\": \"string\" },\n                \"us-east-1\": { \"type\": \"string\" },\n                \"us-east-2\": { \"type\": \"string\" },\n                \"us-gov-west-1\": { \"type\": \"string\" },\n                \"us-gov-east-1\": { \"type\": \"string\" },\n                \"us-west-1\": { \"type\": \"string\" },\n                \"us-west-2\": { \"type\": \"string\" },\n                \"eu-south-1\": { \"type\": \"string\" },\n                \"ap-northeast-3\": { \"type\": \"string\" },\n                \"af-south-1\": { \"type\": \"string\" }\n              }\n            },\n            \"GPUImageId\": {\n              \"type\": \"object\",\n              \"properties\": {\n                \"me-south-1\": { \"type\": \"string\" },\n                \"ap-east-1\": { \"type\": \"string\" },\n                \"ap-northeast-1\": { \"type\": \"string\" },\n                \"ap-northeast-2\": { \"type\": \"string\" },\n                \"ap-south-1\": { \"type\": \"string\" },\n                \"ap-southeast-1\": { \"type\": \"string\" },\n                \"ap-southeast-2\": { \"type\": \"string\" },\n                \"ca-central-1\": { \"type\": \"string\" },\n                \"cn-north-1\": { \"type\": \"string\" },\n                \"cn-northwest-1\": { \"type\": \"string\" },\n                \"eu-central-1\": { \"type\": \"string\" },\n                \"eu-north-1\": { \"type\": \"string\" },\n                \"eu-west-1\": { \"type\": \"string\" },\n                \"eu-west-2\": { \"type\": \"string\" },\n                \"eu-west-3\": { \"type\": \"string\" },\n                \"sa-east-1\": { \"type\": \"string\" },\n                \"us-east-1\": { \"type\": \"string\" },\n                \"us-east-2\": { \"type\": \"string\" },\n                \"us-gov-west-1\": { \"type\": \"string\" },\n                \"us-gov-east-1\": { \"type\": \"string\" },\n                \"us-west-1\": { \"type\": \"string\" },\n                \"us-west-2\": { \"type\": \"string\" },\n                \"eu-south-1\": { \"type\": \"string\" },\n                \"ap-northeast-3\": { \"type\": \"string\" },\n                \"af-south-1\": { \"type\": \"string\" }\n              }\n            },\n            \"ARMImageId\": {\n              \"type\": \"object\",\n              \"properties\": {\n                \"me-south-1\": { \"type\": \"string\" },\n                \"ap-east-1\": { \"type\": \"string\" },\n                \"ap-northeast-1\": { \"type\": \"string\" },\n                \"ap-northeast-2\": { \"type\": \"string\" },\n                \"ap-south-1\": { \"type\": \"string\" },\n                \"ap-southeast-1\": { \"type\": \"string\" },\n                \"ap-southeast-2\": { \"type\": \"string\" },\n                \"ca-central-1\": { \"type\": \"string\" },\n                \"cn-north-1\": { \"type\": \"string\" },\n                \"cn-northwest-1\": { \"type\": \"string\" },\n                \"eu-central-1\": { \"type\": \"string\" },\n                \"eu-north-1\": { \"type\": \"string\" },\n                \"eu-west-1\": { \"type\": \"string\" },\n                \"eu-west-2\": { \"type\": \"string\" },\n                \"eu-west-3\": { \"type\": \"string\" },\n                \"sa-east-1\": { \"type\": \"string\" },\n                \"us-east-1\": { \"type\": \"string\" },\n                \"us-east-2\": { \"type\": \"string\" },\n                \"us-gov-west-1\": { \"type\": \"string\" },\n                \"us-gov-east-1\": { \"type\": \"string\" },\n                \"us-west-1\": { \"type\": \"string\" },\n                \"us-west-2\": { \"type\": \"string\" },\n                \"eu-south-1\": { \"type\": \"string\" },\n                \"ap-northeast-3\": { \"type\": \"string\" },\n                \"af-south-1\": { \"type\": \"string\" }\n              }\n            },\n            \"ComputeAL2ImageId\": {\n              \"type\": \"object\",\n              \"properties\": {\n                \"me-south-1\": { \"type\": \"string\" },\n                \"ap-east-1\": { \"type\": \"string\" },\n                \"ap-northeast-1\": { \"type\": \"string\" },\n                \"ap-northeast-2\": { \"type\": \"string\" },\n                \"ap-south-1\": { \"type\": \"string\" },\n                \"ap-southeast-1\": { \"type\": \"string\" },\n                \"ap-southeast-2\": { \"type\": \"string\" },\n                \"ca-central-1\": { \"type\": \"string\" },\n                \"cn-north-1\": { \"type\": \"string\" },\n                \"cn-northwest-1\": { \"type\": \"string\" },\n                \"eu-central-1\": { \"type\": \"string\" },\n                \"eu-north-1\": { \"type\": \"string\" },\n                \"eu-west-1\": { \"type\": \"string\" },\n                \"eu-west-2\": { \"type\": \"string\" },\n                \"eu-west-3\": { \"type\": \"string\" },\n                \"sa-east-1\": { \"type\": \"string\" },\n                \"us-east-1\": { \"type\": \"string\" },\n                \"us-east-2\": { \"type\": \"string\" },\n                \"us-gov-west-1\": { \"type\": \"string\" },\n                \"us-gov-east-1\": { \"type\": \"string\" },\n                \"us-west-1\": { \"type\": \"string\" },\n                \"us-west-2\": { \"type\": \"string\" },\n                \"eu-south-1\": { \"type\": \"string\" },\n                \"ap-northeast-3\": { \"type\": \"string\" },\n                \"af-south-1\": { \"type\": \"string\" }\n              }\n            }\n          }\n        }\n      }\n    }',
        },
        {
          Type: 'JSON_SCHEMA',
          Content: '{\n  \"$schema\": \"http://json-schema.org/draft-07/schema#\",\n  \"type\": \"string\"\n}',
        },
      ],
      LocationUri: 'hosted',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'MyConfigurationConfigurationProfileEE0ECA85',
      },
      Content: 'This is my content',
      ContentType: 'text/plain',
    });
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 0);
  });

  test('configuration profile with ssm parameter', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    const parameter = new StringParameter(stack, 'MyParameter', {
      stringValue: 'This is the content stored in ssm parameter',
      parameterName: 'my-parameter',
    });
    new SourcedConfiguration(stack, 'MyConfiguration', {
      name: 'TestConfigProfile',
      location: ConfigurationSource.fromParameter(parameter),
      versionNumber: '1',
      application: app,
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
      deployTo: [app.addEnvironment('Environment')],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'TestConfigProfile',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':ssm:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':parameter/',
            { Ref: 'MyParameter18BA547D' },
          ],
        ],
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Effect: iam.Effect.ALLOW,
                Resource: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      { Ref: 'AWS::Partition' },
                      ':ssm:',
                      { Ref: 'AWS::Region' },
                      ':',
                      { Ref: 'AWS::AccountId' },
                      ':parameter/',
                      { Ref: 'MyParameter18BA547D' },
                    ],
                  ],
                },
                Action: 'ssm:GetParameter',
              },
            ],
          },
          PolicyName: 'AllowAppConfigReadFromSourcePolicy',
        },
      ],
    });
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 1);
  });

  test('configuration profile with ssm document', () => {
    const stack = new cdk.Stack();
    const document = new CfnDocument(stack, 'MyDocument', {
      content: {
        mainSteps: [
          {
            action: 'aws:runShellScript',
          },
        ],
      },
      name: 'TestDocumentName',
    });
    const app = new Application(stack, 'MyAppConfig');
    new SourcedConfiguration(stack, 'MyConfiguration', {
      name: 'TestConfigProfile',
      location: ConfigurationSource.fromCfnDocument(document),
      versionNumber: '1',
      application: app,
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
      deployTo: [app.addEnvironment('Environment')],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'TestConfigProfile',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: {
        'Fn::Join': [
          '',
          [
            'ssm-document://',
            { Ref: 'MyDocument' },
          ],
        ],
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Effect: iam.Effect.ALLOW,
                Resource: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      { Ref: 'AWS::Partition' },
                      ':ssm:',
                      { Ref: 'AWS::Region' },
                      ':',
                      { Ref: 'AWS::AccountId' },
                      ':document/',
                      { Ref: 'MyDocument' },
                    ],
                  ],
                },
                Action: 'ssm:GetDocument',
              },
            ],
          },
          PolicyName: 'AllowAppConfigReadFromSourcePolicy',
        },
      ],
    });
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 1);
  });

  test('configuration profile with s3 object', () => {
    const stack = new cdk.Stack();
    const bucket = new Bucket(stack, 'MyBucket', {
      bucketName: 'bucket',
    });
    const app = new Application(stack, 'MyAppConfig');
    new SourcedConfiguration(stack, 'MyConfiguration', {
      name: 'TestConfigProfile',
      location: ConfigurationSource.fromBucket(bucket, 'hello/file.txt'),
      versionNumber: '1',
      application: app,
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
      deployTo: [app.addEnvironment('Environment')],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'TestConfigProfile',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: {
        'Fn::Join': [
          '',
          [
            's3://',
            { Ref: 'MyBucketF68F3FF0' },
            '/hello/file.txt',
          ],
        ],
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Effect: iam.Effect.ALLOW,
                Resource: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      { Ref: 'AWS::Partition' },
                      ':s3:::',
                      { Ref: 'MyBucketF68F3FF0' },
                      '/hello/file.txt',
                    ],
                  ],
                },
                Action: [
                  's3:GetObject',
                  's3:GetObjectMetadata',
                  's3:GetObjectVersion',
                ],
              },
              {
                Effect: iam.Effect.ALLOW,
                Resource: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      { Ref: 'AWS::Partition' },
                      ':s3:::',
                      { Ref: 'MyBucketF68F3FF0' },
                    ],
                  ],
                },
                Action: [
                  's3:GetBucketLocation',
                  's3:GetBucketVersioning',
                  's3:ListBucket',
                  's3:ListBucketVersions',
                ],
              },
              {
                Effect: iam.Effect.ALLOW,
                Resource: '*',
                Action: 's3:ListAllMyBuckets',
              },
            ],
          },
          PolicyName: 'AllowAppConfigReadFromSourcePolicy',
        },
      ],
    });
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 1);
  });

  test('configuration profile with codepipeline', () => {
    const stack = new cdk.Stack();
    const bucket = new Bucket(stack, 'MyBucket');
    const sourceAction = new S3SourceAction({
      actionName: 'Source',
      bucket: bucket,
      bucketKey: 'hello/world/codepipeline.txt',
      output: new Artifact('SourceOutput'),
    });
    const deployAction = new S3DeployAction({
      actionName: 'Deploy',
      input: Artifact.artifact('SourceOutput'),
      bucket: bucket,
      extract: true,
    });
    const pipeline = new Pipeline(stack, 'MyPipeline', {
      stages: [
        {
          stageName: 'beta',
          actions: [sourceAction],
        },
        {
          stageName: 'prod',
          actions: [deployAction],
        },
      ],
    });
    const app = new Application(stack, 'MyAppConfig');
    new SourcedConfiguration(stack, 'MyConfiguration', {
      name: 'TestConfigProfile',
      location: ConfigurationSource.fromPipeline(pipeline),
      application: app,
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
      deployTo: [app.addEnvironment('Environment')],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'TestConfigProfile',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: {
        'Fn::Join': [
          '',
          [
            'codepipeline://',
            { Ref: 'MyPipelineAED38ECF' },
          ],
        ],
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 3);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 3);
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 0);
  });

  test('configuration profile with secretsmanager', () => {
    const stack = new cdk.Stack();
    const secret = new Secret(stack, 'MySecret', {
      secretStringValue: cdk.SecretValue.unsafePlainText('This is the content stored in secrets manager'),
      secretName: 'secret',
    });
    Object.defineProperty(secret, 'secretArn', {
      value: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret',
    });
    const app = new Application(stack, 'MyAppConfig');
    new SourcedConfiguration(stack, 'MyConfiguration', {
      name: 'TestConfigProfile',
      location: ConfigurationSource.fromSecret(secret),
      versionNumber: '1',
      application: app,
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
      deployTo: [app.addEnvironment('Environment')],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'TestConfigProfile',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Effect: iam.Effect.ALLOW,
                Resource: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret',
                Action: 'secretsmanager:GetSecretValue',
              },
            ],
          },
          PolicyName: 'AllowAppConfigReadFromSourcePolicy',
        },
      ],
    });
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 1);
  });

  test('configuration profile with secretsmanager and kms', () => {
    const stack = new cdk.Stack();
    const key = new Key(stack, 'MyKey');
    const secret = new Secret(stack, 'MySecret', {
      secretStringValue: cdk.SecretValue.unsafePlainText('This is the content stored in secrets manager'),
      secretName: 'secret',
      encryptionKey: key,
    });
    Object.defineProperty(secret, 'secretArn', {
      value: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret',
    });
    const app = new Application(stack, 'MyAppConfig');
    new SourcedConfiguration(stack, 'MyConfiguration', {
      name: 'TestConfigProfile',
      location: ConfigurationSource.fromSecret(secret),
      versionNumber: '1',
      application: app,
      deploymentStrategy: new DeploymentStrategy(stack, 'MyDeploymentStrategy', {
        rolloutStrategy: RolloutStrategy.linear({
          growthFactor: 15,
          deploymentDuration: cdk.Duration.minutes(30),
        }),
      }),
      deployTo: [app.addEnvironment('Environment')],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'TestConfigProfile',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Effect: iam.Effect.ALLOW,
                Resource: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret',
                Action: 'secretsmanager:GetSecretValue',
              },
              {
                Effect: iam.Effect.ALLOW,
                Resource: {
                  'Fn::GetAtt': ['MyKey6AB29FA6', 'Arn'],
                },
                Action: 'kms:Decrypt',
              },
            ],
          },
          PolicyName: 'AllowAppConfigReadFromSourcePolicy',
        },
      ],
    });
    Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 1);
  });
});

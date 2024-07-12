"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const assertions_1 = require("aws-cdk-lib/assertions");
const aws_codepipeline_1 = require("aws-cdk-lib/aws-codepipeline");
const aws_codepipeline_actions_1 = require("aws-cdk-lib/aws-codepipeline-actions");
const iam = require("aws-cdk-lib/aws-iam");
const aws_kms_1 = require("aws-cdk-lib/aws-kms");
const aws_s3_1 = require("aws-cdk-lib/aws-s3");
const aws_secretsmanager_1 = require("aws-cdk-lib/aws-secretsmanager");
const aws_ssm_1 = require("aws-cdk-lib/aws-ssm");
const lib_1 = require("../lib");
describe('configuration', () => {
    test('configuration with no environments and no deployTo prop', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.HostedConfiguration(stack, 'MyHostedConfig', {
            content: lib_1.ConfigurationContent.fromInlineText('This is my content'),
            application: app,
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Environment', 0);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
            Name: 'MyHostedConfig',
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            ConfigurationProfileId: {
                Ref: 'MyHostedConfigConfigurationProfile2E1A2BBC',
            },
            Content: 'This is my content',
            ContentType: 'text/plain',
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 0);
    });
    test('configuration with environments and no deployTo prop', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig', {
            applicationName: 'MyApplication',
        });
        app.addEnvironment('MyEnv1');
        app.addEnvironment('MyEnv2');
        new lib_1.HostedConfiguration(stack, 'MyHostedConfig', {
            content: lib_1.ConfigurationContent.fromInlineText('This is my content'),
            application: app,
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
            Name: 'MyHostedConfig',
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            ConfigurationProfileId: {
                Ref: 'MyHostedConfigConfigurationProfile2E1A2BBC',
            },
            Content: 'This is my content',
            ContentType: 'text/plain',
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Environment', 2);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 0);
    });
    test('configuration with environments and deployTo prop', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig', {
            applicationName: 'MyApplication',
        });
        app.addEnvironment('MyEnv1');
        const env = app.addEnvironment('MyEnv2');
        new lib_1.HostedConfiguration(stack, 'MyHostedConfig', {
            content: lib_1.ConfigurationContent.fromInlineText('This is my content'),
            application: app,
            deployTo: [env],
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
            Name: 'MyHostedConfig',
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            ConfigurationProfileId: {
                Ref: 'MyHostedConfigConfigurationProfile2E1A2BBC',
            },
            Content: 'This is my content',
            ContentType: 'text/plain',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Deployment', {
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
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Environment', 2);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 1);
    });
    test('configuration using deploy method and no environment associated', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig', {
            applicationName: 'MyApplication',
        });
        app.addEnvironment('MyEnv1');
        const env = app.addEnvironment('MyEnv2');
        const config = new lib_1.HostedConfiguration(stack, 'MyHostedConfig', {
            content: lib_1.ConfigurationContent.fromInlineText('This is my content'),
            application: app,
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
        });
        config.deploy(env);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Deployment', {
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
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 1);
    });
    test('configuration using deploy method with environment associated', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig', {
            applicationName: 'MyApplication',
        });
        const env1 = app.addEnvironment('MyEnv1');
        const env2 = app.addEnvironment('MyEnv2');
        const config = new lib_1.HostedConfiguration(stack, 'MyHostedConfig', {
            content: lib_1.ConfigurationContent.fromInlineText('This is my content'),
            application: app,
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
            deployTo: [env1],
        });
        config.deploy(env2);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Deployment', {
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
                Ref: 'MyDeploymentStrategy60D31FB0',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Deployment', {
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
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 2);
    });
    test('configuration with no environment associated and no deploy method used', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig', {
            applicationName: 'MyApplication',
        });
        new lib_1.HostedConfiguration(stack, 'MyHostedConfig', {
            content: lib_1.ConfigurationContent.fromInlineText('This is my content'),
            application: app,
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 0);
    });
    test('configuration with two configurations specified', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig', {
            applicationName: 'MyApplication',
        });
        const env1 = app.addEnvironment('MyEnv1');
        const env2 = app.addEnvironment('MyEnv2');
        const bucket = new aws_s3_1.Bucket(stack, 'MyBucket');
        new lib_1.HostedConfiguration(stack, 'MyHostedConfig', {
            content: lib_1.ConfigurationContent.fromInlineText('This is my content'),
            application: app,
            deployTo: [env1],
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy1', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
        });
        new lib_1.SourcedConfiguration(stack, 'MySourcedConfig', {
            versionNumber: '1',
            location: lib_1.ConfigurationSource.fromBucket(bucket, 'path/to/object'),
            application: app,
            deployTo: [env2],
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy2', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
            Name: 'MyHostedConfig',
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            LocationUri: 'hosted',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            ConfigurationProfileId: {
                Ref: 'MyHostedConfigConfigurationProfile2E1A2BBC',
            },
            Content: 'This is my content',
            ContentType: 'text/plain',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
            Name: 'MyDeploymentStrategy1',
            DeploymentDurationInMinutes: 30,
            GrowthFactor: 15,
            ReplicateTo: 'NONE',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
            Name: 'MyDeploymentStrategy2',
            DeploymentDurationInMinutes: 30,
            GrowthFactor: 15,
            ReplicateTo: 'NONE',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Deployment', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Deployment', {
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
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::ConfigurationProfile', 2);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Environment', 2);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 2);
    });
    test('configuration with two configurations and no deployment strategy specified', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig', {
            applicationName: 'MyApplication',
        });
        const bucket = new aws_s3_1.Bucket(stack, 'MyBucket');
        new lib_1.HostedConfiguration(stack, 'MyHostedConfig', {
            content: lib_1.ConfigurationContent.fromInlineText('This is my content'),
            application: app,
        });
        new lib_1.SourcedConfiguration(stack, 'MySourcedConfig', {
            versionNumber: '1',
            location: lib_1.ConfigurationSource.fromBucket(bucket, 'path/to/object'),
            application: app,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
            Name: 'MyHostedConfig-DeploymentStrategy-A5936E60',
            DeploymentDurationInMinutes: 20,
            GrowthFactor: 10,
            ReplicateTo: 'NONE',
            FinalBakeTimeInMinutes: 10,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::DeploymentStrategy', {
            Name: 'MySourcedConfig-DeploymentStrategy-7A104657',
            DeploymentDurationInMinutes: 20,
            GrowthFactor: 10,
            ReplicateTo: 'NONE',
            FinalBakeTimeInMinutes: 10,
        });
    });
    test('deploy secret with kms key', () => {
        const stack = new cdk.Stack();
        const key = new aws_kms_1.Key(stack, 'MyKey');
        const secret = new aws_secretsmanager_1.Secret(stack, 'MySecret');
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.SourcedConfiguration(stack, 'MySourcedConfig', {
            versionNumber: '1',
            location: lib_1.ConfigurationSource.fromSecret(secret),
            deploymentKey: key,
            application: app,
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
            deployTo: [app.addEnvironment('Environment')],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Deployment', {
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
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.HostedConfiguration(stack, 'MyConfiguration', {
            application: app,
            content: lib_1.ConfigurationContent.fromInlineText('This is my content'),
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
            deployTo: [app.addEnvironment('Environment')],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
            Name: 'MyConfiguration',
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            LocationUri: 'hosted',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            ConfigurationProfileId: {
                Ref: 'MyConfigurationConfigurationProfileEE0ECA85',
            },
            Content: 'This is my content',
            ContentType: 'text/plain',
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 1);
    });
    test('default configuration from file', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.HostedConfiguration(stack, 'MyConfiguration', {
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
            application: app,
            content: lib_1.ConfigurationContent.fromFile('test/config.json'),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
            Name: 'MyConfiguration',
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            LocationUri: 'hosted',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
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
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.HostedConfiguration(stack, 'MyConfiguration', {
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
            application: app,
            content: lib_1.ConfigurationContent.fromInline('This should be of content type application/octet'),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
            Name: 'MyConfiguration',
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            LocationUri: 'hosted',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
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
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.HostedConfiguration(stack, 'MyConfiguration', {
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
            application: app,
            content: lib_1.ConfigurationContent.fromInlineYaml('This should be of content type application/x-yaml'),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
            Name: 'MyConfiguration',
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            LocationUri: 'hosted',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
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
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.HostedConfiguration(stack, 'MyConfigurationProfile', {
            name: 'TestConfigProfile',
            application: app,
            content: lib_1.ConfigurationContent.fromInlineText('This is my content'),
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
            Name: 'TestConfigProfile',
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            LocationUri: 'hosted',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            ConfigurationProfileId: {
                Ref: 'MyConfigurationProfile33A97163',
            },
            Content: 'This is my content',
            ContentType: 'text/plain',
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 0);
    });
    test('configuration profile with type', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.HostedConfiguration(stack, 'MyConfigurationProfile', {
            name: 'TestConfigProfile',
            application: app,
            type: lib_1.ConfigurationType.FEATURE_FLAGS,
            content: lib_1.ConfigurationContent.fromInlineText('This is my content'),
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
            Name: 'TestConfigProfile',
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            Type: 'AWS.AppConfig.FeatureFlags',
            LocationUri: 'hosted',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            ConfigurationProfileId: {
                Ref: 'MyConfigurationProfile33A97163',
            },
            Content: 'This is my content',
            ContentType: 'text/plain',
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 0);
    });
    test('configuration profile with description', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.HostedConfiguration(stack, 'MyConfigurationProfile', {
            name: 'TestConfigProfile',
            application: app,
            content: lib_1.ConfigurationContent.fromInlineText('This is my content'),
            description: 'This is my description',
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
            Name: 'TestConfigProfile',
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            Description: 'This is my description',
            LocationUri: 'hosted',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
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
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 0);
    });
    test('configuration profile with validator', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.HostedConfiguration(stack, 'MyConfigurationProfile', {
            name: 'TestConfigProfile',
            application: app,
            content: lib_1.ConfigurationContent.fromInlineText('This is my content'),
            validators: [
                {
                    content: 'dummy validator',
                    type: lib_1.ValidatorType.JSON_SCHEMA,
                },
            ],
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            ConfigurationProfileId: {
                Ref: 'MyConfigurationProfile33A97163',
            },
            Content: 'This is my content',
            ContentType: 'text/plain',
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 0);
    });
    test('configuration profile with inline json schema validator', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig');
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
        new lib_1.HostedConfiguration(stack, 'MyConfiguration', {
            name: 'TestConfigProfile',
            application: app,
            validators: [
                lib_1.JsonSchemaValidator.fromInline(validatorContent),
                lib_1.JsonSchemaValidator.fromFile('test/schema.json'),
            ],
            content: lib_1.ConfigurationContent.fromInlineText('This is my content'),
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            ConfigurationProfileId: {
                Ref: 'MyConfigurationConfigurationProfileEE0ECA85',
            },
            Content: 'This is my content',
            ContentType: 'text/plain',
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 0);
    });
    test('configuration profile with ssm parameter', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig');
        const parameter = new aws_ssm_1.StringParameter(stack, 'MyParameter', {
            stringValue: 'This is the content stored in ssm parameter',
            parameterName: 'my-parameter',
        });
        new lib_1.SourcedConfiguration(stack, 'MyConfiguration', {
            name: 'TestConfigProfile',
            location: lib_1.ConfigurationSource.fromParameter(parameter),
            versionNumber: '1',
            application: app,
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
            deployTo: [app.addEnvironment('Environment')],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 1);
    });
    test('configuration profile with ssm document', () => {
        const stack = new cdk.Stack();
        const document = new aws_ssm_1.CfnDocument(stack, 'MyDocument', {
            content: {
                mainSteps: [
                    {
                        action: 'aws:runShellScript',
                    },
                ],
            },
            name: 'TestDocumentName',
        });
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.SourcedConfiguration(stack, 'MyConfiguration', {
            name: 'TestConfigProfile',
            location: lib_1.ConfigurationSource.fromCfnDocument(document),
            versionNumber: '1',
            application: app,
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
            deployTo: [app.addEnvironment('Environment')],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 1);
    });
    test('configuration profile with s3 object', () => {
        const stack = new cdk.Stack();
        const bucket = new aws_s3_1.Bucket(stack, 'MyBucket', {
            bucketName: 'bucket',
        });
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.SourcedConfiguration(stack, 'MyConfiguration', {
            name: 'TestConfigProfile',
            location: lib_1.ConfigurationSource.fromBucket(bucket, 'hello/file.txt'),
            versionNumber: '1',
            application: app,
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
            deployTo: [app.addEnvironment('Environment')],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 1);
    });
    test('configuration profile with codepipeline', () => {
        const stack = new cdk.Stack();
        const bucket = new aws_s3_1.Bucket(stack, 'MyBucket');
        const sourceAction = new aws_codepipeline_actions_1.S3SourceAction({
            actionName: 'Source',
            bucket: bucket,
            bucketKey: 'hello/world/codepipeline.txt',
            output: new aws_codepipeline_1.Artifact('SourceOutput'),
        });
        const deployAction = new aws_codepipeline_actions_1.S3DeployAction({
            actionName: 'Deploy',
            input: aws_codepipeline_1.Artifact.artifact('SourceOutput'),
            bucket: bucket,
            extract: true,
        });
        const pipeline = new aws_codepipeline_1.Pipeline(stack, 'MyPipeline', {
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
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.SourcedConfiguration(stack, 'MyConfiguration', {
            name: 'TestConfigProfile',
            location: lib_1.ConfigurationSource.fromPipeline(pipeline),
            application: app,
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
            deployTo: [app.addEnvironment('Environment')],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
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
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 3);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 3);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 0);
    });
    test('configuration profile with secretsmanager', () => {
        const stack = new cdk.Stack();
        const secret = new aws_secretsmanager_1.Secret(stack, 'MySecret', {
            secretStringValue: cdk.SecretValue.unsafePlainText('This is the content stored in secrets manager'),
            secretName: 'secret',
        });
        Object.defineProperty(secret, 'secretArn', {
            value: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret',
        });
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.SourcedConfiguration(stack, 'MyConfiguration', {
            name: 'TestConfigProfile',
            location: lib_1.ConfigurationSource.fromSecret(secret),
            versionNumber: '1',
            application: app,
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
            deployTo: [app.addEnvironment('Environment')],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
            Name: 'TestConfigProfile',
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            LocationUri: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 1);
    });
    test('configuration profile with secretsmanager and kms', () => {
        const stack = new cdk.Stack();
        const key = new aws_kms_1.Key(stack, 'MyKey');
        const secret = new aws_secretsmanager_1.Secret(stack, 'MySecret', {
            secretStringValue: cdk.SecretValue.unsafePlainText('This is the content stored in secrets manager'),
            secretName: 'secret',
            encryptionKey: key,
        });
        Object.defineProperty(secret, 'secretArn', {
            value: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret',
        });
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.SourcedConfiguration(stack, 'MyConfiguration', {
            name: 'TestConfigProfile',
            location: lib_1.ConfigurationSource.fromSecret(secret),
            versionNumber: '1',
            application: app,
            deploymentStrategy: new lib_1.DeploymentStrategy(stack, 'MyDeploymentStrategy', {
                rolloutStrategy: lib_1.RolloutStrategy.linear({
                    growthFactor: 15,
                    deploymentDuration: cdk.Duration.minutes(30),
                }),
            }),
            deployTo: [app.addEnvironment('Environment')],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
            Name: 'TestConfigProfile',
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            LocationUri: 'arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AppConfig::Deployment', 1);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlndXJhdGlvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLHVEQUFrRDtBQUNsRCxtRUFBa0U7QUFDbEUsbUZBQXNGO0FBQ3RGLDJDQUEyQztBQUMzQyxpREFBMEM7QUFDMUMsK0NBQTRDO0FBQzVDLHVFQUF3RDtBQUN4RCxpREFBbUU7QUFDbkUsZ0NBV2dCO0FBRWhCLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO0lBQzdCLElBQUksQ0FBQyx5REFBeUQsRUFBRSxHQUFHLEVBQUU7UUFDbkUsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNsRCxJQUFJLHlCQUFtQixDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtZQUMvQyxPQUFPLEVBQUUsMEJBQW9CLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDO1lBQ2xFLFdBQVcsRUFBRSxHQUFHO1lBQ2hCLGtCQUFrQixFQUFFLElBQUksd0JBQWtCLENBQUMsS0FBSyxFQUFFLHNCQUFzQixFQUFFO2dCQUN4RSxlQUFlLEVBQUUscUJBQWUsQ0FBQyxNQUFNLENBQUM7b0JBQ3RDLFlBQVksRUFBRSxFQUFFO29CQUNoQixrQkFBa0IsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7aUJBQzdDLENBQUM7YUFDSCxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDLDZCQUE2QixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVFLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHND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QixhQUFhLEVBQUU7Z0JBQ2IsR0FBRyxFQUFFLHFCQUFxQjthQUMzQjtZQUNELFdBQVcsRUFBRSxnRUFBZ0U7U0FDOUUsQ0FBQyxDQUFDO1FBQ0gscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsZ0JBQWdCLEVBQUU7WUFDaEUsUUFBUSxFQUFFO2dCQUNSO29CQUNFLGNBQWMsRUFBRTt3QkFDZCxTQUFTLEVBQUU7NEJBQ1Q7Z0NBQ0UsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSztnQ0FDeEIsUUFBUSxFQUFFLGdFQUFnRTtnQ0FDMUUsTUFBTSxFQUFFLCtCQUErQjs2QkFDeEM7NEJBQ0Q7Z0NBQ0UsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSztnQ0FDeEIsUUFBUSxFQUFFO29DQUNSLFlBQVksRUFBRSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUM7aUNBQ3ZDO2dDQUNELE1BQU0sRUFBRSxhQUFhOzZCQUN0Qjt5QkFDRjtxQkFDRjtvQkFDRCxVQUFVLEVBQUUsb0NBQW9DO2lCQUNqRDthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDLDRCQUE0QixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hc3NlcnRpb25zJztcbmltcG9ydCB7IEFydGlmYWN0LCBQaXBlbGluZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0IHsgUzNEZXBsb3lBY3Rpb24sIFMzU291cmNlQWN0aW9uIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IEtleSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1rbXMnO1xuaW1wb3J0IHsgQnVja2V0IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCB7IFNlY3JldCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zZWNyZXRzbWFuYWdlcic7XG5pbXBvcnQgeyBDZm5Eb2N1bWVudCwgU3RyaW5nUGFyYW1ldGVyIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXNzbSc7XG5pbXBvcnQge1xuICBBcHBsaWNhdGlvbixcbiAgSG9zdGVkQ29uZmlndXJhdGlvbixcbiAgQ29uZmlndXJhdGlvblNvdXJjZSxcbiAgU291cmNlZENvbmZpZ3VyYXRpb24sXG4gIERlcGxveW1lbnRTdHJhdGVneSxcbiAgQ29uZmlndXJhdGlvblR5cGUsXG4gIFZhbGlkYXRvclR5cGUsXG4gIEpzb25TY2hlbWFWYWxpZGF0b3IsXG4gIENvbmZpZ3VyYXRpb25Db250ZW50LFxuICBSb2xsb3V0U3RyYXRlZ3ksXG59IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICB0ZXN0KCdjb25maWd1cmF0aW9uIHdpdGggbm8gZW52aXJvbm1lbnRzIGFuZCBubyBkZXBsb3lUbyBwcm9wJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwQ29uZmlnJyk7XG4gICAgbmV3IEhvc3RlZENvbmZpZ3VyYXRpb24oc3RhY2ssICdNeUhvc3RlZENvbmZpZycsIHtcbiAgICAgIGNvbnRlbnQ6IENvbmZpZ3VyYXRpb25Db250ZW50LmZyb21JbmxpbmVUZXh0KCdUaGlzIGlzIG15IGNvbnRlbnQnKSxcbiAgICAgIGFwcGxpY2F0aW9uOiBhcHAsXG4gICAgICBkZXBsb3ltZW50U3RyYXRlZ3k6IG5ldyBEZXBsb3ltZW50U3RyYXRlZ3koc3RhY2ssICdNeURlcGxveW1lbnRTdHJhdGVneScsIHtcbiAgICAgICAgcm9sbG91dFN0cmF0ZWd5OiBSb2xsb3V0U3RyYXRlZ3kubGluZWFyKHtcbiAgICAgICAgICBncm93dGhGYWN0b3I6IDE1LFxuICAgICAgICAgIGRlcGxveW1lbnREdXJhdGlvbjogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMzApLFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXBwQ29uZmlnOjpFbnZpcm9ubWVudCcsIDApO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6Q29uZmlndXJhdGlvblByb2ZpbGUnLCB7XG4gICAgICBOYW1lOiAnTXlIb3N0ZWRDb25maWcnLFxuICAgICAgQXBwbGljYXRpb25JZDoge1xuICAgICAgICBSZWY6ICdNeUFwcENvbmZpZ0I0QjYzRTc1JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpIb3N0ZWRDb25maWd1cmF0aW9uVmVyc2lvbicsIHtcbiAgICAgIEFwcGxpY2F0aW9uSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdCNEI2M0U3NScsXG4gICAgICB9LFxuICAgICAgQ29uZmlndXJhdGlvblByb2ZpbGVJZDoge1xuICAgICAgICBSZWY6ICdNeUhvc3RlZENvbmZpZ0NvbmZpZ3VyYXRpb25Qcm9maWxlMkUxQTJCQkMnLFxuICAgICAgfSxcbiAgICAgIENvbnRlbnQ6ICdUaGlzIGlzIG15IGNvbnRlbnQnLFxuICAgICAgQ29udGVudFR5cGU6ICd0ZXh0L3BsYWluJyxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpBcHBDb25maWc6OkRlcGxveW1lbnQnLCAwKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uZmlndXJhdGlvbiB3aXRoIGVudmlyb25tZW50cyBhbmQgbm8gZGVwbG95VG8gcHJvcCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcENvbmZpZycsIHtcbiAgICAgIGFwcGxpY2F0aW9uTmFtZTogJ015QXBwbGljYXRpb24nLFxuICAgIH0pO1xuICAgIGFwcC5hZGRFbnZpcm9ubWVudCgnTXlFbnYxJyk7XG4gICAgYXBwLmFkZEVudmlyb25tZW50KCdNeUVudjInKTtcbiAgICBuZXcgSG9zdGVkQ29uZmlndXJhdGlvbihzdGFjaywgJ015SG9zdGVkQ29uZmlnJywge1xuICAgICAgY29udGVudDogQ29uZmlndXJhdGlvbkNvbnRlbnQuZnJvbUlubGluZVRleHQoJ1RoaXMgaXMgbXkgY29udGVudCcpLFxuICAgICAgYXBwbGljYXRpb246IGFwcCxcbiAgICAgIGRlcGxveW1lbnRTdHJhdGVneTogbmV3IERlcGxveW1lbnRTdHJhdGVneShzdGFjaywgJ015RGVwbG95bWVudFN0cmF0ZWd5Jywge1xuICAgICAgICByb2xsb3V0U3RyYXRlZ3k6IFJvbGxvdXRTdHJhdGVneS5saW5lYXIoe1xuICAgICAgICAgIGdyb3d0aEZhY3RvcjogMTUsXG4gICAgICAgICAgZGVwbG95bWVudER1cmF0aW9uOiBjZGsuRHVyYXRpb24ubWludXRlcygzMCksXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkNvbmZpZ3VyYXRpb25Qcm9maWxlJywge1xuICAgICAgTmFtZTogJ015SG9zdGVkQ29uZmlnJyxcbiAgICAgIEFwcGxpY2F0aW9uSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdCNEI2M0U3NScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6SG9zdGVkQ29uZmlndXJhdGlvblZlcnNpb24nLCB7XG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIENvbmZpZ3VyYXRpb25Qcm9maWxlSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlIb3N0ZWRDb25maWdDb25maWd1cmF0aW9uUHJvZmlsZTJFMUEyQkJDJyxcbiAgICAgIH0sXG4gICAgICBDb250ZW50OiAnVGhpcyBpcyBteSBjb250ZW50JyxcbiAgICAgIENvbnRlbnRUeXBlOiAndGV4dC9wbGFpbicsXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXBwQ29uZmlnOjpFbnZpcm9ubWVudCcsIDIpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkFwcENvbmZpZzo6RGVwbG95bWVudCcsIDApO1xuICB9KTtcblxuICB0ZXN0KCdjb25maWd1cmF0aW9uIHdpdGggZW52aXJvbm1lbnRzIGFuZCBkZXBsb3lUbyBwcm9wJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwQ29uZmlnJywge1xuICAgICAgYXBwbGljYXRpb25OYW1lOiAnTXlBcHBsaWNhdGlvbicsXG4gICAgfSk7XG4gICAgYXBwLmFkZEVudmlyb25tZW50KCdNeUVudjEnKTtcbiAgICBjb25zdCBlbnYgPSBhcHAuYWRkRW52aXJvbm1lbnQoJ015RW52MicpO1xuICAgIG5ldyBIb3N0ZWRDb25maWd1cmF0aW9uKHN0YWNrLCAnTXlIb3N0ZWRDb25maWcnLCB7XG4gICAgICBjb250ZW50OiBDb25maWd1cmF0aW9uQ29udGVudC5mcm9tSW5saW5lVGV4dCgnVGhpcyBpcyBteSBjb250ZW50JyksXG4gICAgICBhcHBsaWNhdGlvbjogYXBwLFxuICAgICAgZGVwbG95VG86IFtlbnZdLFxuICAgICAgZGVwbG95bWVudFN0cmF0ZWd5OiBuZXcgRGVwbG95bWVudFN0cmF0ZWd5KHN0YWNrLCAnTXlEZXBsb3ltZW50U3RyYXRlZ3knLCB7XG4gICAgICAgIHJvbGxvdXRTdHJhdGVneTogUm9sbG91dFN0cmF0ZWd5LmxpbmVhcih7XG4gICAgICAgICAgZ3Jvd3RoRmFjdG9yOiAxNSxcbiAgICAgICAgICBkZXBsb3ltZW50RHVyYXRpb246IGNkay5EdXJhdGlvbi5taW51dGVzKDMwKSxcbiAgICAgICAgfSksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6Q29uZmlndXJhdGlvblByb2ZpbGUnLCB7XG4gICAgICBOYW1lOiAnTXlIb3N0ZWRDb25maWcnLFxuICAgICAgQXBwbGljYXRpb25JZDoge1xuICAgICAgICBSZWY6ICdNeUFwcENvbmZpZ0I0QjYzRTc1JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpIb3N0ZWRDb25maWd1cmF0aW9uVmVyc2lvbicsIHtcbiAgICAgIEFwcGxpY2F0aW9uSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdCNEI2M0U3NScsXG4gICAgICB9LFxuICAgICAgQ29uZmlndXJhdGlvblByb2ZpbGVJZDoge1xuICAgICAgICBSZWY6ICdNeUhvc3RlZENvbmZpZ0NvbmZpZ3VyYXRpb25Qcm9maWxlMkUxQTJCQkMnLFxuICAgICAgfSxcbiAgICAgIENvbnRlbnQ6ICdUaGlzIGlzIG15IGNvbnRlbnQnLFxuICAgICAgQ29udGVudFR5cGU6ICd0ZXh0L3BsYWluJyxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkRlcGxveW1lbnQnLCB7XG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIEVudmlyb25tZW50SWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdNeUVudjIzNTA0MzdENicsXG4gICAgICB9LFxuICAgICAgQ29uZmlndXJhdGlvblZlcnNpb246IHtcbiAgICAgICAgUmVmOiAnTXlIb3N0ZWRDb25maWc1MUQzODc3RCcsXG4gICAgICB9LFxuICAgICAgQ29uZmlndXJhdGlvblByb2ZpbGVJZDoge1xuICAgICAgICBSZWY6ICdNeUhvc3RlZENvbmZpZ0NvbmZpZ3VyYXRpb25Qcm9maWxlMkUxQTJCQkMnLFxuICAgICAgfSxcbiAgICAgIERlcGxveW1lbnRTdHJhdGVneUlkOiB7XG4gICAgICAgIFJlZjogJ015RGVwbG95bWVudFN0cmF0ZWd5NjBEMzFGQjAnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpBcHBDb25maWc6OkVudmlyb25tZW50JywgMik7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXBwQ29uZmlnOjpEZXBsb3ltZW50JywgMSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbmZpZ3VyYXRpb24gdXNpbmcgZGVwbG95IG1ldGhvZCBhbmQgbm8gZW52aXJvbm1lbnQgYXNzb2NpYXRlZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcENvbmZpZycsIHtcbiAgICAgIGFwcGxpY2F0aW9uTmFtZTogJ015QXBwbGljYXRpb24nLFxuICAgIH0pO1xuICAgIGFwcC5hZGRFbnZpcm9ubWVudCgnTXlFbnYxJyk7XG4gICAgY29uc3QgZW52ID0gYXBwLmFkZEVudmlyb25tZW50KCdNeUVudjInKTtcbiAgICBjb25zdCBjb25maWcgPSBuZXcgSG9zdGVkQ29uZmlndXJhdGlvbihzdGFjaywgJ015SG9zdGVkQ29uZmlnJywge1xuICAgICAgY29udGVudDogQ29uZmlndXJhdGlvbkNvbnRlbnQuZnJvbUlubGluZVRleHQoJ1RoaXMgaXMgbXkgY29udGVudCcpLFxuICAgICAgYXBwbGljYXRpb246IGFwcCxcbiAgICAgIGRlcGxveW1lbnRTdHJhdGVneTogbmV3IERlcGxveW1lbnRTdHJhdGVneShzdGFjaywgJ015RGVwbG95bWVudFN0cmF0ZWd5Jywge1xuICAgICAgICByb2xsb3V0U3RyYXRlZ3k6IFJvbGxvdXRTdHJhdGVneS5saW5lYXIoe1xuICAgICAgICAgIGdyb3d0aEZhY3RvcjogMTUsXG4gICAgICAgICAgZGVwbG95bWVudER1cmF0aW9uOiBjZGsuRHVyYXRpb24ubWludXRlcygzMCksXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgfSk7XG4gICAgY29uZmlnLmRlcGxveShlbnYpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpEZXBsb3ltZW50Jywge1xuICAgICAgQXBwbGljYXRpb25JZDoge1xuICAgICAgICBSZWY6ICdNeUFwcENvbmZpZ0I0QjYzRTc1JyxcbiAgICAgIH0sXG4gICAgICBFbnZpcm9ubWVudElkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnTXlFbnYyMzUwNDM3RDYnLFxuICAgICAgfSxcbiAgICAgIENvbmZpZ3VyYXRpb25WZXJzaW9uOiB7XG4gICAgICAgIFJlZjogJ015SG9zdGVkQ29uZmlnNTFEMzg3N0QnLFxuICAgICAgfSxcbiAgICAgIENvbmZpZ3VyYXRpb25Qcm9maWxlSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlIb3N0ZWRDb25maWdDb25maWd1cmF0aW9uUHJvZmlsZTJFMUEyQkJDJyxcbiAgICAgIH0sXG4gICAgICBEZXBsb3ltZW50U3RyYXRlZ3lJZDoge1xuICAgICAgICBSZWY6ICdNeURlcGxveW1lbnRTdHJhdGVneTYwRDMxRkIwJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXBwQ29uZmlnOjpEZXBsb3ltZW50JywgMSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbmZpZ3VyYXRpb24gdXNpbmcgZGVwbG95IG1ldGhvZCB3aXRoIGVudmlyb25tZW50IGFzc29jaWF0ZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHBDb25maWcnLCB7XG4gICAgICBhcHBsaWNhdGlvbk5hbWU6ICdNeUFwcGxpY2F0aW9uJyxcbiAgICB9KTtcbiAgICBjb25zdCBlbnYxID0gYXBwLmFkZEVudmlyb25tZW50KCdNeUVudjEnKTtcbiAgICBjb25zdCBlbnYyID0gYXBwLmFkZEVudmlyb25tZW50KCdNeUVudjInKTtcbiAgICBjb25zdCBjb25maWcgPSBuZXcgSG9zdGVkQ29uZmlndXJhdGlvbihzdGFjaywgJ015SG9zdGVkQ29uZmlnJywge1xuICAgICAgY29udGVudDogQ29uZmlndXJhdGlvbkNvbnRlbnQuZnJvbUlubGluZVRleHQoJ1RoaXMgaXMgbXkgY29udGVudCcpLFxuICAgICAgYXBwbGljYXRpb246IGFwcCxcbiAgICAgIGRlcGxveW1lbnRTdHJhdGVneTogbmV3IERlcGxveW1lbnRTdHJhdGVneShzdGFjaywgJ015RGVwbG95bWVudFN0cmF0ZWd5Jywge1xuICAgICAgICByb2xsb3V0U3RyYXRlZ3k6IFJvbGxvdXRTdHJhdGVneS5saW5lYXIoe1xuICAgICAgICAgIGdyb3d0aEZhY3RvcjogMTUsXG4gICAgICAgICAgZGVwbG95bWVudER1cmF0aW9uOiBjZGsuRHVyYXRpb24ubWludXRlcygzMCksXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgICBkZXBsb3lUbzogW2VudjFdLFxuICAgIH0pO1xuICAgIGNvbmZpZy5kZXBsb3koZW52Mik7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkRlcGxveW1lbnQnLCB7XG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIEVudmlyb25tZW50SWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdNeUVudjFCOTEyMEZBMScsXG4gICAgICB9LFxuICAgICAgQ29uZmlndXJhdGlvblZlcnNpb246IHtcbiAgICAgICAgUmVmOiAnTXlIb3N0ZWRDb25maWc1MUQzODc3RCcsXG4gICAgICB9LFxuICAgICAgQ29uZmlndXJhdGlvblByb2ZpbGVJZDoge1xuICAgICAgICBSZWY6ICdNeUhvc3RlZENvbmZpZ0NvbmZpZ3VyYXRpb25Qcm9maWxlMkUxQTJCQkMnLFxuICAgICAgfSxcbiAgICAgIERlcGxveW1lbnRTdHJhdGVneUlkOiB7XG4gICAgICAgIFJlZjogJ015RGVwbG95bWVudFN0cmF0ZWd5NjBEMzFGQjAnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkRlcGxveW1lbnQnLCB7XG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIEVudmlyb25tZW50SWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdNeUVudjIzNTA0MzdENicsXG4gICAgICB9LFxuICAgICAgQ29uZmlndXJhdGlvblZlcnNpb246IHtcbiAgICAgICAgUmVmOiAnTXlIb3N0ZWRDb25maWc1MUQzODc3RCcsXG4gICAgICB9LFxuICAgICAgQ29uZmlndXJhdGlvblByb2ZpbGVJZDoge1xuICAgICAgICBSZWY6ICdNeUhvc3RlZENvbmZpZ0NvbmZpZ3VyYXRpb25Qcm9maWxlMkUxQTJCQkMnLFxuICAgICAgfSxcbiAgICAgIERlcGxveW1lbnRTdHJhdGVneUlkOiB7XG4gICAgICAgIFJlZjogJ015RGVwbG95bWVudFN0cmF0ZWd5NjBEMzFGQjAnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpBcHBDb25maWc6OkRlcGxveW1lbnQnLCAyKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uZmlndXJhdGlvbiB3aXRoIG5vIGVudmlyb25tZW50IGFzc29jaWF0ZWQgYW5kIG5vIGRlcGxveSBtZXRob2QgdXNlZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcENvbmZpZycsIHtcbiAgICAgIGFwcGxpY2F0aW9uTmFtZTogJ015QXBwbGljYXRpb24nLFxuICAgIH0pO1xuICAgIG5ldyBIb3N0ZWRDb25maWd1cmF0aW9uKHN0YWNrLCAnTXlIb3N0ZWRDb25maWcnLCB7XG4gICAgICBjb250ZW50OiBDb25maWd1cmF0aW9uQ29udGVudC5mcm9tSW5saW5lVGV4dCgnVGhpcyBpcyBteSBjb250ZW50JyksXG4gICAgICBhcHBsaWNhdGlvbjogYXBwLFxuICAgICAgZGVwbG95bWVudFN0cmF0ZWd5OiBuZXcgRGVwbG95bWVudFN0cmF0ZWd5KHN0YWNrLCAnTXlEZXBsb3ltZW50U3RyYXRlZ3knLCB7XG4gICAgICAgIHJvbGxvdXRTdHJhdGVneTogUm9sbG91dFN0cmF0ZWd5LmxpbmVhcih7XG4gICAgICAgICAgZ3Jvd3RoRmFjdG9yOiAxNSxcbiAgICAgICAgICBkZXBsb3ltZW50RHVyYXRpb246IGNkay5EdXJhdGlvbi5taW51dGVzKDMwKSxcbiAgICAgICAgfSksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkFwcENvbmZpZzo6RGVwbG95bWVudCcsIDApO1xuICB9KTtcblxuICB0ZXN0KCdjb25maWd1cmF0aW9uIHdpdGggdHdvIGNvbmZpZ3VyYXRpb25zIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcENvbmZpZycsIHtcbiAgICAgIGFwcGxpY2F0aW9uTmFtZTogJ015QXBwbGljYXRpb24nLFxuICAgIH0pO1xuICAgIGNvbnN0IGVudjEgPSBhcHAuYWRkRW52aXJvbm1lbnQoJ015RW52MScpO1xuICAgIGNvbnN0IGVudjIgPSBhcHAuYWRkRW52aXJvbm1lbnQoJ015RW52MicpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBCdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuICAgIG5ldyBIb3N0ZWRDb25maWd1cmF0aW9uKHN0YWNrLCAnTXlIb3N0ZWRDb25maWcnLCB7XG4gICAgICBjb250ZW50OiBDb25maWd1cmF0aW9uQ29udGVudC5mcm9tSW5saW5lVGV4dCgnVGhpcyBpcyBteSBjb250ZW50JyksXG4gICAgICBhcHBsaWNhdGlvbjogYXBwLFxuICAgICAgZGVwbG95VG86IFtlbnYxXSxcbiAgICAgIGRlcGxveW1lbnRTdHJhdGVneTogbmV3IERlcGxveW1lbnRTdHJhdGVneShzdGFjaywgJ015RGVwbG95bWVudFN0cmF0ZWd5MScsIHtcbiAgICAgICAgcm9sbG91dFN0cmF0ZWd5OiBSb2xsb3V0U3RyYXRlZ3kubGluZWFyKHtcbiAgICAgICAgICBncm93dGhGYWN0b3I6IDE1LFxuICAgICAgICAgIGRlcGxveW1lbnREdXJhdGlvbjogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMzApLFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIG5ldyBTb3VyY2VkQ29uZmlndXJhdGlvbihzdGFjaywgJ015U291cmNlZENvbmZpZycsIHtcbiAgICAgIHZlcnNpb25OdW1iZXI6ICcxJyxcbiAgICAgIGxvY2F0aW9uOiBDb25maWd1cmF0aW9uU291cmNlLmZyb21CdWNrZXQoYnVja2V0LCAncGF0aC90by9vYmplY3QnKSxcbiAgICAgIGFwcGxpY2F0aW9uOiBhcHAsXG4gICAgICBkZXBsb3lUbzogW2VudjJdLFxuICAgICAgZGVwbG95bWVudFN0cmF0ZWd5OiBuZXcgRGVwbG95bWVudFN0cmF0ZWd5KHN0YWNrLCAnTXlEZXBsb3ltZW50U3RyYXRlZ3kyJywge1xuICAgICAgICByb2xsb3V0U3RyYXRlZ3k6IFJvbGxvdXRTdHJhdGVneS5saW5lYXIoe1xuICAgICAgICAgIGdyb3d0aEZhY3RvcjogMTUsXG4gICAgICAgICAgZGVwbG95bWVudER1cmF0aW9uOiBjZGsuRHVyYXRpb24ubWludXRlcygzMCksXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkNvbmZpZ3VyYXRpb25Qcm9maWxlJywge1xuICAgICAgTmFtZTogJ015SG9zdGVkQ29uZmlnJyxcbiAgICAgIEFwcGxpY2F0aW9uSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdCNEI2M0U3NScsXG4gICAgICB9LFxuICAgICAgTG9jYXRpb25Vcmk6ICdob3N0ZWQnLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6SG9zdGVkQ29uZmlndXJhdGlvblZlcnNpb24nLCB7XG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIENvbmZpZ3VyYXRpb25Qcm9maWxlSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlIb3N0ZWRDb25maWdDb25maWd1cmF0aW9uUHJvZmlsZTJFMUEyQkJDJyxcbiAgICAgIH0sXG4gICAgICBDb250ZW50OiAnVGhpcyBpcyBteSBjb250ZW50JyxcbiAgICAgIENvbnRlbnRUeXBlOiAndGV4dC9wbGFpbicsXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpDb25maWd1cmF0aW9uUHJvZmlsZScsIHtcbiAgICAgIE5hbWU6ICdNeVNvdXJjZWRDb25maWcnLFxuICAgICAgQXBwbGljYXRpb25JZDoge1xuICAgICAgICBSZWY6ICdNeUFwcENvbmZpZ0I0QjYzRTc1JyxcbiAgICAgIH0sXG4gICAgICBMb2NhdGlvblVyaToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ3MzOi8vJyxcbiAgICAgICAgICAgIHsgUmVmOiAnTXlCdWNrZXRGNjhGM0ZGMCcgfSxcbiAgICAgICAgICAgICcvcGF0aC90by9vYmplY3QnLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgUmV0cmlldmFsUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlTb3VyY2VkQ29uZmlnUm9sZTI0OTQ0OUIxJywgJ0FybiddIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpEZXBsb3ltZW50U3RyYXRlZ3knLCB7XG4gICAgICBOYW1lOiAnTXlEZXBsb3ltZW50U3RyYXRlZ3kxJyxcbiAgICAgIERlcGxveW1lbnREdXJhdGlvbkluTWludXRlczogMzAsXG4gICAgICBHcm93dGhGYWN0b3I6IDE1LFxuICAgICAgUmVwbGljYXRlVG86ICdOT05FJyxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkRlcGxveW1lbnRTdHJhdGVneScsIHtcbiAgICAgIE5hbWU6ICdNeURlcGxveW1lbnRTdHJhdGVneTInLFxuICAgICAgRGVwbG95bWVudER1cmF0aW9uSW5NaW51dGVzOiAzMCxcbiAgICAgIEdyb3d0aEZhY3RvcjogMTUsXG4gICAgICBSZXBsaWNhdGVUbzogJ05PTkUnLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6RGVwbG95bWVudCcsIHtcbiAgICAgIEFwcGxpY2F0aW9uSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdCNEI2M0U3NScsXG4gICAgICB9LFxuICAgICAgRW52aXJvbm1lbnRJZDoge1xuICAgICAgICBSZWY6ICdNeUFwcENvbmZpZ015RW52MUI5MTIwRkExJyxcbiAgICAgIH0sXG4gICAgICBDb25maWd1cmF0aW9uVmVyc2lvbjoge1xuICAgICAgICBSZWY6ICdNeUhvc3RlZENvbmZpZzUxRDM4NzdEJyxcbiAgICAgIH0sXG4gICAgICBDb25maWd1cmF0aW9uUHJvZmlsZUlkOiB7XG4gICAgICAgIFJlZjogJ015SG9zdGVkQ29uZmlnQ29uZmlndXJhdGlvblByb2ZpbGUyRTFBMkJCQycsXG4gICAgICB9LFxuICAgICAgRGVwbG95bWVudFN0cmF0ZWd5SWQ6IHtcbiAgICAgICAgUmVmOiAnTXlEZXBsb3ltZW50U3RyYXRlZ3kxNzgwOTk0NDYnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkRlcGxveW1lbnQnLCB7XG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIEVudmlyb25tZW50SWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdNeUVudjIzNTA0MzdENicsXG4gICAgICB9LFxuICAgICAgQ29uZmlndXJhdGlvblZlcnNpb246ICcxJyxcbiAgICAgIENvbmZpZ3VyYXRpb25Qcm9maWxlSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlTb3VyY2VkQ29uZmlnNTQ1NUM0N0MnLFxuICAgICAgfSxcbiAgICAgIERlcGxveW1lbnRTdHJhdGVneUlkOiB7XG4gICAgICAgIFJlZjogJ015RGVwbG95bWVudFN0cmF0ZWd5MjAyQjgwNzE1JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXBwQ29uZmlnOjpDb25maWd1cmF0aW9uUHJvZmlsZScsIDIpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkFwcENvbmZpZzo6RW52aXJvbm1lbnQnLCAyKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpBcHBDb25maWc6OkRlcGxveW1lbnQnLCAyKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uZmlndXJhdGlvbiB3aXRoIHR3byBjb25maWd1cmF0aW9ucyBhbmQgbm8gZGVwbG95bWVudCBzdHJhdGVneSBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHBDb25maWcnLCB7XG4gICAgICBhcHBsaWNhdGlvbk5hbWU6ICdNeUFwcGxpY2F0aW9uJyxcbiAgICB9KTtcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcbiAgICBuZXcgSG9zdGVkQ29uZmlndXJhdGlvbihzdGFjaywgJ015SG9zdGVkQ29uZmlnJywge1xuICAgICAgY29udGVudDogQ29uZmlndXJhdGlvbkNvbnRlbnQuZnJvbUlubGluZVRleHQoJ1RoaXMgaXMgbXkgY29udGVudCcpLFxuICAgICAgYXBwbGljYXRpb246IGFwcCxcbiAgICB9KTtcbiAgICBuZXcgU291cmNlZENvbmZpZ3VyYXRpb24oc3RhY2ssICdNeVNvdXJjZWRDb25maWcnLCB7XG4gICAgICB2ZXJzaW9uTnVtYmVyOiAnMScsXG4gICAgICBsb2NhdGlvbjogQ29uZmlndXJhdGlvblNvdXJjZS5mcm9tQnVja2V0KGJ1Y2tldCwgJ3BhdGgvdG8vb2JqZWN0JyksXG4gICAgICBhcHBsaWNhdGlvbjogYXBwLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpEZXBsb3ltZW50U3RyYXRlZ3knLCB7XG4gICAgICBOYW1lOiAnTXlIb3N0ZWRDb25maWctRGVwbG95bWVudFN0cmF0ZWd5LUE1OTM2RTYwJyxcbiAgICAgIERlcGxveW1lbnREdXJhdGlvbkluTWludXRlczogMjAsXG4gICAgICBHcm93dGhGYWN0b3I6IDEwLFxuICAgICAgUmVwbGljYXRlVG86ICdOT05FJyxcbiAgICAgIEZpbmFsQmFrZVRpbWVJbk1pbnV0ZXM6IDEwLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6RGVwbG95bWVudFN0cmF0ZWd5Jywge1xuICAgICAgTmFtZTogJ015U291cmNlZENvbmZpZy1EZXBsb3ltZW50U3RyYXRlZ3ktN0ExMDQ2NTcnLFxuICAgICAgRGVwbG95bWVudER1cmF0aW9uSW5NaW51dGVzOiAyMCxcbiAgICAgIEdyb3d0aEZhY3RvcjogMTAsXG4gICAgICBSZXBsaWNhdGVUbzogJ05PTkUnLFxuICAgICAgRmluYWxCYWtlVGltZUluTWludXRlczogMTAsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlcGxveSBzZWNyZXQgd2l0aCBrbXMga2V5JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGtleSA9IG5ldyBLZXkoc3RhY2ssICdNeUtleScpO1xuICAgIGNvbnN0IHNlY3JldCA9IG5ldyBTZWNyZXQoc3RhY2ssICdNeVNlY3JldCcpO1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwQ29uZmlnJyk7XG4gICAgbmV3IFNvdXJjZWRDb25maWd1cmF0aW9uKHN0YWNrLCAnTXlTb3VyY2VkQ29uZmlnJywge1xuICAgICAgdmVyc2lvbk51bWJlcjogJzEnLFxuICAgICAgbG9jYXRpb246IENvbmZpZ3VyYXRpb25Tb3VyY2UuZnJvbVNlY3JldChzZWNyZXQpLFxuICAgICAgZGVwbG95bWVudEtleToga2V5LFxuICAgICAgYXBwbGljYXRpb246IGFwcCxcbiAgICAgIGRlcGxveW1lbnRTdHJhdGVneTogbmV3IERlcGxveW1lbnRTdHJhdGVneShzdGFjaywgJ015RGVwbG95bWVudFN0cmF0ZWd5Jywge1xuICAgICAgICByb2xsb3V0U3RyYXRlZ3k6IFJvbGxvdXRTdHJhdGVneS5saW5lYXIoe1xuICAgICAgICAgIGdyb3d0aEZhY3RvcjogMTUsXG4gICAgICAgICAgZGVwbG95bWVudER1cmF0aW9uOiBjZGsuRHVyYXRpb24ubWludXRlcygzMCksXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgICBkZXBsb3lUbzogW2FwcC5hZGRFbnZpcm9ubWVudCgnRW52aXJvbm1lbnQnKV0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkRlcGxveW1lbnQnLCB7XG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIEVudmlyb25tZW50SWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdFbnZpcm9ubWVudDgzM0E5MTgyJyxcbiAgICAgIH0sXG4gICAgICBDb25maWd1cmF0aW9uVmVyc2lvbjogJzEnLFxuICAgICAgQ29uZmlndXJhdGlvblByb2ZpbGVJZDoge1xuICAgICAgICBSZWY6ICdNeVNvdXJjZWRDb25maWc1NDU1QzQ3QycsXG4gICAgICB9LFxuICAgICAgRGVwbG95bWVudFN0cmF0ZWd5SWQ6IHtcbiAgICAgICAgUmVmOiAnTXlEZXBsb3ltZW50U3RyYXRlZ3k2MEQzMUZCMCcsXG4gICAgICB9LFxuICAgICAgS21zS2V5SWRlbnRpZmllcjogeyAnRm46OkdldEF0dCc6IFsnTXlLZXk2QUIyOUZBNicsICdBcm4nXSB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdkZWZhdWx0IGNvbmZpZ3VyYXRpb24gZnJvbSBpbmxpbmUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHBDb25maWcnKTtcbiAgICBuZXcgSG9zdGVkQ29uZmlndXJhdGlvbihzdGFjaywgJ015Q29uZmlndXJhdGlvbicsIHtcbiAgICAgIGFwcGxpY2F0aW9uOiBhcHAsXG4gICAgICBjb250ZW50OiBDb25maWd1cmF0aW9uQ29udGVudC5mcm9tSW5saW5lVGV4dCgnVGhpcyBpcyBteSBjb250ZW50JyksXG4gICAgICBkZXBsb3ltZW50U3RyYXRlZ3k6IG5ldyBEZXBsb3ltZW50U3RyYXRlZ3koc3RhY2ssICdNeURlcGxveW1lbnRTdHJhdGVneScsIHtcbiAgICAgICAgcm9sbG91dFN0cmF0ZWd5OiBSb2xsb3V0U3RyYXRlZ3kubGluZWFyKHtcbiAgICAgICAgICBncm93dGhGYWN0b3I6IDE1LFxuICAgICAgICAgIGRlcGxveW1lbnREdXJhdGlvbjogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMzApLFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgICAgZGVwbG95VG86IFthcHAuYWRkRW52aXJvbm1lbnQoJ0Vudmlyb25tZW50JyldLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpDb25maWd1cmF0aW9uUHJvZmlsZScsIHtcbiAgICAgIE5hbWU6ICdNeUNvbmZpZ3VyYXRpb24nLFxuICAgICAgQXBwbGljYXRpb25JZDoge1xuICAgICAgICBSZWY6ICdNeUFwcENvbmZpZ0I0QjYzRTc1JyxcbiAgICAgIH0sXG4gICAgICBMb2NhdGlvblVyaTogJ2hvc3RlZCcsXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpIb3N0ZWRDb25maWd1cmF0aW9uVmVyc2lvbicsIHtcbiAgICAgIEFwcGxpY2F0aW9uSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdCNEI2M0U3NScsXG4gICAgICB9LFxuICAgICAgQ29uZmlndXJhdGlvblByb2ZpbGVJZDoge1xuICAgICAgICBSZWY6ICdNeUNvbmZpZ3VyYXRpb25Db25maWd1cmF0aW9uUHJvZmlsZUVFMEVDQTg1JyxcbiAgICAgIH0sXG4gICAgICBDb250ZW50OiAnVGhpcyBpcyBteSBjb250ZW50JyxcbiAgICAgIENvbnRlbnRUeXBlOiAndGV4dC9wbGFpbicsXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXBwQ29uZmlnOjpEZXBsb3ltZW50JywgMSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlZmF1bHQgY29uZmlndXJhdGlvbiBmcm9tIGZpbGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHBDb25maWcnKTtcbiAgICBuZXcgSG9zdGVkQ29uZmlndXJhdGlvbihzdGFjaywgJ015Q29uZmlndXJhdGlvbicsIHtcbiAgICAgIGRlcGxveW1lbnRTdHJhdGVneTogbmV3IERlcGxveW1lbnRTdHJhdGVneShzdGFjaywgJ015RGVwbG95bWVudFN0cmF0ZWd5Jywge1xuICAgICAgICByb2xsb3V0U3RyYXRlZ3k6IFJvbGxvdXRTdHJhdGVneS5saW5lYXIoe1xuICAgICAgICAgIGdyb3d0aEZhY3RvcjogMTUsXG4gICAgICAgICAgZGVwbG95bWVudER1cmF0aW9uOiBjZGsuRHVyYXRpb24ubWludXRlcygzMCksXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgICBhcHBsaWNhdGlvbjogYXBwLFxuICAgICAgY29udGVudDogQ29uZmlndXJhdGlvbkNvbnRlbnQuZnJvbUZpbGUoJ3Rlc3QvY29uZmlnLmpzb24nKSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6Q29uZmlndXJhdGlvblByb2ZpbGUnLCB7XG4gICAgICBOYW1lOiAnTXlDb25maWd1cmF0aW9uJyxcbiAgICAgIEFwcGxpY2F0aW9uSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdCNEI2M0U3NScsXG4gICAgICB9LFxuICAgICAgTG9jYXRpb25Vcmk6ICdob3N0ZWQnLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6SG9zdGVkQ29uZmlndXJhdGlvblZlcnNpb24nLCB7XG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIENvbmZpZ3VyYXRpb25Qcm9maWxlSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlDb25maWd1cmF0aW9uQ29uZmlndXJhdGlvblByb2ZpbGVFRTBFQ0E4NScsXG4gICAgICB9LFxuICAgICAgQ29udGVudDogJ3tcXG4gIFwiY29udGVudFwiOiBcIlRoaXMgaXMgdGhlIGNvbmZpZ3VyYXRpb24gY29udGVudFwiXFxufScsXG4gICAgICBDb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdkZWZhdWx0IGNvbmZpZ3VyYXRpb24gZnJvbSBpbmxpbmUgb2N0ZXQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHBDb25maWcnKTtcbiAgICBuZXcgSG9zdGVkQ29uZmlndXJhdGlvbihzdGFjaywgJ015Q29uZmlndXJhdGlvbicsIHtcbiAgICAgIGRlcGxveW1lbnRTdHJhdGVneTogbmV3IERlcGxveW1lbnRTdHJhdGVneShzdGFjaywgJ015RGVwbG95bWVudFN0cmF0ZWd5Jywge1xuICAgICAgICByb2xsb3V0U3RyYXRlZ3k6IFJvbGxvdXRTdHJhdGVneS5saW5lYXIoe1xuICAgICAgICAgIGdyb3d0aEZhY3RvcjogMTUsXG4gICAgICAgICAgZGVwbG95bWVudER1cmF0aW9uOiBjZGsuRHVyYXRpb24ubWludXRlcygzMCksXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgICBhcHBsaWNhdGlvbjogYXBwLFxuICAgICAgY29udGVudDogQ29uZmlndXJhdGlvbkNvbnRlbnQuZnJvbUlubGluZSgnVGhpcyBzaG91bGQgYmUgb2YgY29udGVudCB0eXBlIGFwcGxpY2F0aW9uL29jdGV0JyksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkNvbmZpZ3VyYXRpb25Qcm9maWxlJywge1xuICAgICAgTmFtZTogJ015Q29uZmlndXJhdGlvbicsXG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIExvY2F0aW9uVXJpOiAnaG9zdGVkJyxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6Okhvc3RlZENvbmZpZ3VyYXRpb25WZXJzaW9uJywge1xuICAgICAgQXBwbGljYXRpb25JZDoge1xuICAgICAgICBSZWY6ICdNeUFwcENvbmZpZ0I0QjYzRTc1JyxcbiAgICAgIH0sXG4gICAgICBDb25maWd1cmF0aW9uUHJvZmlsZUlkOiB7XG4gICAgICAgIFJlZjogJ015Q29uZmlndXJhdGlvbkNvbmZpZ3VyYXRpb25Qcm9maWxlRUUwRUNBODUnLFxuICAgICAgfSxcbiAgICAgIENvbnRlbnQ6ICdUaGlzIHNob3VsZCBiZSBvZiBjb250ZW50IHR5cGUgYXBwbGljYXRpb24vb2N0ZXQnLFxuICAgICAgQ29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdkZWZhdWx0IGNvbmZpZ3VyYXRpb24gZnJvbSBpbmxpbmUgeWFtbCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcENvbmZpZycpO1xuICAgIG5ldyBIb3N0ZWRDb25maWd1cmF0aW9uKHN0YWNrLCAnTXlDb25maWd1cmF0aW9uJywge1xuICAgICAgZGVwbG95bWVudFN0cmF0ZWd5OiBuZXcgRGVwbG95bWVudFN0cmF0ZWd5KHN0YWNrLCAnTXlEZXBsb3ltZW50U3RyYXRlZ3knLCB7XG4gICAgICAgIHJvbGxvdXRTdHJhdGVneTogUm9sbG91dFN0cmF0ZWd5LmxpbmVhcih7XG4gICAgICAgICAgZ3Jvd3RoRmFjdG9yOiAxNSxcbiAgICAgICAgICBkZXBsb3ltZW50RHVyYXRpb246IGNkay5EdXJhdGlvbi5taW51dGVzKDMwKSxcbiAgICAgICAgfSksXG4gICAgICB9KSxcbiAgICAgIGFwcGxpY2F0aW9uOiBhcHAsXG4gICAgICBjb250ZW50OiBDb25maWd1cmF0aW9uQ29udGVudC5mcm9tSW5saW5lWWFtbCgnVGhpcyBzaG91bGQgYmUgb2YgY29udGVudCB0eXBlIGFwcGxpY2F0aW9uL3gteWFtbCcpLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpDb25maWd1cmF0aW9uUHJvZmlsZScsIHtcbiAgICAgIE5hbWU6ICdNeUNvbmZpZ3VyYXRpb24nLFxuICAgICAgQXBwbGljYXRpb25JZDoge1xuICAgICAgICBSZWY6ICdNeUFwcENvbmZpZ0I0QjYzRTc1JyxcbiAgICAgIH0sXG4gICAgICBMb2NhdGlvblVyaTogJ2hvc3RlZCcsXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpIb3N0ZWRDb25maWd1cmF0aW9uVmVyc2lvbicsIHtcbiAgICAgIEFwcGxpY2F0aW9uSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdCNEI2M0U3NScsXG4gICAgICB9LFxuICAgICAgQ29uZmlndXJhdGlvblByb2ZpbGVJZDoge1xuICAgICAgICBSZWY6ICdNeUNvbmZpZ3VyYXRpb25Db25maWd1cmF0aW9uUHJvZmlsZUVFMEVDQTg1JyxcbiAgICAgIH0sXG4gICAgICBDb250ZW50OiAnVGhpcyBzaG91bGQgYmUgb2YgY29udGVudCB0eXBlIGFwcGxpY2F0aW9uL3gteWFtbCcsXG4gICAgICBDb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL3gteWFtbCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbmZpZ3VyYXRpb24gcHJvZmlsZSB3aXRoIG5hbWUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHBDb25maWcnKTtcbiAgICBuZXcgSG9zdGVkQ29uZmlndXJhdGlvbihzdGFjaywgJ015Q29uZmlndXJhdGlvblByb2ZpbGUnLCB7XG4gICAgICBuYW1lOiAnVGVzdENvbmZpZ1Byb2ZpbGUnLFxuICAgICAgYXBwbGljYXRpb246IGFwcCxcbiAgICAgIGNvbnRlbnQ6IENvbmZpZ3VyYXRpb25Db250ZW50LmZyb21JbmxpbmVUZXh0KCdUaGlzIGlzIG15IGNvbnRlbnQnKSxcbiAgICAgIGRlcGxveW1lbnRTdHJhdGVneTogbmV3IERlcGxveW1lbnRTdHJhdGVneShzdGFjaywgJ015RGVwbG95bWVudFN0cmF0ZWd5Jywge1xuICAgICAgICByb2xsb3V0U3RyYXRlZ3k6IFJvbGxvdXRTdHJhdGVneS5saW5lYXIoe1xuICAgICAgICAgIGdyb3d0aEZhY3RvcjogMTUsXG4gICAgICAgICAgZGVwbG95bWVudER1cmF0aW9uOiBjZGsuRHVyYXRpb24ubWludXRlcygzMCksXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkNvbmZpZ3VyYXRpb25Qcm9maWxlJywge1xuICAgICAgTmFtZTogJ1Rlc3RDb25maWdQcm9maWxlJyxcbiAgICAgIEFwcGxpY2F0aW9uSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdCNEI2M0U3NScsXG4gICAgICB9LFxuICAgICAgTG9jYXRpb25Vcmk6ICdob3N0ZWQnLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6SG9zdGVkQ29uZmlndXJhdGlvblZlcnNpb24nLCB7XG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIENvbmZpZ3VyYXRpb25Qcm9maWxlSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlDb25maWd1cmF0aW9uUHJvZmlsZTMzQTk3MTYzJyxcbiAgICAgIH0sXG4gICAgICBDb250ZW50OiAnVGhpcyBpcyBteSBjb250ZW50JyxcbiAgICAgIENvbnRlbnRUeXBlOiAndGV4dC9wbGFpbicsXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXBwQ29uZmlnOjpEZXBsb3ltZW50JywgMCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbmZpZ3VyYXRpb24gcHJvZmlsZSB3aXRoIHR5cGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHBDb25maWcnKTtcbiAgICBuZXcgSG9zdGVkQ29uZmlndXJhdGlvbihzdGFjaywgJ015Q29uZmlndXJhdGlvblByb2ZpbGUnLCB7XG4gICAgICBuYW1lOiAnVGVzdENvbmZpZ1Byb2ZpbGUnLFxuICAgICAgYXBwbGljYXRpb246IGFwcCxcbiAgICAgIHR5cGU6IENvbmZpZ3VyYXRpb25UeXBlLkZFQVRVUkVfRkxBR1MsXG4gICAgICBjb250ZW50OiBDb25maWd1cmF0aW9uQ29udGVudC5mcm9tSW5saW5lVGV4dCgnVGhpcyBpcyBteSBjb250ZW50JyksXG4gICAgICBkZXBsb3ltZW50U3RyYXRlZ3k6IG5ldyBEZXBsb3ltZW50U3RyYXRlZ3koc3RhY2ssICdNeURlcGxveW1lbnRTdHJhdGVneScsIHtcbiAgICAgICAgcm9sbG91dFN0cmF0ZWd5OiBSb2xsb3V0U3RyYXRlZ3kubGluZWFyKHtcbiAgICAgICAgICBncm93dGhGYWN0b3I6IDE1LFxuICAgICAgICAgIGRlcGxveW1lbnREdXJhdGlvbjogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMzApLFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpDb25maWd1cmF0aW9uUHJvZmlsZScsIHtcbiAgICAgIE5hbWU6ICdUZXN0Q29uZmlnUHJvZmlsZScsXG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIFR5cGU6ICdBV1MuQXBwQ29uZmlnLkZlYXR1cmVGbGFncycsXG4gICAgICBMb2NhdGlvblVyaTogJ2hvc3RlZCcsXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpIb3N0ZWRDb25maWd1cmF0aW9uVmVyc2lvbicsIHtcbiAgICAgIEFwcGxpY2F0aW9uSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdCNEI2M0U3NScsXG4gICAgICB9LFxuICAgICAgQ29uZmlndXJhdGlvblByb2ZpbGVJZDoge1xuICAgICAgICBSZWY6ICdNeUNvbmZpZ3VyYXRpb25Qcm9maWxlMzNBOTcxNjMnLFxuICAgICAgfSxcbiAgICAgIENvbnRlbnQ6ICdUaGlzIGlzIG15IGNvbnRlbnQnLFxuICAgICAgQ29udGVudFR5cGU6ICd0ZXh0L3BsYWluJyxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpBcHBDb25maWc6OkRlcGxveW1lbnQnLCAwKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uZmlndXJhdGlvbiBwcm9maWxlIHdpdGggZGVzY3JpcHRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHBDb25maWcnKTtcbiAgICBuZXcgSG9zdGVkQ29uZmlndXJhdGlvbihzdGFjaywgJ015Q29uZmlndXJhdGlvblByb2ZpbGUnLCB7XG4gICAgICBuYW1lOiAnVGVzdENvbmZpZ1Byb2ZpbGUnLFxuICAgICAgYXBwbGljYXRpb246IGFwcCxcbiAgICAgIGNvbnRlbnQ6IENvbmZpZ3VyYXRpb25Db250ZW50LmZyb21JbmxpbmVUZXh0KCdUaGlzIGlzIG15IGNvbnRlbnQnKSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhpcyBpcyBteSBkZXNjcmlwdGlvbicsXG4gICAgICBkZXBsb3ltZW50U3RyYXRlZ3k6IG5ldyBEZXBsb3ltZW50U3RyYXRlZ3koc3RhY2ssICdNeURlcGxveW1lbnRTdHJhdGVneScsIHtcbiAgICAgICAgcm9sbG91dFN0cmF0ZWd5OiBSb2xsb3V0U3RyYXRlZ3kubGluZWFyKHtcbiAgICAgICAgICBncm93dGhGYWN0b3I6IDE1LFxuICAgICAgICAgIGRlcGxveW1lbnREdXJhdGlvbjogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMzApLFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpDb25maWd1cmF0aW9uUHJvZmlsZScsIHtcbiAgICAgIE5hbWU6ICdUZXN0Q29uZmlnUHJvZmlsZScsXG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIERlc2NyaXB0aW9uOiAnVGhpcyBpcyBteSBkZXNjcmlwdGlvbicsXG4gICAgICBMb2NhdGlvblVyaTogJ2hvc3RlZCcsXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpIb3N0ZWRDb25maWd1cmF0aW9uVmVyc2lvbicsIHtcbiAgICAgIEFwcGxpY2F0aW9uSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdCNEI2M0U3NScsXG4gICAgICB9LFxuICAgICAgQ29uZmlndXJhdGlvblByb2ZpbGVJZDoge1xuICAgICAgICBSZWY6ICdNeUNvbmZpZ3VyYXRpb25Qcm9maWxlMzNBOTcxNjMnLFxuICAgICAgfSxcbiAgICAgIENvbnRlbnQ6ICdUaGlzIGlzIG15IGNvbnRlbnQnLFxuICAgICAgQ29udGVudFR5cGU6ICd0ZXh0L3BsYWluJyxcbiAgICAgIERlc2NyaXB0aW9uOiAnVGhpcyBpcyBteSBkZXNjcmlwdGlvbicsXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXBwQ29uZmlnOjpEZXBsb3ltZW50JywgMCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbmZpZ3VyYXRpb24gcHJvZmlsZSB3aXRoIHZhbGlkYXRvcicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcENvbmZpZycpO1xuICAgIG5ldyBIb3N0ZWRDb25maWd1cmF0aW9uKHN0YWNrLCAnTXlDb25maWd1cmF0aW9uUHJvZmlsZScsIHtcbiAgICAgIG5hbWU6ICdUZXN0Q29uZmlnUHJvZmlsZScsXG4gICAgICBhcHBsaWNhdGlvbjogYXBwLFxuICAgICAgY29udGVudDogQ29uZmlndXJhdGlvbkNvbnRlbnQuZnJvbUlubGluZVRleHQoJ1RoaXMgaXMgbXkgY29udGVudCcpLFxuICAgICAgdmFsaWRhdG9yczogW1xuICAgICAgICB7XG4gICAgICAgICAgY29udGVudDogJ2R1bW15IHZhbGlkYXRvcicsXG4gICAgICAgICAgdHlwZTogVmFsaWRhdG9yVHlwZS5KU09OX1NDSEVNQSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBkZXBsb3ltZW50U3RyYXRlZ3k6IG5ldyBEZXBsb3ltZW50U3RyYXRlZ3koc3RhY2ssICdNeURlcGxveW1lbnRTdHJhdGVneScsIHtcbiAgICAgICAgcm9sbG91dFN0cmF0ZWd5OiBSb2xsb3V0U3RyYXRlZ3kubGluZWFyKHtcbiAgICAgICAgICBncm93dGhGYWN0b3I6IDE1LFxuICAgICAgICAgIGRlcGxveW1lbnREdXJhdGlvbjogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMzApLFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpDb25maWd1cmF0aW9uUHJvZmlsZScsIHtcbiAgICAgIE5hbWU6ICdUZXN0Q29uZmlnUHJvZmlsZScsXG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIFZhbGlkYXRvcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFR5cGU6ICdKU09OX1NDSEVNQScsXG4gICAgICAgICAgQ29udGVudDogJ2R1bW15IHZhbGlkYXRvcicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgTG9jYXRpb25Vcmk6ICdob3N0ZWQnLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6SG9zdGVkQ29uZmlndXJhdGlvblZlcnNpb24nLCB7XG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIENvbmZpZ3VyYXRpb25Qcm9maWxlSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlDb25maWd1cmF0aW9uUHJvZmlsZTMzQTk3MTYzJyxcbiAgICAgIH0sXG4gICAgICBDb250ZW50OiAnVGhpcyBpcyBteSBjb250ZW50JyxcbiAgICAgIENvbnRlbnRUeXBlOiAndGV4dC9wbGFpbicsXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXBwQ29uZmlnOjpEZXBsb3ltZW50JywgMCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbmZpZ3VyYXRpb24gcHJvZmlsZSB3aXRoIGlubGluZSBqc29uIHNjaGVtYSB2YWxpZGF0b3InLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHBDb25maWcnKTtcbiAgICBjb25zdCB2YWxpZGF0b3JDb250ZW50ID0gYFxuICAgIHtcbiAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICAgICAgXCJjb21wdXRlUmVzb3VyY2VcIjoge1xuICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICAgICAgICBcIkNvbXB1dGVBTDFJbWFnZUlkXCI6IHtcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgICAgICAgICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICAgICAgICAgICAgXCJtZS1zb3V0aC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImFwLWVhc3QtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJhcC1ub3J0aGVhc3QtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJhcC1ub3J0aGVhc3QtMlwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJhcC1zb3V0aC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImFwLXNvdXRoZWFzdC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImFwLXNvdXRoZWFzdC0yXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImNhLWNlbnRyYWwtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJjbi1ub3J0aC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImNuLW5vcnRod2VzdC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImV1LWNlbnRyYWwtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJldS1ub3J0aC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImV1LXdlc3QtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJldS13ZXN0LTJcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiZXUtd2VzdC0zXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcInNhLWVhc3QtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJ1cy1lYXN0LTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwidXMtZWFzdC0yXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcInVzLWdvdi13ZXN0LTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwidXMtZ292LWVhc3QtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJ1cy13ZXN0LTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwidXMtd2VzdC0yXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImV1LXNvdXRoLTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiYXAtbm9ydGhlYXN0LTNcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiYWYtc291dGgtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiR1BVSW1hZ2VJZFwiOiB7XG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgICBcInByb3BlcnRpZXNcIjoge1xuICAgICAgICAgICAgICAgIFwibWUtc291dGgtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJhcC1lYXN0LTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiYXAtbm9ydGhlYXN0LTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiYXAtbm9ydGhlYXN0LTJcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiYXAtc291dGgtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJhcC1zb3V0aGVhc3QtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJhcC1zb3V0aGVhc3QtMlwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJjYS1jZW50cmFsLTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiY24tbm9ydGgtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJjbi1ub3J0aHdlc3QtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJldS1jZW50cmFsLTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiZXUtbm9ydGgtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJldS13ZXN0LTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiZXUtd2VzdC0yXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImV1LXdlc3QtM1wiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJzYS1lYXN0LTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwidXMtZWFzdC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcInVzLWVhc3QtMlwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJ1cy1nb3Ytd2VzdC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcInVzLWdvdi1lYXN0LTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwidXMtd2VzdC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcInVzLXdlc3QtMlwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJldS1zb3V0aC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImFwLW5vcnRoZWFzdC0zXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImFmLXNvdXRoLTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIkFSTUltYWdlSWRcIjoge1xuICAgICAgICAgICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICAgICAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICAgICAgICAgICAgICBcIm1lLXNvdXRoLTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiYXAtZWFzdC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImFwLW5vcnRoZWFzdC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImFwLW5vcnRoZWFzdC0yXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImFwLXNvdXRoLTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiYXAtc291dGhlYXN0LTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiYXAtc291dGhlYXN0LTJcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiY2EtY2VudHJhbC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImNuLW5vcnRoLTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiY24tbm9ydGh3ZXN0LTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiZXUtY2VudHJhbC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImV1LW5vcnRoLTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiZXUtd2VzdC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImV1LXdlc3QtMlwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJldS13ZXN0LTNcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwic2EtZWFzdC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcInVzLWVhc3QtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJ1cy1lYXN0LTJcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwidXMtZ292LXdlc3QtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJ1cy1nb3YtZWFzdC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcInVzLXdlc3QtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJ1cy13ZXN0LTJcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiZXUtc291dGgtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJhcC1ub3J0aGVhc3QtM1wiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJhZi1zb3V0aC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJDb21wdXRlQUwySW1hZ2VJZFwiOiB7XG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgICBcInByb3BlcnRpZXNcIjoge1xuICAgICAgICAgICAgICAgIFwibWUtc291dGgtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJhcC1lYXN0LTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiYXAtbm9ydGhlYXN0LTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiYXAtbm9ydGhlYXN0LTJcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiYXAtc291dGgtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJhcC1zb3V0aGVhc3QtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJhcC1zb3V0aGVhc3QtMlwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJjYS1jZW50cmFsLTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiY24tbm9ydGgtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJjbi1ub3J0aHdlc3QtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJldS1jZW50cmFsLTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiZXUtbm9ydGgtMVwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJldS13ZXN0LTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwiZXUtd2VzdC0yXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImV1LXdlc3QtM1wiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJzYS1lYXN0LTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwidXMtZWFzdC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcInVzLWVhc3QtMlwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJ1cy1nb3Ytd2VzdC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcInVzLWdvdi1lYXN0LTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9LFxuICAgICAgICAgICAgICAgIFwidXMtd2VzdC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcInVzLXdlc3QtMlwiOiB7IFwidHlwZVwiOiBcInN0cmluZ1wiIH0sXG4gICAgICAgICAgICAgICAgXCJldS1zb3V0aC0xXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImFwLW5vcnRoZWFzdC0zXCI6IHsgXCJ0eXBlXCI6IFwic3RyaW5nXCIgfSxcbiAgICAgICAgICAgICAgICBcImFmLXNvdXRoLTFcIjogeyBcInR5cGVcIjogXCJzdHJpbmdcIiB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9YDtcbiAgICBuZXcgSG9zdGVkQ29uZmlndXJhdGlvbihzdGFjaywgJ015Q29uZmlndXJhdGlvbicsIHtcbiAgICAgIG5hbWU6ICdUZXN0Q29uZmlnUHJvZmlsZScsXG4gICAgICBhcHBsaWNhdGlvbjogYXBwLFxuICAgICAgdmFsaWRhdG9yczogW1xuICAgICAgICBKc29uU2NoZW1hVmFsaWRhdG9yLmZyb21JbmxpbmUodmFsaWRhdG9yQ29udGVudCksXG4gICAgICAgIEpzb25TY2hlbWFWYWxpZGF0b3IuZnJvbUZpbGUoJ3Rlc3Qvc2NoZW1hLmpzb24nKSxcbiAgICAgIF0sXG4gICAgICBjb250ZW50OiBDb25maWd1cmF0aW9uQ29udGVudC5mcm9tSW5saW5lVGV4dCgnVGhpcyBpcyBteSBjb250ZW50JyksXG4gICAgICBkZXBsb3ltZW50U3RyYXRlZ3k6IG5ldyBEZXBsb3ltZW50U3RyYXRlZ3koc3RhY2ssICdNeURlcGxveW1lbnRTdHJhdGVneScsIHtcbiAgICAgICAgcm9sbG91dFN0cmF0ZWd5OiBSb2xsb3V0U3RyYXRlZ3kubGluZWFyKHtcbiAgICAgICAgICBncm93dGhGYWN0b3I6IDE1LFxuICAgICAgICAgIGRlcGxveW1lbnREdXJhdGlvbjogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMzApLFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpDb25maWd1cmF0aW9uUHJvZmlsZScsIHtcbiAgICAgIE5hbWU6ICdUZXN0Q29uZmlnUHJvZmlsZScsXG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIFZhbGlkYXRvcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFR5cGU6ICdKU09OX1NDSEVNQScsXG4gICAgICAgICAgQ29udGVudDogJ1xcbiAgICB7XFxuICAgICAgXFxcInR5cGVcXFwiOiBcXFwib2JqZWN0XFxcIixcXG4gICAgICBcXFwicHJvcGVydGllc1xcXCI6IHtcXG4gICAgICAgIFxcXCJjb21wdXRlUmVzb3VyY2VcXFwiOiB7XFxuICAgICAgICAgIFxcXCJ0eXBlXFxcIjogXFxcIm9iamVjdFxcXCIsXFxuICAgICAgICAgIFxcXCJwcm9wZXJ0aWVzXFxcIjoge1xcbiAgICAgICAgICAgIFxcXCJDb21wdXRlQUwxSW1hZ2VJZFxcXCI6IHtcXG4gICAgICAgICAgICAgIFxcXCJ0eXBlXFxcIjogXFxcIm9iamVjdFxcXCIsXFxuICAgICAgICAgICAgICBcXFwicHJvcGVydGllc1xcXCI6IHtcXG4gICAgICAgICAgICAgICAgXFxcIm1lLXNvdXRoLTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImFwLWVhc3QtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiYXAtbm9ydGhlYXN0LTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImFwLW5vcnRoZWFzdC0yXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJhcC1zb3V0aC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJhcC1zb3V0aGVhc3QtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiYXAtc291dGhlYXN0LTJcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImNhLWNlbnRyYWwtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiY24tbm9ydGgtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiY24tbm9ydGh3ZXN0LTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImV1LWNlbnRyYWwtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiZXUtbm9ydGgtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiZXUtd2VzdC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJldS13ZXN0LTJcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImV1LXdlc3QtM1xcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwic2EtZWFzdC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJ1cy1lYXN0LTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcInVzLWVhc3QtMlxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwidXMtZ292LXdlc3QtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwidXMtZ292LWVhc3QtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwidXMtd2VzdC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJ1cy13ZXN0LTJcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImV1LXNvdXRoLTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImFwLW5vcnRoZWFzdC0zXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJhZi1zb3V0aC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH1cXG4gICAgICAgICAgICAgIH1cXG4gICAgICAgICAgICB9LFxcbiAgICAgICAgICAgIFxcXCJHUFVJbWFnZUlkXFxcIjoge1xcbiAgICAgICAgICAgICAgXFxcInR5cGVcXFwiOiBcXFwib2JqZWN0XFxcIixcXG4gICAgICAgICAgICAgIFxcXCJwcm9wZXJ0aWVzXFxcIjoge1xcbiAgICAgICAgICAgICAgICBcXFwibWUtc291dGgtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiYXAtZWFzdC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJhcC1ub3J0aGVhc3QtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiYXAtbm9ydGhlYXN0LTJcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImFwLXNvdXRoLTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImFwLXNvdXRoZWFzdC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJhcC1zb3V0aGVhc3QtMlxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiY2EtY2VudHJhbC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJjbi1ub3J0aC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJjbi1ub3J0aHdlc3QtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiZXUtY2VudHJhbC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJldS1ub3J0aC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJldS13ZXN0LTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImV1LXdlc3QtMlxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiZXUtd2VzdC0zXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJzYS1lYXN0LTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcInVzLWVhc3QtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwidXMtZWFzdC0yXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJ1cy1nb3Ytd2VzdC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJ1cy1nb3YtZWFzdC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJ1cy13ZXN0LTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcInVzLXdlc3QtMlxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiZXUtc291dGgtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiYXAtbm9ydGhlYXN0LTNcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImFmLXNvdXRoLTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfVxcbiAgICAgICAgICAgICAgfVxcbiAgICAgICAgICAgIH0sXFxuICAgICAgICAgICAgXFxcIkFSTUltYWdlSWRcXFwiOiB7XFxuICAgICAgICAgICAgICBcXFwidHlwZVxcXCI6IFxcXCJvYmplY3RcXFwiLFxcbiAgICAgICAgICAgICAgXFxcInByb3BlcnRpZXNcXFwiOiB7XFxuICAgICAgICAgICAgICAgIFxcXCJtZS1zb3V0aC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJhcC1lYXN0LTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImFwLW5vcnRoZWFzdC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJhcC1ub3J0aGVhc3QtMlxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiYXAtc291dGgtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiYXAtc291dGhlYXN0LTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImFwLXNvdXRoZWFzdC0yXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJjYS1jZW50cmFsLTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImNuLW5vcnRoLTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImNuLW5vcnRod2VzdC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJldS1jZW50cmFsLTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImV1LW5vcnRoLTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImV1LXdlc3QtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiZXUtd2VzdC0yXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJldS13ZXN0LTNcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcInNhLWVhc3QtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwidXMtZWFzdC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJ1cy1lYXN0LTJcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcInVzLWdvdi13ZXN0LTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcInVzLWdvdi1lYXN0LTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcInVzLXdlc3QtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwidXMtd2VzdC0yXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJldS1zb3V0aC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJhcC1ub3J0aGVhc3QtM1xcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiYWYtc291dGgtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9XFxuICAgICAgICAgICAgICB9XFxuICAgICAgICAgICAgfSxcXG4gICAgICAgICAgICBcXFwiQ29tcHV0ZUFMMkltYWdlSWRcXFwiOiB7XFxuICAgICAgICAgICAgICBcXFwidHlwZVxcXCI6IFxcXCJvYmplY3RcXFwiLFxcbiAgICAgICAgICAgICAgXFxcInByb3BlcnRpZXNcXFwiOiB7XFxuICAgICAgICAgICAgICAgIFxcXCJtZS1zb3V0aC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJhcC1lYXN0LTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImFwLW5vcnRoZWFzdC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJhcC1ub3J0aGVhc3QtMlxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiYXAtc291dGgtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiYXAtc291dGhlYXN0LTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImFwLXNvdXRoZWFzdC0yXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJjYS1jZW50cmFsLTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImNuLW5vcnRoLTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImNuLW5vcnRod2VzdC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJldS1jZW50cmFsLTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImV1LW5vcnRoLTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcImV1LXdlc3QtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiZXUtd2VzdC0yXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJldS13ZXN0LTNcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcInNhLWVhc3QtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwidXMtZWFzdC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJ1cy1lYXN0LTJcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcInVzLWdvdi13ZXN0LTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcInVzLWdvdi1lYXN0LTFcXFwiOiB7IFxcXCJ0eXBlXFxcIjogXFxcInN0cmluZ1xcXCIgfSxcXG4gICAgICAgICAgICAgICAgXFxcInVzLXdlc3QtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwidXMtd2VzdC0yXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJldS1zb3V0aC0xXFxcIjogeyBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiIH0sXFxuICAgICAgICAgICAgICAgIFxcXCJhcC1ub3J0aGVhc3QtM1xcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9LFxcbiAgICAgICAgICAgICAgICBcXFwiYWYtc291dGgtMVxcXCI6IHsgXFxcInR5cGVcXFwiOiBcXFwic3RyaW5nXFxcIiB9XFxuICAgICAgICAgICAgICB9XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgICB9XFxuICAgICAgICB9XFxuICAgICAgfVxcbiAgICB9JyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFR5cGU6ICdKU09OX1NDSEVNQScsXG4gICAgICAgICAgQ29udGVudDogJ3tcXG4gIFxcXCIkc2NoZW1hXFxcIjogXFxcImh0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDcvc2NoZW1hI1xcXCIsXFxuICBcXFwidHlwZVxcXCI6IFxcXCJzdHJpbmdcXFwiXFxufScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgTG9jYXRpb25Vcmk6ICdob3N0ZWQnLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6SG9zdGVkQ29uZmlndXJhdGlvblZlcnNpb24nLCB7XG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIENvbmZpZ3VyYXRpb25Qcm9maWxlSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlDb25maWd1cmF0aW9uQ29uZmlndXJhdGlvblByb2ZpbGVFRTBFQ0E4NScsXG4gICAgICB9LFxuICAgICAgQ29udGVudDogJ1RoaXMgaXMgbXkgY29udGVudCcsXG4gICAgICBDb250ZW50VHlwZTogJ3RleHQvcGxhaW4nLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkFwcENvbmZpZzo6RGVwbG95bWVudCcsIDApO1xuICB9KTtcblxuICB0ZXN0KCdjb25maWd1cmF0aW9uIHByb2ZpbGUgd2l0aCBzc20gcGFyYW1ldGVyJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwQ29uZmlnJyk7XG4gICAgY29uc3QgcGFyYW1ldGVyID0gbmV3IFN0cmluZ1BhcmFtZXRlcihzdGFjaywgJ015UGFyYW1ldGVyJywge1xuICAgICAgc3RyaW5nVmFsdWU6ICdUaGlzIGlzIHRoZSBjb250ZW50IHN0b3JlZCBpbiBzc20gcGFyYW1ldGVyJyxcbiAgICAgIHBhcmFtZXRlck5hbWU6ICdteS1wYXJhbWV0ZXInLFxuICAgIH0pO1xuICAgIG5ldyBTb3VyY2VkQ29uZmlndXJhdGlvbihzdGFjaywgJ015Q29uZmlndXJhdGlvbicsIHtcbiAgICAgIG5hbWU6ICdUZXN0Q29uZmlnUHJvZmlsZScsXG4gICAgICBsb2NhdGlvbjogQ29uZmlndXJhdGlvblNvdXJjZS5mcm9tUGFyYW1ldGVyKHBhcmFtZXRlciksXG4gICAgICB2ZXJzaW9uTnVtYmVyOiAnMScsXG4gICAgICBhcHBsaWNhdGlvbjogYXBwLFxuICAgICAgZGVwbG95bWVudFN0cmF0ZWd5OiBuZXcgRGVwbG95bWVudFN0cmF0ZWd5KHN0YWNrLCAnTXlEZXBsb3ltZW50U3RyYXRlZ3knLCB7XG4gICAgICAgIHJvbGxvdXRTdHJhdGVneTogUm9sbG91dFN0cmF0ZWd5LmxpbmVhcih7XG4gICAgICAgICAgZ3Jvd3RoRmFjdG9yOiAxNSxcbiAgICAgICAgICBkZXBsb3ltZW50RHVyYXRpb246IGNkay5EdXJhdGlvbi5taW51dGVzKDMwKSxcbiAgICAgICAgfSksXG4gICAgICB9KSxcbiAgICAgIGRlcGxveVRvOiBbYXBwLmFkZEVudmlyb25tZW50KCdFbnZpcm9ubWVudCcpXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6Q29uZmlndXJhdGlvblByb2ZpbGUnLCB7XG4gICAgICBOYW1lOiAnVGVzdENvbmZpZ1Byb2ZpbGUnLFxuICAgICAgQXBwbGljYXRpb25JZDoge1xuICAgICAgICBSZWY6ICdNeUFwcENvbmZpZ0I0QjYzRTc1JyxcbiAgICAgIH0sXG4gICAgICBMb2NhdGlvblVyaToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICc6c3NtOicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICc6cGFyYW1ldGVyLycsXG4gICAgICAgICAgICB7IFJlZjogJ015UGFyYW1ldGVyMThCQTU0N0QnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgUG9saWNpZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6c3NtOicsXG4gICAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOnBhcmFtZXRlci8nLFxuICAgICAgICAgICAgICAgICAgICAgIHsgUmVmOiAnTXlQYXJhbWV0ZXIxOEJBNTQ3RCcgfSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdzc206R2V0UGFyYW1ldGVyJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBQb2xpY3lOYW1lOiAnQWxsb3dBcHBDb25maWdSZWFkRnJvbVNvdXJjZVBvbGljeScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkFwcENvbmZpZzo6RGVwbG95bWVudCcsIDEpO1xuICB9KTtcblxuICB0ZXN0KCdjb25maWd1cmF0aW9uIHByb2ZpbGUgd2l0aCBzc20gZG9jdW1lbnQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgZG9jdW1lbnQgPSBuZXcgQ2ZuRG9jdW1lbnQoc3RhY2ssICdNeURvY3VtZW50Jywge1xuICAgICAgY29udGVudDoge1xuICAgICAgICBtYWluU3RlcHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBhY3Rpb246ICdhd3M6cnVuU2hlbGxTY3JpcHQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgbmFtZTogJ1Rlc3REb2N1bWVudE5hbWUnLFxuICAgIH0pO1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwQ29uZmlnJyk7XG4gICAgbmV3IFNvdXJjZWRDb25maWd1cmF0aW9uKHN0YWNrLCAnTXlDb25maWd1cmF0aW9uJywge1xuICAgICAgbmFtZTogJ1Rlc3RDb25maWdQcm9maWxlJyxcbiAgICAgIGxvY2F0aW9uOiBDb25maWd1cmF0aW9uU291cmNlLmZyb21DZm5Eb2N1bWVudChkb2N1bWVudCksXG4gICAgICB2ZXJzaW9uTnVtYmVyOiAnMScsXG4gICAgICBhcHBsaWNhdGlvbjogYXBwLFxuICAgICAgZGVwbG95bWVudFN0cmF0ZWd5OiBuZXcgRGVwbG95bWVudFN0cmF0ZWd5KHN0YWNrLCAnTXlEZXBsb3ltZW50U3RyYXRlZ3knLCB7XG4gICAgICAgIHJvbGxvdXRTdHJhdGVneTogUm9sbG91dFN0cmF0ZWd5LmxpbmVhcih7XG4gICAgICAgICAgZ3Jvd3RoRmFjdG9yOiAxNSxcbiAgICAgICAgICBkZXBsb3ltZW50RHVyYXRpb246IGNkay5EdXJhdGlvbi5taW51dGVzKDMwKSxcbiAgICAgICAgfSksXG4gICAgICB9KSxcbiAgICAgIGRlcGxveVRvOiBbYXBwLmFkZEVudmlyb25tZW50KCdFbnZpcm9ubWVudCcpXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6Q29uZmlndXJhdGlvblByb2ZpbGUnLCB7XG4gICAgICBOYW1lOiAnVGVzdENvbmZpZ1Byb2ZpbGUnLFxuICAgICAgQXBwbGljYXRpb25JZDoge1xuICAgICAgICBSZWY6ICdNeUFwcENvbmZpZ0I0QjYzRTc1JyxcbiAgICAgIH0sXG4gICAgICBMb2NhdGlvblVyaToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ3NzbS1kb2N1bWVudDovLycsXG4gICAgICAgICAgICB7IFJlZjogJ015RG9jdW1lbnQnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgUG9saWNpZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6c3NtOicsXG4gICAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOmRvY3VtZW50LycsXG4gICAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdNeURvY3VtZW50JyB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIEFjdGlvbjogJ3NzbTpHZXREb2N1bWVudCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUG9saWN5TmFtZTogJ0FsbG93QXBwQ29uZmlnUmVhZEZyb21Tb3VyY2VQb2xpY3knLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpBcHBDb25maWc6OkRlcGxveW1lbnQnLCAxKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uZmlndXJhdGlvbiBwcm9maWxlIHdpdGggczMgb2JqZWN0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBCdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIGJ1Y2tldE5hbWU6ICdidWNrZXQnLFxuICAgIH0pO1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwQ29uZmlnJyk7XG4gICAgbmV3IFNvdXJjZWRDb25maWd1cmF0aW9uKHN0YWNrLCAnTXlDb25maWd1cmF0aW9uJywge1xuICAgICAgbmFtZTogJ1Rlc3RDb25maWdQcm9maWxlJyxcbiAgICAgIGxvY2F0aW9uOiBDb25maWd1cmF0aW9uU291cmNlLmZyb21CdWNrZXQoYnVja2V0LCAnaGVsbG8vZmlsZS50eHQnKSxcbiAgICAgIHZlcnNpb25OdW1iZXI6ICcxJyxcbiAgICAgIGFwcGxpY2F0aW9uOiBhcHAsXG4gICAgICBkZXBsb3ltZW50U3RyYXRlZ3k6IG5ldyBEZXBsb3ltZW50U3RyYXRlZ3koc3RhY2ssICdNeURlcGxveW1lbnRTdHJhdGVneScsIHtcbiAgICAgICAgcm9sbG91dFN0cmF0ZWd5OiBSb2xsb3V0U3RyYXRlZ3kubGluZWFyKHtcbiAgICAgICAgICBncm93dGhGYWN0b3I6IDE1LFxuICAgICAgICAgIGRlcGxveW1lbnREdXJhdGlvbjogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMzApLFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgICAgZGVwbG95VG86IFthcHAuYWRkRW52aXJvbm1lbnQoJ0Vudmlyb25tZW50JyldLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpDb25maWd1cmF0aW9uUHJvZmlsZScsIHtcbiAgICAgIE5hbWU6ICdUZXN0Q29uZmlnUHJvZmlsZScsXG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIExvY2F0aW9uVXJpOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnczM6Ly8nLFxuICAgICAgICAgICAgeyBSZWY6ICdNeUJ1Y2tldEY2OEYzRkYwJyB9LFxuICAgICAgICAgICAgJy9oZWxsby9maWxlLnR4dCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgUG9saWNpZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6czM6OjonLFxuICAgICAgICAgICAgICAgICAgICAgIHsgUmVmOiAnTXlCdWNrZXRGNjhGM0ZGMCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnL2hlbGxvL2ZpbGUudHh0JyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAgICdzMzpHZXRPYmplY3QnLFxuICAgICAgICAgICAgICAgICAgJ3MzOkdldE9iamVjdE1ldGFkYXRhJyxcbiAgICAgICAgICAgICAgICAgICdzMzpHZXRPYmplY3RWZXJzaW9uJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgRWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzpzMzo6OicsXG4gICAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdNeUJ1Y2tldEY2OEYzRkYwJyB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICAgJ3MzOkdldEJ1Y2tldExvY2F0aW9uJyxcbiAgICAgICAgICAgICAgICAgICdzMzpHZXRCdWNrZXRWZXJzaW9uaW5nJyxcbiAgICAgICAgICAgICAgICAgICdzMzpMaXN0QnVja2V0JyxcbiAgICAgICAgICAgICAgICAgICdzMzpMaXN0QnVja2V0VmVyc2lvbnMnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBFZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdzMzpMaXN0QWxsTXlCdWNrZXRzJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBQb2xpY3lOYW1lOiAnQWxsb3dBcHBDb25maWdSZWFkRnJvbVNvdXJjZVBvbGljeScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkFwcENvbmZpZzo6RGVwbG95bWVudCcsIDEpO1xuICB9KTtcblxuICB0ZXN0KCdjb25maWd1cmF0aW9uIHByb2ZpbGUgd2l0aCBjb2RlcGlwZWxpbmUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYnVja2V0ID0gbmV3IEJ1Y2tldChzdGFjaywgJ015QnVja2V0Jyk7XG4gICAgY29uc3Qgc291cmNlQWN0aW9uID0gbmV3IFMzU291cmNlQWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICAgICAgYnVja2V0OiBidWNrZXQsXG4gICAgICBidWNrZXRLZXk6ICdoZWxsby93b3JsZC9jb2RlcGlwZWxpbmUudHh0JyxcbiAgICAgIG91dHB1dDogbmV3IEFydGlmYWN0KCdTb3VyY2VPdXRwdXQnKSxcbiAgICB9KTtcbiAgICBjb25zdCBkZXBsb3lBY3Rpb24gPSBuZXcgUzNEZXBsb3lBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ0RlcGxveScsXG4gICAgICBpbnB1dDogQXJ0aWZhY3QuYXJ0aWZhY3QoJ1NvdXJjZU91dHB1dCcpLFxuICAgICAgYnVja2V0OiBidWNrZXQsXG4gICAgICBleHRyYWN0OiB0cnVlLFxuICAgIH0pO1xuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IFBpcGVsaW5lKHN0YWNrLCAnTXlQaXBlbGluZScsIHtcbiAgICAgIHN0YWdlczogW1xuICAgICAgICB7XG4gICAgICAgICAgc3RhZ2VOYW1lOiAnYmV0YScsXG4gICAgICAgICAgYWN0aW9uczogW3NvdXJjZUFjdGlvbl0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFnZU5hbWU6ICdwcm9kJyxcbiAgICAgICAgICBhY3Rpb25zOiBbZGVwbG95QWN0aW9uXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHBDb25maWcnKTtcbiAgICBuZXcgU291cmNlZENvbmZpZ3VyYXRpb24oc3RhY2ssICdNeUNvbmZpZ3VyYXRpb24nLCB7XG4gICAgICBuYW1lOiAnVGVzdENvbmZpZ1Byb2ZpbGUnLFxuICAgICAgbG9jYXRpb246IENvbmZpZ3VyYXRpb25Tb3VyY2UuZnJvbVBpcGVsaW5lKHBpcGVsaW5lKSxcbiAgICAgIGFwcGxpY2F0aW9uOiBhcHAsXG4gICAgICBkZXBsb3ltZW50U3RyYXRlZ3k6IG5ldyBEZXBsb3ltZW50U3RyYXRlZ3koc3RhY2ssICdNeURlcGxveW1lbnRTdHJhdGVneScsIHtcbiAgICAgICAgcm9sbG91dFN0cmF0ZWd5OiBSb2xsb3V0U3RyYXRlZ3kubGluZWFyKHtcbiAgICAgICAgICBncm93dGhGYWN0b3I6IDE1LFxuICAgICAgICAgIGRlcGxveW1lbnREdXJhdGlvbjogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMzApLFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgICAgZGVwbG95VG86IFthcHAuYWRkRW52aXJvbm1lbnQoJ0Vudmlyb25tZW50JyldLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpDb25maWd1cmF0aW9uUHJvZmlsZScsIHtcbiAgICAgIE5hbWU6ICdUZXN0Q29uZmlnUHJvZmlsZScsXG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIExvY2F0aW9uVXJpOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnY29kZXBpcGVsaW5lOi8vJyxcbiAgICAgICAgICAgIHsgUmVmOiAnTXlQaXBlbGluZUFFRDM4RUNGJyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpSb2xlJywgMyk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpQb2xpY3knLCAzKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpBcHBDb25maWc6OkRlcGxveW1lbnQnLCAwKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uZmlndXJhdGlvbiBwcm9maWxlIHdpdGggc2VjcmV0c21hbmFnZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgc2VjcmV0ID0gbmV3IFNlY3JldChzdGFjaywgJ015U2VjcmV0Jywge1xuICAgICAgc2VjcmV0U3RyaW5nVmFsdWU6IGNkay5TZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ1RoaXMgaXMgdGhlIGNvbnRlbnQgc3RvcmVkIGluIHNlY3JldHMgbWFuYWdlcicpLFxuICAgICAgc2VjcmV0TmFtZTogJ3NlY3JldCcsXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNlY3JldCwgJ3NlY3JldEFybicsIHtcbiAgICAgIHZhbHVlOiAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOnNlY3JldDpteS1zZWNyZXQnLFxuICAgIH0pO1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwQ29uZmlnJyk7XG4gICAgbmV3IFNvdXJjZWRDb25maWd1cmF0aW9uKHN0YWNrLCAnTXlDb25maWd1cmF0aW9uJywge1xuICAgICAgbmFtZTogJ1Rlc3RDb25maWdQcm9maWxlJyxcbiAgICAgIGxvY2F0aW9uOiBDb25maWd1cmF0aW9uU291cmNlLmZyb21TZWNyZXQoc2VjcmV0KSxcbiAgICAgIHZlcnNpb25OdW1iZXI6ICcxJyxcbiAgICAgIGFwcGxpY2F0aW9uOiBhcHAsXG4gICAgICBkZXBsb3ltZW50U3RyYXRlZ3k6IG5ldyBEZXBsb3ltZW50U3RyYXRlZ3koc3RhY2ssICdNeURlcGxveW1lbnRTdHJhdGVneScsIHtcbiAgICAgICAgcm9sbG91dFN0cmF0ZWd5OiBSb2xsb3V0U3RyYXRlZ3kubGluZWFyKHtcbiAgICAgICAgICBncm93dGhGYWN0b3I6IDE1LFxuICAgICAgICAgIGRlcGxveW1lbnREdXJhdGlvbjogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMzApLFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgICAgZGVwbG95VG86IFthcHAuYWRkRW52aXJvbm1lbnQoJ0Vudmlyb25tZW50JyldLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpDb25maWd1cmF0aW9uUHJvZmlsZScsIHtcbiAgICAgIE5hbWU6ICdUZXN0Q29uZmlnUHJvZmlsZScsXG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIExvY2F0aW9uVXJpOiAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOnNlY3JldDpteS1zZWNyZXQnLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIFBvbGljaWVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBFZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgICAgICAgUmVzb3VyY2U6ICdhcm46YXdzOnNlY3JldHNtYW5hZ2VyOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6c2VjcmV0Om15LXNlY3JldCcsXG4gICAgICAgICAgICAgICAgQWN0aW9uOiAnc2VjcmV0c21hbmFnZXI6R2V0U2VjcmV0VmFsdWUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFBvbGljeU5hbWU6ICdBbGxvd0FwcENvbmZpZ1JlYWRGcm9tU291cmNlUG9saWN5JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXBwQ29uZmlnOjpEZXBsb3ltZW50JywgMSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbmZpZ3VyYXRpb24gcHJvZmlsZSB3aXRoIHNlY3JldHNtYW5hZ2VyIGFuZCBrbXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qga2V5ID0gbmV3IEtleShzdGFjaywgJ015S2V5Jyk7XG4gICAgY29uc3Qgc2VjcmV0ID0gbmV3IFNlY3JldChzdGFjaywgJ015U2VjcmV0Jywge1xuICAgICAgc2VjcmV0U3RyaW5nVmFsdWU6IGNkay5TZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ1RoaXMgaXMgdGhlIGNvbnRlbnQgc3RvcmVkIGluIHNlY3JldHMgbWFuYWdlcicpLFxuICAgICAgc2VjcmV0TmFtZTogJ3NlY3JldCcsXG4gICAgICBlbmNyeXB0aW9uS2V5OiBrZXksXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNlY3JldCwgJ3NlY3JldEFybicsIHtcbiAgICAgIHZhbHVlOiAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOnNlY3JldDpteS1zZWNyZXQnLFxuICAgIH0pO1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwQ29uZmlnJyk7XG4gICAgbmV3IFNvdXJjZWRDb25maWd1cmF0aW9uKHN0YWNrLCAnTXlDb25maWd1cmF0aW9uJywge1xuICAgICAgbmFtZTogJ1Rlc3RDb25maWdQcm9maWxlJyxcbiAgICAgIGxvY2F0aW9uOiBDb25maWd1cmF0aW9uU291cmNlLmZyb21TZWNyZXQoc2VjcmV0KSxcbiAgICAgIHZlcnNpb25OdW1iZXI6ICcxJyxcbiAgICAgIGFwcGxpY2F0aW9uOiBhcHAsXG4gICAgICBkZXBsb3ltZW50U3RyYXRlZ3k6IG5ldyBEZXBsb3ltZW50U3RyYXRlZ3koc3RhY2ssICdNeURlcGxveW1lbnRTdHJhdGVneScsIHtcbiAgICAgICAgcm9sbG91dFN0cmF0ZWd5OiBSb2xsb3V0U3RyYXRlZ3kubGluZWFyKHtcbiAgICAgICAgICBncm93dGhGYWN0b3I6IDE1LFxuICAgICAgICAgIGRlcGxveW1lbnREdXJhdGlvbjogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMzApLFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgICAgZGVwbG95VG86IFthcHAuYWRkRW52aXJvbm1lbnQoJ0Vudmlyb25tZW50JyldLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpDb25maWd1cmF0aW9uUHJvZmlsZScsIHtcbiAgICAgIE5hbWU6ICdUZXN0Q29uZmlnUHJvZmlsZScsXG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIExvY2F0aW9uVXJpOiAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOnNlY3JldDpteS1zZWNyZXQnLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIFBvbGljaWVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBFZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgICAgICAgUmVzb3VyY2U6ICdhcm46YXdzOnNlY3JldHNtYW5hZ2VyOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6c2VjcmV0Om15LXNlY3JldCcsXG4gICAgICAgICAgICAgICAgQWN0aW9uOiAnc2VjcmV0c21hbmFnZXI6R2V0U2VjcmV0VmFsdWUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgRWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnTXlLZXk2QUIyOUZBNicsICdBcm4nXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIEFjdGlvbjogJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBQb2xpY3lOYW1lOiAnQWxsb3dBcHBDb25maWdSZWFkRnJvbVNvdXJjZVBvbGljeScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkFwcENvbmZpZzo6RGVwbG95bWVudCcsIDEpO1xuICB9KTtcbn0pO1xuIl19
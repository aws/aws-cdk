import { Template } from '../../assertions';
import { Alarm, CompositeAlarm, Metric } from '../../aws-cloudwatch';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import { Application, ConfigurationContent, DeletionProtectionCheck, Environment, HostedConfiguration, Monitor } from '../lib';

describe('environment', () => {
  test('default environment', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    new Environment(stack, 'MyEnvironment', {
      application: app,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
      Name: 'MyEnvironment',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
    });
  });

  test.each([
    DeletionProtectionCheck.ACCOUNT_DEFAULT,
    DeletionProtectionCheck.APPLY,
    DeletionProtectionCheck.BYPASS,
  ])('environment with deletion protection check', (deletionProtectionCheck) => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    new Environment(stack, 'MyEnvironment', {
      application: app,
      deletionProtectionCheck,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
      Name: 'MyEnvironment',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      DeletionProtectionCheck: deletionProtectionCheck,
    });
  });

  test('environment with name', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    new Environment(stack, 'MyEnvironment', {
      environmentName: 'TestEnv',
      application: app,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
      Name: 'TestEnv',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
    });
  });

  test('environment with description', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    new Environment(stack, 'MyEnvironment', {
      environmentName: 'TestEnv',
      application: app,
      description: 'This is my description',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
      Name: 'TestEnv',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      Description: 'This is my description',
    });
  });

  test('environment with single deployment', () => {
    const stack = new cdk.Stack();
    const application = new Application(stack, 'MyAppConfig');
    const env = new Environment(stack, 'MyEnvironment', {
      application,
    });

    const firstConfig = new HostedConfiguration(stack, 'FirstConfig', {
      application,
      content: ConfigurationContent.fromInlineText('This is my content 1'),
    });
    env.addDeployment(firstConfig);

    const actual = Template.fromStack(stack);

    actual.hasResourceProperties('AWS::AppConfig::Environment', {
      Name: 'MyEnvironment',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
    });

    actual.hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'FirstConfig',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: 'hosted',
    });
    actual.hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'FirstConfigConfigurationProfileDEF37C63',
      },
      Content: 'This is my content 1',
      ContentType: 'text/plain',
    });
    actual.hasResource('AWS::AppConfig::Deployment', {
      Properties: {
        ApplicationId: {
          Ref: 'MyAppConfigB4B63E75',
        },
        EnvironmentId: {
          Ref: 'MyEnvironment465E4DEA',
        },
        ConfigurationVersion: {
          Ref: 'FirstConfigC35E996C',
        },
        ConfigurationProfileId: {
          Ref: 'FirstConfigConfigurationProfileDEF37C63',
        },
        DeploymentStrategyId: {
          Ref: 'FirstConfigDeploymentStrategy863BBA9A',
        },
      },
    });

    actual.resourceCountIs('AWS::AppConfig::Deployment', 1);
  });

  test('environment with multiple deployments', () => {
    const stack = new cdk.Stack();
    const application = new Application(stack, 'MyAppConfig');
    const env = new Environment(stack, 'MyEnvironment', {
      application,
    });

    const firstConfig = new HostedConfiguration(stack, 'FirstConfig', {
      application,
      content: ConfigurationContent.fromInlineText('This is my content 1'),
    });
    const secondConfig = new HostedConfiguration(stack, 'SecondConfig', {
      application,
      content: ConfigurationContent.fromInlineText('This is my content 2'),
    });
    const thirdConfig = new HostedConfiguration(stack, 'ThirdConfig', {
      application,
      content: ConfigurationContent.fromInlineText('This is my content 3'),
    });

    env.addDeployments(firstConfig, secondConfig);
    env.addDeployment(thirdConfig);

    const actual = Template.fromStack(stack);

    actual.hasResourceProperties('AWS::AppConfig::Environment', {
      Name: 'MyEnvironment',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
    });

    actual.hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'FirstConfig',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: 'hosted',
    });
    actual.hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'FirstConfigConfigurationProfileDEF37C63',
      },
      Content: 'This is my content 1',
      ContentType: 'text/plain',
    });
    actual.hasResource('AWS::AppConfig::Deployment', {
      Properties: {
        ApplicationId: {
          Ref: 'MyAppConfigB4B63E75',
        },
        EnvironmentId: {
          Ref: 'MyEnvironment465E4DEA',
        },
        ConfigurationVersion: {
          Ref: 'FirstConfigC35E996C',
        },
        ConfigurationProfileId: {
          Ref: 'FirstConfigConfigurationProfileDEF37C63',
        },
        DeploymentStrategyId: {
          Ref: 'FirstConfigDeploymentStrategy863BBA9A',
        },
      },
    });

    actual.hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'SecondConfig',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: 'hosted',
    });
    actual.hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'SecondConfigConfigurationProfileE64FE7B4',
      },
      Content: 'This is my content 2',
      ContentType: 'text/plain',
    });
    actual.hasResource('AWS::AppConfig::Deployment', {
      Properties: {
        ApplicationId: {
          Ref: 'MyAppConfigB4B63E75',
        },
        EnvironmentId: {
          Ref: 'MyEnvironment465E4DEA',
        },
        ConfigurationVersion: {
          Ref: 'SecondConfig22E40AAE',
        },
        ConfigurationProfileId: {
          Ref: 'SecondConfigConfigurationProfileE64FE7B4',
        },
        DeploymentStrategyId: {
          Ref: 'SecondConfigDeploymentStrategy9929738B',
        },
      },
      DependsOn: ['FirstConfigDeployment52928BE68587B'],
    });

    actual.hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'ThirdConfig',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: 'hosted',
    });
    actual.hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'ThirdConfigConfigurationProfile4945C970',
      },
      Content: 'This is my content 3',
      ContentType: 'text/plain',
    });
    actual.hasResource('AWS::AppConfig::Deployment', {
      Properties: {
        ApplicationId: {
          Ref: 'MyAppConfigB4B63E75',
        },
        EnvironmentId: {
          Ref: 'MyEnvironment465E4DEA',
        },
        ConfigurationVersion: {
          Ref: 'ThirdConfig498595D6',
        },
        ConfigurationProfileId: {
          Ref: 'ThirdConfigConfigurationProfile4945C970',
        },
        DeploymentStrategyId: {
          Ref: 'ThirdConfigDeploymentStrategy246FBD1A',
        },
      },
      DependsOn: ['SecondConfigDeployment5292843F35B55'],
    });

    actual.resourceCountIs('AWS::AppConfig::Deployment', 3);
  });

  test('environment with monitors with alarm and alarmRole', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    const alarm = new Alarm(stack, 'Alarm', {
      threshold: 5,
      evaluationPeriods: 5,
      metric: new Metric(
        {
          namespace: 'aws',
          metricName: 'myMetric',
        },
      ),
    });
    const alarmRole = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('appconfig.amazonaws.com'),
    });
    const env = new Environment(stack, 'MyEnvironment', {
      environmentName: 'TestEnv',
      application: app,
      monitors: [Monitor.fromCloudWatchAlarm(alarm, alarmRole)],
    });

    Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 1);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
    expect(env).toBeDefined();
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
      Name: 'TestEnv',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      Monitors: [
        {
          AlarmArn: {
            'Fn::GetAtt': [
              'Alarm7103F465',
              'Arn',
            ],
          },
          AlarmRoleArn: {
            'Fn::GetAtt': [
              'Role1ABCC5F0',
              'Arn',
            ],
          },
        },
      ],
    });
  });

  test('environment with monitors with only alarm', () => {
    const stack = new cdk.Stack();
    const alarm = new Alarm(stack, 'Alarm', {
      threshold: 5,
      evaluationPeriods: 5,
      metric: new Metric(
        {
          namespace: 'aws',
          metricName: 'myMetric',
        },
      ),
    });
    const app = new Application(stack, 'MyAppConfig');
    const env = new Environment(stack, 'MyEnvironment', {
      environmentName: 'TestEnv',
      application: app,
      monitors: [Monitor.fromCloudWatchAlarm(alarm)],
    });

    expect(env).toBeDefined();
    Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
      Name: 'TestEnv',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      Monitors: [
        {
          AlarmArn: {
            'Fn::GetAtt': [
              'Alarm7103F465',
              'Arn',
            ],
          },
          AlarmRoleArn: {
            'Fn::GetAtt': [
              'MyEnvironmentRole1E6113D2F07A1',
              'Arn',
            ],
          },
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Effect: iam.Effect.ALLOW,
                Resource: '*',
                Action: 'cloudwatch:DescribeAlarms',
              },
            ],
          },
          PolicyName: 'AllowAppConfigMonitorAlarmPolicy',
        },
      ],
    });
  });

  test('environment with CfnMonitorsProperty monitor', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    const env = new Environment(stack, 'MyEnvironment', {
      environmentName: 'TestEnv',
      application: app,
      monitors: [
        Monitor.fromCfnMonitorsProperty({
          alarmArn: 'thisismyalarm',
        }),
      ],
    });

    expect(env).toBeDefined();
    Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 0);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
      Name: 'TestEnv',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      Monitors: [
        {
          AlarmArn: 'thisismyalarm',
        },
      ],
    });
  });

  test('environment with CfnMonitorsProperty monitor with roleArn', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    const env = new Environment(stack, 'MyEnvironment', {
      environmentName: 'TestEnv',
      application: app,
      monitors: [
        Monitor.fromCfnMonitorsProperty({
          alarmArn: 'thisismyalarm',
          alarmRoleArn: 'thisismyalarmrolearn',
        }),
      ],
    });

    expect(env).toBeDefined();
    Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 0);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
      Name: 'TestEnv',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      Monitors: [
        {
          AlarmArn: 'thisismyalarm',
          AlarmRoleArn: 'thisismyalarmrolearn',
        },
      ],
    });
  });

  test('environment with composite alarm', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    const alarm = new Alarm(stack, 'Alarm', {
      threshold: 5,
      evaluationPeriods: 5,
      metric: new Metric(
        {
          namespace: 'aws',
          metricName: 'myMetric',
        },
      ),
    });
    const compositeAlarm = new CompositeAlarm(stack, 'MyCompositeAlarm', {
      alarmRule: alarm,
    });
    const env = new Environment(stack, 'MyEnvironment', {
      environmentName: 'TestEnv',
      application: app,
      monitors: [
        Monitor.fromCloudWatchAlarm(compositeAlarm),
      ],
    });

    expect(env).toBeDefined();
    Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 1);
    Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::CompositeAlarm', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
      Name: 'TestEnv',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      Monitors: [
        {
          AlarmArn: {
            'Fn::GetAtt': [
              'MyCompositeAlarm0F045229',
              'Arn',
            ],
          },
          AlarmRoleArn: {
            'Fn::GetAtt': [
              'MyEnvironmentRole1E6113D2F07A1',
              'Arn',
            ],
          },
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Effect: iam.Effect.ALLOW,
                Resource: '*',
                Action: 'cloudwatch:DescribeAlarms',
              },
            ],
          },
          PolicyName: 'AllowAppConfigMonitorAlarmPolicy',
        },
      ],
    });
  });

  test('environment with two composite alarms', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    const alarm = new Alarm(stack, 'Alarm', {
      threshold: 5,
      evaluationPeriods: 5,
      metric: new Metric(
        {
          namespace: 'aws',
          metricName: 'myMetric',
        },
      ),
    });
    const compositeAlarm1 = new CompositeAlarm(stack, 'MyCompositeAlarm1', {
      alarmRule: alarm,
    });
    const compositeAlarm2 = new CompositeAlarm(stack, 'MyCompositeAlarm2', {
      alarmRule: alarm,
    });
    const env = new Environment(stack, 'MyEnvironment', {
      environmentName: 'TestEnv',
      application: app,
      monitors: [
        Monitor.fromCloudWatchAlarm(compositeAlarm1),
        Monitor.fromCloudWatchAlarm(compositeAlarm2),
      ],
    });

    expect(env).toBeDefined();
    Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 1);
    Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::CompositeAlarm', 2);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
      Name: 'TestEnv',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      Monitors: [
        {
          AlarmArn: {
            'Fn::GetAtt': [
              'MyCompositeAlarm159A950D0',
              'Arn',
            ],
          },
          AlarmRoleArn: {
            'Fn::GetAtt': [
              'MyEnvironmentRole1E6113D2F07A1',
              'Arn',
            ],
          },
        },
        {
          AlarmArn: {
            'Fn::GetAtt': [
              'MyCompositeAlarm2195BFA48',
              'Arn',
            ],
          },
          AlarmRoleArn: {
            'Fn::GetAtt': [
              'MyEnvironmentRole1E6113D2F07A1',
              'Arn',
            ],
          },
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Effect: iam.Effect.ALLOW,
                Resource: '*',
                Action: 'cloudwatch:DescribeAlarms',
              },
            ],
          },
          PolicyName: 'AllowAppConfigMonitorAlarmPolicy',
        },
      ],
    });
  });

  test('environment with monitors with multiple alarms', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    const alarm1 = new Alarm(stack, 'Alarm1', {
      threshold: 5,
      evaluationPeriods: 5,
      metric: new Metric(
        {
          namespace: 'aws',
          metricName: 'myMetric',
        },
      ),
    });
    const alarm2 = new Alarm(stack, 'Alarm2', {
      threshold: 5,
      evaluationPeriods: 5,
      metric: new Metric(
        {
          namespace: 'aws',
          metricName: 'myMetric',
        },
      ),
    });
    const alarm3 = new Alarm(stack, 'Alarm3', {
      threshold: 5,
      evaluationPeriods: 5,
      metric: new Metric(
        {
          namespace: 'aws',
          metricName: 'myMetric',
        },
      ),
    });
    new Environment(stack, 'MyEnvironment', {
      environmentName: 'TestEnv',
      application: app,
      monitors: [
        Monitor.fromCloudWatchAlarm(alarm1),
        Monitor.fromCloudWatchAlarm(alarm2),
        Monitor.fromCloudWatchAlarm(alarm3),
      ],
    });

    Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 3);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
      Name: 'TestEnv',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      Monitors: [
        {
          AlarmArn: {
            'Fn::GetAtt': [
              'Alarm1F9009D71',
              'Arn',
            ],
          },
          AlarmRoleArn: {
            'Fn::GetAtt': [
              'MyEnvironmentRole1E6113D2F07A1',
              'Arn',
            ],
          },
        },
        {
          AlarmArn: {
            'Fn::GetAtt': [
              'Alarm2A7122E13',
              'Arn',
            ],
          },
          AlarmRoleArn: {
            'Fn::GetAtt': [
              'MyEnvironmentRole1E6113D2F07A1',
              'Arn',
            ],
          },
        },
        {
          AlarmArn: {
            'Fn::GetAtt': [
              'Alarm32341D8D9',
              'Arn',
            ],
          },
          AlarmRoleArn: {
            'Fn::GetAtt': [
              'MyEnvironmentRole1E6113D2F07A1',
              'Arn',
            ],
          },
        },
      ],
    });
  });

  test('from environment arn', () => {
    const stack = new cdk.Stack();
    const env = Environment.fromEnvironmentArn(stack, 'MyEnvironment',
      'arn:aws:appconfig:us-west-2:123456789012:application/abc123/environment/def456');

    expect(env.applicationId).toEqual('abc123');
    expect(env.environmentId).toEqual('def456');
    expect(env.env.account).toEqual('123456789012');
    expect(env.env.region).toEqual('us-west-2');
  });

  test('from environment arn; cannot add new deployment', () => {
    const stack = new cdk.Stack();
    const application = new Application(stack, 'MyAppConfig');
    const env = Environment.fromEnvironmentArn(stack, 'MyEnvironment',
      'arn:aws:appconfig:us-west-2:123456789012:application/abc123/environment/def456');

    expect(() => {
      env.addDeployment(new HostedConfiguration(stack, 'FirstConfig', {
        application,
        content: ConfigurationContent.fromInlineText('This is my content 1'),
      }));
    }).toThrow('Environment name must be known to add a Deployment');
  });

  test('from environment arn with no resource name', () => {
    const stack = new cdk.Stack();
    expect(() => {
      Environment.fromEnvironmentArn(stack, 'MyEnvironment',
        'arn:aws:appconfig:us-west-2:123456789012:application/');
    }).toThrow('Missing required /$/{applicationId}/environment//$/{environmentId} from environment ARN:');
  });

  test('from environment arn with missing slash', () => {
    const stack = new cdk.Stack();
    expect(() => {
      Environment.fromEnvironmentArn(stack, 'MyEnvironment',
        'arn:aws:appconfig:us-west-2:123456789012:application/abc123environment/def456');
    }).toThrow('Missing required parameters for environment ARN: format should be /$/{applicationId}/environment//$/{environmentId}');
  });

  test('from environment arn with no application id', () => {
    const stack = new cdk.Stack();
    expect(() => {
      Environment.fromEnvironmentArn(stack, 'MyEnvironment',
        'arn:aws:appconfig:us-west-2:123456789012:application//environment/def456');
    }).toThrow('Missing required parameters for environment ARN: format should be /$/{applicationId}/environment//$/{environmentId}');
  });

  test('from environment arn with no environment id', () => {
    const stack = new cdk.Stack();
    expect(() => {
      Environment.fromEnvironmentArn(stack, 'MyEnvironment',
        'arn:aws:appconfig:us-west-2:123456789012:application/abc123/environment/');
    }).toThrow('Missing required parameters for environment ARN: format should be /$/{applicationId}/environment//$/{environmentId}');
  });

  test('from environment attributes', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: {
        region: 'us-west-2',
        account: '123456789012',
      },
    });
    const appConfigApp = new Application(stack, 'MyAppConfig');
    const env = Environment.fromEnvironmentAttributes(stack, 'MyEnvironment', {
      application: appConfigApp,
      environmentId: 'def456',
    });

    expect(env.environmentId).toEqual('def456');
    expect(env.applicationId).toBeDefined();
    expect(env.env.account).toEqual('123456789012');
    expect(env.env.region).toEqual('us-west-2');
  });

  test('from environment attributes; cannot add new deployment without name', () => {
    const stack = new cdk.Stack();
    const application = new Application(stack, 'MyAppConfig');
    const env = Environment.fromEnvironmentAttributes(stack, 'MyEnvironment', {
      application,
      environmentId: 'def456',
    });

    expect(() => {
      env.addDeployment(new HostedConfiguration(stack, 'FirstConfig', {
        application,
        content: ConfigurationContent.fromInlineText('This is my content 1'),
      }));
    }).toThrow('Environment name must be known to add a Deployment');
  });

  test('from environment attributes with name; can add new deployment', () => {
    const stack = new cdk.Stack();
    const application = new Application(stack, 'MyAppConfig');
    const env = Environment.fromEnvironmentAttributes(stack, 'MyEnvironment', {
      application,
      environmentId: 'def456',
      name: 'NamedEnv',
    });
    env.addDeployment(new HostedConfiguration(stack, 'FirstConfig', {
      application,
      content: ConfigurationContent.fromInlineText('This is my content 1'),
    }));

    const actual = Template.fromStack(stack);

    actual.hasResourceProperties('AWS::AppConfig::ConfigurationProfile', {
      Name: 'FirstConfig',
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      LocationUri: 'hosted',
    });
    actual.hasResourceProperties('AWS::AppConfig::HostedConfigurationVersion', {
      ApplicationId: {
        Ref: 'MyAppConfigB4B63E75',
      },
      ConfigurationProfileId: {
        Ref: 'FirstConfigConfigurationProfileDEF37C63',
      },
      Content: 'This is my content 1',
      ContentType: 'text/plain',
    });
    actual.hasResource('AWS::AppConfig::Deployment', {
      Properties: {
        ApplicationId: {
          Ref: 'MyAppConfigB4B63E75',
        },
        EnvironmentId: 'def456',
        ConfigurationVersion: {
          Ref: 'FirstConfigC35E996C',
        },
        ConfigurationProfileId: {
          Ref: 'FirstConfigConfigurationProfileDEF37C63',
        },
        DeploymentStrategyId: {
          Ref: 'FirstConfigDeploymentStrategy863BBA9A',
        },
      },
    });

    actual.resourceCountIs('AWS::AppConfig::Deployment', 1);
  });

  test('grantReadConfig creates and attaches a policy with read only access to the principal', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    const env = new Environment(stack, 'MyEnvironment', {
      application: app,
    });

    const user = new iam.User(stack, 'MyUser');
    env.grantReadConfig(user);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'appconfig:GetLatestConfiguration',
              'appconfig:StartConfigurationSession',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': ['', [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':appconfig:',
                { Ref: 'AWS::Region' },
                ':',
                { Ref: 'AWS::AccountId' },
                ':application/',
                { Ref: 'MyAppConfigB4B63E75' },
                '/environment/',
                { Ref: 'MyEnvironment465E4DEA' },
                '/configuration/*',
              ]],
            },
          },
        ],
      },
    });
  });
});

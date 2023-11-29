import * as cdk from 'aws-cdk-lib';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Alarm, Metric } from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Application, Environment, Monitor } from '../lib';

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

  test('environment with name', () => {
    const stack = new cdk.Stack();
    const app = new Application(stack, 'MyAppConfig');
    new Environment(stack, 'MyEnvironment', {
      name: 'TestEnv',
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
      name: 'TestEnv',
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
      name: 'TestEnv',
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
      name: 'TestEnv',
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
              'MyEnvironmentRole01C8C013F',
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
                Resource: {
                  'Fn::GetAtt': [
                    'Alarm7103F465',
                    'Arn',
                  ],
                },
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
      name: 'TestEnv',
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
      name: 'TestEnv',
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

  test('environment with monitors with two alarms', () => {
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
    new Environment(stack, 'MyEnvironment', {
      name: 'TestEnv',
      application: app,
      monitors: [
        Monitor.fromCloudWatchAlarm(alarm1),
        Monitor.fromCloudWatchAlarm(alarm2),
      ],
    });

    Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 2);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 2);
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
              'MyEnvironmentRole01C8C013F',
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
              'MyEnvironmentRole135A2CEE4',
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
    const app = new App();
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
});

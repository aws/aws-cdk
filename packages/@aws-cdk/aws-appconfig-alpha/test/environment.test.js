"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const assertions_1 = require("aws-cdk-lib/assertions");
const aws_cloudwatch_1 = require("aws-cdk-lib/aws-cloudwatch");
const iam = require("aws-cdk-lib/aws-iam");
const lib_1 = require("../lib");
describe('environment', () => {
    test('default environment', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.Environment(stack, 'MyEnvironment', {
            application: app,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
            Name: 'MyEnvironment',
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
        });
    });
    test('environment with name', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.Environment(stack, 'MyEnvironment', {
            environmentName: 'TestEnv',
            application: app,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
            Name: 'TestEnv',
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
        });
    });
    test('environment with description', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig');
        new lib_1.Environment(stack, 'MyEnvironment', {
            environmentName: 'TestEnv',
            application: app,
            description: 'This is my description',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
            Name: 'TestEnv',
            ApplicationId: {
                Ref: 'MyAppConfigB4B63E75',
            },
            Description: 'This is my description',
        });
    });
    test('environment with monitors with alarm and alarmRole', () => {
        const stack = new cdk.Stack();
        const app = new lib_1.Application(stack, 'MyAppConfig');
        const alarm = new aws_cloudwatch_1.Alarm(stack, 'Alarm', {
            threshold: 5,
            evaluationPeriods: 5,
            metric: new aws_cloudwatch_1.Metric({
                namespace: 'aws',
                metricName: 'myMetric',
            }),
        });
        const alarmRole = new iam.Role(stack, 'Role', {
            assumedBy: new iam.ServicePrincipal('appconfig.amazonaws.com'),
        });
        const env = new lib_1.Environment(stack, 'MyEnvironment', {
            environmentName: 'TestEnv',
            application: app,
            monitors: [lib_1.Monitor.fromCloudWatchAlarm(alarm, alarmRole)],
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 1);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
        expect(env).toBeDefined();
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
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
        const alarm = new aws_cloudwatch_1.Alarm(stack, 'Alarm', {
            threshold: 5,
            evaluationPeriods: 5,
            metric: new aws_cloudwatch_1.Metric({
                namespace: 'aws',
                metricName: 'myMetric',
            }),
        });
        const app = new lib_1.Application(stack, 'MyAppConfig');
        const env = new lib_1.Environment(stack, 'MyEnvironment', {
            environmentName: 'TestEnv',
            application: app,
            monitors: [lib_1.Monitor.fromCloudWatchAlarm(alarm)],
        });
        expect(env).toBeDefined();
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 1);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
        const app = new lib_1.Application(stack, 'MyAppConfig');
        const env = new lib_1.Environment(stack, 'MyEnvironment', {
            environmentName: 'TestEnv',
            application: app,
            monitors: [
                lib_1.Monitor.fromCfnMonitorsProperty({
                    alarmArn: 'thisismyalarm',
                }),
            ],
        });
        expect(env).toBeDefined();
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 0);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
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
        const app = new lib_1.Application(stack, 'MyAppConfig');
        const env = new lib_1.Environment(stack, 'MyEnvironment', {
            environmentName: 'TestEnv',
            application: app,
            monitors: [
                lib_1.Monitor.fromCfnMonitorsProperty({
                    alarmArn: 'thisismyalarm',
                    alarmRoleArn: 'thisismyalarmrolearn',
                }),
            ],
        });
        expect(env).toBeDefined();
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 0);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
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
        const app = new lib_1.Application(stack, 'MyAppConfig');
        const alarm = new aws_cloudwatch_1.Alarm(stack, 'Alarm', {
            threshold: 5,
            evaluationPeriods: 5,
            metric: new aws_cloudwatch_1.Metric({
                namespace: 'aws',
                metricName: 'myMetric',
            }),
        });
        const compositeAlarm = new aws_cloudwatch_1.CompositeAlarm(stack, 'MyCompositeAlarm', {
            alarmRule: alarm,
        });
        const env = new lib_1.Environment(stack, 'MyEnvironment', {
            environmentName: 'TestEnv',
            application: app,
            monitors: [
                lib_1.Monitor.fromCloudWatchAlarm(compositeAlarm),
            ],
        });
        expect(env).toBeDefined();
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 1);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::CompositeAlarm', 1);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
        const app = new lib_1.Application(stack, 'MyAppConfig');
        const alarm = new aws_cloudwatch_1.Alarm(stack, 'Alarm', {
            threshold: 5,
            evaluationPeriods: 5,
            metric: new aws_cloudwatch_1.Metric({
                namespace: 'aws',
                metricName: 'myMetric',
            }),
        });
        const compositeAlarm1 = new aws_cloudwatch_1.CompositeAlarm(stack, 'MyCompositeAlarm1', {
            alarmRule: alarm,
        });
        const compositeAlarm2 = new aws_cloudwatch_1.CompositeAlarm(stack, 'MyCompositeAlarm2', {
            alarmRule: alarm,
        });
        const env = new lib_1.Environment(stack, 'MyEnvironment', {
            environmentName: 'TestEnv',
            application: app,
            monitors: [
                lib_1.Monitor.fromCloudWatchAlarm(compositeAlarm1),
                lib_1.Monitor.fromCloudWatchAlarm(compositeAlarm2),
            ],
        });
        expect(env).toBeDefined();
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 1);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::CompositeAlarm', 2);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
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
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
        const app = new lib_1.Application(stack, 'MyAppConfig');
        const alarm1 = new aws_cloudwatch_1.Alarm(stack, 'Alarm1', {
            threshold: 5,
            evaluationPeriods: 5,
            metric: new aws_cloudwatch_1.Metric({
                namespace: 'aws',
                metricName: 'myMetric',
            }),
        });
        const alarm2 = new aws_cloudwatch_1.Alarm(stack, 'Alarm2', {
            threshold: 5,
            evaluationPeriods: 5,
            metric: new aws_cloudwatch_1.Metric({
                namespace: 'aws',
                metricName: 'myMetric',
            }),
        });
        const alarm3 = new aws_cloudwatch_1.Alarm(stack, 'Alarm3', {
            threshold: 5,
            evaluationPeriods: 5,
            metric: new aws_cloudwatch_1.Metric({
                namespace: 'aws',
                metricName: 'myMetric',
            }),
        });
        new lib_1.Environment(stack, 'MyEnvironment', {
            environmentName: 'TestEnv',
            application: app,
            monitors: [
                lib_1.Monitor.fromCloudWatchAlarm(alarm1),
                lib_1.Monitor.fromCloudWatchAlarm(alarm2),
                lib_1.Monitor.fromCloudWatchAlarm(alarm3),
            ],
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CloudWatch::Alarm', 3);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AppConfig::Environment', {
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
        const env = lib_1.Environment.fromEnvironmentArn(stack, 'MyEnvironment', 'arn:aws:appconfig:us-west-2:123456789012:application/abc123/environment/def456');
        expect(env.applicationId).toEqual('abc123');
        expect(env.environmentId).toEqual('def456');
        expect(env.env.account).toEqual('123456789012');
        expect(env.env.region).toEqual('us-west-2');
    });
    test('from environment arn with no resource name', () => {
        const stack = new cdk.Stack();
        expect(() => {
            lib_1.Environment.fromEnvironmentArn(stack, 'MyEnvironment', 'arn:aws:appconfig:us-west-2:123456789012:application/');
        }).toThrow('Missing required /$/{applicationId}/environment//$/{environmentId} from environment ARN:');
    });
    test('from environment arn with missing slash', () => {
        const stack = new cdk.Stack();
        expect(() => {
            lib_1.Environment.fromEnvironmentArn(stack, 'MyEnvironment', 'arn:aws:appconfig:us-west-2:123456789012:application/abc123environment/def456');
        }).toThrow('Missing required parameters for environment ARN: format should be /$/{applicationId}/environment//$/{environmentId}');
    });
    test('from environment arn with no application id', () => {
        const stack = new cdk.Stack();
        expect(() => {
            lib_1.Environment.fromEnvironmentArn(stack, 'MyEnvironment', 'arn:aws:appconfig:us-west-2:123456789012:application//environment/def456');
        }).toThrow('Missing required parameters for environment ARN: format should be /$/{applicationId}/environment//$/{environmentId}');
    });
    test('from environment arn with no environment id', () => {
        const stack = new cdk.Stack();
        expect(() => {
            lib_1.Environment.fromEnvironmentArn(stack, 'MyEnvironment', 'arn:aws:appconfig:us-west-2:123456789012:application/abc123/environment/');
        }).toThrow('Missing required parameters for environment ARN: format should be /$/{applicationId}/environment//$/{environmentId}');
    });
    test('from environment attributes', () => {
        const app = new aws_cdk_lib_1.App();
        const stack = new cdk.Stack(app, 'Stack', {
            env: {
                region: 'us-west-2',
                account: '123456789012',
            },
        });
        const appConfigApp = new lib_1.Application(stack, 'MyAppConfig');
        const env = lib_1.Environment.fromEnvironmentAttributes(stack, 'MyEnvironment', {
            application: appConfigApp,
            environmentId: 'def456',
        });
        expect(env.environmentId).toEqual('def456');
        expect(env.applicationId).toBeDefined();
        expect(env.env.account).toEqual('123456789012');
        expect(env.env.region).toEqual('us-west-2');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVudmlyb25tZW50LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsNkNBQWtDO0FBQ2xDLHVEQUFrRDtBQUNsRCwrREFBMkU7QUFDM0UsMkNBQTJDO0FBQzNDLGdDQUEyRDtBQUUzRCxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtJQUMzQixJQUFJLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO1FBQy9CLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQVcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDbEQsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUU7WUFDdEMsV0FBVyxFQUFFLEdBQUc7U0FDakIsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsNkJBQTZCLEVBQUU7WUFDN0UsSUFBSSxFQUFFLGVBQWU7WUFDckIsYUFBYSxFQUFFO2dCQUNiLEdBQUcsRUFBRSxxQkFBcUI7YUFDM0I7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7UUFDakMsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNsRCxJQUFJLGlCQUFXLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRTtZQUN0QyxlQUFlLEVBQUUsU0FBUztZQUMxQixXQUFXLEVBQUUsR0FBRztTQUNqQixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FB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QUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQXBwIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hc3NlcnRpb25zJztcbmltcG9ydCB7IEFsYXJtLCBDb21wb3NpdGVBbGFybSwgTWV0cmljIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgQXBwbGljYXRpb24sIEVudmlyb25tZW50LCBNb25pdG9yIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ2Vudmlyb25tZW50JywgKCkgPT4ge1xuICB0ZXN0KCdkZWZhdWx0IGVudmlyb25tZW50JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwQ29uZmlnJyk7XG4gICAgbmV3IEVudmlyb25tZW50KHN0YWNrLCAnTXlFbnZpcm9ubWVudCcsIHtcbiAgICAgIGFwcGxpY2F0aW9uOiBhcHAsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkVudmlyb25tZW50Jywge1xuICAgICAgTmFtZTogJ015RW52aXJvbm1lbnQnLFxuICAgICAgQXBwbGljYXRpb25JZDoge1xuICAgICAgICBSZWY6ICdNeUFwcENvbmZpZ0I0QjYzRTc1JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Vudmlyb25tZW50IHdpdGggbmFtZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcENvbmZpZycpO1xuICAgIG5ldyBFbnZpcm9ubWVudChzdGFjaywgJ015RW52aXJvbm1lbnQnLCB7XG4gICAgICBlbnZpcm9ubWVudE5hbWU6ICdUZXN0RW52JyxcbiAgICAgIGFwcGxpY2F0aW9uOiBhcHAsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkVudmlyb25tZW50Jywge1xuICAgICAgTmFtZTogJ1Rlc3RFbnYnLFxuICAgICAgQXBwbGljYXRpb25JZDoge1xuICAgICAgICBSZWY6ICdNeUFwcENvbmZpZ0I0QjYzRTc1JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Vudmlyb25tZW50IHdpdGggZGVzY3JpcHRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHBDb25maWcnKTtcbiAgICBuZXcgRW52aXJvbm1lbnQoc3RhY2ssICdNeUVudmlyb25tZW50Jywge1xuICAgICAgZW52aXJvbm1lbnROYW1lOiAnVGVzdEVudicsXG4gICAgICBhcHBsaWNhdGlvbjogYXBwLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGlzIGlzIG15IGRlc2NyaXB0aW9uJyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcENvbmZpZzo6RW52aXJvbm1lbnQnLCB7XG4gICAgICBOYW1lOiAnVGVzdEVudicsXG4gICAgICBBcHBsaWNhdGlvbklkOiB7XG4gICAgICAgIFJlZjogJ015QXBwQ29uZmlnQjRCNjNFNzUnLFxuICAgICAgfSxcbiAgICAgIERlc2NyaXB0aW9uOiAnVGhpcyBpcyBteSBkZXNjcmlwdGlvbicsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Vudmlyb25tZW50IHdpdGggbW9uaXRvcnMgd2l0aCBhbGFybSBhbmQgYWxhcm1Sb2xlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwQ29uZmlnJyk7XG4gICAgY29uc3QgYWxhcm0gPSBuZXcgQWxhcm0oc3RhY2ssICdBbGFybScsIHtcbiAgICAgIHRocmVzaG9sZDogNSxcbiAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiA1LFxuICAgICAgbWV0cmljOiBuZXcgTWV0cmljKFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZXNwYWNlOiAnYXdzJyxcbiAgICAgICAgICBtZXRyaWNOYW1lOiAnbXlNZXRyaWMnLFxuICAgICAgICB9LFxuICAgICAgKSxcbiAgICB9KTtcbiAgICBjb25zdCBhbGFybVJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2FwcGNvbmZpZy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG4gICAgY29uc3QgZW52ID0gbmV3IEVudmlyb25tZW50KHN0YWNrLCAnTXlFbnZpcm9ubWVudCcsIHtcbiAgICAgIGVudmlyb25tZW50TmFtZTogJ1Rlc3RFbnYnLFxuICAgICAgYXBwbGljYXRpb246IGFwcCxcbiAgICAgIG1vbml0b3JzOiBbTW9uaXRvci5mcm9tQ2xvdWRXYXRjaEFsYXJtKGFsYXJtLCBhbGFybVJvbGUpXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkNsb3VkV2F0Y2g6OkFsYXJtJywgMSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpSb2xlJywgMSk7XG4gICAgZXhwZWN0KGVudikudG9CZURlZmluZWQoKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkVudmlyb25tZW50Jywge1xuICAgICAgTmFtZTogJ1Rlc3RFbnYnLFxuICAgICAgQXBwbGljYXRpb25JZDoge1xuICAgICAgICBSZWY6ICdNeUFwcENvbmZpZ0I0QjYzRTc1JyxcbiAgICAgIH0sXG4gICAgICBNb25pdG9yczogW1xuICAgICAgICB7XG4gICAgICAgICAgQWxhcm1Bcm46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnQWxhcm03MTAzRjQ2NScsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIEFsYXJtUm9sZUFybjoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdSb2xlMUFCQ0M1RjAnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Vudmlyb25tZW50IHdpdGggbW9uaXRvcnMgd2l0aCBvbmx5IGFsYXJtJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFsYXJtID0gbmV3IEFsYXJtKHN0YWNrLCAnQWxhcm0nLCB7XG4gICAgICB0aHJlc2hvbGQ6IDUsXG4gICAgICBldmFsdWF0aW9uUGVyaW9kczogNSxcbiAgICAgIG1ldHJpYzogbmV3IE1ldHJpYyhcbiAgICAgICAge1xuICAgICAgICAgIG5hbWVzcGFjZTogJ2F3cycsXG4gICAgICAgICAgbWV0cmljTmFtZTogJ215TWV0cmljJyxcbiAgICAgICAgfSxcbiAgICAgICksXG4gICAgfSk7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHBDb25maWcnKTtcbiAgICBjb25zdCBlbnYgPSBuZXcgRW52aXJvbm1lbnQoc3RhY2ssICdNeUVudmlyb25tZW50Jywge1xuICAgICAgZW52aXJvbm1lbnROYW1lOiAnVGVzdEVudicsXG4gICAgICBhcHBsaWNhdGlvbjogYXBwLFxuICAgICAgbW9uaXRvcnM6IFtNb25pdG9yLmZyb21DbG91ZFdhdGNoQWxhcm0oYWxhcm0pXSxcbiAgICB9KTtcblxuICAgIGV4cGVjdChlbnYpLnRvQmVEZWZpbmVkKCk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6Q2xvdWRXYXRjaDo6QWxhcm0nLCAxKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkVudmlyb25tZW50Jywge1xuICAgICAgTmFtZTogJ1Rlc3RFbnYnLFxuICAgICAgQXBwbGljYXRpb25JZDoge1xuICAgICAgICBSZWY6ICdNeUFwcENvbmZpZ0I0QjYzRTc1JyxcbiAgICAgIH0sXG4gICAgICBNb25pdG9yczogW1xuICAgICAgICB7XG4gICAgICAgICAgQWxhcm1Bcm46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnQWxhcm03MTAzRjQ2NScsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIEFsYXJtUm9sZUFybjoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeUVudmlyb25tZW50Um9sZTFFNjExM0QyRjA3QTEnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgUG9saWNpZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgICAgIEFjdGlvbjogJ2Nsb3Vkd2F0Y2g6RGVzY3JpYmVBbGFybXMnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFBvbGljeU5hbWU6ICdBbGxvd0FwcENvbmZpZ01vbml0b3JBbGFybVBvbGljeScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlbnZpcm9ubWVudCB3aXRoIENmbk1vbml0b3JzUHJvcGVydHkgbW9uaXRvcicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcENvbmZpZycpO1xuICAgIGNvbnN0IGVudiA9IG5ldyBFbnZpcm9ubWVudChzdGFjaywgJ015RW52aXJvbm1lbnQnLCB7XG4gICAgICBlbnZpcm9ubWVudE5hbWU6ICdUZXN0RW52JyxcbiAgICAgIGFwcGxpY2F0aW9uOiBhcHAsXG4gICAgICBtb25pdG9yczogW1xuICAgICAgICBNb25pdG9yLmZyb21DZm5Nb25pdG9yc1Byb3BlcnR5KHtcbiAgICAgICAgICBhbGFybUFybjogJ3RoaXNpc215YWxhcm0nLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoZW52KS50b0JlRGVmaW5lZCgpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkNsb3VkV2F0Y2g6OkFsYXJtJywgMCk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpSb2xlJywgMCk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpFbnZpcm9ubWVudCcsIHtcbiAgICAgIE5hbWU6ICdUZXN0RW52JyxcbiAgICAgIEFwcGxpY2F0aW9uSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdCNEI2M0U3NScsXG4gICAgICB9LFxuICAgICAgTW9uaXRvcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFsYXJtQXJuOiAndGhpc2lzbXlhbGFybScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlbnZpcm9ubWVudCB3aXRoIENmbk1vbml0b3JzUHJvcGVydHkgbW9uaXRvciB3aXRoIHJvbGVBcm4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHBDb25maWcnKTtcbiAgICBjb25zdCBlbnYgPSBuZXcgRW52aXJvbm1lbnQoc3RhY2ssICdNeUVudmlyb25tZW50Jywge1xuICAgICAgZW52aXJvbm1lbnROYW1lOiAnVGVzdEVudicsXG4gICAgICBhcHBsaWNhdGlvbjogYXBwLFxuICAgICAgbW9uaXRvcnM6IFtcbiAgICAgICAgTW9uaXRvci5mcm9tQ2ZuTW9uaXRvcnNQcm9wZXJ0eSh7XG4gICAgICAgICAgYWxhcm1Bcm46ICd0aGlzaXNteWFsYXJtJyxcbiAgICAgICAgICBhbGFybVJvbGVBcm46ICd0aGlzaXNteWFsYXJtcm9sZWFybicsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGV4cGVjdChlbnYpLnRvQmVEZWZpbmVkKCk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6Q2xvdWRXYXRjaDo6QWxhcm0nLCAwKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlJvbGUnLCAwKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkVudmlyb25tZW50Jywge1xuICAgICAgTmFtZTogJ1Rlc3RFbnYnLFxuICAgICAgQXBwbGljYXRpb25JZDoge1xuICAgICAgICBSZWY6ICdNeUFwcENvbmZpZ0I0QjYzRTc1JyxcbiAgICAgIH0sXG4gICAgICBNb25pdG9yczogW1xuICAgICAgICB7XG4gICAgICAgICAgQWxhcm1Bcm46ICd0aGlzaXNteWFsYXJtJyxcbiAgICAgICAgICBBbGFybVJvbGVBcm46ICd0aGlzaXNteWFsYXJtcm9sZWFybicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlbnZpcm9ubWVudCB3aXRoIGNvbXBvc2l0ZSBhbGFybScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcENvbmZpZycpO1xuICAgIGNvbnN0IGFsYXJtID0gbmV3IEFsYXJtKHN0YWNrLCAnQWxhcm0nLCB7XG4gICAgICB0aHJlc2hvbGQ6IDUsXG4gICAgICBldmFsdWF0aW9uUGVyaW9kczogNSxcbiAgICAgIG1ldHJpYzogbmV3IE1ldHJpYyhcbiAgICAgICAge1xuICAgICAgICAgIG5hbWVzcGFjZTogJ2F3cycsXG4gICAgICAgICAgbWV0cmljTmFtZTogJ215TWV0cmljJyxcbiAgICAgICAgfSxcbiAgICAgICksXG4gICAgfSk7XG4gICAgY29uc3QgY29tcG9zaXRlQWxhcm0gPSBuZXcgQ29tcG9zaXRlQWxhcm0oc3RhY2ssICdNeUNvbXBvc2l0ZUFsYXJtJywge1xuICAgICAgYWxhcm1SdWxlOiBhbGFybSxcbiAgICB9KTtcbiAgICBjb25zdCBlbnYgPSBuZXcgRW52aXJvbm1lbnQoc3RhY2ssICdNeUVudmlyb25tZW50Jywge1xuICAgICAgZW52aXJvbm1lbnROYW1lOiAnVGVzdEVudicsXG4gICAgICBhcHBsaWNhdGlvbjogYXBwLFxuICAgICAgbW9uaXRvcnM6IFtcbiAgICAgICAgTW9uaXRvci5mcm9tQ2xvdWRXYXRjaEFsYXJtKGNvbXBvc2l0ZUFsYXJtKSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoZW52KS50b0JlRGVmaW5lZCgpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkNsb3VkV2F0Y2g6OkFsYXJtJywgMSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6Q2xvdWRXYXRjaDo6Q29tcG9zaXRlQWxhcm0nLCAxKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkVudmlyb25tZW50Jywge1xuICAgICAgTmFtZTogJ1Rlc3RFbnYnLFxuICAgICAgQXBwbGljYXRpb25JZDoge1xuICAgICAgICBSZWY6ICdNeUFwcENvbmZpZ0I0QjYzRTc1JyxcbiAgICAgIH0sXG4gICAgICBNb25pdG9yczogW1xuICAgICAgICB7XG4gICAgICAgICAgQWxhcm1Bcm46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnTXlDb21wb3NpdGVBbGFybTBGMDQ1MjI5JyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgQWxhcm1Sb2xlQXJuOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015RW52aXJvbm1lbnRSb2xlMUU2MTEzRDJGMDdBMScsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBQb2xpY2llczogW1xuICAgICAgICB7XG4gICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgRWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICAgICAgQWN0aW9uOiAnY2xvdWR3YXRjaDpEZXNjcmliZUFsYXJtcycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUG9saWN5TmFtZTogJ0FsbG93QXBwQ29uZmlnTW9uaXRvckFsYXJtUG9saWN5JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Vudmlyb25tZW50IHdpdGggdHdvIGNvbXBvc2l0ZSBhbGFybXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHBDb25maWcnKTtcbiAgICBjb25zdCBhbGFybSA9IG5ldyBBbGFybShzdGFjaywgJ0FsYXJtJywge1xuICAgICAgdGhyZXNob2xkOiA1LFxuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDUsXG4gICAgICBtZXRyaWM6IG5ldyBNZXRyaWMoXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lc3BhY2U6ICdhd3MnLFxuICAgICAgICAgIG1ldHJpY05hbWU6ICdteU1ldHJpYycsXG4gICAgICAgIH0sXG4gICAgICApLFxuICAgIH0pO1xuICAgIGNvbnN0IGNvbXBvc2l0ZUFsYXJtMSA9IG5ldyBDb21wb3NpdGVBbGFybShzdGFjaywgJ015Q29tcG9zaXRlQWxhcm0xJywge1xuICAgICAgYWxhcm1SdWxlOiBhbGFybSxcbiAgICB9KTtcbiAgICBjb25zdCBjb21wb3NpdGVBbGFybTIgPSBuZXcgQ29tcG9zaXRlQWxhcm0oc3RhY2ssICdNeUNvbXBvc2l0ZUFsYXJtMicsIHtcbiAgICAgIGFsYXJtUnVsZTogYWxhcm0sXG4gICAgfSk7XG4gICAgY29uc3QgZW52ID0gbmV3IEVudmlyb25tZW50KHN0YWNrLCAnTXlFbnZpcm9ubWVudCcsIHtcbiAgICAgIGVudmlyb25tZW50TmFtZTogJ1Rlc3RFbnYnLFxuICAgICAgYXBwbGljYXRpb246IGFwcCxcbiAgICAgIG1vbml0b3JzOiBbXG4gICAgICAgIE1vbml0b3IuZnJvbUNsb3VkV2F0Y2hBbGFybShjb21wb3NpdGVBbGFybTEpLFxuICAgICAgICBNb25pdG9yLmZyb21DbG91ZFdhdGNoQWxhcm0oY29tcG9zaXRlQWxhcm0yKSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoZW52KS50b0JlRGVmaW5lZCgpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkNsb3VkV2F0Y2g6OkFsYXJtJywgMSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6Q2xvdWRXYXRjaDo6Q29tcG9zaXRlQWxhcm0nLCAyKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlJvbGUnLCAxKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBDb25maWc6OkVudmlyb25tZW50Jywge1xuICAgICAgTmFtZTogJ1Rlc3RFbnYnLFxuICAgICAgQXBwbGljYXRpb25JZDoge1xuICAgICAgICBSZWY6ICdNeUFwcENvbmZpZ0I0QjYzRTc1JyxcbiAgICAgIH0sXG4gICAgICBNb25pdG9yczogW1xuICAgICAgICB7XG4gICAgICAgICAgQWxhcm1Bcm46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnTXlDb21wb3NpdGVBbGFybTE1OUE5NTBEMCcsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIEFsYXJtUm9sZUFybjoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeUVudmlyb25tZW50Um9sZTFFNjExM0QyRjA3QTEnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEFsYXJtQXJuOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015Q29tcG9zaXRlQWxhcm0yMTk1QkZBNDgnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBBbGFybVJvbGVBcm46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnTXlFbnZpcm9ubWVudFJvbGUxRTYxMTNEMkYwN0ExJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIFBvbGljaWVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBFZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdjbG91ZHdhdGNoOkRlc2NyaWJlQWxhcm1zJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBQb2xpY3lOYW1lOiAnQWxsb3dBcHBDb25maWdNb25pdG9yQWxhcm1Qb2xpY3knLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZW52aXJvbm1lbnQgd2l0aCBtb25pdG9ycyB3aXRoIG11bHRpcGxlIGFsYXJtcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcENvbmZpZycpO1xuICAgIGNvbnN0IGFsYXJtMSA9IG5ldyBBbGFybShzdGFjaywgJ0FsYXJtMScsIHtcbiAgICAgIHRocmVzaG9sZDogNSxcbiAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiA1LFxuICAgICAgbWV0cmljOiBuZXcgTWV0cmljKFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZXNwYWNlOiAnYXdzJyxcbiAgICAgICAgICBtZXRyaWNOYW1lOiAnbXlNZXRyaWMnLFxuICAgICAgICB9LFxuICAgICAgKSxcbiAgICB9KTtcbiAgICBjb25zdCBhbGFybTIgPSBuZXcgQWxhcm0oc3RhY2ssICdBbGFybTInLCB7XG4gICAgICB0aHJlc2hvbGQ6IDUsXG4gICAgICBldmFsdWF0aW9uUGVyaW9kczogNSxcbiAgICAgIG1ldHJpYzogbmV3IE1ldHJpYyhcbiAgICAgICAge1xuICAgICAgICAgIG5hbWVzcGFjZTogJ2F3cycsXG4gICAgICAgICAgbWV0cmljTmFtZTogJ215TWV0cmljJyxcbiAgICAgICAgfSxcbiAgICAgICksXG4gICAgfSk7XG4gICAgY29uc3QgYWxhcm0zID0gbmV3IEFsYXJtKHN0YWNrLCAnQWxhcm0zJywge1xuICAgICAgdGhyZXNob2xkOiA1LFxuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDUsXG4gICAgICBtZXRyaWM6IG5ldyBNZXRyaWMoXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lc3BhY2U6ICdhd3MnLFxuICAgICAgICAgIG1ldHJpY05hbWU6ICdteU1ldHJpYycsXG4gICAgICAgIH0sXG4gICAgICApLFxuICAgIH0pO1xuICAgIG5ldyBFbnZpcm9ubWVudChzdGFjaywgJ015RW52aXJvbm1lbnQnLCB7XG4gICAgICBlbnZpcm9ubWVudE5hbWU6ICdUZXN0RW52JyxcbiAgICAgIGFwcGxpY2F0aW9uOiBhcHAsXG4gICAgICBtb25pdG9yczogW1xuICAgICAgICBNb25pdG9yLmZyb21DbG91ZFdhdGNoQWxhcm0oYWxhcm0xKSxcbiAgICAgICAgTW9uaXRvci5mcm9tQ2xvdWRXYXRjaEFsYXJtKGFsYXJtMiksXG4gICAgICAgIE1vbml0b3IuZnJvbUNsb3VkV2F0Y2hBbGFybShhbGFybTMpLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkNsb3VkV2F0Y2g6OkFsYXJtJywgMyk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpSb2xlJywgMSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwQ29uZmlnOjpFbnZpcm9ubWVudCcsIHtcbiAgICAgIE5hbWU6ICdUZXN0RW52JyxcbiAgICAgIEFwcGxpY2F0aW9uSWQ6IHtcbiAgICAgICAgUmVmOiAnTXlBcHBDb25maWdCNEI2M0U3NScsXG4gICAgICB9LFxuICAgICAgTW9uaXRvcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFsYXJtQXJuOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ0FsYXJtMUY5MDA5RDcxJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgQWxhcm1Sb2xlQXJuOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015RW52aXJvbm1lbnRSb2xlMUU2MTEzRDJGMDdBMScsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgQWxhcm1Bcm46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnQWxhcm0yQTcxMjJFMTMnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBBbGFybVJvbGVBcm46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnTXlFbnZpcm9ubWVudFJvbGUxRTYxMTNEMkYwN0ExJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBBbGFybUFybjoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdBbGFybTMyMzQxRDhEOScsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIEFsYXJtUm9sZUFybjoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdNeUVudmlyb25tZW50Um9sZTFFNjExM0QyRjA3QTEnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Zyb20gZW52aXJvbm1lbnQgYXJuJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGVudiA9IEVudmlyb25tZW50LmZyb21FbnZpcm9ubWVudEFybihzdGFjaywgJ015RW52aXJvbm1lbnQnLFxuICAgICAgJ2Fybjphd3M6YXBwY29uZmlnOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6YXBwbGljYXRpb24vYWJjMTIzL2Vudmlyb25tZW50L2RlZjQ1NicpO1xuXG4gICAgZXhwZWN0KGVudi5hcHBsaWNhdGlvbklkKS50b0VxdWFsKCdhYmMxMjMnKTtcbiAgICBleHBlY3QoZW52LmVudmlyb25tZW50SWQpLnRvRXF1YWwoJ2RlZjQ1NicpO1xuICAgIGV4cGVjdChlbnYuZW52LmFjY291bnQpLnRvRXF1YWwoJzEyMzQ1Njc4OTAxMicpO1xuICAgIGV4cGVjdChlbnYuZW52LnJlZ2lvbikudG9FcXVhbCgndXMtd2VzdC0yJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Zyb20gZW52aXJvbm1lbnQgYXJuIHdpdGggbm8gcmVzb3VyY2UgbmFtZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgRW52aXJvbm1lbnQuZnJvbUVudmlyb25tZW50QXJuKHN0YWNrLCAnTXlFbnZpcm9ubWVudCcsXG4gICAgICAgICdhcm46YXdzOmFwcGNvbmZpZzp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOmFwcGxpY2F0aW9uLycpO1xuICAgIH0pLnRvVGhyb3coJ01pc3NpbmcgcmVxdWlyZWQgLyQve2FwcGxpY2F0aW9uSWR9L2Vudmlyb25tZW50Ly8kL3tlbnZpcm9ubWVudElkfSBmcm9tIGVudmlyb25tZW50IEFSTjonKTtcbiAgfSk7XG5cbiAgdGVzdCgnZnJvbSBlbnZpcm9ubWVudCBhcm4gd2l0aCBtaXNzaW5nIHNsYXNoJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBFbnZpcm9ubWVudC5mcm9tRW52aXJvbm1lbnRBcm4oc3RhY2ssICdNeUVudmlyb25tZW50JyxcbiAgICAgICAgJ2Fybjphd3M6YXBwY29uZmlnOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6YXBwbGljYXRpb24vYWJjMTIzZW52aXJvbm1lbnQvZGVmNDU2Jyk7XG4gICAgfSkudG9UaHJvdygnTWlzc2luZyByZXF1aXJlZCBwYXJhbWV0ZXJzIGZvciBlbnZpcm9ubWVudCBBUk46IGZvcm1hdCBzaG91bGQgYmUgLyQve2FwcGxpY2F0aW9uSWR9L2Vudmlyb25tZW50Ly8kL3tlbnZpcm9ubWVudElkfScpO1xuICB9KTtcblxuICB0ZXN0KCdmcm9tIGVudmlyb25tZW50IGFybiB3aXRoIG5vIGFwcGxpY2F0aW9uIGlkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBFbnZpcm9ubWVudC5mcm9tRW52aXJvbm1lbnRBcm4oc3RhY2ssICdNeUVudmlyb25tZW50JyxcbiAgICAgICAgJ2Fybjphd3M6YXBwY29uZmlnOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6YXBwbGljYXRpb24vL2Vudmlyb25tZW50L2RlZjQ1NicpO1xuICAgIH0pLnRvVGhyb3coJ01pc3NpbmcgcmVxdWlyZWQgcGFyYW1ldGVycyBmb3IgZW52aXJvbm1lbnQgQVJOOiBmb3JtYXQgc2hvdWxkIGJlIC8kL3thcHBsaWNhdGlvbklkfS9lbnZpcm9ubWVudC8vJC97ZW52aXJvbm1lbnRJZH0nKTtcbiAgfSk7XG5cbiAgdGVzdCgnZnJvbSBlbnZpcm9ubWVudCBhcm4gd2l0aCBubyBlbnZpcm9ubWVudCBpZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgRW52aXJvbm1lbnQuZnJvbUVudmlyb25tZW50QXJuKHN0YWNrLCAnTXlFbnZpcm9ubWVudCcsXG4gICAgICAgICdhcm46YXdzOmFwcGNvbmZpZzp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOmFwcGxpY2F0aW9uL2FiYzEyMy9lbnZpcm9ubWVudC8nKTtcbiAgICB9KS50b1Rocm93KCdNaXNzaW5nIHJlcXVpcmVkIHBhcmFtZXRlcnMgZm9yIGVudmlyb25tZW50IEFSTjogZm9ybWF0IHNob3VsZCBiZSAvJC97YXBwbGljYXRpb25JZH0vZW52aXJvbm1lbnQvLyQve2Vudmlyb25tZW50SWR9Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Zyb20gZW52aXJvbm1lbnQgYXR0cmlidXRlcycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXG4gICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBhcHBDb25maWdBcHAgPSBuZXcgQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcENvbmZpZycpO1xuICAgIGNvbnN0IGVudiA9IEVudmlyb25tZW50LmZyb21FbnZpcm9ubWVudEF0dHJpYnV0ZXMoc3RhY2ssICdNeUVudmlyb25tZW50Jywge1xuICAgICAgYXBwbGljYXRpb246IGFwcENvbmZpZ0FwcCxcbiAgICAgIGVudmlyb25tZW50SWQ6ICdkZWY0NTYnLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KGVudi5lbnZpcm9ubWVudElkKS50b0VxdWFsKCdkZWY0NTYnKTtcbiAgICBleHBlY3QoZW52LmFwcGxpY2F0aW9uSWQpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KGVudi5lbnYuYWNjb3VudCkudG9FcXVhbCgnMTIzNDU2Nzg5MDEyJyk7XG4gICAgZXhwZWN0KGVudi5lbnYucmVnaW9uKS50b0VxdWFsKCd1cy13ZXN0LTInKTtcbiAgfSk7XG59KTtcbiJdfQ==
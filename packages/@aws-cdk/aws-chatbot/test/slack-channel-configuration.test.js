"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const iam = require("@aws-cdk/aws-iam");
const logs = require("@aws-cdk/aws-logs");
const sns = require("@aws-cdk/aws-sns");
const cdk = require("@aws-cdk/core");
const chatbot = require("../lib");
describe('SlackChannelConfiguration', () => {
    let stack;
    beforeEach(() => {
        stack = new cdk.Stack();
    });
    test('created with minimal properties creates a new IAM Role', () => {
        new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
            slackWorkspaceId: 'ABC123',
            slackChannelId: 'DEF456',
            slackChannelConfigurationName: 'Test',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Chatbot::SlackChannelConfiguration', {
            ConfigurationName: 'Test',
            IamRoleArn: {
                'Fn::GetAtt': [
                    'MySlackChannelConfigurationRole1D3F23AE',
                    'Arn',
                ],
            },
            SlackChannelId: 'DEF456',
            SlackWorkspaceId: 'ABC123',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            Service: 'chatbot.amazonaws.com',
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('created and pass loggingLevel parameter [LoggingLevel.ERROR], it should be set [ERROR] logging level in Cloudformation', () => {
        new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
            slackWorkspaceId: 'ABC123',
            slackChannelId: 'DEF456',
            slackChannelConfigurationName: 'Test',
            loggingLevel: chatbot.LoggingLevel.ERROR,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Chatbot::SlackChannelConfiguration', {
            ConfigurationName: 'Test',
            IamRoleArn: {
                'Fn::GetAtt': [
                    'MySlackChannelConfigurationRole1D3F23AE',
                    'Arn',
                ],
            },
            SlackChannelId: 'DEF456',
            SlackWorkspaceId: 'ABC123',
            LoggingLevel: 'ERROR',
        });
    });
    test('created with new sns topic', () => {
        const topic = new sns.Topic(stack, 'MyTopic');
        new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
            slackWorkspaceId: 'ABC123',
            slackChannelId: 'DEF456',
            slackChannelConfigurationName: 'Test',
            notificationTopics: [topic],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Chatbot::SlackChannelConfiguration', {
            ConfigurationName: 'Test',
            IamRoleArn: {
                'Fn::GetAtt': [
                    'MySlackChannelConfigurationRole1D3F23AE',
                    'Arn',
                ],
            },
            SlackChannelId: 'DEF456',
            SlackWorkspaceId: 'ABC123',
            SnsTopicArns: [
                {
                    Ref: 'MyTopic86869434',
                },
            ],
        });
    });
    test('allows adding a Topic after creating the SlackChannel', () => {
        const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
            slackWorkspaceId: 'ABC123',
            slackChannelId: 'DEF456',
            slackChannelConfigurationName: 'Test',
        });
        const topic = new sns.Topic(stack, 'MyTopic');
        slackChannel.addNotificationTopic(topic);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Chatbot::SlackChannelConfiguration', {
            ConfigurationName: 'Test',
            SnsTopicArns: [
                {
                    Ref: 'MyTopic86869434',
                },
            ],
        });
    });
    test('created with existing role', () => {
        const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam:::role/test-role');
        new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
            slackWorkspaceId: 'ABC123',
            slackChannelId: 'DEF456',
            slackChannelConfigurationName: 'Test',
            role: role,
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
    });
    test('created with new role and extra iam policies', () => {
        const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
            slackWorkspaceId: 'ABC123',
            slackChannelId: 'DEF456',
            slackChannelConfigurationName: 'Test',
        });
        slackChannel.addToRolePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                's3:GetObject',
            ],
            resources: ['arn:aws:s3:::abc/xyz/123.txt'],
        }));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 's3:GetObject',
                        Effect: 'Allow',
                        Resource: 'arn:aws:s3:::abc/xyz/123.txt',
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('specifying log retention', () => {
        new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
            slackWorkspaceId: 'ABC123',
            slackChannelId: 'DEF456',
            slackChannelConfigurationName: 'ConfigurationName',
            logRetention: logs.RetentionDays.ONE_MONTH,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
            LogGroupName: '/aws/chatbot/ConfigurationName',
            RetentionInDays: 30,
            LogGroupRegion: 'us-east-1',
        });
    });
    test('getting configuration metric', () => {
        const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
            slackWorkspaceId: 'ABC123',
            slackChannelId: 'DEF456',
            slackChannelConfigurationName: 'ConfigurationName',
            logRetention: logs.RetentionDays.ONE_MONTH,
        });
        const metric = slackChannel.metric('MetricName');
        new cloudwatch.Alarm(stack, 'Alarm', {
            evaluationPeriods: 1,
            threshold: 0,
            comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
            metric: metric,
        });
        expect(metric).toEqual(new cloudwatch.Metric({
            namespace: 'AWS/Chatbot',
            region: 'us-east-1',
            dimensionsMap: {
                ConfigurationName: 'ConfigurationName',
            },
            metricName: 'MetricName',
        }));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
            Namespace: 'AWS/Chatbot',
            MetricName: 'MetricName',
            Dimensions: [
                {
                    Name: 'ConfigurationName',
                    Value: 'ConfigurationName',
                },
            ],
            ComparisonOperator: 'GreaterThanThreshold',
            EvaluationPeriods: 1,
            Threshold: 0,
        });
    });
    test('getting all configurations metric', () => {
        const metric = chatbot.SlackChannelConfiguration.metricAll('MetricName');
        new cloudwatch.Alarm(stack, 'Alarm', {
            evaluationPeriods: 1,
            threshold: 0,
            comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
            metric: metric,
        });
        expect(metric).toEqual(new cloudwatch.Metric({
            namespace: 'AWS/Chatbot',
            region: 'us-east-1',
            metricName: 'MetricName',
        }));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
            Namespace: 'AWS/Chatbot',
            MetricName: 'MetricName',
            Dimensions: assertions_1.Match.absent(),
            ComparisonOperator: 'GreaterThanThreshold',
            EvaluationPeriods: 1,
            Threshold: 0,
        });
    });
    test('added a iam policy to a from slack channel configuration ARN will nothing to do', () => {
        const imported = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');
        imported.addToRolePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                's3:GetObject',
            ],
            resources: ['arn:aws:s3:::abc/xyz/123.txt'],
        }));
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
    });
    test('should throw error if ARN invalid', () => {
        expect(() => chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/my-slack')).toThrow(/The ARN of a Slack integration must be in the form: arn:aws:chatbot:{region}:{account}:chat-configuration\/slack-channel\/{slackChannelName}/);
    });
    test('from slack channel configuration ARN', () => {
        const imported = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');
        expect(imported.slackChannelConfigurationName).toEqual('my-slack');
        expect(imported.slackChannelConfigurationArn).toEqual('arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');
    });
    test('skip validation for tokenized values', () => {
        // invalid ARN because of underscores, no error because tokenized value
        expect(() => chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', cdk.Lazy.string({ produce: () => 'arn:aws:chatbot::1234567890:chat-configuration/slack_channel/my_slack' }))).not.toThrow();
    });
    test('test name and ARN from slack channel configuration ARN', () => {
        const imported = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', cdk.Token.asString({ Ref: 'ARN' }));
        // THEN
        expect(stack.resolve(imported.slackChannelConfigurationName)).toStrictEqual({
            'Fn::Select': [1, { 'Fn::Split': ['slack-channel/', { 'Fn::Select': [1, { 'Fn::Split': [':chat-configuration/', { Ref: 'ARN' }] }] }] }],
        });
        expect(stack.resolve(imported.slackChannelConfigurationArn)).toStrictEqual({
            Ref: 'ARN',
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xhY2stY2hhbm5lbC1jb25maWd1cmF0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzbGFjay1jaGFubmVsLWNvbmZpZ3VyYXRpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCxzREFBc0Q7QUFDdEQsd0NBQXdDO0FBQ3hDLDBDQUEwQztBQUMxQyx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLGtDQUFrQztBQUVsQyxRQUFRLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLElBQUksS0FBZ0IsQ0FBQztJQUVyQixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtRQUNsRSxJQUFJLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7WUFDN0QsZ0JBQWdCLEVBQUUsUUFBUTtZQUMxQixjQUFjLEVBQUUsUUFBUTtZQUN4Qiw2QkFBNkIsRUFBRSxNQUFNO1NBQ3RDLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlDQUF5QyxFQUFFO1lBQ3pGLGlCQUFpQixFQUFFLE1BQU07WUFDekIsVUFBVSxFQUFFO2dCQUNWLFlBQVksRUFBRTtvQkFDWix5Q0FBeUM7b0JBQ3pDLEtBQUs7aUJBQ047YUFDRjtZQUNELGNBQWMsRUFBRSxRQUFRO1lBQ3hCLGdCQUFnQixFQUFFLFFBQVE7U0FDM0IsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsZ0JBQWdCLEVBQUU7WUFDaEUsd0JBQXdCLEVBQUU7Z0JBQ3hCLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxNQUFNLEVB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RSxXQUFXLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUN6SSxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztZQUN6RSxHQUFHLEVBQUUsS0FBSztTQUNYLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbG9ncyBmcm9tICdAYXdzLWNkay9hd3MtbG9ncyc7XG5pbXBvcnQgKiBhcyBzbnMgZnJvbSAnQGF3cy1jZGsvYXdzLXNucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjaGF0Ym90IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdTbGFja0NoYW5uZWxDb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICBsZXQgc3RhY2s6IGNkay5TdGFjaztcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlZCB3aXRoIG1pbmltYWwgcHJvcGVydGllcyBjcmVhdGVzIGEgbmV3IElBTSBSb2xlJywgKCkgPT4ge1xuICAgIG5ldyBjaGF0Ym90LlNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb24oc3RhY2ssICdNeVNsYWNrQ2hhbm5lbCcsIHtcbiAgICAgIHNsYWNrV29ya3NwYWNlSWQ6ICdBQkMxMjMnLFxuICAgICAgc2xhY2tDaGFubmVsSWQ6ICdERUY0NTYnLFxuICAgICAgc2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbk5hbWU6ICdUZXN0JyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNoYXRib3Q6OlNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb24nLCB7XG4gICAgICBDb25maWd1cmF0aW9uTmFtZTogJ1Rlc3QnLFxuICAgICAgSWFtUm9sZUFybjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTXlTbGFja0NoYW5uZWxDb25maWd1cmF0aW9uUm9sZTFEM0YyM0FFJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBTbGFja0NoYW5uZWxJZDogJ0RFRjQ1NicsXG4gICAgICBTbGFja1dvcmtzcGFjZUlkOiAnQUJDMTIzJyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgU2VydmljZTogJ2NoYXRib3QuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZWQgYW5kIHBhc3MgbG9nZ2luZ0xldmVsIHBhcmFtZXRlciBbTG9nZ2luZ0xldmVsLkVSUk9SXSwgaXQgc2hvdWxkIGJlIHNldCBbRVJST1JdIGxvZ2dpbmcgbGV2ZWwgaW4gQ2xvdWRmb3JtYXRpb24nLCAoKSA9PiB7XG4gICAgbmV3IGNoYXRib3QuU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbihzdGFjaywgJ015U2xhY2tDaGFubmVsJywge1xuICAgICAgc2xhY2tXb3Jrc3BhY2VJZDogJ0FCQzEyMycsXG4gICAgICBzbGFja0NoYW5uZWxJZDogJ0RFRjQ1NicsXG4gICAgICBzbGFja0NoYW5uZWxDb25maWd1cmF0aW9uTmFtZTogJ1Rlc3QnLFxuICAgICAgbG9nZ2luZ0xldmVsOiBjaGF0Ym90LkxvZ2dpbmdMZXZlbC5FUlJPUixcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNoYXRib3Q6OlNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb24nLCB7XG4gICAgICBDb25maWd1cmF0aW9uTmFtZTogJ1Rlc3QnLFxuICAgICAgSWFtUm9sZUFybjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTXlTbGFja0NoYW5uZWxDb25maWd1cmF0aW9uUm9sZTFEM0YyM0FFJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBTbGFja0NoYW5uZWxJZDogJ0RFRjQ1NicsXG4gICAgICBTbGFja1dvcmtzcGFjZUlkOiAnQUJDMTIzJyxcbiAgICAgIExvZ2dpbmdMZXZlbDogJ0VSUk9SJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlZCB3aXRoIG5ldyBzbnMgdG9waWMnLCAoKSA9PiB7XG4gICAgY29uc3QgdG9waWMgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnTXlUb3BpYycpO1xuXG4gICAgbmV3IGNoYXRib3QuU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbihzdGFjaywgJ015U2xhY2tDaGFubmVsJywge1xuICAgICAgc2xhY2tXb3Jrc3BhY2VJZDogJ0FCQzEyMycsXG4gICAgICBzbGFja0NoYW5uZWxJZDogJ0RFRjQ1NicsXG4gICAgICBzbGFja0NoYW5uZWxDb25maWd1cmF0aW9uTmFtZTogJ1Rlc3QnLFxuICAgICAgbm90aWZpY2F0aW9uVG9waWNzOiBbdG9waWNdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2hhdGJvdDo6U2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbicsIHtcbiAgICAgIENvbmZpZ3VyYXRpb25OYW1lOiAnVGVzdCcsXG4gICAgICBJYW1Sb2xlQXJuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdNeVNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25Sb2xlMUQzRjIzQUUnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFNsYWNrQ2hhbm5lbElkOiAnREVGNDU2JyxcbiAgICAgIFNsYWNrV29ya3NwYWNlSWQ6ICdBQkMxMjMnLFxuICAgICAgU25zVG9waWNBcm5zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdNeVRvcGljODY4Njk0MzQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWxsb3dzIGFkZGluZyBhIFRvcGljIGFmdGVyIGNyZWF0aW5nIHRoZSBTbGFja0NoYW5uZWwnLCAoKSA9PiB7XG4gICAgY29uc3Qgc2xhY2tDaGFubmVsID0gbmV3IGNoYXRib3QuU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbihzdGFjaywgJ015U2xhY2tDaGFubmVsJywge1xuICAgICAgc2xhY2tXb3Jrc3BhY2VJZDogJ0FCQzEyMycsXG4gICAgICBzbGFja0NoYW5uZWxJZDogJ0RFRjQ1NicsXG4gICAgICBzbGFja0NoYW5uZWxDb25maWd1cmF0aW9uTmFtZTogJ1Rlc3QnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdG9waWMgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnTXlUb3BpYycpO1xuICAgIHNsYWNrQ2hhbm5lbC5hZGROb3RpZmljYXRpb25Ub3BpYyh0b3BpYyk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDaGF0Ym90OjpTbGFja0NoYW5uZWxDb25maWd1cmF0aW9uJywge1xuICAgICAgQ29uZmlndXJhdGlvbk5hbWU6ICdUZXN0JyxcbiAgICAgIFNuc1RvcGljQXJuczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnTXlUb3BpYzg2ODY5NDM0JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZWQgd2l0aCBleGlzdGluZyByb2xlJywgKCkgPT4ge1xuICAgIGNvbnN0IHJvbGUgPSBpYW0uUm9sZS5mcm9tUm9sZUFybihzdGFjaywgJ1JvbGUnLCAnYXJuOmF3czppYW06Ojpyb2xlL3Rlc3Qtcm9sZScpO1xuXG4gICAgbmV3IGNoYXRib3QuU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbihzdGFjaywgJ015U2xhY2tDaGFubmVsJywge1xuICAgICAgc2xhY2tXb3Jrc3BhY2VJZDogJ0FCQzEyMycsXG4gICAgICBzbGFja0NoYW5uZWxJZDogJ0RFRjQ1NicsXG4gICAgICBzbGFja0NoYW5uZWxDb25maWd1cmF0aW9uTmFtZTogJ1Rlc3QnLFxuICAgICAgcm9sZTogcm9sZSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6Um9sZScsIDApO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGVkIHdpdGggbmV3IHJvbGUgYW5kIGV4dHJhIGlhbSBwb2xpY2llcycsICgpID0+IHtcbiAgICBjb25zdCBzbGFja0NoYW5uZWwgPSBuZXcgY2hhdGJvdC5TbGFja0NoYW5uZWxDb25maWd1cmF0aW9uKHN0YWNrLCAnTXlTbGFja0NoYW5uZWwnLCB7XG4gICAgICBzbGFja1dvcmtzcGFjZUlkOiAnQUJDMTIzJyxcbiAgICAgIHNsYWNrQ2hhbm5lbElkOiAnREVGNDU2JyxcbiAgICAgIHNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25OYW1lOiAnVGVzdCcsXG4gICAgfSk7XG5cbiAgICBzbGFja0NoYW5uZWwuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgJ3MzOkdldE9iamVjdCcsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbJ2Fybjphd3M6czM6OjphYmMveHl6LzEyMy50eHQnXSxcbiAgICB9KSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ3MzOkdldE9iamVjdCcsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogJ2Fybjphd3M6czM6OjphYmMveHl6LzEyMy50eHQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NwZWNpZnlpbmcgbG9nIHJldGVudGlvbicsICgpID0+IHtcbiAgICBuZXcgY2hhdGJvdC5TbGFja0NoYW5uZWxDb25maWd1cmF0aW9uKHN0YWNrLCAnTXlTbGFja0NoYW5uZWwnLCB7XG4gICAgICBzbGFja1dvcmtzcGFjZUlkOiAnQUJDMTIzJyxcbiAgICAgIHNsYWNrQ2hhbm5lbElkOiAnREVGNDU2JyxcbiAgICAgIHNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25OYW1lOiAnQ29uZmlndXJhdGlvbk5hbWUnLFxuICAgICAgbG9nUmV0ZW50aW9uOiBsb2dzLlJldGVudGlvbkRheXMuT05FX01PTlRILFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6TG9nUmV0ZW50aW9uJywge1xuICAgICAgTG9nR3JvdXBOYW1lOiAnL2F3cy9jaGF0Ym90L0NvbmZpZ3VyYXRpb25OYW1lJyxcbiAgICAgIFJldGVudGlvbkluRGF5czogMzAsXG4gICAgICBMb2dHcm91cFJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dldHRpbmcgY29uZmlndXJhdGlvbiBtZXRyaWMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc2xhY2tDaGFubmVsID0gbmV3IGNoYXRib3QuU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbihzdGFjaywgJ015U2xhY2tDaGFubmVsJywge1xuICAgICAgc2xhY2tXb3Jrc3BhY2VJZDogJ0FCQzEyMycsXG4gICAgICBzbGFja0NoYW5uZWxJZDogJ0RFRjQ1NicsXG4gICAgICBzbGFja0NoYW5uZWxDb25maWd1cmF0aW9uTmFtZTogJ0NvbmZpZ3VyYXRpb25OYW1lJyxcbiAgICAgIGxvZ1JldGVudGlvbjogbG9ncy5SZXRlbnRpb25EYXlzLk9ORV9NT05USCxcbiAgICB9KTtcbiAgICBjb25zdCBtZXRyaWMgPSBzbGFja0NoYW5uZWwubWV0cmljKCdNZXRyaWNOYW1lJyk7XG4gICAgbmV3IGNsb3Vkd2F0Y2guQWxhcm0oc3RhY2ssICdBbGFybScsIHtcbiAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAxLFxuICAgICAgdGhyZXNob2xkOiAwLFxuICAgICAgY29tcGFyaXNvbk9wZXJhdG9yOiBjbG91ZHdhdGNoLkNvbXBhcmlzb25PcGVyYXRvci5HUkVBVEVSX1RIQU5fVEhSRVNIT0xELFxuICAgICAgbWV0cmljOiBtZXRyaWMsXG4gICAgfSk7XG5cbiAgICBleHBlY3QobWV0cmljKS50b0VxdWFsKG5ldyBjbG91ZHdhdGNoLk1ldHJpYyh7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvQ2hhdGJvdCcsXG4gICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgZGltZW5zaW9uc01hcDoge1xuICAgICAgICBDb25maWd1cmF0aW9uTmFtZTogJ0NvbmZpZ3VyYXRpb25OYW1lJyxcbiAgICAgIH0sXG4gICAgICBtZXRyaWNOYW1lOiAnTWV0cmljTmFtZScsXG4gICAgfSkpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkV2F0Y2g6OkFsYXJtJywge1xuICAgICAgTmFtZXNwYWNlOiAnQVdTL0NoYXRib3QnLFxuICAgICAgTWV0cmljTmFtZTogJ01ldHJpY05hbWUnLFxuICAgICAgRGltZW5zaW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgTmFtZTogJ0NvbmZpZ3VyYXRpb25OYW1lJyxcbiAgICAgICAgICBWYWx1ZTogJ0NvbmZpZ3VyYXRpb25OYW1lJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBDb21wYXJpc29uT3BlcmF0b3I6ICdHcmVhdGVyVGhhblRocmVzaG9sZCcsXG4gICAgICBFdmFsdWF0aW9uUGVyaW9kczogMSxcbiAgICAgIFRocmVzaG9sZDogMCxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ2V0dGluZyBhbGwgY29uZmlndXJhdGlvbnMgbWV0cmljJywgKCkgPT4ge1xuICAgIGNvbnN0IG1ldHJpYyA9IGNoYXRib3QuU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbi5tZXRyaWNBbGwoJ01ldHJpY05hbWUnKTtcbiAgICBuZXcgY2xvdWR3YXRjaC5BbGFybShzdGFjaywgJ0FsYXJtJywge1xuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDEsXG4gICAgICB0aHJlc2hvbGQ6IDAsXG4gICAgICBjb21wYXJpc29uT3BlcmF0b3I6IGNsb3Vkd2F0Y2guQ29tcGFyaXNvbk9wZXJhdG9yLkdSRUFURVJfVEhBTl9USFJFU0hPTEQsXG4gICAgICBtZXRyaWM6IG1ldHJpYyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChtZXRyaWMpLnRvRXF1YWwobmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9DaGF0Ym90JyxcbiAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICBtZXRyaWNOYW1lOiAnTWV0cmljTmFtZScsXG4gICAgfSkpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkV2F0Y2g6OkFsYXJtJywge1xuICAgICAgTmFtZXNwYWNlOiAnQVdTL0NoYXRib3QnLFxuICAgICAgTWV0cmljTmFtZTogJ01ldHJpY05hbWUnLFxuICAgICAgRGltZW5zaW9uczogTWF0Y2guYWJzZW50KCksXG4gICAgICBDb21wYXJpc29uT3BlcmF0b3I6ICdHcmVhdGVyVGhhblRocmVzaG9sZCcsXG4gICAgICBFdmFsdWF0aW9uUGVyaW9kczogMSxcbiAgICAgIFRocmVzaG9sZDogMCxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkZWQgYSBpYW0gcG9saWN5IHRvIGEgZnJvbSBzbGFjayBjaGFubmVsIGNvbmZpZ3VyYXRpb24gQVJOIHdpbGwgbm90aGluZyB0byBkbycsICgpID0+IHtcbiAgICBjb25zdCBpbXBvcnRlZCA9IGNoYXRib3QuU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbi5mcm9tU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbkFybihzdGFjaywgJ015U2xhY2tDaGFubmVsJywgJ2Fybjphd3M6Y2hhdGJvdDo6MTIzNDU2Nzg5MDpjaGF0LWNvbmZpZ3VyYXRpb24vc2xhY2stY2hhbm5lbC9teS1zbGFjaycpO1xuXG4gICAgKGltcG9ydGVkIGFzIGNoYXRib3QuU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbikuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgJ3MzOkdldE9iamVjdCcsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbJ2Fybjphd3M6czM6OjphYmMveHl6LzEyMy50eHQnXSxcbiAgICB9KSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlJvbGUnLCAwKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlBvbGljeScsIDApO1xuICB9KTtcblxuICB0ZXN0KCdzaG91bGQgdGhyb3cgZXJyb3IgaWYgQVJOIGludmFsaWQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IGNoYXRib3QuU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbi5mcm9tU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbkFybihzdGFjaywgJ015U2xhY2tDaGFubmVsJywgJ2Fybjphd3M6Y2hhdGJvdDo6MTIzNDU2Nzg5MDpjaGF0LWNvbmZpZ3VyYXRpb24vbXktc2xhY2snKSkudG9UaHJvdyhcbiAgICAgIC9UaGUgQVJOIG9mIGEgU2xhY2sgaW50ZWdyYXRpb24gbXVzdCBiZSBpbiB0aGUgZm9ybTogYXJuOmF3czpjaGF0Ym90OntyZWdpb259OnthY2NvdW50fTpjaGF0LWNvbmZpZ3VyYXRpb25cXC9zbGFjay1jaGFubmVsXFwve3NsYWNrQ2hhbm5lbE5hbWV9LyxcbiAgICApO1xuICB9KTtcblxuICB0ZXN0KCdmcm9tIHNsYWNrIGNoYW5uZWwgY29uZmlndXJhdGlvbiBBUk4nLCAoKSA9PiB7XG4gICAgY29uc3QgaW1wb3J0ZWQgPSBjaGF0Ym90LlNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb24uZnJvbVNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25Bcm4oc3RhY2ssICdNeVNsYWNrQ2hhbm5lbCcsICdhcm46YXdzOmNoYXRib3Q6OjEyMzQ1Njc4OTA6Y2hhdC1jb25maWd1cmF0aW9uL3NsYWNrLWNoYW5uZWwvbXktc2xhY2snKTtcblxuICAgIGV4cGVjdChpbXBvcnRlZC5zbGFja0NoYW5uZWxDb25maWd1cmF0aW9uTmFtZSkudG9FcXVhbCgnbXktc2xhY2snKTtcbiAgICBleHBlY3QoaW1wb3J0ZWQuc2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbkFybikudG9FcXVhbCgnYXJuOmF3czpjaGF0Ym90OjoxMjM0NTY3ODkwOmNoYXQtY29uZmlndXJhdGlvbi9zbGFjay1jaGFubmVsL215LXNsYWNrJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NraXAgdmFsaWRhdGlvbiBmb3IgdG9rZW5pemVkIHZhbHVlcycsICgpID0+IHtcbiAgICAvLyBpbnZhbGlkIEFSTiBiZWNhdXNlIG9mIHVuZGVyc2NvcmVzLCBubyBlcnJvciBiZWNhdXNlIHRva2VuaXplZCB2YWx1ZVxuICAgIGV4cGVjdCgoKSA9PiBjaGF0Ym90LlNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb24uZnJvbVNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25Bcm4oc3RhY2ssICdNeVNsYWNrQ2hhbm5lbCcsXG4gICAgICBjZGsuTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAnYXJuOmF3czpjaGF0Ym90OjoxMjM0NTY3ODkwOmNoYXQtY29uZmlndXJhdGlvbi9zbGFja19jaGFubmVsL215X3NsYWNrJyB9KSkpLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rlc3QgbmFtZSBhbmQgQVJOIGZyb20gc2xhY2sgY2hhbm5lbCBjb25maWd1cmF0aW9uIEFSTicsICgpID0+IHtcbiAgICBjb25zdCBpbXBvcnRlZCA9IGNoYXRib3QuU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbi5mcm9tU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbkFybihzdGFjaywgJ015U2xhY2tDaGFubmVsJywgY2RrLlRva2VuLmFzU3RyaW5nKHsgUmVmOiAnQVJOJyB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoaW1wb3J0ZWQuc2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbk5hbWUpKS50b1N0cmljdEVxdWFsKHtcbiAgICAgICdGbjo6U2VsZWN0JzogWzEsIHsgJ0ZuOjpTcGxpdCc6IFsnc2xhY2stY2hhbm5lbC8nLCB7wqAnRm46OlNlbGVjdCc6IFsxLCB7ICdGbjo6U3BsaXQnOiBbJzpjaGF0LWNvbmZpZ3VyYXRpb24vJywgeyBSZWY6ICdBUk4nIH1dIH1dIH1dIH1dLFxuICAgIH0pO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGltcG9ydGVkLnNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25Bcm4pKS50b1N0cmljdEVxdWFsKHtcbiAgICAgIFJlZjogJ0FSTicsXG4gICAgfSk7XG4gIH0pO1xufSk7Il19
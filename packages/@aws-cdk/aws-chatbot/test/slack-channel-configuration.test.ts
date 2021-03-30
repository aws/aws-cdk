import '@aws-cdk/assert-internal/jest';
import { ABSENT } from '@aws-cdk/assert-internal';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as chatbot from '../lib';

describe('SlackChannelConfiguration', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('created with minimal properties creates a new IAM Role', () => {
    new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
    });

    expect(stack).toHaveResourceLike('AWS::Chatbot::SlackChannelConfiguration', {
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

    expect(stack).toHaveResourceLike('AWS::IAM::Role', {
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

    expect(stack).toHaveResourceLike('AWS::Chatbot::SlackChannelConfiguration', {
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

    expect(stack).toHaveResourceLike('AWS::Chatbot::SlackChannelConfiguration', {
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

  test('created with existing role', () => {
    const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam:::role/test-role');

    new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
      role: role,
    });

    expect(stack).toCountResources('AWS::IAM::Role', 0);
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

    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
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

    expect(stack).toHaveResourceLike('Custom::LogRetention', {
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
      dimensions: {
        ConfigurationName: 'ConfigurationName',
      },
      metricName: 'MetricName',
    }));
    expect(stack).toHaveResourceLike('AWS::CloudWatch::Alarm', {
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
    expect(stack).toHaveResourceLike('AWS::CloudWatch::Alarm', {
      Namespace: 'AWS/Chatbot',
      MetricName: 'MetricName',
      Dimensions: ABSENT,
      ComparisonOperator: 'GreaterThanThreshold',
      EvaluationPeriods: 1,
      Threshold: 0,
    });
  });

  test('added a iam policy to a from slack channel configuration ARN will nothing to do', () => {
    const imported = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');

    (imported as chatbot.SlackChannelConfiguration).addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:GetObject',
      ],
      resources: ['arn:aws:s3:::abc/xyz/123.txt'],
    }));

    expect(stack).toCountResources('AWS::IAM::Role', 0);
    expect(stack).toCountResources('AWS::IAM::Policy', 0);
  });

  test('should throw error if ARN invalid', () => {
    expect(() => chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/my-slack')).toThrow(
      /The ARN of a Slack integration must be in the form: arn:aws:chatbot:{region}:{account}:chat-configuration\/slack-channel\/{slackChannelName}/,
    );
  });

  test('from slack channel configuration ARN', () => {
    const imported = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');

    expect(imported.slackChannelConfigurationName).toEqual('my-slack');
    expect(imported.slackChannelConfigurationArn).toEqual('arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');
  });
});
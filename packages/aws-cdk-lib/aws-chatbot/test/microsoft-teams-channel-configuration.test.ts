import { Match, Template } from '../../assertions';
import * as cloudwatch from '../../aws-cloudwatch';
import * as iam from '../../aws-iam';
import * as logs from '../../aws-logs';
import * as sns from '../../aws-sns';
import * as cdk from '../../core';
import * as chatbot from '../lib';

describe('MicrosoftTeamsChannelConfiguration', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('created with minimal properties creates a new IAM Role', () => {
    new chatbot.MicrosoftTeamsChannelConfiguration(stack, 'MyTeamsChannel', {
      teamId: 'ABC123',
      teamsChannelId: 'DEF456',
      teamsTenantId: 'GHI789',
      microsoftTeamsChannelConfigurationName: 'Test',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Chatbot::MicrosoftTeamsChannelConfiguration', {
      ConfigurationName: 'Test',
      IamRoleArn: {
        'Fn::GetAtt': [
          'MyMicrosoftTeamsChannelConfigurationRole1D3F23AE',
          'Arn',
        ],
      },
      TeamId: 'ABC123',
      TeamsChannelId: 'DEF456',
      TeamsTenantId: 'GHI789',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
    new chatbot.MicrosoftTeamsChannelConfiguration(stack, 'MyMicrosoftTeamsChannel', {
      teamId: 'ABC123',
      teamsChannelId: 'DEF456',
      teamsTenantId: 'GHI789',
      microsoftTeamsChannelConfigurationName: 'Test',
      loggingLevel: chatbot.LoggingLevel.ERROR,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Chatbot::MicrosoftTeamsChannelConfiguration', {
      ConfigurationName: 'Test',
      IamRoleArn: {
        'Fn::GetAtt': [
          'MyMicrosoftTeamsChannelConfigurationRole1D3F23AE',
          'Arn',
        ],
      },
      TeamId: 'ABC123',
      TeamsChannelId: 'DEF456',
      TeamsTenantId: 'GHI789',
      LoggingLevel: 'ERROR',
    });
  });

  test('created with new sns topic', () => {
    const topic = new sns.Topic(stack, 'MyTopic');

    new chatbot.MicrosoftTeamsChannelConfiguration(stack, 'MyMicrosoftTeamsChannel', {
      teamId: 'ABC123',
      teamsChannelId: 'DEF456',
      teamsTenantId: 'GHI789',
      microsoftTeamsChannelConfigurationName: 'Test',
      notificationTopics: [topic],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Chatbot::MicrosoftTeamsChannelConfiguration', {
      ConfigurationName: 'Test',
      IamRoleArn: {
        'Fn::GetAtt': [
          'MyMicrosoftTeamsChannelConfigurationRole1D3F23AE',
          'Arn',
        ],
      },
      TeamId: 'ABC123',
      TeamsChannelId: 'DEF456',
      TeamsTenantId: 'GHI789',
      SnsTopicArns: [
        {
          Ref: 'MyTopic86869434',
        },
      ],
    });
  });

  test('allows adding a Topic after creating the MicrosoftTeamsChannel', () => {
    const microsoftTeamsChannel = new chatbot.MicrosoftTeamsChannelConfiguration(stack, 'MyMicrosoftTeamsChannel', {
      teamId: 'ABC123',
      teamsChannelId: 'DEF456',
      teamsTenantId: 'GHI789',
      microsoftTeamsChannelConfigurationName: 'Test',
    });

    const topic = new sns.Topic(stack, 'MyTopic');
    microsoftTeamsChannel.addNotificationTopic(topic);

    Template.fromStack(stack).hasResourceProperties('AWS::Chatbot::MicrosoftTeamsChannelConfiguration', {
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

    new chatbot.MicrosoftTeamsChannelConfiguration(stack, 'MyMicrosoftTeamsChannel', {
      teamId: 'ABC123',
      teamsChannelId: 'DEF456',
      teamsTenantId: 'GHI789',
      microsoftTeamsChannelConfigurationName: 'Test',
      role: role,
    });

    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
  });

  test('created with new role and extra iam policies', () => {
    const microsoftTeamsChannel = new chatbot.MicrosoftTeamsChannelConfiguration(stack, 'MyMicrosoftTeamsChannel', {
      teamId: 'ABC123',
      teamsChannelId: 'DEF456',
      teamsTenantId: 'GHI789',
      microsoftTeamsChannelConfigurationName: 'Test',
    });

    microsoftTeamsChannel.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:GetObject',
      ],
      resources: ['arn:aws:s3:::abc/xyz/123.txt'],
    }));

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
    new chatbot.MicrosoftTeamsChannelConfiguration(stack, 'MyMicrosoftTeamsChannel', {
      teamId: 'ABC123',
      teamsChannelId: 'DEF456',
      teamsTenantId: 'GHI789',
      microsoftTeamsChannelConfigurationName: 'Test',
      logRetention: logs.RetentionDays.ONE_MONTH,
    });

    Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
      LogGroupName: '/aws/chatbot/ConfigurationName',
      RetentionInDays: 30,
      LogGroupRegion: 'us-east-1',
    });
  });

  test('getting configuration metric', () => {
    const microsoftTeamsChannel = new chatbot.MicrosoftTeamsChannelConfiguration(stack, 'MyMicrosoftTeamsChannel', {
      teamId: 'ABC123',
      teamsChannelId: 'DEF456',
      teamsTenantId: 'GHI789',
      microsoftTeamsChannelConfigurationName: 'Test',
      logRetention: logs.RetentionDays.ONE_MONTH,
    });
    const metric = microsoftTeamsChannel.metric('MetricName');
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
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
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
    const metric = chatbot.MicrosoftTeamsChannelConfiguration.metricAll('MetricName');
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
    Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Alarm', {
      Namespace: 'AWS/Chatbot',
      MetricName: 'MetricName',
      Dimensions: Match.absent(),
      ComparisonOperator: 'GreaterThanThreshold',
      EvaluationPeriods: 1,
      Threshold: 0,
    });
  });

  test('added a iam policy to a from microsoft teams channel configuration ARN will nothing to do', () => {
    const imported = chatbot.MicrosoftTeamsChannelConfiguration.fromMicrosoftTeamsChannelConfigurationArn(stack, 'MyMicrosoftTeamsChannel', 'arn:aws:chatbot::1234567890:chat-configuration/microsoft-teams-channel/my-channel');

    (imported as chatbot.MicrosoftTeamsChannelConfiguration).addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:GetObject',
      ],
      resources: ['arn:aws:s3:::abc/xyz/123.txt'],
    }));

    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
  });

  test('should throw error if ARN invalid', () => {
    expect(() => chatbot.MicrosoftTeamsChannelConfiguration.fromMicrosoftTeamsChannelConfigurationArn(stack, 'MyMicrosoftTeamsChannel', 'arn:aws:chatbot::1234567890:chat-configuration/my-channel')).toThrow(
      /The ARN of a Microsoft Teams integration must be in the form: arn:<partition>:chatbot:<region>:<account>:chat-configuration\/microsoft-teams-channel\/<microsoftTeamsChannelName>/,
    );
  });

  test('from microsoft teams channel configuration ARN', () => {
    const imported = chatbot.MicrosoftTeamsChannelConfiguration.fromMicrosoftTeamsChannelConfigurationArn(stack, 'MyMicrosoftTeamsChannel', 'arn:aws:chatbot::1234567890:chat-configuration/microsoft-teams-channel/my-channel');

    expect(imported.microsoftTeamsChannelConfigurationName).toEqual('my-channel');
    expect(imported.microsoftTeamsChannelConfigurationArn).toEqual('arn:aws:chatbot::1234567890:chat-configuration/microsoft-teams-channel/my-channel');
  });

  test('skip validation for tokenized values', () => {
    // invalid ARN because of underscores, no error because tokenized value
    expect(() => chatbot.MicrosoftTeamsChannelConfiguration.fromMicrosoftTeamsChannelConfigurationArn(stack, 'MyMicrosoftTeamsChannel',
      cdk.Lazy.string({ produce: () => 'arn:aws:chatbot::1234567890:chat-configuration/microsoft_teams_channel/my_channel' }))).not.toThrow();
  });

  test('test name and ARN from microsoft teams channel configuration ARN', () => {
    const imported = chatbot.MicrosoftTeamsChannelConfiguration.fromMicrosoftTeamsChannelConfigurationArn(stack, 'MyMicrosoftTeamsChannel', cdk.Token.asString({ Ref: 'ARN' }));

    // THEN
    expect(stack.resolve(imported.microsoftTeamsChannelConfigurationName)).toStrictEqual({
      'Fn::Select': [1, { 'Fn::Split': ['microsoft-teams-channel/', { 'Fn::Select': [1, { 'Fn::Split': [':chat-configuration/', { Ref: 'ARN' }] }] }] }],
    });
    expect(stack.resolve(imported.microsoftTeamsChannelConfigurationArn)).toStrictEqual({
      Ref: 'ARN',
    });
  });

  test('guardrail policy should be configured by ARN when specified', () => {
    new chatbot.MicrosoftTeamsChannelConfiguration(stack, 'MyMicrosoftTeamsChannel', {
      teamId: 'ABC123',
      teamsChannelId: 'DEF456',
      teamsTenantId: 'GHI789',
      microsoftTeamsChannelConfigurationName: 'Test',
      guardrailPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchReadOnlyAccess')],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Chatbot::MicrosoftTeamsChannelConfiguration', {
      GuardrailPolicies: [
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/CloudWatchReadOnlyAccess']] },
      ],
    });
  });
});
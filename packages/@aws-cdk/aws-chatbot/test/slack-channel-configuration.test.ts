import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
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

  test('created with new role and add notification permissions', () => {
    const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
    });

    slackChannel.addNotificationPermissions();

    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'cloudwatch:Describe*',
              'cloudwatch:Get*',
              'cloudwatch:List*',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('created with new role and add read-only command permissions', () => {
    const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
    });

    slackChannel.addReadOnlyCommandPermissions();

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
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/ReadOnlyAccess',
            ],
          ],
        },
      ],
    });

    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'iam:*',
              's3:GetBucketPolicy',
              'ssm:*',
              'sts:*',
              'kms:*',
              'cognito-idp:GetSigningCertificate',
              'ec2:GetPasswordData',
              'ecr:GetAuthorizationToken',
              'gamelift:RequestUploadCredentials',
              'gamelift:GetInstanceAccess',
              'lightsail:DownloadDefaultKeyPair',
              'lightsail:GetInstanceAccessDetails',
              'lightsail:GetKeyPair',
              'lightsail:GetKeyPairs',
              'redshift:GetClusterCredentials',
              'storagegateway:DescribeChapCredentials',
            ],
            Effect: 'Deny',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('created with new role and add lambda invoke command permissions', () => {
    const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
    });

    slackChannel.addLambdaInvokeCommandPermissions();

    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'lambda:invokeAsync',
              'lambda:invokeFunction',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('created with new role and add support command permissions', () => {
    const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
    });

    slackChannel.addSupportCommandPermissions();

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
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/AWSSupportAccess',
            ],
          ],
        },
      ],
    });
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

  test('call addNotificationPermissions() method with imported slack channel configuration will nothing todo', () => {
    const imported = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');
    (imported as chatbot.SlackChannelConfiguration).addNotificationPermissions();

    expect(stack).toCountResources('AWS::IAM::Role', 0);
    expect(stack).toCountResources('AWS::IAM::Policy', 0);
  });

  test('call addReadOnlyCommandPermissions() method with imported slack channel configuration will nothing todo', () => {
    const imported = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');
    (imported as chatbot.SlackChannelConfiguration).addReadOnlyCommandPermissions();

    expect(stack).toCountResources('AWS::IAM::Role', 0);
    expect(stack).toCountResources('AWS::IAM::Policy', 0);
  });

  test('call addLambdaInvokeCommandPermissions() method with imported slack channel configuration will nothing todo', () => {
    const imported = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');
    (imported as chatbot.SlackChannelConfiguration).addLambdaInvokeCommandPermissions();

    expect(stack).toCountResources('AWS::IAM::Role', 0);
    expect(stack).toCountResources('AWS::IAM::Policy', 0);
  });

  test('call addSupportCommandPermissions() method with imported slack channel configuration will nothing todo', () => {
    const imported = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');
    (imported as chatbot.SlackChannelConfiguration).addSupportCommandPermissions();

    expect(stack).toCountResources('AWS::IAM::Role', 0);
    expect(stack).toCountResources('AWS::IAM::Policy', 0);
  });

  test('should throw error if ARN invalid', () => {
    expect(() => chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/my-slack')).toThrow(
      /The ARN of a Slack integration must be in the form: arn:aws:chatbot:accountId:chat-configuration\/slack-channel\/slackChannelName/,
    );
  });

  test('from slack channel configuration ARN', () => {
    const imported = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');

    expect(imported.slackChannelConfigurationName).toEqual('my-slack');
    expect(imported.slackChannelConfigurationArn).toEqual('arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');
  });
});
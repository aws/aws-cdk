import { expect, haveResourceLike, countResources } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as chatbot from '../lib';

describe('created slack channel configuration tests', () => {
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

    expect(stack).to(haveResourceLike('AWS::Chatbot::SlackChannelConfiguration', {
      ConfigurationName: 'Test',
      IamRoleArn: {
        'Fn::GetAtt': [
          'MySlackChannelConfigurationRole1D3F23AE',
          'Arn',
        ],
      },
      SlackChannelId: 'DEF456',
      SlackWorkspaceId: 'ABC123',
    }));

    expect(stack).to(haveResourceLike('AWS::IAM::Role', {
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
    }));
  });

  test('created and pass loggingLevel parameter [LoggingLevel.ERROR], it should be set [ERROR] logging level in Cloudformation', () => {
    new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
      loggingLevel: chatbot.LoggingLevel.ERROR,
    });

    expect(stack).to(haveResourceLike('AWS::Chatbot::SlackChannelConfiguration', {
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
    }));
  });

  test('created with new sns topic', () => {
    const topic = new sns.Topic(stack, 'MyTopic');

    new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
      notificationTopics: [topic],
    });

    expect(stack).to(haveResourceLike('AWS::Chatbot::SlackChannelConfiguration', {
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
    }));
  });

  test('created with existing role', () => {
    const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam:::role/test-role');

    new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
      role: role,
    });

    expect(stack).to(countResources('AWS::IAM::Role', 0));
  });

  test('created with new role and add notification permissions', () => {
    const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
    });

    slackChannel.addNotificationPermissions();

    expect(stack).to(haveResourceLike('AWS::IAM::ManagedPolicy', {
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
      Description: 'NotificationsOnly policy for AWS Chatbot',
      ManagedPolicyName: 'AWS-Chatbot-NotificationsOnly-Policy',
      Path: '/',
    }));
  });

  test('created with new role and add read-only command permissions', () => {
    const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
    });

    slackChannel.addReadOnlyCommandPermissions();

    expect(stack).to(haveResourceLike('AWS::IAM::Role', {
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
        {
          Ref: 'MySlackChannelReadonlyCommandsPolicyD69F9CE1',
        },
      ],
    }));

    expect(stack).to(haveResourceLike('AWS::IAM::ManagedPolicy', {
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
      Description: 'ReadonlyCommands policy for AWS Chatbot',
      ManagedPolicyName: 'AWS-Chatbot-ReadonlyCommands',
      Path: '/',
    }));
  });

  test('created with new role and add lambda invoke command permissions', () => {
    const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
    });

    slackChannel.addLambdaInvokeCommandPermissions();

    expect(stack).to(haveResourceLike('AWS::IAM::ManagedPolicy', {
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
      Description: 'LambdaInvoke policy for AWS Chatbot',
      ManagedPolicyName: 'AWS-Chatbot-LambdaInvoke-Policy',
      Path: '/',
    }));
  });

  test('created with new role and add support command permissions', () => {
    const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
    });

    slackChannel.addSupportCommandPermissions();

    expect(stack).to(haveResourceLike('AWS::IAM::Role', {
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
    }));
  });

  test('created with new role and extra iam policies', () => {
    const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
    });

    slackChannel.addToPrincipalPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:GetObject',
      ],
      resources: ['arn:aws:s3:::abc/xyz/123.txt'],
    }));

    expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
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
    }));
  });

  test('added a iam policy to a from slack channel configuration ARN will nothing to do', () => {
    const imported = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');

    (imported as chatbot.SlackChannelConfiguration).addToPrincipalPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:GetObject',
      ],
      resources: ['arn:aws:s3:::abc/xyz/123.txt'],
    }));

    expect(stack).to(countResources('AWS::IAM::Role', 0));
    expect(stack).to(countResources('AWS::IAM::Policy', 0));
  });
});
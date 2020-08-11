import * as cdkAssert from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as chatbot from '../lib';

describe('slack channel configuration tests', () => {
  test('new configuration with least properties', () => {
    const stack = new cdk.Stack();

    new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
    });

    cdkAssert.expect(stack).toMatch({
      Resources: {
        MySlackChannelConfigurationRole1D3F23AE: {
          Type: 'AWS::IAM::Role',
          Properties: {
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
          },
        },
        MySlackChannelA8E0B56C: {
          Type: 'AWS::Chatbot::SlackChannelConfiguration',
          Properties: {
            ConfigurationName: 'Test',
            IamRoleArn: {
              'Fn::GetAtt': [
                'MySlackChannelConfigurationRole1D3F23AE',
                'Arn',
              ],
            },
            SlackChannelId: 'DEF456',
            SlackWorkspaceId: 'ABC123',
            LoggingLevel: 'NONE',
          },
        },
      },
    });
  });

  test('new configuration with new sns topic', () => {
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'MyTopic');

    new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
      notificationTopics: [topic],
    });

    cdkAssert.expect(stack).toMatch({
      Resources: {
        MyTopic86869434: {
          Type: 'AWS::SNS::Topic',
        },
        MySlackChannelConfigurationRole1D3F23AE: {
          Type: 'AWS::IAM::Role',
          Properties: {
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
          },
        },
        MySlackChannelA8E0B56C: {
          Type: 'AWS::Chatbot::SlackChannelConfiguration',
          Properties: {
            ConfigurationName: 'Test',
            IamRoleArn: {
              'Fn::GetAtt': [
                'MySlackChannelConfigurationRole1D3F23AE',
                'Arn',
              ],
            },
            SlackChannelId: 'DEF456',
            SlackWorkspaceId: 'ABC123',
            LoggingLevel: 'NONE',
            SnsTopicArns: [
              {
                Ref: 'MyTopic86869434',
              },
            ],
          },
        },
      },
    });
  });

  test('new configuration with existing role', () => {
    const stack = new cdk.Stack();
    const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam:::role/test-role');

    new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
      configurationRole: role,
    });

    cdkAssert.expect(stack).to(cdkAssert.countResources('AWS::IAM::Role', 0));
  });

  test('new configuration with new role and add notification permissions', () => {
    const stack = new cdk.Stack();

    const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
    });

    slackChannel.addNotificationPermissions();

    cdkAssert.expect(stack).to(cdkAssert.haveResource('AWS::IAM::ManagedPolicy', {
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

  test('new configuration with new role and add read-only command permissions', () => {
    const stack = new cdk.Stack();

    const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
    });

    slackChannel.addReadOnlyCommandPermissions();

    cdkAssert.expect(stack).to(cdkAssert.haveResource('AWS::IAM::Role', {
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

    cdkAssert.expect(stack).to(cdkAssert.haveResource('AWS::IAM::ManagedPolicy', {
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

  test('new configuration with new role and add lambda invoke command permissions', () => {
    const stack = new cdk.Stack();

    const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
    });

    slackChannel.addLambdaInvokeCommandPermissions();

    cdkAssert.expect(stack).to(cdkAssert.haveResource('AWS::IAM::ManagedPolicy', {
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

  test('new configuration with new role and add support command permissions', () => {
    const stack = new cdk.Stack();

    const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
      slackWorkspaceId: 'ABC123',
      slackChannelId: 'DEF456',
      slackChannelConfigurationName: 'Test',
    });

    slackChannel.addSupportCommandPermissions();

    cdkAssert.expect(stack).to(cdkAssert.haveResource('AWS::IAM::Role', {
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

  test('new configuration with new role and extra iam policies', () => {
    const stack = new cdk.Stack();

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

    cdkAssert.expect(stack).to(cdkAssert.haveResource('AWS::IAM::Policy', {
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
    const stack = new cdk.Stack();
    const imported = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');

    (imported as chatbot.SlackChannelConfiguration).addToPrincipalPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:GetObject',
      ],
      resources: ['arn:aws:s3:::abc/xyz/123.txt'],
    }));

    cdkAssert.expect(stack).to(cdkAssert.countResources('AWS::IAM::Role', 0));
    cdkAssert.expect(stack).to(cdkAssert.countResources('AWS::IAM::Policy', 0));
  });

  test('from slack channel configuration ARN', () => {
    const stack = new cdk.Stack();
    const imported = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');

    expect(imported.configurationName).toEqual('my-slack');
    expect(imported.slackChannelConfigurationArn).toEqual('arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');
  });
});
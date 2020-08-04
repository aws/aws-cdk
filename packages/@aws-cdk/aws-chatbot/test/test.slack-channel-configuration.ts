import { expect, haveResource, countResources } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as chatbot from '../lib';

export = {
  'slack channel configuration tests': {
    'new configuration with least properties'(test: Test) {
      const stack = new cdk.Stack();

      new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
        slackWorkspaceId: 'ABC123',
        slackChannelId: 'DEF456',
        slackChannelConfigurationName: 'Test',
      });

      expect(stack).toMatch({
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
      test.done();
    },

    'new configuration with existing role'(test: Test) {
      const stack = new cdk.Stack();
      const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam:::role/test-role');

      new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
        slackWorkspaceId: 'ABC123',
        slackChannelId: 'DEF456',
        slackChannelConfigurationName: 'Test',
        configurationRole: role,
      });

      expect(stack).to(countResources('AWS::IAM::Role', 0));

      test.done();
    },

    'new configuration with new role and add notification permissions'(test: Test) {
      const stack = new cdk.Stack();

      const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
        slackWorkspaceId: 'ABC123',
        slackChannelId: 'DEF456',
        slackChannelConfigurationName: 'Test',
      });

      slackChannel.addNotificationPermissions();

      expect(stack).to(haveResource('AWS::IAM::ManagedPolicy', {
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
      test.done();
    },

    'new configuration with new role and add read-only command permissions'(test: Test) {
      const stack = new cdk.Stack();

      const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
        slackWorkspaceId: 'ABC123',
        slackChannelId: 'DEF456',
        slackChannelConfigurationName: 'Test',
      });

      slackChannel.addReadOnlyCommandPermissions();

      expect(stack).to(haveResource('AWS::IAM::Role', {
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

      expect(stack).to(haveResource('AWS::IAM::ManagedPolicy', {
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


      test.done();
    },

    'new configuration with new role and add lambda invoke command permissions'(test: Test) {
      const stack = new cdk.Stack();

      const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
        slackWorkspaceId: 'ABC123',
        slackChannelId: 'DEF456',
        slackChannelConfigurationName: 'Test',
      });

      slackChannel.addLambdaInvokeCommandPermissions();

      expect(stack).to(haveResource('AWS::IAM::ManagedPolicy', {
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

      test.done();
    },

    'new configuration with new role and add support command permissions'(test: Test) {
      const stack = new cdk.Stack();

      const slackChannel = new chatbot.SlackChannelConfiguration(stack, 'MySlackChannel', {
        slackWorkspaceId: 'ABC123',
        slackChannelId: 'DEF456',
        slackChannelConfigurationName: 'Test',
      });

      slackChannel.addSupportCommandPermissions();

      expect(stack).to(haveResource('AWS::IAM::Role', {
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

      test.done();
    },

    'from slack channel configuration ARN'(test: Test) {
      const stack = new cdk.Stack();
      const imported = chatbot.SlackChannelConfiguration.fromSlackChannelConfigurationArn(stack, 'MySlackChannel', 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');

      test.deepEqual(imported.configurationName, 'my-slack');
      test.deepEqual(imported.slackChannelConfigurationArn, 'arn:aws:chatbot::1234567890:chat-configuration/slack-channel/my-slack');

      test.done();
    },
  },
};
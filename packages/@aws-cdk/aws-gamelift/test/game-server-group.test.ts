
import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as gamelift from '../lib';

describe('gameservergroup', () => {

  describe('new', () => {
    let stack: cdk.Stack;

    beforeEach(() => {
      stack = new cdk.Stack();
    });

    test('default gameservergroup', () => {
      const vpc = new ec2.Vpc(stack, 'vpc');
      const launchTemplate = new ec2.LaunchTemplate(stack, 'LaunchTemplte', {});
      new gamelift.GameServerGroup(stack, 'MyGameServerGroup', {
        instanceDefinitions: [{
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
        }],
        vpc: vpc,
        launchTemplate: launchTemplate,
        gameServerGroupName: 'test-gameservergroup-name',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument:
          {
            Statement:
              [{
                Action: 'sts:AssumeRole',
                Effect: 'Allow',
                Principal: {
                  Service: 'gamelift.amazonaws.com',
                },
              },
              {
                Action: 'sts:AssumeRole',
                Effect: 'Allow',
                Principal: {
                  Service: 'autoscaling.amazonaws.com',
                },
              }],
            Version: '2012-10-17',
          },
        ManagedPolicyArns: [{
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/GameLiftGameServerGroupPolicy',
            ],
          ],
        }],
      });

      Template.fromStack(stack).hasResource('AWS::GameLift::GameServerGroup', {
        Properties:
          {
            GameServerGroupName: 'test-gameservergroup-name',
          },
      });
    });
  });
});
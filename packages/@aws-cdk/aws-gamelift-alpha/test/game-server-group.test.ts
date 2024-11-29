
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as gamelift from '../lib';

describe('gameservergroup', () => {
  describe('new', () => {
    let stack: cdk.Stack;
    let vpc: ec2.Vpc;
    let launchTemplate: ec2.LaunchTemplate;

    beforeEach(() => {
      stack = new cdk.Stack();
      vpc = new ec2.Vpc(stack, 'vpc');
      launchTemplate = new ec2.LaunchTemplate(stack, 'LaunchTemplte', {});
    });

    test('default gameservergroup', () => {

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
            GameServerProtectionPolicy: 'NO_PROTECTION',
            InstanceDefinitions: [{ InstanceType: 'c5.large' }],
            LaunchTemplate: {
              LaunchTemplateId: { Ref: 'LaunchTemplte29591DF8' },
              Version: {
                'Fn::GetAtt': [
                  'LaunchTemplte29591DF8',
                  'LatestVersionNumber',
                ],
              },
            },
            RoleArn: {
              'Fn::GetAtt': [
                'MyGameServerGroupServiceRoleD6701F0B',
                'Arn',
              ],
            },
            VpcSubnets: [
              { Ref: 'vpcPublicSubnet1Subnet2E65531E' },
              { Ref: 'vpcPublicSubnet2Subnet009B674F' },
            ],
          },
      });
    });

    test('with autoScalingPolicy', () => {
      new gamelift.GameServerGroup(stack, 'MyGameServerGroup', {
        instanceDefinitions: [{
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
        }],
        vpc: vpc,
        launchTemplate: launchTemplate,
        gameServerGroupName: 'test-gameservergroup-name',
        autoScalingPolicy: {
          targetTrackingConfiguration: 10,
          estimatedInstanceWarmup: cdk.Duration.minutes(5),
        },
      });

      Template.fromStack(stack).hasResource('AWS::GameLift::GameServerGroup', {
        Properties:
          {
            GameServerGroupName: 'test-gameservergroup-name',
            GameServerProtectionPolicy: 'NO_PROTECTION',
            InstanceDefinitions: [{ InstanceType: 'c5.large' }],
            LaunchTemplate: {
              LaunchTemplateId: { Ref: 'LaunchTemplte29591DF8' },
              Version: {
                'Fn::GetAtt': [
                  'LaunchTemplte29591DF8',
                  'LatestVersionNumber',
                ],
              },
            },
            RoleArn: {
              'Fn::GetAtt': [
                'MyGameServerGroupServiceRoleD6701F0B',
                'Arn',
              ],
            },
            VpcSubnets: [
              { Ref: 'vpcPublicSubnet1Subnet2E65531E' },
              { Ref: 'vpcPublicSubnet2Subnet009B674F' },
            ],
            AutoScalingPolicy: {
              EstimatedInstanceWarmup: 300,
              TargetTrackingConfiguration: {
                TargetValue: 10,
              },
            },
          },
      });
    });

    test('with an incorrect game server group name length', () => {
      let incorrectName = '';
      for (let i = 0; i < 129; i++) {
        incorrectName += 'A';
      }
      expect(() => new gamelift.GameServerGroup(stack, 'MyGameServerGroup', {
        instanceDefinitions: [{
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
        }],
        vpc: vpc,
        launchTemplate: launchTemplate,
        gameServerGroupName: incorrectName,
      })).toThrow(/GameServerGroup name can not be longer than 128 characters but has 129 characters./);
    });

    test('with an incorrect game server group name format', () => {
      let incorrectName = 'test with space';
      expect(() => new gamelift.GameServerGroup(stack, 'MyGameServerGroup', {
        instanceDefinitions: [{
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
        }],
        vpc: vpc,
        launchTemplate: launchTemplate,
        gameServerGroupName: incorrectName,
      })).toThrow(/Game server group name test with space can contain only letters, numbers, hyphens, back slash or dot with no spaces./);
    });

    test('with an incorrect instance definitions list from constructor', () => {
      let incorrectInstanceDefinitions: gamelift.InstanceDefinition[] = [];
      for (let i = 0; i < 21; i++) {
        incorrectInstanceDefinitions.push({
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
        });
      }
      expect(() => new gamelift.GameServerGroup(stack, 'MyGameServerGroup', {
        instanceDefinitions: incorrectInstanceDefinitions,
        vpc: vpc,
        launchTemplate: launchTemplate,
        gameServerGroupName: 'test-name',
      })).toThrow(/No more than 20 instance definitions are allowed per game server group, given 21/);
    });

    test('with incorrect minSize', () => {
      expect(() => new gamelift.GameServerGroup(stack, 'MyGameServerGroup', {
        instanceDefinitions: [{
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
        }],
        vpc: vpc,
        launchTemplate: launchTemplate,
        gameServerGroupName: 'test-name',
        minSize: -1,
      })).toThrow(/The minimum number of instances allowed in the Amazon EC2 Auto Scaling group cannot be lower than 0, given -1/);
    });

    test('with incorrect maxSize', () => {
      expect(() => new gamelift.GameServerGroup(stack, 'MyGameServerGroup', {
        instanceDefinitions: [{
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
        }],
        vpc: vpc,
        launchTemplate: launchTemplate,
        gameServerGroupName: 'test-name',
        maxSize: -1,
      })).toThrow(/The maximum number of instances allowed in the Amazon EC2 Auto Scaling group cannot be lower than 1, given -1/);
    });
  });

  describe('test import methods', () => {
    let stack: cdk.Stack;
    const gameServerGroupName = 'test-gameservergroup-name';
    const gameServerGroupArn = `arn:aws:gamelift:test-region:123456789012:gameservergroup/${gameServerGroupName}`;
    const autoScalingGroupArn = 'arn:aws:autoscaling:test-region:123456789012:autoScalingGroup:test-uuid:autoScalingGroupName/test-name';

    beforeEach(() => {
      const app = new cdk.App();
      stack = new cdk.Stack(app, 'Base', {
        env: { account: '111111111111', region: 'stack-region' },
      });
    });

    test('with required attrs only', () => {
      const importedFleet = gamelift.GameServerGroup.fromGameServerGroupAttributes(stack, 'ImportedScript', { gameServerGroupArn, autoScalingGroupArn });

      expect(importedFleet.autoScalingGroupArn).toEqual(autoScalingGroupArn);
      expect(importedFleet.gameServerGroupArn).toEqual(gameServerGroupArn);
      expect(importedFleet.gameServerGroupName).toEqual(gameServerGroupName);
      expect(importedFleet.env.account).toEqual('123456789012');
      expect(importedFleet.env.region).toEqual('test-region');
      expect(importedFleet.grantPrincipal).toEqual(new iam.UnknownPrincipal({ resource: importedFleet }));
    });

    test('with all attrs', () => {
      const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/TestRole');
      const importedFleet = gamelift.GameServerGroup.fromGameServerGroupAttributes(stack, 'ImportedScript', { gameServerGroupArn, autoScalingGroupArn, role });

      expect(importedFleet.autoScalingGroupArn).toEqual(autoScalingGroupArn);
      expect(importedFleet.gameServerGroupArn).toEqual(gameServerGroupArn);
      expect(importedFleet.gameServerGroupName).toEqual(gameServerGroupName);
      expect(importedFleet.grantPrincipal).toEqual(role);
    });

    test('with missing attrs', () => {
      const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/TestRole');
      expect(() => gamelift.GameServerGroup.fromGameServerGroupAttributes(stack, 'ImportedScript', { role, autoScalingGroupArn }))
        .toThrow(/Either gameServerGroupName or gameServerGroupArn must be provided in GameServerGroupAttributes/);
    });

    test('with invalid ARN', () => {
      expect(() => gamelift.GameServerGroup.fromGameServerGroupAttributes(stack, 'ImportedScript', { autoScalingGroupArn, gameServerGroupArn: 'arn:aws:gamelift:test-region:123456789012:gameservergroup' }))
        .toThrow(/No game server group name found in ARN: 'arn:aws:gamelift:test-region:123456789012:gameservergroup'/);
    });

    test("the gameServerGroup's region is taken from the ARN", () => {
      const importedFleet = gamelift.GameServerGroup.fromGameServerGroupAttributes(stack, 'ImportedScript', { gameServerGroupArn, autoScalingGroupArn });
      expect(importedFleet.env.region).toBe('test-region');
    });

    test("the gameServerGroup's account is taken from the ARN", () => {
      const importedFleet = gamelift.GameServerGroup.fromGameServerGroupAttributes(stack, 'ImportedScript', { gameServerGroupArn, autoScalingGroupArn });
      expect(importedFleet.env.account).toBe('123456789012');
    });
  });

  describe('metric methods provide a Metric with configured and attached properties', () => {
    let stack: cdk.Stack;
    let vpc: ec2.Vpc;
    let launchTemplate: ec2.LaunchTemplate;
    let gameServerGroup: gamelift.GameServerGroup;

    beforeEach(() => {
      stack = new cdk.Stack(undefined, undefined, { env: { account: '000000000000', region: 'us-west-1' } });
      vpc = new ec2.Vpc(stack, 'vpc');
      launchTemplate = new ec2.LaunchTemplate(stack, 'LaunchTemplte', {});
      gameServerGroup = new gamelift.GameServerGroup(stack, 'MyGameServerGroup', {
        instanceDefinitions: [{
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
        }],
        vpc: vpc,
        launchTemplate: launchTemplate,
        gameServerGroupName: 'test-gameservergroup-name',
      });
    });

    test('metric', () => {
      const metric = gameServerGroup.metric('AvailableGameServers');

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'AvailableGameServers',
        dimensions: {
          GameServerGroupArn: gameServerGroup.gameServerGroupArn,
        },
      });
    });
  });

  describe('granting access', () => {
    let stack: cdk.Stack;
    let vpc: ec2.Vpc;
    let launchTemplate: ec2.LaunchTemplate;
    let gameServerGroup: gamelift.GameServerGroup;
    let role: iam.Role;

    beforeEach(() => {
      stack = new cdk.Stack(undefined, undefined, { env: { account: '000000000000', region: 'us-west-1' } });
      vpc = new ec2.Vpc(stack, 'vpc');
      role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('gamelift.amazonaws.com'),
      });
      launchTemplate = new ec2.LaunchTemplate(stack, 'LaunchTemplte', {});
      gameServerGroup = new gamelift.GameServerGroup(stack, 'MyGameServerGroup', {
        instanceDefinitions: [{
          instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
        }],
        vpc: vpc,
        launchTemplate: launchTemplate,
        gameServerGroupName: 'test-gameservergroup-name',
        role: role,
      });
    });

    test('grant', () => {
      gameServerGroup.grant(role, 'gamelift:DescribeGameServerGroup');

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            Match.objectLike({
              Action: 'gamelift:DescribeGameServerGroup',
              Resource: stack.resolve(gameServerGroup.gameServerGroupArn),
            }),
          ],
        },
        Roles: [stack.resolve(role.roleName)],
      });
    });
  });
});

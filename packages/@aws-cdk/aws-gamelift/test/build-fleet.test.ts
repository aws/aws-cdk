import * as path from 'path';
import { Template, Match, Annotations } from '@aws-cdk/assertions';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as gamelift from '../lib';

describe('build fleet', () => {

  describe('new', () => {
    let stack: cdk.Stack;

    beforeEach(() => {
      stack = new cdk.Stack();
    });

    test('default build fleet', () => {
      new gamelift.BuildFleet(stack, 'MyBuildFleet', {
        fleetName: 'test-fleet',
        content: gamelift.Build.fromAsset(stack, 'Build', path.join(__dirname, 'my-game-build')),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
        runtimeConfiguration: {
          serverProcesses: [{
            launchPath: 'test-launch-path',
          }],
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument:
          {
            Statement:
              [{
                Action: 'sts:AssumeRole',
                Effect: 'Allow',
                Principal: { Service: 'gamelift.amazonaws.com' },
              }],
            Version: '2012-10-17',
          },
      });

      Template.fromStack(stack).hasResource('AWS::GameLift::Fleet', {
        Properties:
          {
            BuildId: { Ref: 'Build45A36621' },
            NewGameSessionProtectionPolicy: 'NoProtection',
            FleetType: 'ON_DEMAND',
            EC2InstanceType: 'c4.large',
            CertificateConfiguration: {
              CertificateType: 'DISABLED',
            },
            MaxSize: 1,
            MinSize: 0,
            RuntimeConfiguration: {
              ServerProcesses: [
                {
                  ConcurrentExecutions: 1,
                  LaunchPath: 'test-launch-path',
                },
              ],
            },
          },
      });
    });

    test('with an incorrect fleet name', () => {
      let incorrectFleetName = '';
      for (let i = 0; i < 1025; i++) {
        incorrectFleetName += 'A';
      }

      expect(() => new gamelift.BuildFleet(stack, 'MyBuildFleet', {
        fleetName: incorrectFleetName,
        content: gamelift.Build.fromAsset(stack, 'Build', path.join(__dirname, 'my-game-build')),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
        runtimeConfiguration: {
          serverProcesses: [{
            launchPath: 'test-launch-path',
          }],
        },
      })).toThrow(/Fleet name can not be longer than 1024 characters but has 1025 characters./);
    });

    test('with an incorrect description', () => {
      let incorrectDescription = '';
      for (let i = 0; i < 1025; i++) {
        incorrectDescription += 'A';
      }

      expect(() => new gamelift.BuildFleet(stack, 'MyBuildFleet', {
        fleetName: 'test-fleet',
        description: incorrectDescription,
        content: gamelift.Build.fromAsset(stack, 'Build', path.join(__dirname, 'my-game-build')),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
        runtimeConfiguration: {
          serverProcesses: [{
            launchPath: 'test-launch-path',
          }],
        },
      })).toThrow(/Fleet description can not be longer than 1024 characters but has 1025 characters./);
    });

    test('with an incorrect minSize value', () => {
      expect(() => new gamelift.BuildFleet(stack, 'MyBuildFleet', {
        fleetName: 'test-fleet',
        content: gamelift.Build.fromAsset(stack, 'Build', path.join(__dirname, 'my-game-build')),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
        runtimeConfiguration: {
          serverProcesses: [{
            launchPath: 'test-launch-path',
          }],
        },
        minSize: -1,
      })).toThrow(/The minimum number of instances allowed in the Fleet cannot be lower than 0, given -1/);
    });

    test('with an incorrect maxSize value', () => {
      expect(() => new gamelift.BuildFleet(stack, 'MyBuildFleet', {
        fleetName: 'test-fleet',
        content: gamelift.Build.fromAsset(stack, 'Build', path.join(__dirname, 'my-game-build')),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
        runtimeConfiguration: {
          serverProcesses: [{
            launchPath: 'test-launch-path',
          }],
        },
        maxSize: -1,
      })).toThrow(/The maximum number of instances allowed in the Fleet cannot be lower than 0, given -1/);
    });

    test('with too much locations from constructor', () => {
      let incorrectLocations: gamelift.Location[] = [];
      for (let i = 0; i < 101; i++) {
        incorrectLocations.push({
          region: 'eu-west-1',
        });
      }

      expect(() => new gamelift.BuildFleet(stack, 'MyBuildFleet', {
        fleetName: 'test-fleet',
        locations: incorrectLocations,
        content: gamelift.Build.fromAsset(stack, 'Build', path.join(__dirname, 'my-game-build')),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
        runtimeConfiguration: {
          serverProcesses: [{
            launchPath: 'test-launch-path',
          }],
        },
      })).toThrow(/No more than 100 locations are allowed per fleet, given 101/);
    });

    test('with too much locations', () => {
      let locations: gamelift.Location[] = [];
      for (let i = 0; i < 100; i++) {
        locations.push({
          region: 'eu-west-1',
        });
      }

      const fleet = new gamelift.BuildFleet(stack, 'MyBuildFleet', {
        fleetName: 'test-fleet',
        locations: locations,
        content: gamelift.Build.fromAsset(stack, 'Build', path.join(__dirname, 'my-game-build')),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
        runtimeConfiguration: {
          serverProcesses: [{
            launchPath: 'test-launch-path',
          }],
        },
      });

      expect(() => fleet.addLocation('eu-west-1')).toThrow(/No more than 100 locations are allowed per fleet/);
    });

    test('with too much ingress rules', () => {
      let incorrectIngressRules: gamelift.IngressRule[] = [];
      for (let i = 0; i < 51; i++) {
        incorrectIngressRules.push({
          source: gamelift.Peer.anyIpv4(),
          port: gamelift.Port.tcpRange(100, 200),
        });
      }

      expect(() => new gamelift.BuildFleet(stack, 'MyBuildFleet', {
        fleetName: 'test-fleet',
        ingressRules: incorrectIngressRules,
        content: gamelift.Build.fromAsset(stack, 'Build', path.join(__dirname, 'my-game-build')),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
        runtimeConfiguration: {
          serverProcesses: [{
            launchPath: 'test-launch-path',
          }],
        },
      })).toThrow(/No more than 50 ingress rules are allowed per fleet, given 51/);
    });
  });

  describe('test ingress rules', () => {
    let stack: cdk.Stack;
    let fleet: gamelift.BuildFleet;

    beforeEach(() => {
      stack = new cdk.Stack();
      fleet = new gamelift.BuildFleet(stack, 'MyBuildFleet', {
        fleetName: 'test-fleet',
        content: gamelift.Build.fromAsset(stack, 'Build', path.join(__dirname, 'my-game-build')),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
        runtimeConfiguration: {
          serverProcesses: [{
            launchPath: 'test-launch-path',
          }],
        },
      });
    });

    test('add single tcp port ingress rule', () => {
      // WHEN
      fleet.addIngressRule(gamelift.Peer.anyIpv4(), gamelift.Port.tcp(144));

      // THEN
      Template.fromStack(stack).hasResource('AWS::GameLift::Fleet', {
        Properties:
            {
              EC2InboundPermissions: [
                {
                  IpRange: '0.0.0.0/0',
                  FromPort: 144,
                  ToPort: 144,
                  Protocol: 'TCP',
                },
              ],
            },
      });
    });

    test('add tcp port range ingress rule', () => {
      // WHEN
      fleet.addIngressRule(gamelift.Peer.anyIpv4(), gamelift.Port.tcpRange(100, 200));

      // THEN
      Template.fromStack(stack).hasResource('AWS::GameLift::Fleet', {
        Properties:
            {

              EC2InboundPermissions: [
                {
                  IpRange: '0.0.0.0/0',
                  FromPort: 100,
                  ToPort: 200,
                  Protocol: 'TCP',
                },
              ],
            },
      });
    });

    test('add single udp port ingress rule', () => {
      // WHEN
      fleet.addIngressRule(gamelift.Peer.anyIpv4(), gamelift.Port.udp(144));

      // THEN
      Template.fromStack(stack).hasResource('AWS::GameLift::Fleet', {
        Properties:
            {

              EC2InboundPermissions: [
                {
                  IpRange: '0.0.0.0/0',
                  FromPort: 144,
                  ToPort: 144,
                  Protocol: 'UDP',
                },
              ],

            },
      });
    });

    test('add udp port range ingress rule', () => {
      // WHEN
      fleet.addIngressRule(gamelift.Peer.anyIpv4(), gamelift.Port.udpRange(100, 200));

      // THEN
      Template.fromStack(stack).hasResource('AWS::GameLift::Fleet', {
        Properties:
            {

              EC2InboundPermissions: [
                {
                  IpRange: '0.0.0.0/0',
                  FromPort: 100,
                  ToPort: 200,
                  Protocol: 'UDP',
                },
              ],

            },
      });
    });

    test('add all tcp ingress rule', () => {
      // WHEN
      fleet.addIngressRule(gamelift.Peer.ipv4('1.2.3.4/5'), gamelift.Port.allTcp());

      // THEN
      Template.fromStack(stack).hasResource('AWS::GameLift::Fleet', {
        Properties:
            {

              EC2InboundPermissions: [
                {
                  IpRange: '1.2.3.4/5',
                  FromPort: 1026,
                  ToPort: 60000,
                  Protocol: 'TCP',
                },
              ],

            },
      });
    });

    test('add all udp ingress rule', () => {
      // WHEN
      fleet.addIngressRule(gamelift.Peer.ipv4('1.2.3.4/5'), gamelift.Port.allUdp());

      // THEN
      Template.fromStack(stack).hasResource('AWS::GameLift::Fleet', {
        Properties:
            {

              EC2InboundPermissions: [
                {
                  IpRange: '1.2.3.4/5',
                  FromPort: 1026,
                  ToPort: 60000,
                  Protocol: 'UDP',
                },
              ],

            },
      });
    });

    test('add invalid IPv4 CIDR address', () => {
      // WHEN
      expect(() => fleet.addIngressRule(gamelift.Peer.ipv4('1.2.3/23'), gamelift.Port.tcp(144)))
        .toThrowError('Invalid IPv4 CIDR: \"1.2.3/23\"');
    });

    test('add IPv4 CIDR address without mask', () => {
      // WHEN
      expect(() => fleet.addIngressRule(gamelift.Peer.ipv4('1.2.3.4'), gamelift.Port.tcp(144)))
        .toThrowError('CIDR mask is missing in IPv4: \"1.2.3.4\". Did you mean \"1.2.3.4/32\"?');
    });

    test('add too much ingress rules', () => {
      for (let i = 0; i < 50; i++) {
        fleet.addIngressRule(gamelift.Peer.anyIpv4(), gamelift.Port.tcpRange(100, 200));
      }
      expect(() => fleet.addIngressRule(gamelift.Peer.anyIpv4(), gamelift.Port.tcp(144)))
        .toThrowError('No more than 50 ingress rules are allowed per fleet');
    });

  });

  describe('add locations', () => {
    let stack: cdk.Stack;
    let fleet: gamelift.BuildFleet;

    beforeEach(() => {
      stack = new cdk.Stack();
      fleet = new gamelift.BuildFleet(stack, 'MyBuildFleet', {
        fleetName: 'test-fleet',
        content: gamelift.Build.fromAsset(stack, 'Build', path.join(__dirname, 'my-game-build')),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
        runtimeConfiguration: {
          serverProcesses: [{
            launchPath: 'test-launch-path',
          }],
        },
      });
    });

    test('add new location', () => {
      // Add a new location
      fleet.addLocation('eu-west-1');

      Template.fromStack(stack).hasResource('AWS::GameLift::Fleet', {
        Properties:
              {
                Locations: [{
                  Location: 'eu-west-1',
                }],
              },
      });
    });

    test('add new location with capacity', () => {
      // Add a new location
      fleet.addLocation('eu-west-1', 3, 1, 4);

      Template.fromStack(stack).hasResource('AWS::GameLift::Fleet', {
        Properties:
                {
                  Locations: [{
                    Location: 'eu-west-1',
                    LocationCapacity: {
                      DesiredEC2Instances: 3,
                      MinSize: 1,
                      MaxSize: 4,
                    },
                  }],
                },
      });
    });
  });

  describe('test import methods', () => {
    test('BuildFleet.fromBuildFleetArn', () => {
      // GIVEN
      const stack2 = new cdk.Stack();

      // WHEN
      const imported = gamelift.BuildFleet.fromBuildFleetArn(stack2, 'Imported', 'arn:aws:gamelift:us-east-1:123456789012:fleet/sample-fleet-id');

      // THEN
      expect(imported.fleetArn).toEqual('arn:aws:gamelift:us-east-1:123456789012:fleet/sample-fleet-id');
      expect(imported.fleetId).toEqual('sample-fleet-id');
      expect(imported.grantPrincipal).toEqual(new iam.UnknownPrincipal({ resource: imported }));
    });

    test('BuildFleet.fromFleetId', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const imported = gamelift.BuildFleet.fromBuildFleetId(stack, 'Imported', 'sample-fleet-id');

      // THEN
      expect(stack.resolve(imported.fleetArn)).toStrictEqual({
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':gamelift:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':fleet/sample-fleet-id',
        ]],
      });
      expect(stack.resolve(imported.fleetId)).toStrictEqual('sample-fleet-id');
      expect(imported.grantPrincipal).toEqual(new iam.UnknownPrincipal({ resource: imported }));
    });
  });

  test('grant provides access to fleet', () => {
    const stack = new cdk.Stack();

    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    const fleet = new gamelift.BuildFleet(stack, 'MyBuildFleet', {
      fleetName: 'test-fleet',
      content: gamelift.Build.fromAsset(stack, 'Build', path.join(__dirname, 'my-game-build')),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
      runtimeConfiguration: {
        serverProcesses: [{
          launchPath: 'test-launch-path',
        }],
      },
      role: role,
    });

    fleet.grant(role, 'gamelift:ListFleets');

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          Match.objectLike({
            Action: 'gamelift:ListFleets',
            Resource: stack.resolve(fleet.fleetArn),
          }),
        ],
      },
      Roles: [stack.resolve(role.roleName)],
    });
  });

  describe('metric methods provide a Metric with configured and attached properties', () => {
    let stack: cdk.Stack;
    let fleet: gamelift.BuildFleet;

    beforeEach(() => {
      stack = new cdk.Stack(undefined, undefined, { env: { account: '000000000000', region: 'us-west-1' } });
      fleet = new gamelift.BuildFleet(stack, 'MyBuildFleet', {
        fleetName: 'test-fleet',
        content: gamelift.Build.fromAsset(stack, 'Build', path.join(__dirname, 'my-game-build')),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
        runtimeConfiguration: {
          serverProcesses: [{
            launchPath: 'test-launch-path',
          }],
        },
      });
    });

    test('metric', () => {
      const metric = fleet.metric('ActiveInstances');

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'ActiveInstances',
        dimensions: {
          FleetId: fleet.fleetId,
        },
      });
    });

    test('metricActiveInstances', () => {
      const metric = fleet.metricActiveInstances();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'ActiveInstances',
        statistic: cloudwatch.Statistic.AVERAGE,
        dimensions: {
          FleetId: fleet.fleetId,
        },
      });
    });

    test('metricPercentIdleInstances', () => {
      const metric = fleet.metricPercentIdleInstances();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'PercentIdleInstances',
        statistic: cloudwatch.Statistic.AVERAGE,
        dimensions: {
          FleetId: fleet.fleetId,
        },
      });
    });

    test('metricDesiredInstances', () => {
      const metric = fleet.metricDesiredInstances();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'DesiredInstances',
        statistic: cloudwatch.Statistic.AVERAGE,
        dimensions: {
          FleetId: fleet.fleetId,
        },
      });
    });

    test('metricIdleInstances', () => {
      const metric = fleet.metricIdleInstances();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'IdleInstances',
        statistic: cloudwatch.Statistic.AVERAGE,
        dimensions: {
          FleetId: fleet.fleetId,
        },
      });
    });

    test('metricInstanceInterruptions', () => {
      const metric = fleet.metricInstanceInterruptions();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'InstanceInterruptions',
        statistic: cloudwatch.Statistic.SUM,
        dimensions: {
          FleetId: fleet.fleetId,
        },
      });
    });

    test('metricMaxInstances', () => {
      const metric = fleet.metricMaxInstances();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'MaxInstances',
        statistic: cloudwatch.Statistic.AVERAGE,
        dimensions: {
          FleetId: fleet.fleetId,
        },
      });
    });

    test('metricMinInstances', () => {
      const metric = fleet.metricMinInstances();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'MinInstances',
        statistic: cloudwatch.Statistic.AVERAGE,
        dimensions: {
          FleetId: fleet.fleetId,
        },
      });
    });
  });

  describe('test vpc peering', () => {
    let warningMessage: string;

    beforeEach(() => {
      warningMessage = 'To authorize the VPC peering, call the GameLift service API';
    });

    test('add vpc peering', () => {
      const stack = new cdk.Stack();

      const vpc = new ec2.Vpc(stack, 'Vpc');

      new gamelift.BuildFleet(stack, 'MyBuildFleet', {
        fleetName: 'test-fleet',
        content: gamelift.Build.fromAsset(stack, 'Build', path.join(__dirname, 'my-game-build')),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
        runtimeConfiguration: {
          serverProcesses: [{
            launchPath: 'test-launch-path',
          }],
        },
        peerVpc: vpc,
      });

      Template.fromStack(stack).hasResource('AWS::GameLift::Fleet', {
        Properties:
            {
              PeerVpcAwsAccountId: { Ref: 'AWS::AccountId' },
              PeerVpcId: { Ref: 'Vpc8378EB38' },
            },
      });
    });

    test('check warning message', () => {
      const stack = new cdk.Stack();

      const vpc = new ec2.Vpc(stack, 'Vpc');

      new gamelift.BuildFleet(stack, 'MyBuildFleet', {
        fleetName: 'test-fleet',
        content: gamelift.Build.fromAsset(stack, 'Build', path.join(__dirname, 'my-game-build')),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
        runtimeConfiguration: {
          serverProcesses: [{
            launchPath: 'test-launch-path',
          }],
        },
        peerVpc: vpc,
      });
      Annotations.fromStack(stack).hasWarning('/Default/MyBuildFleet', Match.stringLikeRegexp(warningMessage));
    });
  });


});
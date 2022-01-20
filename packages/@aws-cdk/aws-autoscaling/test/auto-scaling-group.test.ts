import '@aws-cdk/assert-internal/jest';
import { ABSENT, InspectionFailure, ResourcePart } from '@aws-cdk/assert-internal';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cdk from '@aws-cdk/core';
import * as autoscaling from '../lib';

/* eslint-disable quote-props */

describe('auto scaling group', () => {
  test('default fleet', () => {
    const stack = getTestStack();
    const vpc = mockVpc(stack);

    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
    });

    expect(stack).toMatchTemplate({
      'Parameters': {
        'SsmParameterValueawsserviceamiamazonlinuxlatestamznamihvmx8664gp2C96584B6F00A464EAD1953AFF4B05118Parameter': {
          'Type': 'AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>',
          'Default': '/aws/service/ami-amazon-linux-latest/amzn-ami-hvm-x86_64-gp2',
        },
      },
      'Resources': {
        'MyFleetInstanceSecurityGroup774E8234': {
          'Type': 'AWS::EC2::SecurityGroup',
          'Properties': {
            'GroupDescription': 'TestStack/MyFleet/InstanceSecurityGroup',
            'SecurityGroupEgress': [
              {
                'CidrIp': '0.0.0.0/0',
                'Description': 'Allow all outbound traffic by default',
                'IpProtocol': '-1',
              },
            ],
            'Tags': [
              {
                'Key': 'Name',
                'Value': 'TestStack/MyFleet',
              },
            ],

            'VpcId': 'my-vpc',
          },
        },
        'MyFleetInstanceRole25A84AB8': {
          'Type': 'AWS::IAM::Role',
          'Properties': {
            'AssumeRolePolicyDocument': {
              'Statement': [
                {
                  'Action': 'sts:AssumeRole',
                  'Effect': 'Allow',
                  'Principal': {
                    'Service': 'ec2.amazonaws.com',
                  },
                },
              ],
              'Version': '2012-10-17',
            },
            'Tags': [
              {
                'Key': 'Name',
                'Value': 'TestStack/MyFleet',
              },
            ],
          },
        },
        'MyFleetInstanceProfile70A58496': {
          'Type': 'AWS::IAM::InstanceProfile',
          'Properties': {
            'Roles': [
              {
                'Ref': 'MyFleetInstanceRole25A84AB8',
              },
            ],
          },
        },
        'MyFleetLaunchConfig5D7F9801': {
          'Type': 'AWS::AutoScaling::LaunchConfiguration',
          'Properties': {
            'IamInstanceProfile': {
              'Ref': 'MyFleetInstanceProfile70A58496',
            },
            'ImageId': { 'Ref': 'SsmParameterValueawsserviceamiamazonlinuxlatestamznamihvmx8664gp2C96584B6F00A464EAD1953AFF4B05118Parameter' },
            'InstanceType': 'm4.micro',
            'SecurityGroups': [
              {
                'Fn::GetAtt': [
                  'MyFleetInstanceSecurityGroup774E8234',
                  'GroupId',
                ],
              },
            ],
            'UserData': {
              'Fn::Base64': '#!/bin/bash',
            },
          },
          'DependsOn': [
            'MyFleetInstanceRole25A84AB8',
          ],
        },
        'MyFleetASG88E55886': {
          'Type': 'AWS::AutoScaling::AutoScalingGroup',
          'UpdatePolicy': {
            'AutoScalingScheduledAction': {
              'IgnoreUnmodifiedGroupSizeProperties': true,
            },
          },
          'Properties': {
            'LaunchConfigurationName': {
              'Ref': 'MyFleetLaunchConfig5D7F9801',
            },
            'Tags': [
              {
                'Key': 'Name',
                'PropagateAtLaunch': true,
                'Value': 'TestStack/MyFleet',
              },
            ],

            'MaxSize': '1',
            'MinSize': '1',
            'VPCZoneIdentifier': [
              'pri1',
            ],
          },
        },
      },
    });


  });

  test('can set minCapacity, maxCapacity, desiredCapacity to 0', () => {
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
    const vpc = mockVpc(stack);

    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      minCapacity: 0,
      maxCapacity: 0,
      desiredCapacity: 0,
    });

    expect(stack).toHaveResource('AWS::AutoScaling::AutoScalingGroup', {
      MinSize: '0',
      MaxSize: '0',
      DesiredCapacity: '0',
    },
    );


  });

  test('validation is not performed when using Tokens', () => {
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
    const vpc = mockVpc(stack);

    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      minCapacity: cdk.Lazy.number({ produce: () => 5 }),
      maxCapacity: cdk.Lazy.number({ produce: () => 1 }),
      desiredCapacity: cdk.Lazy.number({ produce: () => 20 }),
    });

    // THEN: no exception
    expect(stack).toHaveResource('AWS::AutoScaling::AutoScalingGroup', {
      MinSize: '5',
      MaxSize: '1',
      DesiredCapacity: '20',
    },
    );


  });

  test('userdata can be overridden by image', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    const ud = ec2.UserData.forLinux();
    ud.addCommands('it me!');

    // WHEN
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage({
        userData: ud,
      }),
      vpc,
    });

    // THEN
    expect(asg.userData.render()).toEqual('#!/bin/bash\nit me!');


  });

  test('userdata can be overridden at ASG directly', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    const ud1 = ec2.UserData.forLinux();
    ud1.addCommands('it me!');

    const ud2 = ec2.UserData.forLinux();
    ud2.addCommands('no me!');

    // WHEN
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage({
        userData: ud1,
      }),
      vpc,
      userData: ud2,
    });

    // THEN
    expect(asg.userData.render()).toEqual('#!/bin/bash\nno me!');


  });

  test('can specify only min capacity', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      minCapacity: 10,
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::AutoScalingGroup', {
      MinSize: '10',
      MaxSize: '10',
    },
    );


  });

  test('can specify only max capacity', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      maxCapacity: 10,
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::AutoScalingGroup', {
      MinSize: '1',
      MaxSize: '10',
    },
    );


  });

  test('can specify only desiredCount', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      desiredCapacity: 10,
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::AutoScalingGroup', {
      MinSize: '1',
      MaxSize: '10',
      DesiredCapacity: '10',
    },
    );


  });

  test('addToRolePolicy can be used to add statements to the role policy', () => {
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
    const vpc = mockVpc(stack);

    const fleet = new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
    });

    fleet.addToRolePolicy(new iam.PolicyStatement({
      actions: ['test:SpecialName'],
      resources: ['*'],
    }));

    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'test:SpecialName',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    });

  });

  testDeprecated('can configure replacing update', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      updateType: autoscaling.UpdateType.REPLACING_UPDATE,
      replacingUpdateMinSuccessfulInstancesPercent: 50,
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AutoScaling::AutoScalingGroup', {
      UpdatePolicy: {
        AutoScalingReplacingUpdate: {
          WillReplace: true,
        },
      },
      CreationPolicy: {
        AutoScalingCreationPolicy: {
          MinSuccessfulInstancesPercent: 50,
        },
      },
    }, ResourcePart.CompleteDefinition);


  });

  testDeprecated('can configure rolling update', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      updateType: autoscaling.UpdateType.ROLLING_UPDATE,
      rollingUpdateConfiguration: {
        minSuccessfulInstancesPercent: 50,
        pauseTime: cdk.Duration.seconds(345),
      },
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AutoScaling::AutoScalingGroup', {
      UpdatePolicy: {
        'AutoScalingRollingUpdate': {
          'MinSuccessfulInstancesPercent': 50,
          'WaitOnResourceSignals': true,
          'PauseTime': 'PT5M45S',
          'SuspendProcesses': ['HealthCheck', 'ReplaceUnhealthy', 'AZRebalance', 'AlarmNotification', 'ScheduledActions'],
        },
      },
    }, ResourcePart.CompleteDefinition);


  });

  testDeprecated('can configure resource signals', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      resourceSignalCount: 5,
      resourceSignalTimeout: cdk.Duration.seconds(666),
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AutoScaling::AutoScalingGroup', {
      CreationPolicy: {
        ResourceSignal: {
          Count: 5,
          Timeout: 'PT11M6S',
        },
      },
    }, ResourcePart.CompleteDefinition);


  });

  test('can configure EC2 health check', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      healthCheck: autoscaling.HealthCheck.ec2(),
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AutoScaling::AutoScalingGroup', {
      HealthCheckType: 'EC2',
    });


  });

  test('can configure EBS health check', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      healthCheck: autoscaling.HealthCheck.elb({ grace: cdk.Duration.minutes(15) }),
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AutoScaling::AutoScalingGroup', {
      HealthCheckType: 'ELB',
      HealthCheckGracePeriod: 900,
    });


  });

  test('can add Security Group to Fleet', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
    const vpc = mockVpc(stack);

    // WHEN
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
    });
    asg.addSecurityGroup(mockSecurityGroup(stack));
    expect(stack).toHaveResource('AWS::AutoScaling::LaunchConfiguration', {
      SecurityGroups: [
        {
          'Fn::GetAtt': [
            'MyFleetInstanceSecurityGroup774E8234',
            'GroupId',
          ],
        },
        'most-secure',
      ],
    });

  });

  test('can set tags', () => {
    // GIVEN
    const stack = getTestStack();
    // new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' }});
    const vpc = mockVpc(stack);

    // WHEN
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      updatePolicy: autoscaling.UpdatePolicy.rollingUpdate(),
    });

    cdk.Tags.of(asg).add('superfood', 'acai');
    cdk.Tags.of(asg).add('notsuper', 'caramel', { applyToLaunchedInstances: false });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::AutoScalingGroup', {
      Tags: [
        {
          Key: 'Name',
          PropagateAtLaunch: true,
          Value: 'TestStack/MyFleet',
        },
        {
          Key: 'notsuper',
          PropagateAtLaunch: false,
          Value: 'caramel',
        },
        {
          Key: 'superfood',
          PropagateAtLaunch: true,
          Value: 'acai',
        },
      ],
    });

  });

  test('allows setting spot price', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyStack', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,

      spotPrice: '0.05',
    });

    // THEN
    expect(asg.spotPrice).toEqual('0.05');
    expect(stack).toHaveResource('AWS::AutoScaling::LaunchConfiguration', {
      SpotPrice: '0.05',
    });


  });

  test('allows association of public IP address', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyStack', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      minCapacity: 0,
      maxCapacity: 0,
      desiredCapacity: 0,

      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      associatePublicIpAddress: true,
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::LaunchConfiguration', {
      AssociatePublicIpAddress: true,
    },
    );

  });

  test('association of public IP address requires public subnet', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    expect(() => {
      new autoscaling.AutoScalingGroup(stack, 'MyStack', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
        machineImage: new ec2.AmazonLinuxImage(),
        vpc,
        minCapacity: 0,
        maxCapacity: 0,
        desiredCapacity: 0,
        associatePublicIpAddress: true,
      });
    }).toThrow();

  });

  test('allows disassociation of public IP address', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyStack', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      minCapacity: 0,
      maxCapacity: 0,
      desiredCapacity: 0,
      associatePublicIpAddress: false,
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::LaunchConfiguration', {
      AssociatePublicIpAddress: false,
    },
    );

  });

  test('does not specify public IP address association by default', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyStack', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      minCapacity: 0,
      maxCapacity: 0,
      desiredCapacity: 0,
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::LaunchConfiguration', (resource: any, errors: InspectionFailure) => {
      for (const key of Object.keys(resource)) {
        if (key === 'AssociatePublicIpAddress') {
          errors.failureReason = 'Has AssociatePublicIpAddress';
          return false;
        }
      }
      return true;
    });

  });

  test('an existing security group can be specified instead of auto-created', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);
    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(stack, 'MySG', 'most-secure');

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyASG', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      securityGroup,
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::LaunchConfiguration', {
      SecurityGroups: ['most-secure'],
    },
    );

  });

  test('an existing role can be specified instead of auto-created', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);
    const importedRole = iam.Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/HelloDude');

    // WHEN
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyASG', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      role: importedRole,
    });

    // THEN
    expect(asg.role).toEqual(importedRole);
    expect(stack).toHaveResource('AWS::IAM::InstanceProfile', {
      'Roles': ['HelloDude'],
    });

  });

  test('defaultChild is available on an ASG', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyStack', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
    });

    // THEN
    expect(asg.node.defaultChild instanceof autoscaling.CfnAutoScalingGroup).toEqual(true);


  });

  test('can set blockDeviceMappings', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);
    new autoscaling.AutoScalingGroup(stack, 'MyStack', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      blockDevices: [{
        deviceName: 'ebs',
        mappingEnabled: true,
        volume: autoscaling.BlockDeviceVolume.ebs(15, {
          deleteOnTermination: true,
          encrypted: true,
          volumeType: autoscaling.EbsDeviceVolumeType.IO1,
          iops: 5000,
        }),
      }, {
        deviceName: 'ebs-snapshot',
        volume: autoscaling.BlockDeviceVolume.ebsFromSnapshot('snapshot-id', {
          volumeSize: 500,
          deleteOnTermination: false,
          volumeType: autoscaling.EbsDeviceVolumeType.SC1,
        }),
      }, {
        deviceName: 'ephemeral',
        volume: autoscaling.BlockDeviceVolume.ephemeral(0),
      }, {
        deviceName: 'disabled',
        volume: autoscaling.BlockDeviceVolume.ephemeral(1),
        mappingEnabled: false,
      }, {
        deviceName: 'none',
        volume: autoscaling.BlockDeviceVolume.noDevice(),
      }],
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::LaunchConfiguration', {
      BlockDeviceMappings: [
        {
          DeviceName: 'ebs',
          Ebs: {
            DeleteOnTermination: true,
            Encrypted: true,
            Iops: 5000,
            VolumeSize: 15,
            VolumeType: 'io1',
          },
          NoDevice: ABSENT,
        },
        {
          DeviceName: 'ebs-snapshot',
          Ebs: {
            DeleteOnTermination: false,
            SnapshotId: 'snapshot-id',
            VolumeSize: 500,
            VolumeType: 'sc1',
          },
          NoDevice: ABSENT,
        },
        {
          DeviceName: 'ephemeral',
          VirtualName: 'ephemeral0',
          NoDevice: ABSENT,
        },
        {
          DeviceName: 'disabled',
          NoDevice: true,
        },
        {
          DeviceName: 'none',
          NoDevice: true,
        },
      ],
    });


  });

  test('can configure maxInstanceLifetime', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);
    new autoscaling.AutoScalingGroup(stack, 'MyStack', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      maxInstanceLifetime: cdk.Duration.days(7),
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::AutoScalingGroup', {
      'MaxInstanceLifetime': 604800,
    });


  });

  test('throws if maxInstanceLifetime < 7 days', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // THEN
    expect(() => {
      new autoscaling.AutoScalingGroup(stack, 'MyStack', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
        machineImage: new ec2.AmazonLinuxImage(),
        vpc,
        maxInstanceLifetime: cdk.Duration.days(6),
      });
    }).toThrow(/maxInstanceLifetime must be between 7 and 365 days \(inclusive\)/);


  });

  test('throws if maxInstanceLifetime > 365 days', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // THEN
    expect(() => {
      new autoscaling.AutoScalingGroup(stack, 'MyStack', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
        machineImage: new ec2.AmazonLinuxImage(),
        vpc,
        maxInstanceLifetime: cdk.Duration.days(366),
      });
    }).toThrow(/maxInstanceLifetime must be between 7 and 365 days \(inclusive\)/);


  });

  test('can configure instance monitoring', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyStack', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      instanceMonitoring: autoscaling.Monitoring.BASIC,
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::LaunchConfiguration', {
      InstanceMonitoring: false,
    });

  });

  test('instance monitoring defaults to absent', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyStack', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::LaunchConfiguration', {
      InstanceMonitoring: ABSENT,
    });

  });

  test('throws if ephemeral volumeIndex < 0', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // THEN
    expect(() => {
      new autoscaling.AutoScalingGroup(stack, 'MyStack', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
        machineImage: new ec2.AmazonLinuxImage(),
        vpc,
        blockDevices: [{
          deviceName: 'ephemeral',
          volume: autoscaling.BlockDeviceVolume.ephemeral(-1),
        }],
      });
    }).toThrow(/volumeIndex must be a number starting from 0/);


  });

  test('throws if volumeType === IO1 without iops', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // THEN
    expect(() => {
      new autoscaling.AutoScalingGroup(stack, 'MyStack', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
        machineImage: new ec2.AmazonLinuxImage(),
        vpc,
        blockDevices: [{
          deviceName: 'ebs',
          volume: autoscaling.BlockDeviceVolume.ebs(15, {
            deleteOnTermination: true,
            encrypted: true,
            volumeType: autoscaling.EbsDeviceVolumeType.IO1,
          }),
        }],
      });
    }).toThrow(/ops property is required with volumeType: EbsDeviceVolumeType.IO1/);


  });

  test('warning if iops without volumeType', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    const asg = new autoscaling.AutoScalingGroup(stack, 'MyStack', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      blockDevices: [{
        deviceName: 'ebs',
        volume: autoscaling.BlockDeviceVolume.ebs(15, {
          deleteOnTermination: true,
          encrypted: true,
          iops: 5000,
        }),
      }],
    });

    // THEN
    expect(asg.node.metadataEntry[0].type).toEqual(cxschema.ArtifactMetadataEntryType.WARN);
    expect(asg.node.metadataEntry[0].data).toEqual('iops will be ignored without volumeType: EbsDeviceVolumeType.IO1');


  });

  test('warning if iops and volumeType !== IO1', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    const asg = new autoscaling.AutoScalingGroup(stack, 'MyStack', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      blockDevices: [{
        deviceName: 'ebs',
        volume: autoscaling.BlockDeviceVolume.ebs(15, {
          deleteOnTermination: true,
          encrypted: true,
          volumeType: autoscaling.EbsDeviceVolumeType.GP2,
          iops: 5000,
        }),
      }],
    });

    // THEN
    expect(asg.node.metadataEntry[0].type).toEqual(cxschema.ArtifactMetadataEntryType.WARN);
    expect(asg.node.metadataEntry[0].data).toEqual('iops will be ignored without volumeType: EbsDeviceVolumeType.IO1');


  });

  test('step scaling on metric', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyStack', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
    });

    // WHEN
    asg.scaleOnMetric('Metric', {
      metric: new cloudwatch.Metric({
        namespace: 'Test',
        metricName: 'Metric',
      }),
      adjustmentType: autoscaling.AdjustmentType.CHANGE_IN_CAPACITY,
      scalingSteps: [
        { change: -1, lower: 0, upper: 49 },
        { change: 0, lower: 50, upper: 99 },
        { change: 1, lower: 100 },
      ],
    });

    // THEN
    expect(stack).toHaveResource('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'LessThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      MetricName: 'Metric',
      Namespace: 'Test',
      Period: 300,
    });


  });

  test('step scaling on MathExpression', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyStack', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
    });

    // WHEN
    asg.scaleOnMetric('Metric', {
      metric: new cloudwatch.MathExpression({
        expression: 'a',
        usingMetrics: {
          a: new cloudwatch.Metric({
            namespace: 'Test',
            metricName: 'Metric',
          }),
        },
      }),
      adjustmentType: autoscaling.AdjustmentType.CHANGE_IN_CAPACITY,
      scalingSteps: [
        { change: -1, lower: 0, upper: 49 },
        { change: 0, lower: 50, upper: 99 },
        { change: 1, lower: 100 },
      ],
    });

    // THEN
    expect(stack).not.toHaveResource('AWS::CloudWatch::Alarm', {
      Period: 60,
    });

    expect(stack).toHaveResource('AWS::CloudWatch::Alarm', {
      'ComparisonOperator': 'LessThanOrEqualToThreshold',
      'EvaluationPeriods': 1,
      'Metrics': [
        {
          'Expression': 'a',
          'Id': 'expr_1',
        },
        {
          'Id': 'a',
          'MetricStat': {
            'Metric': {
              'MetricName': 'Metric',
              'Namespace': 'Test',
            },
            'Period': 300,
            'Stat': 'Average',
          },
          'ReturnData': false,
        },
      ],
      'Threshold': 49,
    });


  });

  test('test GroupMetrics.all(), adds a single MetricsCollection with no Metrics specified', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);
    // When
    new autoscaling.AutoScalingGroup(stack, 'ASG', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      groupMetrics: [autoscaling.GroupMetrics.all()],
    });

    // Then
    expect(stack).toHaveResource('AWS::AutoScaling::AutoScalingGroup', {
      MetricsCollection: [
        {
          Granularity: '1Minute',
          Metrics: ABSENT,
        },
      ],
    });

  });

  test('test can specify a subset of group metrics', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'ASG', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      groupMetrics: [
        new autoscaling.GroupMetrics(autoscaling.GroupMetric.MIN_SIZE,
          autoscaling.GroupMetric.MAX_SIZE,
          autoscaling.GroupMetric.DESIRED_CAPACITY,
          autoscaling.GroupMetric.IN_SERVICE_INSTANCES),
        new autoscaling.GroupMetrics(autoscaling.GroupMetric.PENDING_INSTANCES,
          autoscaling.GroupMetric.STANDBY_INSTANCES,
          autoscaling.GroupMetric.TOTAL_INSTANCES,
          autoscaling.GroupMetric.TERMINATING_INSTANCES,
        ),
      ],
      vpc,
    });

    // Then
    expect(stack).toHaveResource('AWS::AutoScaling::AutoScalingGroup', {
      MetricsCollection: [
        {
          Granularity: '1Minute',
          Metrics: ['GroupMinSize', 'GroupMaxSize', 'GroupDesiredCapacity', 'GroupInServiceInstances'],
        }, {
          Granularity: '1Minute',
          Metrics: ['GroupPendingInstances', 'GroupStandbyInstances', 'GroupTotalInstances', 'GroupTerminatingInstances'],
        },
      ],
    });

  });

  test('test deduplication of group metrics ', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);
    new autoscaling.AutoScalingGroup(stack, 'ASG', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      groupMetrics: [new autoscaling.GroupMetrics(autoscaling.GroupMetric.MIN_SIZE,
        autoscaling.GroupMetric.MAX_SIZE,
        autoscaling.GroupMetric.MAX_SIZE,
        autoscaling.GroupMetric.MIN_SIZE,
      )],
    });

    // Then
    expect(stack).toHaveResource('AWS::AutoScaling::AutoScalingGroup', {
      MetricsCollection: [
        {
          Granularity: '1Minute',
          Metrics: ['GroupMinSize', 'GroupMaxSize'],
        },
      ],
    });

  });

  test('allow configuring notifications', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);
    const topic = new sns.Topic(stack, 'MyTopic');

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyASG', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      notifications: [
        {
          topic,
          scalingEvents: autoscaling.ScalingEvents.ERRORS,
        },
        {
          topic,
          scalingEvents: new autoscaling.ScalingEvents(autoscaling.ScalingEvent.INSTANCE_TERMINATE),
        },
      ],
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::AutoScalingGroup', {
      NotificationConfigurations: [
        {
          TopicARN: { Ref: 'MyTopic86869434' },
          NotificationTypes: [
            'autoscaling:EC2_INSTANCE_LAUNCH_ERROR',
            'autoscaling:EC2_INSTANCE_TERMINATE_ERROR',
          ],
        },
        {
          TopicARN: { Ref: 'MyTopic86869434' },
          NotificationTypes: [
            'autoscaling:EC2_INSTANCE_TERMINATE',
          ],
        },
      ],
    },
    );


  });

  testDeprecated('throw if notification and notificationsTopics are both configured', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);
    const topic = new sns.Topic(stack, 'MyTopic');

    // THEN
    expect(() => {
      new autoscaling.AutoScalingGroup(stack, 'MyASG', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
        machineImage: new ec2.AmazonLinuxImage(),
        vpc,
        notificationsTopic: topic,
        notifications: [{
          topic,
        }],
      });
    }).toThrow('Cannot set \'notificationsTopic\' and \'notifications\', \'notificationsTopic\' is deprecated use \'notifications\' instead');

  });

  test('notificationTypes default includes all non test NotificationType', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);
    const topic = new sns.Topic(stack, 'MyTopic');

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyASG', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      notifications: [
        {
          topic,
        },
      ],
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::AutoScalingGroup', {
      NotificationConfigurations: [
        {
          TopicARN: { Ref: 'MyTopic86869434' },
          NotificationTypes: [
            'autoscaling:EC2_INSTANCE_LAUNCH',
            'autoscaling:EC2_INSTANCE_LAUNCH_ERROR',
            'autoscaling:EC2_INSTANCE_TERMINATE',
            'autoscaling:EC2_INSTANCE_TERMINATE_ERROR',
          ],
        },
      ],
    },
    );


  });

  testDeprecated('setting notificationTopic configures all non test NotificationType', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);
    const topic = new sns.Topic(stack, 'MyTopic');

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyASG', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      notificationsTopic: topic,
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::AutoScalingGroup', {
      NotificationConfigurations: [
        {
          TopicARN: { Ref: 'MyTopic86869434' },
          NotificationTypes: [
            'autoscaling:EC2_INSTANCE_LAUNCH',
            'autoscaling:EC2_INSTANCE_LAUNCH_ERROR',
            'autoscaling:EC2_INSTANCE_TERMINATE',
            'autoscaling:EC2_INSTANCE_TERMINATE_ERROR',
          ],
        },
      ],
    },
    );


  });

  test('NotificationTypes.ALL includes all non test NotificationType', () => {
    expect(Object.values(autoscaling.ScalingEvent).length - 1).toEqual(autoscaling.ScalingEvents.ALL._types.length);

  });

  test('Can protect new instances from scale-in via constructor property', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyASG', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      newInstancesProtectedFromScaleIn: true,
    });

    // THEN
    expect(asg.areNewInstancesProtectedFromScaleIn()).toEqual(true);
    expect(stack).toHaveResourceLike('AWS::AutoScaling::AutoScalingGroup', {
      NewInstancesProtectedFromScaleIn: true,
    });


  });

  test('Can protect new instances from scale-in via setter', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyASG', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
    });
    asg.protectNewInstancesFromScaleIn();

    // THEN
    expect(asg.areNewInstancesProtectedFromScaleIn()).toEqual(true);
    expect(stack).toHaveResourceLike('AWS::AutoScaling::AutoScalingGroup', {
      NewInstancesProtectedFromScaleIn: true,
    });


  });

  test('requires imdsv2', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyASG', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ec2.MachineImage.latestAmazonLinux(),
      requireImdsv2: true,
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::AutoScaling::LaunchConfiguration', {
      MetadataOptions: {
        HttpTokens: 'required',
      },
    });
  });

  test('supports termination policies', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyASG', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ec2.MachineImage.latestAmazonLinux(),
      terminationPolicies: [
        autoscaling.TerminationPolicy.OLDEST_INSTANCE,
        autoscaling.TerminationPolicy.DEFAULT,
      ],
    });

    // THEN
    expect(stack).toHaveResource('AWS::AutoScaling::AutoScalingGroup', {
      TerminationPolicies: [
        'OldestInstance',
        'Default',
      ],
    });
  });
});

function mockVpc(stack: cdk.Stack) {
  return ec2.Vpc.fromVpcAttributes(stack, 'MyVpc', {
    vpcId: 'my-vpc',
    availabilityZones: ['az1'],
    publicSubnetIds: ['pub1'],
    privateSubnetIds: ['pri1'],
    isolatedSubnetIds: [],
  });
}

test('Can set autoScalingGroupName', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = mockVpc(stack);

  // WHEN
  new autoscaling.AutoScalingGroup(stack, 'MyASG', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
    machineImage: new ec2.AmazonLinuxImage(),
    vpc,
    autoScalingGroupName: 'MyAsg',
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::AutoScaling::AutoScalingGroup', {
    AutoScalingGroupName: 'MyAsg',
  });
});

test('can use Vpc imported from unparseable list tokens', () => {
  // GIVEN
  const stack = new cdk.Stack();

  const vpcId = cdk.Fn.importValue('myVpcId');
  const availabilityZones = cdk.Fn.split(',', cdk.Fn.importValue('myAvailabilityZones'));
  const publicSubnetIds = cdk.Fn.split(',', cdk.Fn.importValue('myPublicSubnetIds'));
  const privateSubnetIds = cdk.Fn.split(',', cdk.Fn.importValue('myPrivateSubnetIds'));
  const isolatedSubnetIds = cdk.Fn.split(',', cdk.Fn.importValue('myIsolatedSubnetIds'));

  const vpc = ec2.Vpc.fromVpcAttributes(stack, 'importedVpc', {
    vpcId,
    availabilityZones,
    publicSubnetIds,
    privateSubnetIds,
    isolatedSubnetIds,
  });

  // WHEN
  new autoscaling.AutoScalingGroup(stack, 'ecs-ec2-asg', {
    instanceType: new ec2.InstanceType('t2.micro'),
    machineImage: new ec2.AmazonLinuxImage(),
    minCapacity: 1,
    maxCapacity: 1,
    desiredCapacity: 1,
    vpc,
    allowAllOutbound: false,
    associatePublicIpAddress: false,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE },
  });

  // THEN
  expect(stack).toHaveResourceLike('AWS::AutoScaling::AutoScalingGroup', {
    VPCZoneIdentifier: {
      'Fn::Split': [',', { 'Fn::ImportValue': 'myPrivateSubnetIds' }],
    },
  });
});

function mockSecurityGroup(stack: cdk.Stack) {
  return ec2.SecurityGroup.fromSecurityGroupId(stack, 'MySG', 'most-secure');
}

function getTestStack(): cdk.Stack {
  return new cdk.Stack(undefined, 'TestStack', { env: { account: '1234', region: 'us-east-1' } });
}

import {expect, haveResource, haveResourceLike, InspectionFailure, ResourcePart} from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import { Lazy } from '@aws-cdk/core';
import cxapi = require('@aws-cdk/cx-api');
import { Test } from 'nodeunit';
import autoscaling = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'default fleet'(test: Test) {
    const stack = getTestStack();
    const vpc = mockVpc(stack);

    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc
    });

    expect(stack).toMatch({
      "Parameters": {
        "SsmParameterValueawsserviceamiamazonlinuxlatestamznamihvmx8664gp2C96584B6F00A464EAD1953AFF4B05118Parameter": {
          "Type": "AWS::SSM::Parameter::Value<String>",
          "Default": "/aws/service/ami-amazon-linux-latest/amzn-ami-hvm-x86_64-gp2"
        }
      },
      "Resources": {
        "MyFleetInstanceSecurityGroup774E8234": {
          "Type": "AWS::EC2::SecurityGroup",
          "Properties": {
            "GroupDescription": "MyFleet/InstanceSecurityGroup",
            "SecurityGroupEgress": [
              {
                "CidrIp": "0.0.0.0/0",
                "Description": "Allow all outbound traffic by default",
                "IpProtocol": "-1",
              }
            ],
            "Tags": [
              {
                "Key": "Name",
                "Value": "MyFleet"
              }
            ],

            "VpcId": "my-vpc"
          }
        },
        "MyFleetInstanceRole25A84AB8": {
          "Type": "AWS::IAM::Role",
          "Properties": {
            "AssumeRolePolicyDocument": {
              "Statement": [
                {
                  "Action": "sts:AssumeRole",
                  "Effect": "Allow",
                  "Principal": {
                    "Service": "ec2.amazonaws.com"
                  }
                }
              ],
              "Version": "2012-10-17"
            },
            "Tags": [
             {
               "Key": "Name",
               "Value": "MyFleet"
             }
           ],
          }
        },
        "MyFleetInstanceProfile70A58496": {
          "Type": "AWS::IAM::InstanceProfile",
          "Properties": {
            "Roles": [
              {
                "Ref": "MyFleetInstanceRole25A84AB8"
              }
            ]
          }
        },
        "MyFleetLaunchConfig5D7F9801": {
          "Type": "AWS::AutoScaling::LaunchConfiguration",
          "Properties": {
            "IamInstanceProfile": {
              "Ref": "MyFleetInstanceProfile70A58496"
            },
            "ImageId": { "Ref": "SsmParameterValueawsserviceamiamazonlinuxlatestamznamihvmx8664gp2C96584B6F00A464EAD1953AFF4B05118Parameter" },
            "InstanceType": "m4.micro",
            "SecurityGroups": [
              {
                "Fn::GetAtt": [
                  "MyFleetInstanceSecurityGroup774E8234",
                  "GroupId"
                ]
              }
            ],
            "UserData": {
              "Fn::Base64": "#!/bin/bash"
            }
          },
          "DependsOn": [
            "MyFleetInstanceRole25A84AB8"
          ]
        },
        "MyFleetASG88E55886": {
          "Type": "AWS::AutoScaling::AutoScalingGroup",
          "UpdatePolicy": {
            "AutoScalingScheduledAction": {
              "IgnoreUnmodifiedGroupSizeProperties": true
            }
          },
          "Properties": {
            "DesiredCapacity": "1",
            "LaunchConfigurationName": {
              "Ref": "MyFleetLaunchConfig5D7F9801"
            },
            "Tags": [
              {
                "Key": "Name",
                "PropagateAtLaunch": true,
                "Value": "MyFleet"
              }
            ],

            "MaxSize": "1",
            "MinSize": "1",
            "VPCZoneIdentifier": [
              "pri1"
            ]
          }
        }
      }
    });

    test.done();
  },

  'can set minCapacity, maxCapacity, desiredCapacity to 0'(test: Test) {
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
    const vpc = mockVpc(stack);

    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      minCapacity: 0,
      maxCapacity: 0,
      desiredCapacity: 0
    });

    expect(stack).to(haveResource("AWS::AutoScaling::AutoScalingGroup", {
      MinSize: "0",
      MaxSize: "0",
      DesiredCapacity: "0",
    }
    ));

    test.done();
  },

  'validation is not performed when using Tokens'(test: Test) {
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
    const vpc = mockVpc(stack);

    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      minCapacity: Lazy.numberValue({ produce: () => 5 }),
      maxCapacity: Lazy.numberValue({ produce: () => 1 }),
      desiredCapacity: Lazy.numberValue({ produce: () => 20 }),
    });

    // THEN: no exception
    expect(stack).to(haveResource("AWS::AutoScaling::AutoScalingGroup", {
      MinSize: "5",
      MaxSize: "1",
      DesiredCapacity: "20",
    }
    ));

    test.done();
  },

  'userdata can be overriden by image'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    const ud = ec2.UserData.forLinux();
    ud.addCommands('it me!');

    // WHEN
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage({
        userData: ud
      }),
      vpc,
    });

    // THEN
    test.equals(asg.userData.render(), '#!/bin/bash\nit me!');

    test.done();
  },

  'userdata can be overriden at ASG directly'(test: Test) {
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
        userData: ud1
      }),
      vpc,
      userData: ud2
    });

    // THEN
    test.equals(asg.userData.render(), '#!/bin/bash\nno me!');

    test.done();
  },

  'can specify only min capacity'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      minCapacity: 10
    });

    // THEN
    expect(stack).to(haveResource("AWS::AutoScaling::AutoScalingGroup", {
      MinSize: "10",
      MaxSize: "10",
      DesiredCapacity: "10",
    }
    ));

    test.done();
  },

  'can specify only max capacity'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      maxCapacity: 10
    });

    // THEN
    expect(stack).to(haveResource("AWS::AutoScaling::AutoScalingGroup", {
      MinSize: "1",
      MaxSize: "10",
      DesiredCapacity: "10",
    }
    ));

    test.done();
  },

  'can specify only desiredCount'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      desiredCapacity: 10
    });

    // THEN
    expect(stack).to(haveResource("AWS::AutoScaling::AutoScalingGroup", {
      MinSize: "1",
      MaxSize: "10",
      DesiredCapacity: "10",
    }
    ));

    test.done();
  },

  'addToRolePolicy can be used to add statements to the role policy'(test: Test) {
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
    const vpc = mockVpc(stack);

    const fleet = new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc
    });

    fleet.addToRolePolicy(new iam.PolicyStatement({
      actions: ['test:SpecialName'],
      resources: ['*']
    }));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: "test:SpecialName",
            Effect: "Allow",
            Resource: "*"
          }
        ],
      },
    }));
    test.done();
  },

  'can configure replacing update'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      updateType: autoscaling.UpdateType.REPLACING_UPDATE,
      replacingUpdateMinSuccessfulInstancesPercent: 50
    });

    // THEN
    expect(stack).to(haveResourceLike("AWS::AutoScaling::AutoScalingGroup", {
      UpdatePolicy: {
        AutoScalingReplacingUpdate: {
          WillReplace: true
        }
      },
      CreationPolicy: {
        AutoScalingCreationPolicy: {
          MinSuccessfulInstancesPercent: 50
        }
      }
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'can configure rolling update'(test: Test) {
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
        pauseTime: cdk.Duration.seconds(345)
      }
    });

    // THEN
    expect(stack).to(haveResourceLike("AWS::AutoScaling::AutoScalingGroup", {
      UpdatePolicy: {
        "AutoScalingRollingUpdate": {
          "MinSuccessfulInstancesPercent": 50,
          "WaitOnResourceSignals": true,
          "PauseTime": "PT5M45S",
          "SuspendProcesses": ["HealthCheck", "ReplaceUnhealthy", "AZRebalance", "AlarmNotification", "ScheduledActions"]
        },
      }
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'can configure resource signals'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      resourceSignalCount: 5,
      resourceSignalTimeout: cdk.Duration.seconds(666)
    });

    // THEN
    expect(stack).to(haveResourceLike("AWS::AutoScaling::AutoScalingGroup", {
      CreationPolicy: {
        ResourceSignal: {
          Count: 5,
          Timeout: 'PT11M6S'
        },
      }
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'can configure EC2 health check'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      healthCheck: autoscaling.HealthCheck.ec2()
    });

    // THEN
    expect(stack).to(haveResourceLike("AWS::AutoScaling::AutoScalingGroup", {
      HealthCheckType: 'EC2',
    }));

    test.done();
  },

  'can configure EBS health check'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' } });
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      healthCheck: autoscaling.HealthCheck.elb({grace: cdk.Duration.minutes(15)})
    });

    // THEN
    expect(stack).to(haveResourceLike("AWS::AutoScaling::AutoScalingGroup", {
      HealthCheckType: 'ELB',
      HealthCheckGracePeriod: 900
    }));

    test.done();
  },

  'can add Security Group to Fleet'(test: Test) {
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
    expect(stack).to(haveResource("AWS::AutoScaling::LaunchConfiguration", {
      SecurityGroups: [
        {
          "Fn::GetAtt": [
            "MyFleetInstanceSecurityGroup774E8234",
            "GroupId"
          ]
        },
        'most-secure'],
    }));
    test.done();
  },

  'can set tags'(test: Test) {
    // GIVEN
    const stack = getTestStack();
    // new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' }});
    const vpc = mockVpc(stack);

    // WHEN
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      updateType: autoscaling.UpdateType.ROLLING_UPDATE,
      rollingUpdateConfiguration: {
        minSuccessfulInstancesPercent: 50,
        pauseTime: cdk.Duration.seconds(345)
      },
    });
    asg.node.applyAspect(new cdk.Tag('superfood', 'acai'));
    asg.node.applyAspect(new cdk.Tag('notsuper', 'caramel', { applyToLaunchedInstances: false }));

    // THEN
    expect(stack).to(haveResource("AWS::AutoScaling::AutoScalingGroup", {
      Tags: [
        {
          Key: 'Name',
          PropagateAtLaunch: true,
          Value: 'MyFleet',
        },
        {
          Key: 'superfood',
          PropagateAtLaunch: true,
          Value: 'acai',
        },
        {
          Key: 'notsuper',
          PropagateAtLaunch: false,
          Value: 'caramel',
        },
      ]
    }));
    test.done();
  },

  'allows setting spot price'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyStack', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,

      spotPrice: "0.05",
    });

    // THEN
    test.deepEqual(asg.spotPrice, '0.05');
    expect(stack).to(haveResource("AWS::AutoScaling::LaunchConfiguration", {
      SpotPrice: "0.05",
    }));

    test.done();
  },

  'allows association of public IP address'(test: Test) {
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
    expect(stack).to(haveResource("AWS::AutoScaling::LaunchConfiguration", {
      AssociatePublicIpAddress: true,
    }
    ));
    test.done();
  },

  'association of public IP address requires public subnet'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    test.throws(() => {
      new autoscaling.AutoScalingGroup(stack, 'MyStack', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
        machineImage: new ec2.AmazonLinuxImage(),
        vpc,
        minCapacity: 0,
        maxCapacity: 0,
        desiredCapacity: 0,
        associatePublicIpAddress: true,
      });
    });
    test.done();
  },

  'allows disassociation of public IP address'(test: Test) {
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
    expect(stack).to(haveResource("AWS::AutoScaling::LaunchConfiguration", {
      AssociatePublicIpAddress: false,
    }
    ));
    test.done();
  },

  'does not specify public IP address association by default'(test: Test) {
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
    expect(stack).to(haveResource("AWS::AutoScaling::LaunchConfiguration", (resource: any, errors: InspectionFailure) => {
      for (const key of Object.keys(resource)) {
        if (key === "AssociatePublicIpAddress") {
          errors.failureReason = "Has AssociatePublicIpAddress";
          return false;
        }
      }
      return true;
    }));
    test.done();
  },

  'an existing role can be specified instead of auto-created'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);
    const importedRole = iam.Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/HelloDude');

    // WHEN
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyASG', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      role: importedRole
    });

    // THEN
    test.same(asg.role, importedRole);
    expect(stack).to(haveResource('AWS::IAM::InstanceProfile', {
      "Roles": ["HelloDude"]
    }));
    test.done();
  },

  'defaultChild is available on an ASG'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyStack', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
    });

    // THEN
    test.ok(asg.node.defaultChild instanceof autoscaling.CfnAutoScalingGroup);

    test.done();
  },

  'can set blockDeviceMappings'(test: Test) {
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
        })
      }, {
        deviceName: 'ebs-snapshot',
        mappingEnabled: false,
        volume: autoscaling.BlockDeviceVolume.ebsFromSnapshot('snapshot-id', {
          volumeSize: 500,
          deleteOnTermination: false,
          volumeType: autoscaling.EbsDeviceVolumeType.SC1,
        })
      }, {
        deviceName: 'ephemeral',
        volume: autoscaling.BlockDeviceVolume.ephemeral(0)
      }]
    });

    // THEN
    expect(stack).to(haveResource("AWS::AutoScaling::LaunchConfiguration", {
      BlockDeviceMappings: [
        {
          DeviceName: "ebs",
          Ebs: {
            DeleteOnTermination: true,
            Encrypted: true,
            Iops: 5000,
            VolumeSize: 15,
            VolumeType: "io1"
          },
          NoDevice: false
        },
        {
          DeviceName: "ebs-snapshot",
          Ebs: {
            DeleteOnTermination: false,
            SnapshotId: "snapshot-id",
            VolumeSize: 500,
            VolumeType: "sc1"
          },
          NoDevice: true
        },
        {
          DeviceName: "ephemeral",
          VirtualName: "ephemeral0"
        }
      ]
    }));

    test.done();
  },

  'throws if ephemeral volumeIndex < 0'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // THEN
    test.throws(() => {
      new autoscaling.AutoScalingGroup(stack, 'MyStack', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
        machineImage: new ec2.AmazonLinuxImage(),
        vpc,
        blockDevices: [{
          deviceName: 'ephemeral',
          volume: autoscaling.BlockDeviceVolume.ephemeral(-1)
        }]
      });
    }, /volumeIndex must be a number starting from 0/);

    test.done();
  },

  'throws if volumeType === IO1 without iops'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // THEN
    test.throws(() => {
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
          })
        }]
      });
    }, /ops property is required with volumeType: EbsDeviceVolumeType.IO1/);

    test.done();
  },

  'warning if iops without volumeType'(test: Test) {
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
        })
      }]
    });

    // THEN
    test.deepEqual(asg.node.metadata[0].type, cxapi.WARNING_METADATA_KEY);
    test.deepEqual(asg.node.metadata[0].data, 'iops will be ignored without volumeType: EbsDeviceVolumeType.IO1');

    test.done();
  },

  'warning if iops and volumeType !== IO1'(test: Test) {
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
        })
      }]
    });

    // THEN
    test.deepEqual(asg.node.metadata[0].type, cxapi.WARNING_METADATA_KEY);
    test.deepEqual(asg.node.metadata[0].data, 'iops will be ignored without volumeType: EbsDeviceVolumeType.IO1');

    test.done();
  },
};

function mockVpc(stack: cdk.Stack) {
  return ec2.Vpc.fromVpcAttributes(stack, 'MyVpc', {
    vpcId: 'my-vpc',
    availabilityZones: ['az1'],
    publicSubnetIds: ['pub1'],
    privateSubnetIds: ['pri1'],
    isolatedSubnetIds: [],
  });
}

function mockSecurityGroup(stack: cdk.Stack) {
  return ec2.SecurityGroup.fromSecurityGroupId(stack, 'MySG', 'most-secure');
}

function getTestStack(): cdk.Stack {
  return new cdk.Stack(undefined, 'TestStack', { env: { account: '1234', region: 'us-east-1' } });
}

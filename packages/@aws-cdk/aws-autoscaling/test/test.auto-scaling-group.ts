import { expect, haveResource, haveResourceLike, InspectionFailure, ResourcePart } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import autoscaling = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'default fleet'(test: Test) {
    const stack = getTestStack();
    const vpc = mockVpc(stack);

    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.Micro),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc
    });

    expect(stack).toMatch({
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
            "SecurityGroupIngress": [],
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
          }
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
          "ImageId": "dummy",
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
          "Fn::Base64": "#!/bin/bash\n"
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
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' }});
    const vpc = mockVpc(stack);

    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.Micro),
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

  'can specify only min capacity'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.Micro),
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
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.Micro),
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
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.Micro),
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
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' }});
    const vpc = mockVpc(stack);

    const fleet = new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.Micro),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc
    });

    fleet.addToRolePolicy(new iam.PolicyStatement()
      .addAction('test:SpecialName')
      .addAllResources());

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
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' }});
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.Micro),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      updateType: autoscaling.UpdateType.ReplacingUpdate,
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
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' }});
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.Micro),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      updateType: autoscaling.UpdateType.RollingUpdate,
      rollingUpdateConfiguration: {
        minSuccessfulInstancesPercent: 50,
        pauseTimeSec: 345
      }
    });

    // THEN
    expect(stack).to(haveResourceLike("AWS::AutoScaling::AutoScalingGroup", {
      UpdatePolicy: {
        "AutoScalingRollingUpdate": {
        "MinSuccessfulInstancesPercent": 50,
        "WaitOnResourceSignals": true,
        "PauseTime": "PT5M45S",
        "SuspendProcesses": [ "HealthCheck", "ReplaceUnhealthy", "AZRebalance", "AlarmNotification", "ScheduledActions" ]
        },
      }
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'can configure resource signals'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' }});
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.Micro),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      resourceSignalCount: 5,
      resourceSignalTimeoutSec: 666
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
  'can add Security Group to Fleet'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' }});
    const vpc = mockVpc(stack);

    // WHEN
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyFleet', {
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.Micro),
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
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.Micro),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      updateType: autoscaling.UpdateType.RollingUpdate,
      rollingUpdateConfiguration: {
        minSuccessfulInstancesPercent: 50,
        pauseTimeSec: 345
      },
    });
    asg.node.apply(new cdk.Tag('superfood', 'acai'));
    asg.node.apply(new cdk.Tag('notsuper', 'caramel', { applyToLaunchedInstances: false }));

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
  'allows association of public IP address'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = mockVpc(stack);

    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'MyStack', {
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.Micro),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      minCapacity: 0,
      maxCapacity: 0,
      desiredCapacity: 0,

      vpcSubnets: { subnetTypes: [ec2.SubnetType.Public] },
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
        instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.Micro),
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
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.Micro),
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
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.Micro),
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
    const importedRole = iam.Role.import(stack, 'ImportedRole', { roleArn: 'arn:aws:iam::123456789012:role/HelloDude' });

    // WHEN
    const asg = new autoscaling.AutoScalingGroup(stack, 'MyASG', {
      vpc,
      instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.Micro),
      machineImage: new ec2.AmazonLinuxImage(),
      role: importedRole
    });

    // THEN
    test.same(asg.role, importedRole);
    expect(stack).to(haveResource('AWS::IAM::InstanceProfile', {
      "Roles": [ "HelloDude" ]
    }));
    test.done();
  }
};

function mockVpc(stack: cdk.Stack) {
  return ec2.VpcNetwork.import(stack, 'MyVpc', {
    vpcId: 'my-vpc',
    availabilityZones: [ 'az1' ],
    publicSubnetIds: [ 'pub1' ],
    privateSubnetIds: [ 'pri1' ],
    isolatedSubnetIds: [],
  });
}

function mockSecurityGroup(stack: cdk.Stack) {
  return ec2.SecurityGroup.import(stack, 'MySG', {
    securityGroupId: 'most-secure',
  });
}

function getTestStack(): cdk.Stack {
  return new cdk.Stack(undefined, 'TestStack', { env: { account: '1234', region: 'us-east-1' } });
}

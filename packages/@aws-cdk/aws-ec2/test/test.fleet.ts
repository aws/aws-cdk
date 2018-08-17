import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import { PolicyStatement, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { AmazonLinuxImage, AutoScalingGroup, InstanceClass, InstanceSize, InstanceTypePair,
  UpdateType, VpcNetwork, VpcNetworkId, VpcSubnetId } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
    'default fleet'(test: Test) {
        const stack = new Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' }});
        const vpc = mockVpc(stack);

        new AutoScalingGroup(stack, 'MyFleet', {
            instanceType: new InstanceTypePair(InstanceClass.M4, InstanceSize.Micro),
            machineImage: new AmazonLinuxImage(),
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
                      "Description": "Outbound traffic allowed by default",
                      "FromPort": -1,
                      "IpProtocol": "-1",
                      "ToPort": -1
                    }
                  ],
                  "SecurityGroupIngress": [],
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
                  "LoadBalancerNames": [],
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

    'addToRolePolicy can be used to add statements to the role policy'(test: Test) {
        const stack = new Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' }});
        const vpc = mockVpc(stack);

        const fleet = new AutoScalingGroup(stack, 'MyFleet', {
            instanceType: new InstanceTypePair(InstanceClass.M4, InstanceSize.Micro),
            machineImage: new AmazonLinuxImage(),
            vpc
        });

        fleet.addToRolePolicy(new PolicyStatement()
            .addAction('*')
            .addResource('*'));

        expect(stack).toMatch({
            "Resources": {
              "MyFleetInstanceSecurityGroup774E8234": {
                "Type": "AWS::EC2::SecurityGroup",
                "Properties": {
                  "GroupDescription": "MyFleet/InstanceSecurityGroup",
                  "SecurityGroupEgress": [
                    {
                      "CidrIp": "0.0.0.0/0",
                      "Description": "Outbound traffic allowed by default",
                      "FromPort": -1,
                      "IpProtocol": "-1",
                      "ToPort": -1
                    }
                  ],
                  "SecurityGroupIngress": [],
                  "VpcId": "my-vpc"
                }
              },
              MyFleetInstanceRole25A84AB8: {
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
              MyFleetInstanceRoleDefaultPolicy7B0197E7: {
                "Type": "AWS::IAM::Policy",
                "Properties": {
                  "PolicyDocument": {
                    "Statement": [
                      {
                        "Action": "*",
                        "Effect": "Allow",
                        "Resource": "*"
                      }
                    ],
                    "Version": "2012-10-17"
                  },
                  "PolicyName": "MyFleetInstanceRoleDefaultPolicy7B0197E7",
                  "Roles": [
                    {
                      "Ref": "MyFleetInstanceRole25A84AB8"
                    }
                  ]
                }
              },
              MyFleetInstanceProfile70A58496: {
                "Type": "AWS::IAM::InstanceProfile",
                "Properties": {
                  "Roles": [
                    {
                      "Ref": "MyFleetInstanceRole25A84AB8"
                    }
                  ]
                }
              },
              MyFleetLaunchConfig5D7F9801: {
                Type: "AWS::AutoScaling::LaunchConfiguration",
                Properties: {
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
                DependsOn: [
                  "MyFleetInstanceRole25A84AB8",
                  "MyFleetInstanceRoleDefaultPolicy7B0197E7"
                ]
              },
              MyFleetASG88E55886: {
                Type: "AWS::AutoScaling::AutoScalingGroup",
                UpdatePolicy: {
                  AutoScalingScheduledAction: { IgnoreUnmodifiedGroupSizeProperties: true }
                },
                Properties: {
                  DesiredCapacity: "1",
                  LaunchConfigurationName: {
                    Ref: "MyFleetLaunchConfig5D7F9801"
                  },
                  LoadBalancerNames: [],
                  MaxSize: "1",
                  MinSize: "1",
                  VPCZoneIdentifier: [
                    "pri1"
                  ]
                }
              }
            }
        });

        test.done();
    },

    'can configure replacing update'(test: Test) {
      // GIVEN
      const stack = new Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' }});
      const vpc = mockVpc(stack);

      // WHEN
      new AutoScalingGroup(stack, 'MyFleet', {
          instanceType: new InstanceTypePair(InstanceClass.M4, InstanceSize.Micro),
          machineImage: new AmazonLinuxImage(),
          vpc,
          updateType: UpdateType.ReplacingUpdate,
          replacingUpdateMinSuccessfulInstancesPercent: 50
      });

      // THEN
      expect(stack).to(haveResource("AWS::AutoScaling::AutoScalingGroup", {
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
      const stack = new Stack(undefined, 'MyStack', { env: { region: 'us-east-1', account: '1234' }});
      const vpc = mockVpc(stack);

      // WHEN
      new AutoScalingGroup(stack, 'MyFleet', {
          instanceType: new InstanceTypePair(InstanceClass.M4, InstanceSize.Micro),
          machineImage: new AmazonLinuxImage(),
          vpc,
          updateType: UpdateType.RollingUpdate,
          rollingUpdateConfiguration: {
            minSuccessfulInstancesPercent: 50,
            pauseTimeSec: 345
          }
      });

      // THEN
      expect(stack).to(haveResource("AWS::AutoScaling::AutoScalingGroup", {
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
    }
};

function mockVpc(stack: Stack) {
    return VpcNetwork.import(stack, 'MyVpc', {
        vpcId: new VpcNetworkId('my-vpc'),
        availabilityZones: [ 'az1' ],
        publicSubnetIds: [ new VpcSubnetId('pub1') ],
        privateSubnetIds: [ new VpcSubnetId('pri1') ],
    });
}

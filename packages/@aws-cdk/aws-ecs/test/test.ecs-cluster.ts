import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import { InstanceType } from '@aws-cdk/aws-ec2';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ecs = require('../lib');

export = {
  "When creating an ECS Cluster": {
    "with only required properties set, it correctly sets default properties"(test: Test) {
      // GIVEN
      const stack =  new cdk.Stack();
      const vpc = new ec2.VpcNetwork(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
      });

      cluster.addCapacity('DefaultAutoScalingGroup', {
        instanceType: new ec2.InstanceType('t2.micro')
      });

      expect(stack).to(haveResource("AWS::ECS::Cluster"));

      expect(stack).to(haveResource("AWS::EC2::VPC", {
        CidrBlock: '10.0.0.0/16',
        EnableDnsHostnames: true,
        EnableDnsSupport: true,
        InstanceTenancy: ec2.DefaultInstanceTenancy.Default,
        Tags: [
          {
            Key: "Name",
            Value: "MyVpc"
          }
        ]
      }));

      expect(stack).to(haveResource("AWS::AutoScaling::LaunchConfiguration", {
        ImageId: "", // Should this not be the latest image ID?
        InstanceType: "t2.micro",
        IamInstanceProfile: {
          Ref: "EcsClusterDefaultAutoScalingGroupInstanceProfile2CE606B3"
        },
        SecurityGroups: [
          {
            "Fn::GetAtt": [
              "EcsClusterDefaultAutoScalingGroupInstanceSecurityGroup912E1231",
              "GroupId"
            ]
          }
        ],
        UserData: {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "#!/bin/bash\necho ECS_CLUSTER=",
                {
                  Ref: "EcsCluster97242B84"
                },
                // tslint:disable-next-line:max-line-length
                " >> /etc/ecs/ecs.config\nsudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP\nsudo service iptables save\necho ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config"
              ]
            ]
          }
        }
      }));

      expect(stack).to(haveResource("AWS::AutoScaling::AutoScalingGroup", {
        MaxSize: "1",
        MinSize: "1",
        DesiredCapacity: "1",
        LaunchConfigurationName: {
          Ref: "EcsClusterDefaultAutoScalingGroupLaunchConfigB7E376C1"
        },
        Tags: [
          {
            Key: "Name",
            PropagateAtLaunch: true,
            Value: "EcsCluster/DefaultAutoScalingGroup"
          }
        ],
        VPCZoneIdentifier: [
          {
            Ref: "MyVpcPrivateSubnet1Subnet5057CF7E"
          },
          {
            Ref: "MyVpcPrivateSubnet2Subnet0040C983"
          },
          {
            Ref: "MyVpcPrivateSubnet3Subnet772D6AD7"
          }
        ]
      }));

      expect(stack).to(haveResource("AWS::EC2::SecurityGroup", {
        GroupDescription: "EcsCluster/DefaultAutoScalingGroup/InstanceSecurityGroup",
        SecurityGroupEgress: [
          {
            CidrIp: "0.0.0.0/0",
            Description: "Allow all outbound traffic by default",
            IpProtocol: "-1"
          }
        ],
        SecurityGroupIngress: [],
        Tags: [
          {
            Key: "Name",
            Value: "EcsCluster/DefaultAutoScalingGroup"
          }
        ],
        VpcId: {
          Ref: "MyVpcF9F0CA6F"
        }
      }));

      expect(stack).to(haveResource("AWS::IAM::Role", {
          AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: "sts:AssumeRole",
              Effect: "Allow",
              Principal: {
                Service: "ec2.amazonaws.com"
              }
            }
          ],
          Version: "2012-10-17"
        }
      }));

      expect(stack).to(haveResource("AWS::IAM::Policy", {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                "ecs:CreateCluster",
                "ecs:DeregisterContainerInstance",
                "ecs:DiscoverPollEndpoint",
                "ecs:Poll",
                "ecs:RegisterContainerInstance",
                "ecs:StartTelemetrySession",
                "ecs:Submit*",
                "ecr:GetAuthorizationToken",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
              ],
              Effect: "Allow",
              Resource: "*"
            }
          ],
          Version: "2012-10-17"
        }
      }));

      test.done();
    },

    'lifecycle hook is automatically added'(test: Test) {
      // GIVEN
      const stack =  new cdk.Stack();
      const vpc = new ec2.VpcNetwork(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', {
        vpc,
      });

      // WHEN
      cluster.addCapacity('DefaultAutoScalingGroup', {
        instanceType: new ec2.InstanceType('t2.micro')
      });

      // THEN
      expect(stack).to(haveResource('AWS::AutoScaling::LifecycleHook', {
        AutoScalingGroupName: { Ref: "EcsClusterDefaultAutoScalingGroupASGC1A785DB" },
        LifecycleTransition: "autoscaling:EC2_INSTANCE_TERMINATING",
        DefaultResult: "CONTINUE",
        HeartbeatTimeout: 300,
        NotificationTargetARN: { Ref: "EcsClusterDefaultAutoScalingGroupDrainECSHookTopicC705BD25" },
        RoleARN: { "Fn::GetAtt": [ "EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookRoleA38EC83B", "Arn" ] }
      }));

      test.done();
    },
  },

  "allows specifying instance type"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new InstanceType("m3.large")
    });

    // THEN
    expect(stack).to(haveResource("AWS::AutoScaling::LaunchConfiguration", {
      InstanceType: "m3.large"
    }));

    test.done();
  },

  "allows specifying cluster size"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'MyVpc', {});

    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
      desiredCapacity: 3
    });

    // THEN
    expect(stack).to(haveResource("AWS::AutoScaling::AutoScalingGroup", {
      MaxSize: "3"
    }));

    test.done();
  },
};

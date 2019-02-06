import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ecs = require('../../lib');
import { ContainerImage } from '../../lib';

export = {
  "When creating a Fargate Service": {
    "with only required properties set, it correctly sets default properties"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.VpcNetwork(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromDockerHub("amazon/amazon-ecs-sample"),
      });

      new ecs.FargateService(stack, "FargateService", {
        cluster,
        taskDefinition
      });

      // THEN
      expect(stack).to(haveResource("AWS::ECS::Service", {
        TaskDefinition: {
          Ref: "FargateTaskDefC6FB60B4"
        },
        Cluster: {
          Ref: "EcsCluster97242B84"
        },
        DeploymentConfiguration: {
          MaximumPercent: 200,
          MinimumHealthyPercent: 50
        },
        DesiredCount: 1,
        LaunchType: "FARGATE",
        LoadBalancers: [],
        NetworkConfiguration: {
          AwsvpcConfiguration: {
            AssignPublicIp: "DISABLED",
            SecurityGroups: [
              {
                "Fn::GetAtt": [
                  "FargateServiceSecurityGroup0A0E79CB",
                  "GroupId"
                ]
              }
            ],
            Subnets: [
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
          }
        }
      }));

      expect(stack).to(haveResource("AWS::EC2::SecurityGroup", {
        GroupDescription: "FargateService/SecurityGroup",
        SecurityGroupEgress: [
          {
            CidrIp: "0.0.0.0/0",
            Description: "Allow all outbound traffic by default",
            IpProtocol: "-1"
          }
        ],
        SecurityGroupIngress: [],
        VpcId: {
          Ref: "MyVpcF9F0CA6F"
        }
      }));

      test.done();
    },

    "errors when no container specified on task definition"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.VpcNetwork(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      // THEN
      test.throws(() => {
        new ecs.FargateService(stack, "FargateService", {
          cluster,
          taskDefinition,
        });
      });

      test.done();
    },

    "allows specifying assignPublicIP as enabled"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.VpcNetwork(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromDockerHub("amazon/amazon-ecs-sample"),
      });

      new ecs.FargateService(stack, "FargateService", {
        cluster,
        taskDefinition,
        assignPublicIp: true
      });

      // THEN
      expect(stack).to(haveResourceLike("AWS::ECS::Service", {
        NetworkConfiguration: {
          AwsvpcConfiguration: {
            AssignPublicIp: "ENABLED",
          }
        }
      }));

      test.done();
    },

    "allows specifying 0 for minimumHealthyPercent"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.VpcNetwork(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromDockerHub("amazon/amazon-ecs-sample"),
      });

      new ecs.FargateService(stack, "FargateService", {
        cluster,
        taskDefinition,
        minimumHealthyPercent: 0,
      });

      // THEN
      expect(stack).to(haveResourceLike("AWS::ECS::Service", {
        DeploymentConfiguration: {
          MinimumHealthyPercent: 0,
        }
      }));

      test.done();
    },
  },

  "When setting up a health check": {
    'grace period is respected'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.VpcNetwork(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      taskDefinition.addContainer('MainContainer', {
        image: ContainerImage.fromDockerHub('hello'),
      });

      // WHEN
      new ecs.FargateService(stack, 'Svc', {
        cluster,
        taskDefinition,
        healthCheckGracePeriodSeconds: 10
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::Service', {
        HealthCheckGracePeriodSeconds: 10
      }));

      test.done();
    },
  },

  "When adding an app load balancer": {
    'allows auto scaling by ALB request per target'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.VpcNetwork(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ContainerImage.fromDockerHub('hello'),
      });
      container.addPortMappings({ containerPort: 8000 });
      const service = new ecs.FargateService(stack, 'Service', { cluster, taskDefinition });

      const lb = new elbv2.ApplicationLoadBalancer(stack, "lb", { vpc });
      const listener = lb.addListener("listener", { port: 80 });
      const targetGroup = listener.addTargets("target", {
        port: 80,
        targets: [service]
      });

      // WHEN
      const capacity = service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 1 });
      capacity.scaleOnRequestCount("ScaleOnRequests", {
        requestsPerTarget: 1000,
        targetGroup
      });

      // THEN
      expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
        MaxCapacity: 10,
        MinCapacity: 1
      }));

      expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
        TargetTrackingScalingPolicyConfiguration: {
          PredefinedMetricSpecification: {
            PredefinedMetricType: "ALBRequestCountPerTarget",
            ResourceLabel: {
              "Fn::Join": ["", [
                { "Fn::Select": [1, { "Fn::Split": ["/", { Ref: "lblistener657ADDEC" }] }] }, "/",
                { "Fn::Select": [2, { "Fn::Split": ["/", { Ref: "lblistener657ADDEC" }] }] }, "/",
                { "Fn::Select": [3, { "Fn::Split": ["/", { Ref: "lblistener657ADDEC" }] }] }, "/",
                { "Fn::GetAtt": ["lblistenertargetGroupC7489D1E", "TargetGroupFullName"] }
              ]]
            }
          },
          TargetValue: 1000
        }
      }));

      test.done();
    }

  }
};

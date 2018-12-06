import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
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
};

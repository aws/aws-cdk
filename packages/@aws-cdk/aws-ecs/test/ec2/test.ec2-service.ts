import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import elb = require('@aws-cdk/aws-elasticloadbalancing');
import cloudmap = require('@aws-cdk/aws-servicediscovery');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import ecs = require('../../lib');
import { BinPackResource, BuiltInAttributes, ContainerImage, NetworkMode } from '../../lib';
import { LaunchType } from '../../lib/base/base-service';
import { PlacementConstraint, PlacementStrategy } from '../../lib/placement';

export = {
  "When creating an ECS Service": {
    "with only required properties set, it correctly sets default properties"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      new ecs.Ec2Service(stack, "Ec2Service", {
        cluster,
        taskDefinition,
      });

      // THEN
      expect(stack).to(haveResource("AWS::ECS::Service", {
        TaskDefinition: {
          Ref: "Ec2TaskDef0226F28C"
        },
        Cluster: {
          Ref: "EcsCluster97242B84"
        },
        DeploymentConfiguration: {
          MaximumPercent: 200,
          MinimumHealthyPercent: 50
        },
        DesiredCount: 1,
        LaunchType: LaunchType.EC2,
        LoadBalancers: [],
        SchedulingStrategy: "REPLICA"
      }));

      test.done();
    },

    "errors if daemon and desiredCount both specified"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
      taskDefinition.addContainer('BaseContainer', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryReservationMiB: 10,
      });

      // THEN
      test.throws(() => {
        new ecs.Ec2Service(stack, "Ec2Service", {
          cluster,
          taskDefinition,
          daemon: true,
          desiredCount: 2
        });
      }, /Don't supply desiredCount/);

      test.done();
    },

    "errors if daemon and maximumPercent not 100"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
      taskDefinition.addContainer('BaseContainer', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryReservationMiB: 10,
      });

      // THEN
      test.throws(() => {
        new ecs.Ec2Service(stack, "Ec2Service", {
          cluster,
          taskDefinition,
          daemon: true,
          maxHealthyPercent: 300
        });
      }, /Maximum percent must be 100 for daemon mode./);

      test.done();
    },

    "errors if daemon and minimum not 0"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
      taskDefinition.addContainer('BaseContainer', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryReservationMiB: 10,
      });

      // THEN
      test.throws(() => {
        new ecs.Ec2Service(stack, "Ec2Service", {
          cluster,
          taskDefinition,
          daemon: true,
          minHealthyPercent: 50
        });
      }, /Minimum healthy percent must be 0 for daemon mode./);

      test.done();
    },

    'Output does not contain DesiredCount if daemon mode is set'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
      taskDefinition.addContainer('BaseContainer', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryReservationMiB: 10,
      });

      // WHEN
      new ecs.Ec2Service(stack, "Ec2Service", {
        cluster,
        taskDefinition,
        daemon: true,
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::Service', (service: any) => {
        return service.LaunchType === LaunchType.EC2 && service.DesiredCount === undefined;
      }));

      test.done();
    },

    "errors if no container definitions"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      // THEN
      test.throws(() => {
        new ecs.Ec2Service(stack, "Ec2Service", {
          cluster,
          taskDefinition,
        });
      });

      test.done();
    },

    "sets daemon scheduling strategy"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      new ecs.Ec2Service(stack, "Ec2Service", {
        cluster,
        taskDefinition,
        daemon: true
      });

      // THEN
      expect(stack).to(haveResource("AWS::ECS::Service", {
        SchedulingStrategy: "DAEMON",
        DeploymentConfiguration: {
          MaximumPercent: 100,
          MinimumHealthyPercent: 0
        },
      }));

      test.done();
    },

    "with a TaskDefinition with Bridge network mode": {
      "it errors if vpcSubnets is specified"(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
          networkMode: NetworkMode.BRIDGE
        });

        taskDefinition.addContainer("web", {
          image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
          memoryLimitMiB: 512
        });

      // THEN
        test.throws(() => {
          new ecs.Ec2Service(stack, "Ec2Service", {
            cluster,
            taskDefinition,
            vpcSubnets: {
              subnetType: ec2.SubnetType.PUBLIC
            }
          });
        });

        // THEN
        test.done();
      },

      "it errors if assignPublicIp is true"(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
          networkMode: NetworkMode.BRIDGE
        });

        taskDefinition.addContainer("web", {
          image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
          memoryLimitMiB: 512
        });

      // THEN
        test.throws(() => {
          new ecs.Ec2Service(stack, "Ec2Service", {
            cluster,
            taskDefinition,
            assignPublicIp: true
          });
        });

        // THEN
        test.done();
      },
    },

    "with a TaskDefinition with AwsVpc network mode": {
      "it creates a security group for the service"(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
          networkMode: NetworkMode.AWS_VPC
        });

        taskDefinition.addContainer("web", {
          image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
          memoryLimitMiB: 512
        });

        new ecs.Ec2Service(stack, "Ec2Service", {
          cluster,
          taskDefinition,
        });

        // THEN
        expect(stack).to(haveResource("AWS::ECS::Service", {
          NetworkConfiguration: {
            AwsvpcConfiguration: {
              AssignPublicIp: "DISABLED",
              SecurityGroups: [
                {
                  "Fn::GetAtt": [
                    "Ec2ServiceSecurityGroupAEC30825",
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
              ]
            }
          }
        }));

        test.done();
      },

      "it allows vpcSubnets"(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
          networkMode: NetworkMode.AWS_VPC
        });

        taskDefinition.addContainer("web", {
          image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
          memoryLimitMiB: 512
        });

        new ecs.Ec2Service(stack, "Ec2Service", {
          cluster,
          taskDefinition,
          vpcSubnets: {
            subnetType: ec2.SubnetType.PUBLIC
          }
        });

        // THEN
        test.done();
      },
    },

    "with distinctInstance placement constraint"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      new ecs.Ec2Service(stack, "Ec2Service", {
        cluster,
        taskDefinition,
        placementConstraints: [ecs.PlacementConstraint.distinctInstances()]
      });

      // THEN
      expect(stack).to(haveResource("AWS::ECS::Service", {
        PlacementConstraints: [{
            Type: "distinctInstance"
        }]
      }));

      test.done();
    },

    "with memberOf placement constraints"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      const service = new ecs.Ec2Service(stack, "Ec2Service", {
        cluster,
        taskDefinition,
      });

      service.addPlacementConstraints(PlacementConstraint.memberOf("attribute:ecs.instance-type =~ t2.*"));

      // THEN
      expect(stack).to(haveResource("AWS::ECS::Service", {
        PlacementConstraints: [{
            Expression: "attribute:ecs.instance-type =~ t2.*",
            Type: "memberOf"
        }]
      }));

      test.done();
    },

    "with spreadAcross placement strategy"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      const service = new ecs.Ec2Service(stack, "Ec2Service", {
        cluster,
        taskDefinition,
      });

      service.addPlacementStrategies(PlacementStrategy.spreadAcross(BuiltInAttributes.AVAILABILITY_ZONE));

      // THEN
      expect(stack).to(haveResource("AWS::ECS::Service", {
        PlacementStrategies: [{
          Field: "attribute:ecs.availability-zone",
          Type: "spread"
        }]
      }));

      test.done();
    },

    "errors with spreadAcross placement strategy if daemon specified"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      const service = new ecs.Ec2Service(stack, "Ec2Service", {
        cluster,
        taskDefinition,
        daemon: true
      });

      // THEN
      test.throws(() => {
        service.addPlacementStrategies(PlacementStrategy.spreadAcross(BuiltInAttributes.AVAILABILITY_ZONE));
      });

      test.done();
    },

    "with random placement strategy"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc');
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      const service = new ecs.Ec2Service(stack, "Ec2Service", {
        cluster,
        taskDefinition,
      });

      service.addPlacementStrategies(PlacementStrategy.randomly());

      // THEN
      expect(stack).to(haveResource("AWS::ECS::Service", {
        PlacementStrategies: [{
          Type: "random"
        }]
      }));

      test.done();
    },

    "errors with random placement strategy if daemon specified"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc');
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      const service = new ecs.Ec2Service(stack, "Ec2Service", {
        cluster,
        taskDefinition,
        daemon: true
      });

      // THEN
      test.throws(() => {
        service.addPlacementStrategies(PlacementStrategy.randomly());
      });

      test.done();
    },

    "with packedBy placement strategy"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      const service = new ecs.Ec2Service(stack, "Ec2Service", {
        cluster,
        taskDefinition,
      });

      service.addPlacementStrategies(PlacementStrategy.packedBy(BinPackResource.MEMORY));

      // THEN
      expect(stack).to(haveResource("AWS::ECS::Service", {
        PlacementStrategies: [{
          Field: "memory",
          Type: "binpack"
        }]
      }));

      test.done();
    },

    "errors with packedBy placement strategy if daemon specified"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      const service = new ecs.Ec2Service(stack, "Ec2Service", {
        cluster,
        taskDefinition,
        daemon: true
      });

      // THEN
      test.throws(() => {
        service.addPlacementStrategies(PlacementStrategy.packedBy(BinPackResource.MEMORY));
      });

      test.done();
    }
  },

  'classic ELB': {
    'can attach to classic ELB'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'VPC');
      const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TD', { networkMode: ecs.NetworkMode.HOST });
      const container = taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
      });
      container.addPortMappings({ containerPort: 808 });
      const service = new ecs.Ec2Service(stack, 'Service', { cluster, taskDefinition});

      // WHEN
      const lb = new elb.LoadBalancer(stack, 'LB', { vpc });
      lb.addTarget(service);

      // THEN
      expect(stack).to(haveResource('AWS::ECS::Service', {
        LoadBalancers: [
          {
            ContainerName: "web",
            ContainerPort: 808,
            LoadBalancerName: { Ref: "LB8A12904C" }
          }
        ]
      }));

      expect(stack).to(haveResource('AWS::ECS::Service', {
        // if any load balancer is configured and healthCheckGracePeriodSeconds is not
        // set, then it should default to 60 seconds.
        HealthCheckGracePeriodSeconds: 60
      }));

      test.done();
    }
  },

  'When enabling service discovery': {
    'throws if namespace has not been added to cluster'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });

      // default network mode is bridge
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512
      });
      container.addPortMappings({ containerPort: 8000 });

      // THEN
      test.throws(() => {
        new ecs.Ec2Service(stack, 'Service', {
          cluster,
          taskDefinition,
          cloudMapOptions: {
            name: 'myApp',
          }
        });
      }, /Cannot enable service discovery if a Cloudmap Namespace has not been created in the cluster./);

      test.done();
    },

    'throws if network mode is none'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        networkMode: NetworkMode.NONE
      });
      const container = taskDefinition.addContainer('MainContainer', {
        image: ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512
      });
      container.addPortMappings({ containerPort: 8000 });

      cluster.addDefaultCloudMapNamespace({ name: 'foo.com' });

      // THEN
      test.throws(() => {
        new ecs.Ec2Service(stack, 'Service', {
          cluster,
          taskDefinition,
          cloudMapOptions: {
            name: 'myApp',
          }
        });
      }, /Cannot use a service discovery if NetworkMode is None. Use Bridge, Host or AwsVpc instead./);

      test.done();
    },

    'creates AWS Cloud Map service for Private DNS namespace with bridge network mode'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });

      // default network mode is bridge
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512
      });
      container.addPortMappings({ containerPort: 8000 });

      // WHEN
      cluster.addDefaultCloudMapNamespace({
        name: 'foo.com',
        type: cloudmap.NamespaceType.DNS_PRIVATE
      });

      new ecs.Ec2Service(stack, 'Service', {
        cluster,
        taskDefinition,
        cloudMapOptions: {
          name: 'myApp',
        }
      });

      // THEN
      expect(stack).to(haveResource("AWS::ECS::Service", {
        ServiceRegistries: [
          {
            ContainerName: "MainContainer",
            ContainerPort: 8000,
            RegistryArn: {
              "Fn::GetAtt": [
                "ServiceCloudmapService046058A4",
                "Arn"
              ]
            }
          }
        ]
      }));

      expect(stack).to(haveResource('AWS::ServiceDiscovery::Service', {
        DnsConfig: {
          DnsRecords: [
            {
              TTL: 60,
              Type: "SRV"
            }
          ],
          NamespaceId: {
            'Fn::GetAtt': [
              'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
              'Id'
            ]
          },
          RoutingPolicy: 'MULTIVALUE'
        },
        HealthCheckCustomConfig: {
          FailureThreshold: 1
        },
        Name: "myApp",
        NamespaceId: {
          'Fn::GetAtt': [
            'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
            'Id'
          ]
        }
      }));

      test.done();
    },

    'creates AWS Cloud Map service for Private DNS namespace with host network mode'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        networkMode: NetworkMode.HOST
      });
      const container = taskDefinition.addContainer('MainContainer', {
        image: ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512
      });
      container.addPortMappings({ containerPort: 8000 });

      // WHEN
      cluster.addDefaultCloudMapNamespace({
        name: 'foo.com',
        type: cloudmap.NamespaceType.DNS_PRIVATE
      });

      new ecs.Ec2Service(stack, 'Service', {
        cluster,
        taskDefinition,
        cloudMapOptions: {
          name: 'myApp',
        }
      });

      // THEN
      expect(stack).to(haveResource("AWS::ECS::Service", {
        ServiceRegistries: [
          {
            ContainerName: "MainContainer",
            ContainerPort: 8000,
            RegistryArn: {
              "Fn::GetAtt": [
                "ServiceCloudmapService046058A4",
                "Arn"
              ]
            }
          }
        ]
      }));

      expect(stack).to(haveResource('AWS::ServiceDiscovery::Service', {
        DnsConfig: {
          DnsRecords: [
            {
              TTL: 60,
              Type: "SRV"
            }
          ],
          NamespaceId: {
            'Fn::GetAtt': [
              'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
              'Id'
            ]
          },
          RoutingPolicy: 'MULTIVALUE'
        },
        HealthCheckCustomConfig: {
          FailureThreshold: 1
        },
        Name: "myApp",
        NamespaceId: {
          'Fn::GetAtt': [
            'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
            'Id'
          ]
        }
      }));

      test.done();
    },

    'throws if wrong DNS record type specified with bridge network mode'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });

      // default network mode is bridge
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512
      });
      container.addPortMappings({ containerPort: 8000 });

      cluster.addDefaultCloudMapNamespace({
        name: 'foo.com',
      });

      // THEN
      test.throws(() => {
        new ecs.Ec2Service(stack, 'Service', {
          cluster,
          taskDefinition,
          cloudMapOptions: {
            name: 'myApp',
            dnsRecordType: cloudmap.DnsRecordType.A
          }
        });
      }, /SRV records must be used when network mode is Bridge or Host./);

      test.done();
    },

    'creates AWS Cloud Map service for Private DNS namespace with AwsVpc network mode'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        networkMode: NetworkMode.AWS_VPC
      });
      const container = taskDefinition.addContainer('MainContainer', {
        image: ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512
      });
      container.addPortMappings({ containerPort: 8000 });

      // WHEN
      cluster.addDefaultCloudMapNamespace({
        name: 'foo.com',
        type: cloudmap.NamespaceType.DNS_PRIVATE
      });

      new ecs.Ec2Service(stack, 'Service', {
        cluster,
        taskDefinition,
        cloudMapOptions: {
          name: 'myApp',
        }
      });

      // THEN
      expect(stack).to(haveResource("AWS::ECS::Service", {
        ServiceRegistries: [
          {
            RegistryArn: {
              "Fn::GetAtt": [
                "ServiceCloudmapService046058A4",
                "Arn"
              ]
            }
          }
        ]
      }));

      expect(stack).to(haveResource('AWS::ServiceDiscovery::Service', {
        DnsConfig: {
          DnsRecords: [
            {
              TTL: 60,
              Type: "A"
            }
          ],
          NamespaceId: {
            'Fn::GetAtt': [
              'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
              'Id'
            ]
          },
          RoutingPolicy: 'MULTIVALUE'
        },
        HealthCheckCustomConfig: {
          FailureThreshold: 1
        },
        Name: "myApp",
        NamespaceId: {
          'Fn::GetAtt': [
            'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
            'Id'
          ]
        }
      }));

      test.done();
    },

    'creates AWS Cloud Map service for Private DNS namespace with AwsVpc network mode with SRV records'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        networkMode: NetworkMode.AWS_VPC
      });
      const container = taskDefinition.addContainer('MainContainer', {
        image: ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512
      });
      container.addPortMappings({ containerPort: 8000 });

      // WHEN
      cluster.addDefaultCloudMapNamespace({
        name: 'foo.com',
        type: cloudmap.NamespaceType.DNS_PRIVATE
      });

      new ecs.Ec2Service(stack, 'Service', {
        cluster,
        taskDefinition,
        cloudMapOptions: {
          name: 'myApp',
          dnsRecordType: cloudmap.DnsRecordType.SRV
        }
      });

      // THEN
      expect(stack).to(haveResource("AWS::ECS::Service", {
        ServiceRegistries: [
          {
            ContainerName: "MainContainer",
            ContainerPort: 8000,
            RegistryArn: {
              "Fn::GetAtt": [
                "ServiceCloudmapService046058A4",
                "Arn"
              ]
            }
          }
        ]
      }));

      expect(stack).to(haveResource('AWS::ServiceDiscovery::Service', {
        DnsConfig: {
          DnsRecords: [
            {
              TTL: 60,
              Type: "SRV"
            }
          ],
          NamespaceId: {
            'Fn::GetAtt': [
              'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
              'Id'
            ]
          },
          RoutingPolicy: 'MULTIVALUE'
        },
        HealthCheckCustomConfig: {
          FailureThreshold: 1
        },
        Name: "myApp",
        NamespaceId: {
          'Fn::GetAtt': [
            'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
            'Id'
          ]
        }
      }));

      test.done();
    },
  },

  'Metric'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'FargateTaskDef');
    taskDefinition.addContainer('Container', {
      image: ecs.ContainerImage.fromRegistry('hello')
    });

    // WHEN
    const service = new ecs.Ec2Service(stack, 'Service', {
      cluster,
      taskDefinition,
    });

    // THEN
    test.deepEqual(stack.resolve(service.metricMemoryUtilization()), {
      dimensions: {
        ClusterName: { Ref: 'EcsCluster97242B84' },
        ServiceName: { 'Fn::GetAtt': ['ServiceD69D759B', 'Name'] }
      },
      namespace: 'AWS/ECS',
      metricName: 'MemoryUtilization',
      period: cdk.Duration.minutes(5),
      statistic: 'Average'
    });

    test.done();
  }
};

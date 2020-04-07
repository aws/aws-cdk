import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ecs from '../../lib';
import { LaunchType } from '../../lib/base/base-service';

export = {
  'When creating a Fargate Service': {
    'with only required properties set, it correctly sets default properties'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      });

      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::Service', {
        TaskDefinition: {
          Ref: 'FargateTaskDefC6FB60B4'
        },
        Cluster: {
          Ref: 'EcsCluster97242B84'
        },
        DeploymentConfiguration: {
          MaximumPercent: 200,
          MinimumHealthyPercent: 50
        },
        DesiredCount: 1,
        LaunchType: LaunchType.FARGATE,
        EnableECSManagedTags: false,
        NetworkConfiguration: {
          AwsvpcConfiguration: {
            AssignPublicIp: 'DISABLED',
            SecurityGroups: [
              {
                'Fn::GetAtt': [
                  'FargateServiceSecurityGroup0A0E79CB',
                  'GroupId'
                ]
              }
            ],
            Subnets: [
              {
                Ref: 'MyVpcPrivateSubnet1Subnet5057CF7E'
              },
              {
                Ref: 'MyVpcPrivateSubnet2Subnet0040C983'
              },
            ]
          }
        }
      }));

      expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
        GroupDescription: 'FargateService/SecurityGroup',
        SecurityGroupEgress: [
          {
            CidrIp: '0.0.0.0/0',
            Description: 'Allow all outbound traffic by default',
            IpProtocol: '-1'
          }
        ],
        VpcId: {
          Ref: 'MyVpcF9F0CA6F'
        }
      }));

      test.done();
    },

    'can create service with default settings if VPC only has public subnets'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {
        subnetConfiguration: [
          {
            cidrMask: 28,
            name: 'public-only',
            subnetType: ec2.SubnetType.PUBLIC
          }
        ]
      });
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      });

      // WHEN
      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
      });

      // THEN -- did not throw
      test.done();
    },

    'with custom cloudmap namespace'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      const container = taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512
      });
      container.addPortMappings({ containerPort: 8000 });

      const cloudMapNamespace = new cloudmap.PrivateDnsNamespace(stack, 'TestCloudMapNamespace', {
        name: 'scorekeep.com',
        vpc,
      });

      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        cloudMapOptions: {
          name: 'myApp',
          failureThreshold: 20,
          cloudMapNamespace,
        },
      });

      // THEN
      expect(stack).to(haveResource('AWS::ServiceDiscovery::Service', {
        DnsConfig: {
          DnsRecords: [
            {
              TTL: 60,
              Type: 'A'
            }
          ],
          NamespaceId: {
            'Fn::GetAtt': [
              'TestCloudMapNamespace1FB9B446',
              'Id'
            ]
          },
          RoutingPolicy: 'MULTIVALUE'
        },
        HealthCheckCustomConfig: {
          FailureThreshold: 20
        },
        Name: 'myApp',
        NamespaceId: {
          'Fn::GetAtt': [
            'TestCloudMapNamespace1FB9B446',
            'Id'
          ]
        }
      }));

      expect(stack).to(haveResource('AWS::ServiceDiscovery::PrivateDnsNamespace', {
        Name: 'scorekeep.com',
        Vpc: {
          Ref: 'MyVpcF9F0CA6F'
        }
      }));

      test.done();
    },

    'with all properties set'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

      cluster.addDefaultCloudMapNamespace({
        name: 'foo.com',
        type: cloudmap.NamespaceType.DNS_PRIVATE
      });

      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      });

      const svc = new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        desiredCount: 2,
        assignPublicIp: true,
        cloudMapOptions: {
          name: 'myapp',
          dnsRecordType: cloudmap.DnsRecordType.A,
          dnsTtl: cdk.Duration.seconds(50),
          failureThreshold: 20
        },
        healthCheckGracePeriod: cdk.Duration.seconds(60),
        maxHealthyPercent: 150,
        minHealthyPercent: 55,
        deploymentController: {
          type: ecs.DeploymentControllerType.CODE_DEPLOY
        },
        securityGroup: new ec2.SecurityGroup(stack, 'SecurityGroup1', {
          allowAllOutbound: true,
          description: 'Example',
          securityGroupName: 'Bob',
          vpc,
        }),
        serviceName: 'bonjour',
        vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }
      });

      // THEN
      test.ok(svc.cloudMapService !== undefined);

      expect(stack).to(haveResource('AWS::ECS::Service', {
        TaskDefinition: {
          Ref: 'FargateTaskDefC6FB60B4'
        },
        Cluster: {
          Ref: 'EcsCluster97242B84'
        },
        DeploymentConfiguration: {
          MaximumPercent: 150,
          MinimumHealthyPercent: 55
        },
        DeploymentController: {
          Type: ecs.DeploymentControllerType.CODE_DEPLOY
        },
        DesiredCount: 2,
        HealthCheckGracePeriodSeconds: 60,
        LaunchType: LaunchType.FARGATE,
        NetworkConfiguration: {
          AwsvpcConfiguration: {
            AssignPublicIp: 'ENABLED',
            SecurityGroups: [
              {
                'Fn::GetAtt': [
                  'SecurityGroup1F554B36F',
                  'GroupId'
                ]
              }
            ],
            Subnets: [
              {
                Ref: 'MyVpcPublicSubnet1SubnetF6608456'
              },
              {
                Ref: 'MyVpcPublicSubnet2Subnet492B6BFB'
              }
            ]
          }
        },
        ServiceName: 'bonjour',
        ServiceRegistries: [
          {
            RegistryArn: {
              'Fn::GetAtt': [
                'FargateServiceCloudmapService9544B753',
                'Arn'
              ]
            }
          }
        ]
      }));

      test.done();
    },

    'throws when task definition is not Fargate compatible'(test: Test) {
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.TaskDefinition(stack, 'Ec2TaskDef', {
        compatibility: ecs.Compatibility.EC2,
      });
      taskDefinition.addContainer('BaseContainer', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryReservationMiB: 10,
      });

      // THEN
      test.throws(() => {
        new ecs.FargateService(stack, 'FargateService', {
          cluster,
          taskDefinition,
        });
      }, /Supplied TaskDefinition is not configured for compatibility with Fargate/);

      test.done();
    },

    'errors when no container specified on task definition'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      // THEN
      test.throws(() => {
        new ecs.FargateService(stack, 'FargateService', {
          cluster,
          taskDefinition,
        });
      });

      test.done();
    },

    'allows specifying assignPublicIP as enabled'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      });

      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        assignPublicIp: true
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::ECS::Service', {
        NetworkConfiguration: {
          AwsvpcConfiguration: {
            AssignPublicIp: 'ENABLED',
          }
        }
      }));

      test.done();
    },

    'allows specifying 0 for minimumHealthyPercent'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      });

      new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        minHealthyPercent: 0,
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::ECS::Service', {
        DeploymentConfiguration: {
          MinimumHealthyPercent: 0,
        }
      }));

      test.done();
    },
  },

  'When setting up a health check': {
    'grace period is respected'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
      });

      // WHEN
      new ecs.FargateService(stack, 'Svc', {
        cluster,
        taskDefinition,
        healthCheckGracePeriod: cdk.Duration.seconds(10)
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::Service', {
        HealthCheckGracePeriodSeconds: 10
      }));

      test.done();
    },
  },

  'When adding an app load balancer': {
    'allows auto scaling by ALB request per target'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
      });
      container.addPortMappings({ containerPort: 8000 });
      const service = new ecs.FargateService(stack, 'Service', { cluster, taskDefinition});

      const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
      const listener = lb.addListener('listener', { port: 80 });
      const targetGroup = listener.addTargets('target', {
        port: 80,
        targets: [service]
      });

      // WHEN
      const capacity = service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 1 });
      capacity.scaleOnRequestCount('ScaleOnRequests', {
        requestsPerTarget: 1000,
        targetGroup
      });

      // THEN
      expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
        MaxCapacity: 10,
        MinCapacity: 1,
        ResourceId: {
          'Fn::Join': [
            '',
            [
              'service/',
              {
                Ref: 'EcsCluster97242B84'
              },
              '/',
              {
                'Fn::GetAtt': [
                  'ServiceD69D759B',
                  'Name'
                ]
              }
            ]
          ]
        },
      }));

      expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
        TargetTrackingScalingPolicyConfiguration: {
          PredefinedMetricSpecification: {
            PredefinedMetricType: 'ALBRequestCountPerTarget',
            ResourceLabel: {
              'Fn::Join': ['', [
                { 'Fn::Select': [1, { 'Fn::Split': ['/', { Ref: 'lblistener657ADDEC' }] }] }, '/',
                { 'Fn::Select': [2, { 'Fn::Split': ['/', { Ref: 'lblistener657ADDEC' }] }] }, '/',
                { 'Fn::Select': [3, { 'Fn::Split': ['/', { Ref: 'lblistener657ADDEC' }] }] }, '/',
                { 'Fn::GetAtt': ['lblistenertargetGroupC7489D1E', 'TargetGroupFullName'] }
              ]]
            }
          },
          TargetValue: 1000
        }
      }));

      expect(stack).to(haveResource('AWS::ECS::Service', {
        // if any load balancer is configured and healthCheckGracePeriodSeconds is not
        // set, then it should default to 60 seconds.
        HealthCheckGracePeriodSeconds: 60
      }));

      test.done();
    },

    'allows auto scaling by ALB with new service arn format'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
      });
      container.addPortMappings({ containerPort: 8000 });

      const service = new ecs.FargateService(stack, 'Service', {
        cluster,
        taskDefinition
      });

      const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
      const listener = lb.addListener('listener', { port: 80 });
      const targetGroup = listener.addTargets('target', {
        port: 80,
        targets: [service]
      });

      // WHEN
      const capacity = service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 1 });
      capacity.scaleOnRequestCount('ScaleOnRequests', {
        requestsPerTarget: 1000,
        targetGroup
      });

      // THEN
      expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
        MaxCapacity: 10,
        MinCapacity: 1,
        ResourceId: {
          'Fn::Join': [
            '',
            [
              'service/',
              {
                Ref: 'EcsCluster97242B84'
              },
              '/',
              {
                'Fn::GetAtt': [
                  'ServiceD69D759B',
                  'Name'
                ]
              }
            ]
          ]
        },
      }));

      test.done();
    },

    'allows specify any existing container name and port in a service': {
      'with default setting'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
        const container = taskDefinition.addContainer('MainContainer', {
          image: ecs.ContainerImage.fromRegistry('hello'),
        });
        container.addPortMappings({ containerPort: 8000 });
        container.addPortMappings({ containerPort: 8001 });

        const service = new ecs.FargateService(stack, 'Service', {
          cluster,
          taskDefinition
        });

        // WHEN
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
        const listener = lb.addListener('listener', { port: 80 });
        listener.addTargets('target', {
          port: 80,
          targets: [service.loadBalancerTarget({
            containerName: 'MainContainer'
          })]
        });

        // THEN
        expect(stack).to(haveResource('AWS::ECS::Service', {
          LoadBalancers: [
            {
              ContainerName: 'MainContainer',
              ContainerPort: 8000,
              TargetGroupArn: {
                Ref: 'lblistenertargetGroupC7489D1E'
              }
            }
          ],
        }));

        expect(stack).to(haveResource('AWS::EC2::SecurityGroupIngress', {
          Description: 'Load balancer to target',
          FromPort: 8000,
          ToPort: 8000,
        }));

        expect(stack).to(haveResource('AWS::EC2::SecurityGroupEgress', {
          Description: 'Load balancer to target',
          FromPort: 8000,
          ToPort: 8000
        }));

        test.done();
      },

      'with TCP protocol'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
        const container = taskDefinition.addContainer('MainContainer', {
          image: ecs.ContainerImage.fromRegistry('hello'),
        });
        container.addPortMappings({ containerPort: 8000 });
        container.addPortMappings({ containerPort: 8001, protocol: ecs.Protocol.TCP });

        const service = new ecs.FargateService(stack, 'Service', {
          cluster,
          taskDefinition
        });

        // WHEN
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
        const listener = lb.addListener('listener', { port: 80 });

        // THEN
        listener.addTargets('target', {
          port: 80,
          targets: [service.loadBalancerTarget({
            containerName: 'MainContainer',
            containerPort: 8001,
            protocol: ecs.Protocol.TCP
          })]
        });

        test.done();
      },

      'with UDP protocol'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
        const container = taskDefinition.addContainer('MainContainer', {
          image: ecs.ContainerImage.fromRegistry('hello'),
        });
        container.addPortMappings({ containerPort: 8000 });
        container.addPortMappings({ containerPort: 8001, protocol: ecs.Protocol.UDP });

        const service = new ecs.FargateService(stack, 'Service', {
          cluster,
          taskDefinition
        });

        // WHEN
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
        const listener = lb.addListener('listener', { port: 80 });

        // THEN
        listener.addTargets('target', {
          port: 80,
          targets: [service.loadBalancerTarget({
            containerName: 'MainContainer',
            containerPort: 8001,
            protocol: ecs.Protocol.UDP
          })]
        });

        test.done();
      },

      'throws when protocol does not match'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
        const container = taskDefinition.addContainer('MainContainer', {
          image: ecs.ContainerImage.fromRegistry('hello'),
        });
        container.addPortMappings({ containerPort: 8000 });
        container.addPortMappings({ containerPort: 8001, protocol: ecs.Protocol.UDP });

        const service = new ecs.FargateService(stack, 'Service', {
          cluster,
          taskDefinition
        });

        // WHEN
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
        const listener = lb.addListener('listener', { port: 80 });

        // THEN
        test.throws(() => {
          listener.addTargets('target', {
            port: 80,
            targets: [service.loadBalancerTarget({
              containerName: 'MainContainer',
              containerPort: 8001,
              protocol: ecs.Protocol.TCP
            })]
          });
        }, /Container 'FargateTaskDef\/MainContainer' has no mapping for port 8001 and protocol tcp. Did you call "container.addPortMappings\(\)"\?/);

        test.done();
      },

      'throws when port does not match'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
        const container = taskDefinition.addContainer('MainContainer', {
          image: ecs.ContainerImage.fromRegistry('hello'),
        });
        container.addPortMappings({ containerPort: 8000 });
        container.addPortMappings({ containerPort: 8001 });

        const service = new ecs.FargateService(stack, 'Service', {
          cluster,
          taskDefinition
        });

        // WHEN
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
        const listener = lb.addListener('listener', { port: 80 });

        // THEN
        test.throws(() => {
          listener.addTargets('target', {
            port: 80,
            targets: [service.loadBalancerTarget({
              containerName: 'MainContainer',
              containerPort: 8002,
            })]
          });
        }, /Container 'FargateTaskDef\/MainContainer' has no mapping for port 8002 and protocol tcp. Did you call "container.addPortMappings\(\)"\?/);

        test.done();
      },

      'throws when container does not exist'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
        const container = taskDefinition.addContainer('MainContainer', {
          image: ecs.ContainerImage.fromRegistry('hello'),
        });
        container.addPortMappings({ containerPort: 8000 });
        container.addPortMappings({ containerPort: 8001 });

        const service = new ecs.FargateService(stack, 'Service', {
          cluster,
          taskDefinition
        });

        // WHEN
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
        const listener = lb.addListener('listener', { port: 80 });

        // THEN
        test.throws(() => {
          listener.addTargets('target', {
            port: 80,
            targets: [service.loadBalancerTarget({
              containerName: 'SideContainer',
              containerPort: 8001,
            })]
          });
        }, /No container named 'SideContainer'. Did you call "addContainer()"?/);

        test.done();
      }
    },

    'allows load balancing to any container and port of service': {
      'with application load balancers': {
        'with default target group port and protocol'(test: Test) {
          // GIVEN
          const stack = new cdk.Stack();
          const vpc = new ec2.Vpc(stack, 'MyVpc', {});
          const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
          const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
          const container = taskDefinition.addContainer('MainContainer', {
            image: ecs.ContainerImage.fromRegistry('hello'),
          });
          container.addPortMappings({ containerPort: 8000 });

          const service = new ecs.FargateService(stack, 'Service', {
            cluster,
            taskDefinition
          });

          // WHEN
          const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
          const listener = lb.addListener('listener', { port: 80 });

          service.registerLoadBalancerTargets(
            {
              containerName: 'MainContainer',
              containerPort: 8000,
              listener: ecs.ListenerConfig.applicationListener(listener),
              newTargetGroupId: 'target1',
            }
          );

          // THEN
          expect(stack).to(haveResource('AWS::ECS::Service', {
            LoadBalancers: [
              {
                ContainerName: 'MainContainer',
                ContainerPort: 8000,
                TargetGroupArn: {
                  Ref: 'lblistenertarget1Group1A1A5C9E'
                }
              }
            ],
          }));

          expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
            Port: 80,
            Protocol: 'HTTP',
          }));

          test.done();
        },

        'with default target group port and HTTP protocol'(test: Test) {
          // GIVEN
          const stack = new cdk.Stack();
          const vpc = new ec2.Vpc(stack, 'MyVpc', {});
          const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
          const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
          const container = taskDefinition.addContainer('MainContainer', {
            image: ecs.ContainerImage.fromRegistry('hello'),
          });
          container.addPortMappings({ containerPort: 8000 });

          const service = new ecs.FargateService(stack, 'Service', {
            cluster,
            taskDefinition
          });

          // WHEN
          const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
          const listener = lb.addListener('listener', { port: 80 });

          service.registerLoadBalancerTargets(
            {
              containerName: 'MainContainer',
              containerPort: 8000,
              listener: ecs.ListenerConfig.applicationListener(listener, {
                protocol: elbv2.ApplicationProtocol.HTTP
              }),
              newTargetGroupId: 'target1',
            }
          );

          // THEN
          expect(stack).to(haveResource('AWS::ECS::Service', {
            LoadBalancers: [
              {
                ContainerName: 'MainContainer',
                ContainerPort: 8000,
                TargetGroupArn: {
                  Ref: 'lblistenertarget1Group1A1A5C9E'
                }
              }
            ],
          }));

          expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
            Port: 80,
            Protocol: 'HTTP',
          }));

          test.done();
        },

        'with default target group port and HTTPS protocol'(test: Test) {
          // GIVEN
          const stack = new cdk.Stack();
          const vpc = new ec2.Vpc(stack, 'MyVpc', {});
          const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
          const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
          const container = taskDefinition.addContainer('MainContainer', {
            image: ecs.ContainerImage.fromRegistry('hello'),
          });
          container.addPortMappings({ containerPort: 8000 });

          const service = new ecs.FargateService(stack, 'Service', {
            cluster,
            taskDefinition
          });

          // WHEN
          const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
          const listener = lb.addListener('listener', { port: 80 });

          service.registerLoadBalancerTargets(
            {
              containerName: 'MainContainer',
              containerPort: 8000,
              listener: ecs.ListenerConfig.applicationListener(listener, {
                protocol: elbv2.ApplicationProtocol.HTTPS
              }),
              newTargetGroupId: 'target1',
            }
          );

          // THEN
          expect(stack).to(haveResource('AWS::ECS::Service', {
            LoadBalancers: [
              {
                ContainerName: 'MainContainer',
                ContainerPort: 8000,
                TargetGroupArn: {
                  Ref: 'lblistenertarget1Group1A1A5C9E'
                }
              }
            ],
          }));

          expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
            Port: 443,
            Protocol: 'HTTPS',
          }));

          test.done();
        },

        'with any target group port and protocol'(test: Test) {
          // GIVEN
          const stack = new cdk.Stack();
          const vpc = new ec2.Vpc(stack, 'MyVpc', {});
          const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
          const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
          const container = taskDefinition.addContainer('MainContainer', {
            image: ecs.ContainerImage.fromRegistry('hello'),
          });
          container.addPortMappings({ containerPort: 8000 });

          const service = new ecs.FargateService(stack, 'Service', {
            cluster,
            taskDefinition
          });

          // WHEN
          const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
          const listener = lb.addListener('listener', { port: 80 });

          service.registerLoadBalancerTargets(
            {
              containerName: 'MainContainer',
              containerPort: 8000,
              listener: ecs.ListenerConfig.applicationListener(listener, {
                port: 83,
                protocol: elbv2.ApplicationProtocol.HTTP
              }),
              newTargetGroupId: 'target1'
            }
          );

          // THEN
          expect(stack).to(haveResource('AWS::ECS::Service', {
            LoadBalancers: [
              {
                ContainerName: 'MainContainer',
                ContainerPort: 8000,
                TargetGroupArn: {
                  Ref: 'lblistenertarget1Group1A1A5C9E'
                }
              }
            ],
          }));

          expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
            Port: 83,
            Protocol: 'HTTP',
          }));

          test.done();
        },
      },

      'with network load balancers': {
        'with default target group port'(test: Test) {
          // GIVEN
          const stack = new cdk.Stack();
          const vpc = new ec2.Vpc(stack, 'MyVpc', {});
          const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
          const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
          const container = taskDefinition.addContainer('MainContainer', {
            image: ecs.ContainerImage.fromRegistry('hello'),
          });
          container.addPortMappings({ containerPort: 8000 });

          const service = new ecs.FargateService(stack, 'Service', {
            cluster,
            taskDefinition
          });

          // WHEN
          const lb = new elbv2.NetworkLoadBalancer(stack, 'lb', { vpc });
          const listener = lb.addListener('listener', { port: 80 });

          service.registerLoadBalancerTargets(
            {
              containerName: 'MainContainer',
              containerPort: 8000,
              listener: ecs.ListenerConfig.networkListener(listener),
              newTargetGroupId: 'target1',
            }
          );

          // THEN
          expect(stack).to(haveResource('AWS::ECS::Service', {
            LoadBalancers: [
              {
                ContainerName: 'MainContainer',
                ContainerPort: 8000,
                TargetGroupArn: {
                  Ref: 'lblistenertarget1Group1A1A5C9E'
                }
              }
            ],
          }));

          expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
            Port: 80,
            Protocol: 'TCP',
          }));

          test.done();
        },

        'with any target group port'(test: Test) {
          // GIVEN
          const stack = new cdk.Stack();
          const vpc = new ec2.Vpc(stack, 'MyVpc', {});
          const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
          const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
          const container = taskDefinition.addContainer('MainContainer', {
            image: ecs.ContainerImage.fromRegistry('hello'),
          });
          container.addPortMappings({ containerPort: 8000 });

          const service = new ecs.FargateService(stack, 'Service', {
            cluster,
            taskDefinition
          });

          // WHEN
          const lb = new elbv2.NetworkLoadBalancer(stack, 'lb', { vpc });
          const listener = lb.addListener('listener', { port: 80 });

          service.registerLoadBalancerTargets(
            {
              containerName: 'MainContainer',
              containerPort: 8000,
              listener: ecs.ListenerConfig.networkListener(listener, {
                port: 81
              }),
              newTargetGroupId: 'target1'
            }
          );

          // THEN
          expect(stack).to(haveResource('AWS::ECS::Service', {
            LoadBalancers: [
              {
                ContainerName: 'MainContainer',
                ContainerPort: 8000,
                TargetGroupArn: {
                  Ref: 'lblistenertarget1Group1A1A5C9E'
                }
              }
            ],
          }));

          expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
            Port: 81,
            Protocol: 'TCP',
          }));

          test.done();
        },
      }
    }
  },

  'allows scaling on a specified scheduled time'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    const container = taskDefinition.addContainer('MainContainer', {
      image: ecs.ContainerImage.fromRegistry('hello'),
    });
    container.addPortMappings({ containerPort: 8000 });

    const service = new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition
    });

    // WHEN
    const capacity = service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 1 });
    capacity.scaleOnSchedule('ScaleOnSchedule', {
      schedule: appscaling.Schedule.cron({ hour: '8', minute: '0' }),
      minCapacity: 10,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalableTarget', {
      ScheduledActions: [
        {
          ScalableTargetAction: {
            MinCapacity: 10
          },
          Schedule: 'cron(0 8 * * ? *)',
          ScheduledActionName: 'ScaleOnSchedule'
        }
      ]
    }));

    test.done();
  },

  'allows scaling on a specified metric value'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    const container = taskDefinition.addContainer('MainContainer', {
      image: ecs.ContainerImage.fromRegistry('hello'),
    });
    container.addPortMappings({ containerPort: 8000 });

    const service = new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition
    });

    // WHEN
    const capacity = service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 1 });
    capacity.scaleOnMetric('ScaleOnMetric', {
      metric: new cloudwatch.Metric({ namespace: 'Test', metricName: 'Metric' }),
      scalingSteps: [
        { upper: 0, change: -1 },
        { lower: 100, change: +1 },
        { lower: 500, change: +5 }
      ]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'StepScaling',
      ScalingTargetId: {
        Ref: 'ServiceTaskCountTarget23E25614'
      },
      StepScalingPolicyConfiguration: {
        AdjustmentType: 'ChangeInCapacity',
        MetricAggregationType: 'Average',
        StepAdjustments: [
          {
            MetricIntervalUpperBound: 0,
            ScalingAdjustment: -1
          }
        ]
      }
    }));

    test.done();
  },

  'allows scaling on a target CPU utilization'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    const container = taskDefinition.addContainer('MainContainer', {
      image: ecs.ContainerImage.fromRegistry('hello'),
    });
    container.addPortMappings({ containerPort: 8000 });

    const service = new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition
    });

    // WHEN
    const capacity = service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 1 });
    capacity.scaleOnCpuUtilization('ScaleOnCpu', {
      targetUtilizationPercent: 30
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'ECSServiceAverageCPUUtilization' },
        TargetValue: 30
      }
    }));

    test.done();
  },

  'allows scaling on memory utilization'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    const container = taskDefinition.addContainer('MainContainer', {
      image: ecs.ContainerImage.fromRegistry('hello'),
    });
    container.addPortMappings({ containerPort: 8000 });

    const service = new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition
    });

    // WHEN
    const capacity = service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 1 });
    capacity.scaleOnMemoryUtilization('ScaleOnMemory', {
      targetUtilizationPercent: 30
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        PredefinedMetricSpecification: { PredefinedMetricType: 'ECSServiceAverageMemoryUtilization' },
        TargetValue: 30
      }
    }));

    test.done();
  },

  'allows scaling on custom CloudWatch metric'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    const container = taskDefinition.addContainer('MainContainer', {
      image: ecs.ContainerImage.fromRegistry('hello'),
    });
    container.addPortMappings({ containerPort: 8000 });

    const service = new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition
    });

    // WHEN
    const capacity = service.autoScaleTaskCount({ maxCapacity: 10, minCapacity: 1 });
    capacity.scaleToTrackCustomMetric('ScaleOnCustomMetric', {
      metric: new cloudwatch.Metric({ namespace: 'Test', metricName: 'Metric' }),
      targetValue: 5
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApplicationAutoScaling::ScalingPolicy', {
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        CustomizedMetricSpecification: {
          MetricName: 'Metric',
          Namespace: 'Test',
          Statistic: 'Average'
        },
        TargetValue: 5
      }
    }));

    test.done();
  },

  'When enabling service discovery': {
    'throws if namespace has not been added to cluster'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512
      });
      container.addPortMappings({ containerPort: 8000 });

      // THEN
      test.throws(() => {
        new ecs.FargateService(stack, 'Service', {
          cluster,
          taskDefinition,
          cloudMapOptions: {
            name: 'myApp',
          }
        });
      }, /Cannot enable service discovery if a Cloudmap Namespace has not been created in the cluster./);

      test.done();
    },

    'creates cloud map service for Private DNS namespace'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
      });
      container.addPortMappings({ containerPort: 8000 });

      // WHEN
      cluster.addDefaultCloudMapNamespace({
        name: 'foo.com',
        type: cloudmap.NamespaceType.DNS_PRIVATE
      });

      new ecs.FargateService(stack, 'Service', {
        cluster,
        taskDefinition,
        cloudMapOptions: {
          name: 'myApp'
        }
      });

      // THEN
      expect(stack).to(haveResource('AWS::ServiceDiscovery::Service', {
        DnsConfig: {
          DnsRecords: [
            {
              TTL: 60,
              Type: 'A'
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
        Name: 'myApp',
        NamespaceId: {
          'Fn::GetAtt': [
            'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
            'Id'
          ]
        }
      }));

      test.done();
    },

    'creates AWS Cloud Map service for Private DNS namespace with SRV records with proper defaults'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });

      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512
      });
      container.addPortMappings({ containerPort: 8000 });

      // WHEN
      cluster.addDefaultCloudMapNamespace({
        name: 'foo.com',
        type: cloudmap.NamespaceType.DNS_PRIVATE
      });

      new ecs.FargateService(stack, 'Service', {
        cluster,
        taskDefinition,
        cloudMapOptions: {
          name: 'myApp',
          dnsRecordType: cloudmap.DnsRecordType.SRV,
        }
      });

      // THEN
      expect(stack).to(haveResource('AWS::ServiceDiscovery::Service', {
        DnsConfig: {
          DnsRecords: [
            {
              TTL: 60,
              Type: 'SRV'
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
        Name: 'myApp',
        NamespaceId: {
          'Fn::GetAtt': [
            'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
            'Id'
          ]
        }
      }));

      test.done();
    },

    'creates AWS Cloud Map service for Private DNS namespace with SRV records with overriden defaults'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });

      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
      const container = taskDefinition.addContainer('MainContainer', {
        image: ecs.ContainerImage.fromRegistry('hello'),
        memoryLimitMiB: 512
      });
      container.addPortMappings({ containerPort: 8000 });

      // WHEN
      cluster.addDefaultCloudMapNamespace({
        name: 'foo.com',
        type: cloudmap.NamespaceType.DNS_PRIVATE
      });

      new ecs.FargateService(stack, 'Service', {
        cluster,
        taskDefinition,
        cloudMapOptions: {
          name: 'myApp',
          dnsRecordType: cloudmap.DnsRecordType.SRV,
          dnsTtl: cdk.Duration.seconds(10),
        }
      });

      // THEN
      expect(stack).to(haveResource('AWS::ServiceDiscovery::Service', {
        DnsConfig: {
          DnsRecords: [
            {
              TTL: 10,
              Type: 'SRV'
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
        Name: 'myApp',
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
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    taskDefinition.addContainer('Container', {
      image: ecs.ContainerImage.fromRegistry('hello')
    });

    // WHEN
    const service = new ecs.FargateService(stack, 'Service', {
      cluster,
      taskDefinition,
    });

    // THEN
    test.deepEqual(stack.resolve(service.metricCpuUtilization()), {
      dimensions: {
        ClusterName: { Ref: 'EcsCluster97242B84' },
        ServiceName: { 'Fn::GetAtt': ['ServiceD69D759B', 'Name'] }
      },
      namespace: 'AWS/ECS',
      metricName: 'CPUUtilization',
      period: cdk.Duration.minutes(5),
      statistic: 'Average'
    });

    test.done();
  },

  'When import a Fargate Service': {
    'with serviceArn'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const cluster = new ecs.Cluster(stack, 'EcsCluster');

      // WHEN
      const service = ecs.FargateService.fromFargateServiceAttributes(stack, 'EcsService', {
        serviceArn: 'arn:aws:ecs:us-west-2:123456789012:service/my-http-service',
        cluster,
      });

      // THEN
      test.equal(service.serviceArn, 'arn:aws:ecs:us-west-2:123456789012:service/my-http-service');
      test.equal(service.serviceName, 'my-http-service');

      test.done();
    },

    'with serviceName'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const pseudo = new cdk.ScopedAws(stack);
      const cluster = new ecs.Cluster(stack, 'EcsCluster');

      // WHEN
      const service = ecs.FargateService.fromFargateServiceAttributes(stack, 'EcsService', {
        serviceName: 'my-http-service',
        cluster,
      });

      // THEN
      test.deepEqual(stack.resolve(service.serviceArn), stack.resolve(`arn:${pseudo.partition}:ecs:${pseudo.region}:${pseudo.accountId}:service/my-http-service`));
      test.equal(service.serviceName, 'my-http-service');

      test.done();
    },

    'throws an exception if both serviceArn and serviceName were provided for fromEc2ServiceAttributes'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const cluster = new ecs.Cluster(stack, 'EcsCluster');

      test.throws(() => {
        ecs.FargateService.fromFargateServiceAttributes(stack, 'EcsService', {
          serviceArn: 'arn:aws:ecs:us-west-2:123456789012:service/my-http-service',
          serviceName: 'my-http-service',
          cluster,
        });
      }, /only specify either serviceArn or serviceName/);

      test.done();
    },

    'throws an exception if neither serviceArn nor serviceName were provided for fromEc2ServiceAttributes'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const cluster = new ecs.Cluster(stack, 'EcsCluster');

      test.throws(() => {
        ecs.FargateService.fromFargateServiceAttributes(stack, 'EcsService', {
          cluster,
        });
      }, /only specify either serviceArn or serviceName/);

      test.done();
    },
  },
};

import { Match, Template } from '@aws-cdk/assertions';
import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import * as ec2 from '@aws-cdk/aws-ec2';
import { MachineImage, Vpc } from '@aws-cdk/aws-ec2';
import {
  AsgCapacityProvider,
  AwsLogDriver,
  Cluster,
  ContainerImage,
  Ec2TaskDefinition,
  PropagatedTagSource,
  Protocol,
  PlacementStrategy,
  PlacementConstraint,
} from '@aws-cdk/aws-ecs';
import { ApplicationProtocol, SslPolicy } from '@aws-cdk/aws-elasticloadbalancingv2';
import { CompositePrincipal, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { PublicHostedZone } from '@aws-cdk/aws-route53';
import { NamespaceType } from '@aws-cdk/aws-servicediscovery';
import { Duration, Stack } from '@aws-cdk/core';
import { ApplicationMultipleTargetGroupsEc2Service, NetworkMultipleTargetGroupsEc2Service } from '../../lib';

describe('When Application Load Balancer', () => {
  test('test ECS ALB construct with default settings', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    // WHEN
    new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
      cluster,
      memoryLimitMiB: 1024,
      taskImageOptions: {
        image: ContainerImage.fromRegistry('test'),
      },
    });

    // THEN - stack contains a load balancer, a service, and a target group.
    Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      LaunchType: 'EC2',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Image: 'test',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'ServiceTaskDefwebLogGroup2A898F61',
              },
              'awslogs-stream-prefix': 'Service',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
          Memory: 1024,
          Name: 'web',
          PortMappings: [
            {
              ContainerPort: 80,
              HostPort: 0,
              Protocol: 'tcp',
            },
          ],
        }),
      ],
      NetworkMode: 'bridge',
      RequiresCompatibilities: [
        'EC2',
      ],
    });
  });

  test('test ECS ALB construct with all settings', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));
    const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });

    // WHEN
    new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
      cluster,
      memoryLimitMiB: 1024,
      taskImageOptions: {
        image: ContainerImage.fromRegistry('test'),
        containerName: 'myContainer',
        containerPorts: [80, 90],
        enableLogging: false,
        environment: {
          TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
          TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
        },
        logDriver: new AwsLogDriver({
          streamPrefix: 'TestStream',
        }),
        family: 'Ec2TaskDef',
        executionRole: new Role(stack, 'ExecutionRole', {
          path: '/',
          assumedBy: new CompositePrincipal(
            new ServicePrincipal('ecs.amazonaws.com'),
            new ServicePrincipal('ecs-tasks.amazonaws.com'),
          ),
        }),
        taskRole: new Role(stack, 'TaskRole', {
          assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
        }),
        dockerLabels: { label1: 'labelValue1', label2: 'labelValue2' },
      },
      cpu: 256,
      desiredCount: 3,
      enableECSManagedTags: true,
      enableExecuteCommand: true,
      healthCheckGracePeriod: Duration.millis(2000),
      loadBalancers: [
        {
          name: 'lb',
          domainName: 'api.example.com',
          domainZone: zone,
          publicLoadBalancer: false,
          listeners: [
            {
              name: 'listener',
              protocol: ApplicationProtocol.HTTPS,
              certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
              sslPolicy: SslPolicy.TLS12_EXT,
            },
          ],
        },
      ],
      propagateTags: PropagatedTagSource.SERVICE,
      memoryReservationMiB: 1024,
      serviceName: 'myService',
      targetGroups: [
        {
          containerPort: 80,
          listener: 'listener',
        },
        {
          containerPort: 90,
          listener: 'listener',
          pathPattern: 'a/b/c',
          priority: 10,
          protocol: Protocol.TCP,
        },
      ],
      placementStrategies: [PlacementStrategy.spreadAcrossInstances(), PlacementStrategy.packedByCpu(), PlacementStrategy.randomly()],
      placementConstraints: [PlacementConstraint.memberOf('attribute:ecs.instance-type =~ m5a.*')],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DesiredCount: 3,
      LaunchType: 'EC2',
      EnableECSManagedTags: true,
      EnableExecuteCommand: true,
      HealthCheckGracePeriodSeconds: 2,
      LoadBalancers: [
        {
          ContainerName: 'myContainer',
          ContainerPort: 80,
          TargetGroupArn: {
            Ref: 'ServicelblistenerECSTargetGroupmyContainer80GroupAD83584A',
          },
        },
        {
          ContainerName: 'myContainer',
          ContainerPort: 90,
          TargetGroupArn: {
            Ref: 'ServicelblistenerECSTargetGroupmyContainer90GroupF5A6D3A0',
          },
        },
      ],
      PropagateTags: 'SERVICE',
      ServiceName: 'myService',
      PlacementConstraints: [{ Type: 'memberOf', Expression: 'attribute:ecs.instance-type =~ m5a.*' }],
      PlacementStrategies: [{ Field: 'instanceId', Type: 'spread' }, { Field: 'CPU', Type: 'binpack' }, { Type: 'random' }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          Environment: [
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE1',
              Value: 'test environment variable 1 value',
            },
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE2',
              Value: 'test environment variable 2 value',
            },
          ],
          Essential: true,
          Image: 'test',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'ServiceTaskDefmyContainerLogGroup0A87368B',
              },
              'awslogs-stream-prefix': 'TestStream',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
          Memory: 1024,
          MemoryReservation: 1024,
          Name: 'myContainer',
          PortMappings: [
            {
              ContainerPort: 80,
              HostPort: 0,
              Protocol: 'tcp',
            },
            {
              ContainerPort: 90,
              HostPort: 0,
              Protocol: 'tcp',
            },
          ],
          DockerLabels: {
            label1: 'labelValue1',
            label2: 'labelValue2',
          },
        },
      ],
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'ExecutionRole605A040B',
          'Arn',
        ],
      },
      Family: 'ServiceTaskDef79D79521',
      NetworkMode: 'bridge',
      RequiresCompatibilities: [
        'EC2',
      ],
      TaskRoleArn: {
        'Fn::GetAtt': [
          'TaskRole30FC0FBB',
          'Arn',
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Port: 443,
      Protocol: 'HTTPS',
      Certificates: [{
        CertificateArn: 'helloworld',
      }],
      SslPolicy: SslPolicy.TLS12_EXT,
    });
  });

  test('able to pass pre-defined task definition', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    const taskDefinition = new Ec2TaskDefinition(stack, 'Ec2TaskDef');
    const container = taskDefinition.addContainer('web', {
      image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 512,
    });
    container.addPortMappings({
      containerPort: 80,
    });

    // WHEN
    new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
      cluster,
      taskDefinition,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Essential: true,
          Image: 'amazon/amazon-ecs-sample',
          Memory: 512,
          Name: 'web',
          PortMappings: [
            {
              ContainerPort: 80,
              HostPort: 0,
              Protocol: 'tcp',
            },
          ],
        },
      ],
      Family: 'Ec2TaskDef',
      NetworkMode: 'bridge',
      RequiresCompatibilities: [
        'EC2',
      ],
    });
  });

  test('able to output correct load balancer DNS and URLs for each protocol type', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));
    const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });

    // WHEN
    new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
      cluster,
      memoryLimitMiB: 1024,
      taskImageOptions: {
        image: ContainerImage.fromRegistry('test'),
      },
      loadBalancers: [
        {
          name: 'lb1',
          domainName: 'api.example.com',
          domainZone: zone,
          listeners: [
            {
              name: 'listener1',
              protocol: ApplicationProtocol.HTTPS,
              certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
            },
            {
              name: 'listener2',
              protocol: ApplicationProtocol.HTTP,
            },
          ],
        },
        {
          name: 'lb3',
          listeners: [
            {
              name: 'listener3',
              protocol: ApplicationProtocol.HTTP,
            },
          ],
        },
      ],
      targetGroups: [
        {
          containerPort: 80,
          listener: 'listener1',
        },
        {
          containerPort: 90,
          listener: 'listener2',
        },
        {
          containerPort: 70,
          listener: 'listener3',
        },
      ],
    });

    // THEN
    const outputs = Template.fromStack(stack).findOutputs('*');
    expect(outputs).toEqual({
      ServiceLoadBalancerDNSlb175E78BFE: {
        Value: {
          'Fn::GetAtt': [
            'Servicelb152C7F4F9',
            'DNSName',
          ],
        },
      },
      ServiceServiceURLlb1https5C0C4079: {
        Value: {
          'Fn::Join': [
            '',
            [
              'https://',
              {
                Ref: 'ServiceDNSlb12BA1FAD3',
              },
            ],
          ],
        },
      },
      ServiceServiceURLlb1http65F0546A: {
        Value: {
          'Fn::Join': [
            '',
            [
              'http://',
              {
                Ref: 'ServiceDNSlb12BA1FAD3',
              },
            ],
          ],
        },
      },
      ServiceLoadBalancerDNSlb32F273F27: {
        Value: {
          'Fn::GetAtt': [
            'Servicelb3A583D5E7',
            'DNSName',
          ],
        },
      },
      ServiceServiceURLlb3http40F9CADC: {
        Value: {
          'Fn::Join': [
            '',
            [
              'http://',
              {
                'Fn::GetAtt': [
                  'Servicelb3A583D5E7',
                  'DNSName',
                ],
              },
            ],
          ],
        },
      },
    });
  });

  test('errors if no essential container in pre-defined task definition', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    const taskDefinition = new Ec2TaskDefinition(stack, 'Ec2TaskDef');

    // THEN
    expect(() => {
      new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        taskDefinition,
      });
    }).toThrow(/At least one essential container must be specified/);
  });

  test('set default load balancer, listener, target group correctly', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });

    // WHEN
    const ecsService = new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
      vpc,
      memoryLimitMiB: 1024,
      taskImageOptions: {
        image: ContainerImage.fromRegistry('test'),
      },
      loadBalancers: [
        {
          name: 'lb1',
          listeners: [
            {
              name: 'listener1',
            },
          ],
        },
        {
          name: 'lb2',
          domainName: 'api.example.com',
          domainZone: zone,
          listeners: [
            {
              name: 'listener2',
            },
            {
              name: 'listener3',
              protocol: ApplicationProtocol.HTTPS,
              certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
            },
          ],
        },
      ],
      targetGroups: [
        {
          containerPort: 80,
        },
        {
          containerPort: 90,
        },
      ],
    });

    // THEN
    expect(ecsService.loadBalancer.node.id).toEqual('lb1');
    expect(ecsService.listener.node.id).toEqual('listener1');
    expect(ecsService.targetGroup.node.id).toEqual('ECSTargetGroupweb80Group');
  });

  test('setting vpc and cluster throws error', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });

    // WHEN
    expect(() => new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
      cluster,
      vpc,
      taskImageOptions: {
        image: ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
    })).toThrow(/You can only specify either vpc or cluster. Alternatively, you can leave both blank/);
  });

  test('creates AWS Cloud Map service for Private DNS namespace', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'MyVpc', {});
    const cluster = new Cluster(stack, 'EcsCluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    // WHEN
    cluster.addDefaultCloudMapNamespace({
      name: 'foo.com',
      type: NamespaceType.DNS_PRIVATE,
    });

    new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ContainerImage.fromRegistry('hello'),
      },
      cloudMapOptions: {
        name: 'myApp',
      },
      memoryLimitMiB: 512,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      ServiceRegistries: [
        {
          ContainerName: 'web',
          ContainerPort: 80,
          RegistryArn: {
            'Fn::GetAtt': [
              'ServiceCloudmapServiceDE76B29D',
              'Arn',
            ],
          },
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Service', {
      DnsConfig: {
        DnsRecords: [
          {
            TTL: 60,
            Type: 'SRV',
          },
        ],
        NamespaceId: {
          'Fn::GetAtt': [
            'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
            'Id',
          ],
        },
        RoutingPolicy: 'MULTIVALUE',
      },
      HealthCheckCustomConfig: {
        FailureThreshold: 1,
      },
      Name: 'myApp',
      NamespaceId: {
        'Fn::GetAtt': [
          'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
          'Id',
        ],
      },
    });
  });

  test('errors when setting both taskDefinition and taskImageOptions', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    const taskDefinition = new Ec2TaskDefinition(stack, 'Ec2TaskDef');
    taskDefinition.addContainer('test', {
      image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 512,
    });

    // THEN
    expect(() => {
      new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
        taskDefinition,
      });
    }).toThrow(/You must specify only one of TaskDefinition or TaskImageOptions./);
  });

  test('errors when setting neither taskDefinition nor taskImageOptions', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    // THEN
    expect(() => {
      new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
      });
    }).toThrow(/You must specify one of: taskDefinition or image/);
  });

  test('errors when setting domainName but not domainZone', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    // THEN
    expect(() => {
      new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
        loadBalancers: [
          {
            name: 'lb1',
            domainName: 'api.example.com',
            listeners: [
              {
                name: 'listener1',
              },
            ],
          },
        ],
      });
    }).toThrow(/A Route53 hosted domain zone name is required to configure the specified domain name/);
  });

  test('errors when loadBalancers is empty', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
        loadBalancers: [],
      });
    }).toThrow(/At least one load balancer must be specified/);
  });

  test('errors when targetGroups is empty', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
        targetGroups: [],
      });
    }).toThrow(/At least one target group should be specified/);
  });

  test('errors when no listener specified', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
        loadBalancers: [
          {
            name: 'lb',
            listeners: [],
          },
        ],
      });
    }).toThrow(/At least one listener must be specified/);
  });

  test('errors when setting both HTTP protocol and certificate', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
        loadBalancers: [
          {
            name: 'lb',
            listeners: [
              {
                name: 'listener',
                protocol: ApplicationProtocol.HTTP,
                certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
              },
            ],
          },
        ],
      });
    }).toThrow(/The HTTPS protocol must be used when a certificate is given/);
  });

  test('errors when setting HTTPS protocol but not domain name', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
        loadBalancers: [
          {
            name: 'lb',
            listeners: [
              {
                name: 'listener',
                protocol: ApplicationProtocol.HTTPS,
              },
            ],
          },
        ],
      });
    }).toThrow(/A domain name and zone is required when using the HTTPS protocol/);
  });

  test('errors when listener is not defined but used in creating target groups', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
        loadBalancers: [
          {
            name: 'lb',
            listeners: [
              {
                name: 'listener1',
              },
            ],
          },
        ],
        targetGroups: [
          {
            containerPort: 80,
            listener: 'listener2',
          },
        ],
      });
    }).toThrow(/Listener listener2 is not defined. Did you define listener with name listener2?/);
  });

  test('errors if desiredTaskCount is 0', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    // THEN
    expect(() =>
      new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        memoryLimitMiB: 1024,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
        desiredCount: 0,
      })).toThrow(/You must specify a desiredCount greater than 0/);
  });
});

describe('When Network Load Balancer', () => {
  test('test ECS NLB construct with default settings', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    // WHEN
    new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
      cluster,
      memoryLimitMiB: 256,
      taskImageOptions: {
        image: ContainerImage.fromRegistry('test'),
      },
    });

    // THEN - stack contains a load balancer and a service
    Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      LaunchType: 'EC2',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Essential: true,
          Image: 'test',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'ServiceTaskDefwebLogGroup2A898F61',
              },
              'awslogs-stream-prefix': 'Service',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
          Memory: 256,
          Name: 'web',
          PortMappings: [
            {
              ContainerPort: 80,
              HostPort: 0,
              Protocol: 'tcp',
            },
          ],
        },
      ],
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'ServiceTaskDefExecutionRole919F7BE3',
          'Arn',
        ],
      },
      Family: 'ServiceTaskDef79D79521',
      NetworkMode: 'bridge',
      RequiresCompatibilities: [
        'EC2',
      ],
      TaskRoleArn: {
        'Fn::GetAtt': [
          'ServiceTaskDefTaskRole0CFE2F57',
          'Arn',
        ],
      },
    });
  });


  test('Assert EnableExecuteCommand is missing if not set', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));
    const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });

    // WHEN
    new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
      cluster,
      memoryLimitMiB: 256,
      taskImageOptions: {
        image: ContainerImage.fromRegistry('test'),
        containerName: 'myContainer',
        containerPorts: [80, 90],
        enableLogging: false,
        environment: {
          TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
          TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
        },
        logDriver: new AwsLogDriver({
          streamPrefix: 'TestStream',
        }),
        family: 'Ec2TaskDef',
        executionRole: new Role(stack, 'ExecutionRole', {
          path: '/',
          assumedBy: new CompositePrincipal(
            new ServicePrincipal('ecs.amazonaws.com'),
            new ServicePrincipal('ecs-tasks.amazonaws.com'),
          ),
        }),
        taskRole: new Role(stack, 'TaskRole', {
          assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
        }),
        dockerLabels: { label1: 'labelValue1', label2: 'labelValue2' },
      },
      cpu: 256,
      desiredCount: 3,
      enableECSManagedTags: true,
      enableExecuteCommand: false,
      healthCheckGracePeriod: Duration.millis(2000),
      loadBalancers: [
        {
          name: 'lb1',
          domainName: 'api.example.com',
          domainZone: zone,
          publicLoadBalancer: false,
          listeners: [
            {
              name: 'listener1',
            },
          ],
        },
        {
          name: 'lb2',
          listeners: [
            {
              name: 'listener2',
              port: 81,
            },
          ],
        },
      ],
      propagateTags: PropagatedTagSource.SERVICE,
      memoryReservationMiB: 256,
      serviceName: 'myService',
      targetGroups: [
        {
          containerPort: 80,
          listener: 'listener1',
        },
        {
          containerPort: 90,
          listener: 'listener2',
        },
      ],
      placementStrategies: [PlacementStrategy.spreadAcrossInstances(), PlacementStrategy.packedByCpu(), PlacementStrategy.randomly()],
      placementConstraints: [PlacementConstraint.memberOf('attribute:ecs.instance-type =~ m5a.*')],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      EnableExecuteCommand: false,
    });
  });

  test('test ECS NLB construct with all settings', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));
    const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });

    // WHEN
    new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
      cluster,
      memoryLimitMiB: 256,
      taskImageOptions: {
        image: ContainerImage.fromRegistry('test'),
        containerName: 'myContainer',
        containerPorts: [80, 90],
        enableLogging: false,
        environment: {
          TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
          TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
        },
        logDriver: new AwsLogDriver({
          streamPrefix: 'TestStream',
        }),
        family: 'Ec2TaskDef',
        executionRole: new Role(stack, 'ExecutionRole', {
          path: '/',
          assumedBy: new CompositePrincipal(
            new ServicePrincipal('ecs.amazonaws.com'),
            new ServicePrincipal('ecs-tasks.amazonaws.com'),
          ),
        }),
        taskRole: new Role(stack, 'TaskRole', {
          assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
        }),
        dockerLabels: { label1: 'labelValue1', label2: 'labelValue2' },
      },
      cpu: 256,
      desiredCount: 3,
      enableECSManagedTags: true,
      enableExecuteCommand: true,
      healthCheckGracePeriod: Duration.millis(2000),
      loadBalancers: [
        {
          name: 'lb1',
          domainName: 'api.example.com',
          domainZone: zone,
          publicLoadBalancer: false,
          listeners: [
            {
              name: 'listener1',
            },
          ],
        },
        {
          name: 'lb2',
          listeners: [
            {
              name: 'listener2',
              port: 81,
            },
          ],
        },
      ],
      propagateTags: PropagatedTagSource.SERVICE,
      memoryReservationMiB: 256,
      serviceName: 'myService',
      targetGroups: [
        {
          containerPort: 80,
          listener: 'listener1',
        },
        {
          containerPort: 90,
          listener: 'listener2',
        },
      ],
      placementStrategies: [PlacementStrategy.spreadAcrossInstances(), PlacementStrategy.packedByCpu(), PlacementStrategy.randomly()],
      placementConstraints: [PlacementConstraint.memberOf('attribute:ecs.instance-type =~ m5a.*')],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DesiredCount: 3,
      EnableECSManagedTags: true,
      EnableExecuteCommand: true,
      HealthCheckGracePeriodSeconds: 2,
      LaunchType: 'EC2',
      LoadBalancers: [
        {
          ContainerName: 'myContainer',
          ContainerPort: 80,
          TargetGroupArn: {
            Ref: 'Servicelb1listener1ECSTargetGroupmyContainer80Group43098F8B',
          },
        },
        {
          ContainerName: 'myContainer',
          ContainerPort: 90,
          TargetGroupArn: {
            Ref: 'Servicelb2listener2ECSTargetGroupmyContainer90GroupDEB417E4',
          },
        },
      ],
      PropagateTags: 'SERVICE',
      SchedulingStrategy: 'REPLICA',
      ServiceName: 'myService',
      PlacementConstraints: [{ Type: 'memberOf', Expression: 'attribute:ecs.instance-type =~ m5a.*' }],
      PlacementStrategies: [{ Field: 'instanceId', Type: 'spread' }, { Field: 'CPU', Type: 'binpack' }, { Type: 'random' }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          Environment: [
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE1',
              Value: 'test environment variable 1 value',
            },
            {
              Name: 'TEST_ENVIRONMENT_VARIABLE2',
              Value: 'test environment variable 2 value',
            },
          ],
          Essential: true,
          Image: 'test',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'ServiceTaskDefmyContainerLogGroup0A87368B',
              },
              'awslogs-stream-prefix': 'TestStream',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
          Memory: 256,
          MemoryReservation: 256,
          Name: 'myContainer',
          PortMappings: [
            {
              ContainerPort: 80,
              HostPort: 0,
              Protocol: 'tcp',
            },
            {
              ContainerPort: 90,
              HostPort: 0,
              Protocol: 'tcp',
            },
          ],
          DockerLabels: {
            label1: 'labelValue1',
            label2: 'labelValue2',
          },
        },
      ],
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'ExecutionRole605A040B',
          'Arn',
        ],
      },
      Family: 'ServiceTaskDef79D79521',
      NetworkMode: 'bridge',
      RequiresCompatibilities: [
        'EC2',
      ],
      TaskRoleArn: {
        'Fn::GetAtt': [
          'TaskRole30FC0FBB',
          'Arn',
        ],
      },
    });
  });

  test('EnableExecuteCommand flag generated IAM Permissions', () => {
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));
    const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });

    // WHEN
    new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
      cluster,
      memoryLimitMiB: 256,
      taskImageOptions: {
        image: ContainerImage.fromRegistry('test'),
        containerName: 'myContainer',
        containerPorts: [80, 90],
        enableLogging: false,
        environment: {
          TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
          TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
        },
        logDriver: new AwsLogDriver({
          streamPrefix: 'TestStream',
        }),
        family: 'Ec2TaskDef',
        executionRole: new Role(stack, 'ExecutionRole', {
          path: '/',
          assumedBy: new CompositePrincipal(
            new ServicePrincipal('ecs.amazonaws.com'),
            new ServicePrincipal('ecs-tasks.amazonaws.com'),
          ),
        }),
        taskRole: new Role(stack, 'TaskRole', {
          assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
        }),
        dockerLabels: { label1: 'labelValue1', label2: 'labelValue2' },
      },
      cpu: 256,
      desiredCount: 3,
      enableECSManagedTags: true,
      enableExecuteCommand: true,
      healthCheckGracePeriod: Duration.millis(2000),
      loadBalancers: [
        {
          name: 'lb1',
          domainName: 'api.example.com',
          domainZone: zone,
          publicLoadBalancer: false,
          listeners: [
            {
              name: 'listener1',
            },
          ],
        },
        {
          name: 'lb2',
          listeners: [
            {
              name: 'listener2',
              port: 81,
            },
          ],
        },
      ],
      propagateTags: PropagatedTagSource.SERVICE,
      memoryReservationMiB: 256,
      serviceName: 'myService',
      targetGroups: [
        {
          containerPort: 80,
          listener: 'listener1',
        },
        {
          containerPort: 90,
          listener: 'listener2',
        },
      ],
      placementStrategies: [PlacementStrategy.spreadAcrossInstances(), PlacementStrategy.packedByCpu(), PlacementStrategy.randomly()],
      placementConstraints: [PlacementConstraint.memberOf('attribute:ecs.instance-type =~ m5a.*')],
    });

    // ECS Exec
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'ssmmessages:CreateControlChannel',
              'ssmmessages:CreateDataChannel',
              'ssmmessages:OpenControlChannel',
              'ssmmessages:OpenDataChannel',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: 'logs:DescribeLogGroups',
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: [
              'logs:CreateLogStream',
              'logs:DescribeLogStreams',
              'logs:PutLogEvents',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'TaskRoleDefaultPolicy07FC53DE',
      Roles: [
        {
          Ref: 'TaskRole30FC0FBB',
        },
      ],
    });
  });

  test('able to pass pre-defined task definition', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    const taskDefinition = new Ec2TaskDefinition(stack, 'Ec2TaskDef');
    const container = taskDefinition.addContainer('web', {
      image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 512,
    });
    container.addPortMappings({
      containerPort: 80,
    });

    // WHEN
    new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
      cluster,
      taskDefinition,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Essential: true,
          Image: 'amazon/amazon-ecs-sample',
          Memory: 512,
          Name: 'web',
          PortMappings: [
            {
              ContainerPort: 80,
              HostPort: 0,
              Protocol: 'tcp',
            },
          ],
        },
      ],
      Family: 'Ec2TaskDef',
      NetworkMode: 'bridge',
      RequiresCompatibilities: [
        'EC2',
      ],
    });
  });

  test('errors if no essential container in pre-defined task definition', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    const taskDefinition = new Ec2TaskDefinition(stack, 'Ec2TaskDef');

    // THEN
    expect(() => {
      new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        taskDefinition,
      });
    }).toThrow(/At least one essential container must be specified/);
  });

  test('set default load balancer, listener, target group correctly', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });

    // WHEN
    const ecsService = new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
      vpc,
      memoryLimitMiB: 1024,
      taskImageOptions: {
        image: ContainerImage.fromRegistry('test'),
      },
      loadBalancers: [
        {
          name: 'lb1',
          listeners: [
            {
              name: 'listener1',
            },
          ],
        },
        {
          name: 'lb2',
          domainName: 'api.example.com',
          domainZone: zone,
          listeners: [
            {
              name: 'listener2',
            },
            {
              name: 'listener3',
            },
          ],
        },
      ],
      targetGroups: [
        {
          containerPort: 80,
        },
        {
          containerPort: 90,
        },
      ],
    });

    // THEN
    expect(ecsService.loadBalancer.node.id).toEqual('lb1');
    expect(ecsService.listener.node.id).toEqual('listener1');
    expect(ecsService.targetGroup.node.id).toEqual('ECSTargetGroupweb80Group');
  });

  test('setting vpc and cluster throws error', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });

    // WHEN
    expect(() => new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
      cluster,
      vpc,
      taskImageOptions: {
        image: ContainerImage.fromRegistry('/aws/aws-example-app'),
      },
    })).toThrow(/You can only specify either vpc or cluster. Alternatively, you can leave both blank/);
  });

  test('creates AWS Cloud Map service for Private DNS namespace', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'MyVpc', {});
    const cluster = new Cluster(stack, 'EcsCluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    // WHEN
    cluster.addDefaultCloudMapNamespace({
      name: 'foo.com',
      type: NamespaceType.DNS_PRIVATE,
    });

    new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ContainerImage.fromRegistry('hello'),
      },
      cloudMapOptions: {
        name: 'myApp',
      },
      memoryLimitMiB: 512,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      ServiceRegistries: [
        {
          ContainerName: 'web',
          ContainerPort: 80,
          RegistryArn: {
            'Fn::GetAtt': [
              'ServiceCloudmapServiceDE76B29D',
              'Arn',
            ],
          },
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::Service', {
      DnsConfig: {
        DnsRecords: [
          {
            TTL: 60,
            Type: 'SRV',
          },
        ],
        NamespaceId: {
          'Fn::GetAtt': [
            'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
            'Id',
          ],
        },
        RoutingPolicy: 'MULTIVALUE',
      },
      HealthCheckCustomConfig: {
        FailureThreshold: 1,
      },
      Name: 'myApp',
      NamespaceId: {
        'Fn::GetAtt': [
          'EcsClusterDefaultServiceDiscoveryNamespaceB0971B2F',
          'Id',
        ],
      },
    });
  });

  test('errors when setting both taskDefinition and taskImageOptions', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    const taskDefinition = new Ec2TaskDefinition(stack, 'Ec2TaskDef');
    taskDefinition.addContainer('test', {
      image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 512,
    });

    // THEN
    expect(() => {
      new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
        taskDefinition,
      });
    }).toThrow(/You must specify only one of TaskDefinition or TaskImageOptions./);
  });

  test('errors when setting neither taskDefinition nor taskImageOptions', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    // THEN
    expect(() => {
      new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
      });
    }).toThrow(/You must specify one of: taskDefinition or image/);
  });

  test('errors when setting domainName but not domainZone', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    // THEN
    expect(() => {
      new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
        loadBalancers: [
          {
            name: 'lb1',
            domainName: 'api.example.com',
            listeners: [{
              name: 'listener1',
            }],
          },
        ],
      });
    }).toThrow(/A Route53 hosted domain zone name is required to configure the specified domain name/);
  });

  test('errors when loadBalancers is empty', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
        loadBalancers: [],
      });
    }).toThrow(/At least one load balancer must be specified/);
  });

  test('errors when targetGroups is empty', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
        targetGroups: [],
      });
    }).toThrow(/At least one target group should be specified/);
  });

  test('errors when no listener specified', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
        loadBalancers: [
          {
            name: 'lb',
            listeners: [],
          },
        ],
      });
    }).toThrow(/At least one listener must be specified/);
  });

  test('errors when listener is not defined but used in creating target groups', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });

    // THEN
    expect(() => {
      new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
        loadBalancers: [
          {
            name: 'lb',
            listeners: [
              {
                name: 'listener1',
              },
            ],
          },
        ],
        targetGroups: [
          {
            containerPort: 80,
            listener: 'listener2',
          },
        ],
      });
    }).toThrow(/Listener listener2 is not defined. Did you define listener with name listener2?/);
  });

  test('errors if desiredTaskCount is 0', () => {
    // GIVEN
    const stack = new Stack();
    const vpc = new Vpc(stack, 'VPC');
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
      autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
        vpc,
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      }),
    }));

    // THEN
    expect(() =>
      new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
        cluster,
        memoryLimitMiB: 1024,
        taskImageOptions: {
          image: ContainerImage.fromRegistry('test'),
        },
        desiredCount: 0,
      })).toThrow(/You must specify a desiredCount greater than 0/);
  });
});

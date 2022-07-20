import { Match, Template } from '@aws-cdk/assertions';
import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import * as ec2 from '@aws-cdk/aws-ec2';
import { MachineImage } from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { AsgCapacityProvider } from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancer, ApplicationProtocol, ApplicationProtocolVersion, NetworkLoadBalancer, SslPolicy } from '@aws-cdk/aws-elasticloadbalancingv2';
import { PublicHostedZone } from '@aws-cdk/aws-route53';
import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import { testLegacyBehavior } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as ecsPatterns from '../../lib';

test('test ECS loadbalanced construct', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    memoryLimitMiB: 1024,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
      environment: {
        TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
        TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
      },
      dockerLabels: { label1: 'labelValue1', label2: 'labelValue2' },
    },
    desiredCount: 2,
  });

  // THEN - stack contains a load balancer and a service
  Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DesiredCount: 2,
    LaunchType: 'EC2',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      Match.objectLike({
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
        Memory: 1024,
        DockerLabels: {
          label1: 'labelValue1',
          label2: 'labelValue2',
        },
      }),
    ],
  });
});

testLegacyBehavior('ApplicationLoadBalancedEc2Service desiredCount can be undefined when feature flag is set', cdk.App, (app) => {
  // GIVEN
  const stack = new cdk.Stack(app);
  stack.node.setContext(cxapi.ECS_REMOVE_DEFAULT_DESIRED_COUNT, true);

  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    memoryLimitMiB: 1024,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DesiredCount: Match.absent(),
  });
});

testLegacyBehavior('ApplicationLoadBalancedFargateService desiredCount can be undefined when feature flag is set', cdk.App, (app) => {
  // GIVEN
  const stack = new cdk.Stack(app);
  stack.node.setContext(cxapi.ECS_REMOVE_DEFAULT_DESIRED_COUNT, true);

  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
    cluster,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DesiredCount: Match.absent(),
  });
});

test('ApplicationLoadBalancedEc2Service multiple capacity provider strategies are set', () => {
  // GIVEN
  const stack = new cdk.Stack();

  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'AutoScalingGroupProvider1', {
    autoScalingGroup: new AutoScalingGroup(stack, 'AutoScalingGroup1', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'AutoScalingGroupProvider2', {
    autoScalingGroup: new AutoScalingGroup(stack, 'AutoScalingGroup2', {
      vpc,
      instanceType: new ec2.InstanceType('t3.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    memoryLimitMiB: 1024,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
    },
    capacityProviderStrategies: [
      {
        capacityProvider: 'AutoScalingGroupProvider1',
        base: 1,
        weight: 1,
      },
      {
        capacityProvider: 'AutoScalingGroupProvider2',
        base: 0,
        weight: 2,
      },
    ],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    CapacityProviderStrategy: Match.arrayEquals([
      {
        Base: 1,
        CapacityProvider: 'AutoScalingGroupProvider1',
        Weight: 1,
      },
      {
        Base: 0,
        CapacityProvider: 'AutoScalingGroupProvider2',
        Weight: 2,
      },
    ]),
  });
});

test('NetworkLoadBalancedEc2Service multiple capacity provider strategies are set', () => {
  // GIVEN
  const stack = new cdk.Stack();

  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'AutoScalingGroupProvider1', {
    autoScalingGroup: new AutoScalingGroup(stack, 'AutoScalingGroup1', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'AutoScalingGroupProvider2', {
    autoScalingGroup: new AutoScalingGroup(stack, 'AutoScalingGroup2', {
      vpc,
      instanceType: new ec2.InstanceType('t3.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  // WHEN
  new ecsPatterns.NetworkLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    memoryLimitMiB: 1024,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
    },
    capacityProviderStrategies: [
      {
        capacityProvider: 'AutoScalingGroupProvider1',
        base: 1,
        weight: 1,
      },
      {
        capacityProvider: 'AutoScalingGroupProvider2',
        base: 0,
        weight: 2,
      },
    ],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    CapacityProviderStrategy: Match.arrayEquals([
      {
        Base: 1,
        CapacityProvider: 'AutoScalingGroupProvider1',
        Weight: 1,
      },
      {
        Base: 0,
        CapacityProvider: 'AutoScalingGroupProvider2',
        Weight: 2,
      },
    ]),
  });
});

testLegacyBehavior('NetworkLoadBalancedEc2Service desiredCount can be undefined when feature flag is set', cdk.App, (app) => {
  // GIVEN
  const stack = new cdk.Stack(app);
  stack.node.setContext(cxapi.ECS_REMOVE_DEFAULT_DESIRED_COUNT, true);

  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  // WHEN
  new ecsPatterns.NetworkLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    memoryLimitMiB: 1024,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DesiredCount: Match.absent(),
  });
});

testLegacyBehavior('NetworkLoadBalancedFargateService desiredCount can be undefined when feature flag is set', cdk.App, (app) => {
  // GIVEN
  const stack = new cdk.Stack(app);
  stack.node.setContext(cxapi.ECS_REMOVE_DEFAULT_DESIRED_COUNT, true);

  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  // WHEN
  new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
    cluster,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DesiredCount: Match.absent(),
  });
});

test('setting vpc and cluster throws error', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  // WHEN
  expect(() => new ecsPatterns.NetworkLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    vpc,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
    },
  })).toThrow();
});

test('test ECS loadbalanced construct with memoryReservationMiB', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    memoryReservationMiB: 1024,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
    },
  });

  // THEN - stack contains a load balancer and a service
  Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      Match.objectLike({
        MemoryReservation: 1024,
      }),
    ],
  });
});

test('creates AWS Cloud Map service for Private DNS namespace with application load balanced ec2 service', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'MyVpc', {});
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
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
    type: cloudmap.NamespaceType.DNS_PRIVATE,
  });

  new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    taskImageOptions: {
      containerPort: 8000,
      image: ecs.ContainerImage.fromRegistry('hello'),
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
        ContainerPort: 8000,
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

test('creates AWS Cloud Map service for Private DNS namespace with network load balanced fargate service', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'MyVpc', {});
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
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
    type: cloudmap.NamespaceType.DNS_PRIVATE,
  });

  new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
    cluster,
    taskImageOptions: {
      containerPort: 8000,
      image: ecs.ContainerImage.fromRegistry('hello'),
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
          Type: 'A',
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

test('test Fargate loadbalanced construct', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
    cluster,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
      environment: {
        TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
        TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
      },
      dockerLabels: { label1: 'labelValue1', label2: 'labelValue2' },
    },
    desiredCount: 2,
  });

  // THEN - stack contains a load balancer and a service
  Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      Match.objectLike({
        Cpu: 1024,
        DockerLabels: {
          label1: 'labelValue1',
          label2: 'labelValue2',
        },
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
        Image: 'test',
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-group': { Ref: 'ServiceTaskDefwebLogGroup2A898F61' },
            'awslogs-stream-prefix': 'Service',
            'awslogs-region': { Ref: 'AWS::Region' },
          },
        },
        Memory: 2048,
      }),
    ],
    Cpu: 1024,
    Memory: 2048,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DesiredCount: 2,
    LaunchType: 'FARGATE',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
    Port: 80,
    Protocol: 'HTTP',
  });
});

test('test Fargate loadbalanced construct opting out of log driver creation', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
    cluster,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
      enableLogging: false,
      environment: {
        TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
        TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
      },
    },
    desiredCount: 2,
  });

  // THEN - stack contains a load balancer and a service
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      Match.objectLike({
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
        LogConfiguration: Match.absent(),
      }),
    ],
  });
});

test('test Fargate loadbalanced construct with TLS', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
    cluster,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
    },
    domainName: 'api.example.com',
    domainZone: zone,
    certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
    sslPolicy: SslPolicy.TLS12_EXT,
  });

  // THEN - stack contains a load balancer and a service
  Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);

  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
    Port: 443,
    Protocol: 'HTTPS',
    Certificates: [{
      CertificateArn: 'helloworld',
    }],
    SslPolicy: SslPolicy.TLS12_EXT,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
    Port: 80,
    Protocol: 'HTTP',
    TargetType: 'ip',
    VpcId: {
      Ref: 'VPCB9E5F0B4',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    LaunchType: 'FARGATE',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    Name: 'api.example.com.',
    HostedZoneId: {
      Ref: 'HostedZoneDB99F866',
    },
    Type: 'A',
    AliasTarget: {
      HostedZoneId: { 'Fn::GetAtt': ['ServiceLBE9A1ADBC', 'CanonicalHostedZoneID'] },
      DNSName: { 'Fn::Join': ['', ['dualstack.', { 'Fn::GetAtt': ['ServiceLBE9A1ADBC', 'DNSName'] }]] },
    },
  });
});

test('test Fargateloadbalanced construct with TLS and default certificate', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
    cluster,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
    },
    domainName: 'api.example.com',
    domainZone: zone,
    protocol: ApplicationProtocol.HTTPS,
  });

  // THEN - stack contains a load balancer, a service, and a certificate
  Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
    DomainName: 'api.example.com',
    DomainValidationOptions: [
      {
        DomainName: 'api.example.com',
        HostedZoneId: {
          Ref: 'HostedZoneDB99F866',
        },
      },
    ],
    ValidationMethod: 'DNS',
  });

  Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);

  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
    Port: 443,
    Protocol: 'HTTPS',
    Certificates: [{
      CertificateArn: {
        Ref: 'ServiceCertificateA7C65FE6',
      },
    }],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    LaunchType: 'FARGATE',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
    Name: 'api.example.com.',
    HostedZoneId: {
      Ref: 'HostedZoneDB99F866',
    },
    Type: 'A',
    AliasTarget: {
      HostedZoneId: { 'Fn::GetAtt': ['ServiceLBE9A1ADBC', 'CanonicalHostedZoneID'] },
      DNSName: { 'Fn::Join': ['', ['dualstack.', { 'Fn::GetAtt': ['ServiceLBE9A1ADBC', 'DNSName'] }]] },
    },
  });
});

test('errors when setting domainName but not domainZone', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  // THEN
  expect(() => {
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
      },
      domainName: 'api.example.com',
    });
  }).toThrow();
});

test('errors when setting both HTTP protocol and certificate', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  // THEN
  expect(() => {
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
      },
      protocol: ApplicationProtocol.HTTP,
      certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
    });
  }).toThrow();
});

test('errors when setting both HTTP protocol and redirectHTTP', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  // THEN
  expect(() => {
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
      },
      protocol: ApplicationProtocol.HTTP,
      redirectHTTP: true,
    });
  }).toThrow();
});

test('does not throw errors when not setting HTTPS protocol but certificate for redirectHTTP', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });

  // THEN
  new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
    cluster,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
    },
    domainName: 'api.example.com',
    domainZone: zone,
    redirectHTTP: true,
    certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
  });
});

test('errors when setting HTTPS protocol but not domain name', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  // THEN
  expect(() => {
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
      },
      protocol: ApplicationProtocol.HTTPS,
    });
  }).toThrow();
});

test('test Fargate loadbalanced construct with optional log driver input', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
    cluster,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
      enableLogging: false,
      environment: {
        TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
        TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
      },
      logDriver: new ecs.AwsLogDriver({
        streamPrefix: 'TestStream',
      }),
    },
    desiredCount: 2,
  });

  // THEN - stack contains a load balancer and a service
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      Match.objectLike({
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
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-group': { Ref: 'ServiceTaskDefwebLogGroup2A898F61' },
            'awslogs-stream-prefix': 'TestStream',
            'awslogs-region': { Ref: 'AWS::Region' },
          },
        },
      }),
    ],
  });
});

test('test Fargate loadbalanced construct with logging enabled', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
    cluster,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
      enableLogging: true,
      environment: {
        TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
        TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
      },
    },
    desiredCount: 2,
  });

  // THEN - stack contains a load balancer and a service
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      Match.objectLike({
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
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-group': { Ref: 'ServiceTaskDefwebLogGroup2A898F61' },
            'awslogs-stream-prefix': 'Service',
            'awslogs-region': { Ref: 'AWS::Region' },
          },
        },
      }),
    ],
  });
});

test('test Fargate loadbalanced construct with both image and taskDefinition provided', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
  taskDefinition.addContainer('web', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 512,
  });

  // WHEN
  expect(() => new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
    cluster,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
      enableLogging: true,
      environment: {
        TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
        TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
      },
    },
    desiredCount: 2,
    taskDefinition,
  })).toThrow();
});

test('test Fargate application loadbalanced construct with taskDefinition provided', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
  const container = taskDefinition.addContainer('passedTaskDef', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 512,
  });
  container.addPortMappings({
    containerPort: 80,
  });

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
    cluster,
    taskDefinition,
    desiredCount: 2,
    memoryLimitMiB: 1024,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      Match.objectLike({
        Image: 'amazon/amazon-ecs-sample',
        Memory: 512,
        Name: 'passedTaskDef',
        PortMappings: [
          {
            ContainerPort: 80,
            Protocol: 'tcp',
          },
        ],
      }),
    ],
  });
});

test('ALB - throws if desiredTaskCount is 0', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  // THEN
  expect(() =>
    new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
      cluster,
      memoryLimitMiB: 1024,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
      },
      desiredCount: 0,
    }),
  ).toThrow(/You must specify a desiredCount greater than 0/);
});

test('NLB - throws if desiredTaskCount is 0', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  // THEN
  expect(() =>
    new ecsPatterns.NetworkLoadBalancedEc2Service(stack, 'Service', {
      cluster,
      memoryLimitMiB: 1024,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
      },
      desiredCount: 0,
    }),
  ).toThrow(/You must specify a desiredCount greater than 0/);
});

test('ALBFargate - having *HealthyPercent properties', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'ALB123Service', {
    cluster,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    },
    minHealthyPercent: 100,
    maxHealthyPercent: 200,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DeploymentConfiguration: {
      MinimumHealthyPercent: 100,
      MaximumPercent: 200,
    },
  });
});

test('NLBFargate - having *HealthyPercent properties', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  // WHEN
  new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
    cluster,
    memoryLimitMiB: 1024,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    },
    desiredCount: 1,
    minHealthyPercent: 100,
    maxHealthyPercent: 200,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DeploymentConfiguration: {
      MinimumHealthyPercent: 100,
      MaximumPercent: 200,
    },
  });
});

test('ALB - having *HealthyPercent properties', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    memoryLimitMiB: 1024,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    },
    desiredCount: 1,
    minHealthyPercent: 100,
    maxHealthyPercent: 200,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DeploymentConfiguration: {
      MinimumHealthyPercent: 100,
      MaximumPercent: 200,
    },
  });
});

test('ALB - includes provided protocol version properties', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));
  const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    memoryLimitMiB: 1024,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    },
    desiredCount: 1,
    domainName: 'api.example.com',
    domainZone: zone,
    protocol: ApplicationProtocol.HTTPS,
    protocolVersion: ApplicationProtocolVersion.GRPC,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
    ProtocolVersion: 'GRPC',
  });
});

test('NLB - having *HealthyPercent properties', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  // WHEN
  new ecsPatterns.NetworkLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    memoryLimitMiB: 1024,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    },
    desiredCount: 1,
    minHealthyPercent: 100,
    maxHealthyPercent: 200,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DeploymentConfiguration: {
      MinimumHealthyPercent: 100,
      MaximumPercent: 200,
    },
  });
});

test('ALB - having deployment controller', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    memoryLimitMiB: 1024,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    },
    deploymentController: {
      type: ecs.DeploymentControllerType.CODE_DEPLOY,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DeploymentController: {
      Type: 'CODE_DEPLOY',
    },
  });
});

test('NLB - having  deployment controller', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  // WHEN
  new ecsPatterns.NetworkLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    memoryLimitMiB: 1024,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    },
    deploymentController: {
      type: ecs.DeploymentControllerType.CODE_DEPLOY,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DeploymentController: {
      Type: 'CODE_DEPLOY',
    },
  });
});

test('ALB with circuit breaker', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    memoryLimitMiB: 1024,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    },
    circuitBreaker: { rollback: true },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DeploymentConfiguration: {
      DeploymentCircuitBreaker: {
        Enable: true,
        Rollback: true,
      },
    },
    DeploymentController: {
      Type: 'ECS',
    },
  });
});

test('NLB with circuit breaker', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  // WHEN
  new ecsPatterns.NetworkLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    memoryLimitMiB: 1024,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    },
    circuitBreaker: { rollback: true },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DeploymentConfiguration: {
      DeploymentCircuitBreaker: {
        Enable: true,
        Rollback: true,
      },
    },
    DeploymentController: {
      Type: 'ECS',
    },
  });
});

test('NetworkLoadbalancedEC2Service accepts previously created load balancer', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc, clusterName: 'MyCluster' });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));
  const nlb = new NetworkLoadBalancer(stack, 'NLB', { vpc });
  const taskDef = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
  const container = taskDef.addContainer('Container', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 1024,
  });
  container.addPortMappings({ containerPort: 80 });

  // WHEN
  new ecsPatterns.NetworkLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    loadBalancer: nlb,
    taskDefinition: taskDef,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    LaunchType: 'EC2',
  });
  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
    Type: 'network',
  });
});

test('NetworkLoadBalancedEC2Service accepts imported load balancer', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const nlbArn = 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-load-balancer/50dc6c495c0c9188';
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc, clusterName: 'MyCluster' });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));
  const nlb = NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stack, 'NLB', {
    loadBalancerArn: nlbArn,
    vpc,
  });
  const taskDef = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
  const container = taskDef.addContainer('Container', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 1024,
  });
  container.addPortMappings({
    containerPort: 80,
  });

  // WHEN
  new ecsPatterns.NetworkLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    loadBalancer: nlb,
    desiredCount: 1,
    taskDefinition: taskDef,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    LaunchType: 'EC2',
    LoadBalancers: [Match.objectLike({ ContainerName: 'Container', ContainerPort: 80 })],
  });
  Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::TargetGroup', 1);
  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
    LoadBalancerArn: nlb.loadBalancerArn,
    Port: 80,
  });
});

test('ApplicationLoadBalancedEC2Service accepts previously created load balancer', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc, clusterName: 'MyCluster' });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));
  const sg = new ec2.SecurityGroup(stack, 'SG', { vpc });
  const alb = new ApplicationLoadBalancer(stack, 'NLB', {
    vpc,
    securityGroup: sg,
  });
  const taskDef = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
  const container = taskDef.addContainer('Container', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 1024,
  });
  container.addPortMappings({ containerPort: 80 });

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    loadBalancer: alb,
    taskDefinition: taskDef,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    LaunchType: 'EC2',
  });
  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
    Type: 'application',
  });
});

test('ApplicationLoadBalancedEC2Service accepts imported load balancer', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const albArn = 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-load-balancer/50dc6c495c0c9188';
  const vpc = new ec2.Vpc(stack, 'Vpc');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc, clusterName: 'MyCluster' });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));
  const sg = new ec2.SecurityGroup(stack, 'SG', { vpc });
  const alb = ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack, 'ALB', {
    loadBalancerArn: albArn,
    vpc,
    securityGroupId: sg.securityGroupId,
    loadBalancerDnsName: 'MyName',
  });
  const taskDef = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
  const container = taskDef.addContainer('Container', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 1024,
  });
  container.addPortMappings({
    containerPort: 80,
  });
  // WHEN
  new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    loadBalancer: alb,
    taskDefinition: taskDef,
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    LaunchType: 'EC2',
    LoadBalancers: [Match.objectLike({ ContainerName: 'Container', ContainerPort: 80 })],
  });
  Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::TargetGroup', 1);
  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
    LoadBalancerArn: alb.loadBalancerArn,
    Port: 80,
  });
});

test('test ECS loadbalanced construct default/open security group', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    memoryReservationMiB: 1024,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
    },
  });

  // THEN - Stack contains no ingress security group rules
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
    SecurityGroupIngress: [Match.objectLike({
      CidrIp: '0.0.0.0/0',
      FromPort: 80,
      IpProtocol: 'tcp',
      ToPort: 80,
    })],
  });
});

test('test ECS loadbalanced construct closed security group', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));
  const zone = new PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });

  // WHEN
  new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
    cluster,
    memoryReservationMiB: 1024,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('test'),
    },
    domainName: 'api.example.com',
    domainZone: zone,
    certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
    openListener: false,
    redirectHTTP: true,
  });

  // THEN - Stack contains no ingress security group rules
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
    SecurityGroupIngress: Match.absent(),
  });
});

import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import { AwsLogDriver } from '@aws-cdk/aws-ecs';
import { ApplicationProtocol } from '@aws-cdk/aws-elasticloadbalancingv2';
import { PublicHostedZone } from '@aws-cdk/aws-route53';
import cloudmap = require('@aws-cdk/aws-servicediscovery');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import ecsPatterns = require('../../lib');

export = {
  'test ECS loadbalanced construct'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
      cluster,
      memoryLimitMiB: 1024,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
        environment: {
          TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
          TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
        }
      },
      desiredCount: 2,
    });

    // THEN - stack contains a load balancer and a service
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));

    expect(stack).to(haveResource("AWS::ECS::Service", {
      DesiredCount: 2,
      LaunchType: "EC2",
    }));

    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [
            {
              Name: "TEST_ENVIRONMENT_VARIABLE1",
              Value: "test environment variable 1 value"
            },
            {
              Name: "TEST_ENVIRONMENT_VARIABLE2",
              Value: "test environment variable 2 value"
            }
          ],
          Memory: 1024
        }
      ]
    }));

    test.done();
  },

  'set vpc instead of cluster'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
      vpc,
      memoryLimitMiB: 1024,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
        environment: {
          TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
          TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
        }
      },
      desiredCount: 2,
    });

    // THEN - stack does not contain a LaunchConfiguration
    expect(stack, true).notTo(haveResource("AWS::AutoScaling::LaunchConfiguration"));

    test.throws(() => expect(stack));

    test.done();
  },

  'setting vpc and cluster throws error'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    test.throws(() => new ecsPatterns.NetworkLoadBalancedEc2Service(stack, 'Service', {
      cluster,
      vpc,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app")
      }
    }));

    test.done();
  },

  'test ECS loadbalanced construct with memoryReservationMiB'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
      cluster,
      memoryReservationMiB: 1024,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test')
      }
    });

    // THEN - stack contains a load balancer and a service
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));

    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          MemoryReservation: 1024
        }
      ]
    }));

    test.done();
  },

  'creates AWS Cloud Map service for Private DNS namespace with application load balanced ec2 service'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });

    // WHEN
    cluster.addDefaultCloudMapNamespace({
      name: 'foo.com',
      type: cloudmap.NamespaceType.DNS_PRIVATE
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
    expect(stack).to(haveResource("AWS::ECS::Service", {
      ServiceRegistries: [
        {
          ContainerName: "web",
          ContainerPort: 8000,
          RegistryArn: {
            "Fn::GetAtt": [
              "ServiceCloudmapServiceDE76B29D",
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

  'creates AWS Cloud Map service for Private DNS namespace with network load balanced fargate service'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });

    // WHEN
    cluster.addDefaultCloudMapNamespace({
      name: 'foo.com',
      type: cloudmap.NamespaceType.DNS_PRIVATE
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
    expect(stack).to(haveResource("AWS::ECS::Service", {
      ServiceRegistries: [
        {
          RegistryArn: {
            "Fn::GetAtt": [
              "ServiceCloudmapServiceDE76B29D",
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

  'test Fargate loadbalanced construct'(test: Test) {
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
          TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
          TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
        }
      },
      desiredCount: 2,
    });

    // THEN - stack contains a load balancer and a service
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [
            {
              Name: "TEST_ENVIRONMENT_VARIABLE1",
              Value: "test environment variable 1 value"
            },
            {
              Name: "TEST_ENVIRONMENT_VARIABLE2",
              Value: "test environment variable 2 value"
            }
          ],
          LogConfiguration: {
            LogDriver: "awslogs",
            Options: {
              "awslogs-group": { Ref: "ServiceTaskDefwebLogGroup2A898F61" },
              "awslogs-stream-prefix": "Service",
              "awslogs-region": { Ref: "AWS::Region" }
            }
          },
        }
      ]
    }));

    expect(stack).to(haveResource("AWS::ECS::Service", {
      DesiredCount: 2,
      LaunchType: "FARGATE",
    }));

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      Port: 80,
      Protocol: 'HTTP'
    }));

    test.done();
  },

  'test Fargate loadbalanced construct opting out of log driver creation'(test: Test) {
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
          TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
          TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
        },
      },
      desiredCount: 2,
    });

    // THEN - stack contains a load balancer and a service
    expect(stack).notTo(haveResource('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [
            {
              Name: "TEST_ENVIRONMENT_VARIABLE1",
              Value: "test environment variable 1 value"
            },
            {
              Name: "TEST_ENVIRONMENT_VARIABLE2",
              Value: "test environment variable 2 value"
            }
          ],
          LogConfiguration: {
            LogDriver: "awslogs",
            Options: {
              "awslogs-group": { Ref: "ServiceTaskDefwebLogGroup2A898F61" },
              "awslogs-stream-prefix": "Service",
              "awslogs-region": { Ref: "AWS::Region" }
            }
          },
        }
      ]
    }));

    test.done();
  },
  'test Fargateloadbalanced construct with TLS'(test: Test) {
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
      certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld')
    });

    // THEN - stack contains a load balancer and a service
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      Port: 443,
      Protocol: 'HTTPS',
      Certificates: [{
        CertificateArn: "helloworld"
      }]
    }));

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      Port: 80,
      Protocol: 'HTTP',
      TargetType: "ip",
      VpcId: {
        Ref: "VPCB9E5F0B4"
      }
    }));

    expect(stack).to(haveResource("AWS::ECS::Service", {
      DesiredCount: 1,
      LaunchType: "FARGATE",
    }));

    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'api.example.com.',
      HostedZoneId: {
        Ref: "HostedZoneDB99F866"
      },
      Type: 'A',
      AliasTarget: {
        HostedZoneId: { 'Fn::GetAtt': ['ServiceLBE9A1ADBC', 'CanonicalHostedZoneID'] },
        DNSName: { 'Fn::GetAtt': ['ServiceLBE9A1ADBC', 'DNSName'] },
      }
    }));

    test.done();
  },

  'test Fargateloadbalanced construct with TLS and default certificate'(test: Test) {
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
      protocol: ApplicationProtocol.HTTPS
    });

    // THEN - stack contains a load balancer, a service, and a certificate
    expect(stack).to(haveResource('AWS::CloudFormation::CustomResource', {
      ServiceToken: {
      'Fn::GetAtt': [
        'ServiceCertificateCertificateRequestorFunctionB69CD117',
        'Arn'
        ]
      },
      DomainName: 'api.example.com',
      HostedZoneId: {
        Ref: "HostedZoneDB99F866"
      }
    }));

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      Port: 443,
      Protocol: 'HTTPS',
      Certificates: [{
        CertificateArn: { 'Fn::GetAtt': [
          'ServiceCertificateCertificateRequestorResource0FC297E9',
          'Arn'
        ]}
      }]
    }));

    expect(stack).to(haveResource("AWS::ECS::Service", {
      DesiredCount: 1,
      LaunchType: "FARGATE",
    }));

    expect(stack).to(haveResource('AWS::Route53::RecordSet', {
      Name: 'api.example.com.',
      HostedZoneId: {
        Ref: "HostedZoneDB99F866"
      },
      Type: 'A',
      AliasTarget: {
        HostedZoneId: { 'Fn::GetAtt': ['ServiceLBE9A1ADBC', 'CanonicalHostedZoneID'] },
        DNSName: { 'Fn::GetAtt': ['ServiceLBE9A1ADBC', 'DNSName'] },
      }
    }));

    test.done();
  },

  "errors when setting domainName but not domainZone"(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // THEN
    test.throws(() => {
      new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('test'),
        },
        domainName: 'api.example.com'
      });
    });

    test.done();
  },

  'errors when setting both HTTP protocol and certificate'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // THEN
    test.throws(() => {
      new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('test'),
        },
        protocol: ApplicationProtocol.HTTP,
        certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld')
      });
    });

    test.done();
  },

  'errors when setting HTTPS protocol but not domain name'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // THEN
    test.throws(() => {
      new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
        cluster,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('test'),
        },
        protocol: ApplicationProtocol.HTTPS
      });
    });

    test.done();
  },

  'test Fargate loadbalanced construct with optional log driver input'(test: Test) {
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
          TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
          TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
        },
        logDriver: new AwsLogDriver({
          streamPrefix: "TestStream"
        }),
      },
      desiredCount: 2,
    });

    // THEN - stack contains a load balancer and a service
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [
            {
              Name: "TEST_ENVIRONMENT_VARIABLE1",
              Value: "test environment variable 1 value"
            },
            {
              Name: "TEST_ENVIRONMENT_VARIABLE2",
              Value: "test environment variable 2 value"
            }
          ],
          LogConfiguration: {
            LogDriver: "awslogs",
            Options: {
              "awslogs-group": { Ref: "ServiceTaskDefwebLogGroup2A898F61" },
              "awslogs-stream-prefix": "TestStream",
              "awslogs-region": { Ref: "AWS::Region" }
            }
          },
        }
      ]
    }));

    test.done();
  },
  'test Fargate loadbalanced construct with logging enabled'(test: Test) {
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
          TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
          TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
        }
      },
      desiredCount: 2,
    });

    // THEN - stack contains a load balancer and a service
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [
            {
              Name: "TEST_ENVIRONMENT_VARIABLE1",
              Value: "test environment variable 1 value"
            },
            {
              Name: "TEST_ENVIRONMENT_VARIABLE2",
              Value: "test environment variable 2 value"
            }
          ],
          LogConfiguration: {
            LogDriver: "awslogs",
            Options: {
              "awslogs-group": { Ref: "ServiceTaskDefwebLogGroup2A898F61" },
              "awslogs-stream-prefix": "Service",
              "awslogs-region": { Ref: "AWS::Region" }
            }
          },
        }
      ]
    }));

    test.done();
  },
  'test Fargate loadbalanced construct with both image and taskDefinition provided'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
    taskDefinition.addContainer("web", {
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      memoryLimitMiB: 512
    });

    // WHEN
    test.throws(() => new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('test'),
        enableLogging: true,
        environment: {
          TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
          TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
        },
      },
      desiredCount: 2,
      taskDefinition
    }));

    test.done();
  },
  'test Fargate application loadbalanced construct with taskDefinition provided'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    const container = taskDefinition.addContainer("passedTaskDef", {
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      memoryLimitMiB: 512
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

    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Image: "amazon/amazon-ecs-sample",
          Memory: 512,
          Name: "passedTaskDef",
          PortMappings: [
            {
              ContainerPort: 80,
              Protocol: "tcp"
            }
          ],
        }
      ]
    }));

    test.done();
  },

  'ALB - throws if desiredTaskCount is 0'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });

    // THEN
    test.throws(() =>
      new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
        cluster,
        memoryLimitMiB: 1024,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('test'),
        },
        desiredCount: 0,
      })
    , /You must specify a desiredCount greater than 0/);

    test.done();
  },

  'NLB - throws if desiredTaskCount is 0'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });

    // THEN
    test.throws(() =>
      new ecsPatterns.NetworkLoadBalancedEc2Service(stack, 'Service', {
        cluster,
        memoryLimitMiB: 1024,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('test'),
        },
        desiredCount: 0,
      })
    , /You must specify a desiredCount greater than 0/);

    test.done();
  },
};

import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import { AwsLogDriver } from '@aws-cdk/aws-ecs';
import { PublicHostedZone } from '@aws-cdk/aws-route53';
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
    new ecsPatterns.LoadBalancedEc2Service(stack, 'Service', {
      cluster,
      memoryLimitMiB: 1024,
      image: ecs.ContainerImage.fromRegistry('test'),
      desiredCount: 2,
      environment: {
        TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
        TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
      }
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
    new ecsPatterns.LoadBalancedEc2Service(stack, 'Service', {
      vpc,
      memoryLimitMiB: 1024,
      image: ecs.ContainerImage.fromRegistry('test'),
      desiredCount: 2,
      environment: {
        TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
        TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
      }
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
    test.throws(() => new ecsPatterns.LoadBalancedEc2Service(stack, 'Service', {
      cluster,
      vpc,
      loadBalancerType: ecsPatterns.LoadBalancerType.NETWORK,
      image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app")
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
    new ecsPatterns.LoadBalancedEc2Service(stack, 'Service', {
      cluster,
      memoryReservationMiB: 1024,
      image: ecs.ContainerImage.fromRegistry('test')
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

  'test Fargate loadbalanced construct'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
      cluster,
      image: ecs.ContainerImage.fromRegistry('test'),
      desiredCount: 2,
      environment: {
        TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
        TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
      }
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
      Port: 80
    }));

    test.done();
  },

  'test Fargate loadbalanced construct opting out of log driver creation'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
      cluster,
      image: ecs.ContainerImage.fromRegistry('test'),
      desiredCount: 2,
      enableLogging: false,
      environment: {
        TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
        TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
      }
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
    new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
      cluster,
      image: ecs.ContainerImage.fromRegistry('test'),
      domainName: 'api.example.com',
      domainZone: zone,
      certificate: Certificate.fromCertificateArn(stack, 'Cert', 'helloworld')
    });

    // THEN - stack contains a load balancer and a service
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      Port: 443,
      Certificates: [{
        CertificateArn: "helloworld"
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
      new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
        cluster,
        image: ecs.ContainerImage.fromRegistry('test'),
        domainName: 'api.example.com'
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
    new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
      cluster,
      image: ecs.ContainerImage.fromRegistry('test'),
      desiredCount: 2,
      enableLogging: false,
      environment: {
        TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
        TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
      },
      logDriver: new AwsLogDriver({
        streamPrefix: "TestStream"
      })
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
    new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
      cluster,
      image: ecs.ContainerImage.fromRegistry('test'),
      desiredCount: 2,
      enableLogging: true,
      environment: {
        TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
        TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
      }
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
};

"use strict";
const assert_1 = require("@aws-cdk/assert");
const aws_certificatemanager_1 = require("@aws-cdk/aws-certificatemanager");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const aws_elasticloadbalancingv2_1 = require("@aws-cdk/aws-elasticloadbalancingv2");
const aws_route53_1 = require("@aws-cdk/aws-route53");
const cloudmap = require("@aws-cdk/aws-servicediscovery");
const cdk = require("@aws-cdk/core");
const ecsPatterns = require("../../lib");
module.exports = {
    'test ECS loadbalanced construct'(test) {
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
                    TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
                    TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
                },
            },
            desiredCount: 2,
        });
        // THEN - stack contains a load balancer and a service
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
            DesiredCount: 2,
            LaunchType: 'EC2',
        }));
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                {
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
                },
            ],
        }));
        test.done();
    },
    'set vpc instead of cluster'(test) {
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
                    TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
                    TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
                },
            },
            desiredCount: 2,
        });
        // THEN - stack does not contain a LaunchConfiguration
        assert_1.expect(stack, true).notTo(assert_1.haveResource('AWS::AutoScaling::LaunchConfiguration'));
        test.throws(() => assert_1.expect(stack));
        test.done();
    },
    'setting vpc and cluster throws error'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        // WHEN
        test.throws(() => new ecsPatterns.NetworkLoadBalancedEc2Service(stack, 'Service', {
            cluster,
            vpc,
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
            },
        }));
        test.done();
    },
    'test ECS loadbalanced construct with memoryReservationMiB'(test) {
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
                image: ecs.ContainerImage.fromRegistry('test'),
            },
        });
        // THEN - stack contains a load balancer and a service
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                {
                    MemoryReservation: 1024,
                },
            ],
        }));
        test.done();
    },
    'creates AWS Cloud Map service for Private DNS namespace with application load balanced ec2 service'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
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
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
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
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ServiceDiscovery::Service', {
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
        }));
        test.done();
    },
    'creates AWS Cloud Map service for Private DNS namespace with network load balanced fargate service'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
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
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
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
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ServiceDiscovery::Service', {
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
        }));
        test.done();
    },
    'test Fargate loadbalanced construct'(test) {
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
            },
            desiredCount: 2,
        });
        // THEN - stack contains a load balancer and a service
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                {
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
                },
            ],
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
            DesiredCount: 2,
            LaunchType: 'FARGATE',
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ElasticLoadBalancingV2::Listener', {
            Port: 80,
            Protocol: 'HTTP',
        }));
        test.done();
    },
    'test Fargate loadbalanced construct opting out of log driver creation'(test) {
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
        assert_1.expect(stack).notTo(assert_1.haveResource('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                {
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
                },
            ],
        }));
        test.done();
    },
    'test Fargate loadbalanced construct with TLS'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        const zone = new aws_route53_1.PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });
        // WHEN
        new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
            cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('test'),
            },
            domainName: 'api.example.com',
            domainZone: zone,
            certificate: aws_certificatemanager_1.Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
        });
        // THEN - stack contains a load balancer and a service
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ElasticLoadBalancingV2::Listener', {
            Port: 443,
            Protocol: 'HTTPS',
            Certificates: [{
                    CertificateArn: 'helloworld',
                }],
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
            Port: 80,
            Protocol: 'HTTP',
            TargetType: 'ip',
            VpcId: {
                Ref: 'VPCB9E5F0B4',
            },
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
            DesiredCount: 1,
            LaunchType: 'FARGATE',
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::Route53::RecordSet', {
            Name: 'api.example.com.',
            HostedZoneId: {
                Ref: 'HostedZoneDB99F866',
            },
            Type: 'A',
            AliasTarget: {
                HostedZoneId: { 'Fn::GetAtt': ['ServiceLBE9A1ADBC', 'CanonicalHostedZoneID'] },
                DNSName: { 'Fn::GetAtt': ['ServiceLBE9A1ADBC', 'DNSName'] },
            },
        }));
        test.done();
    },
    'test Fargateloadbalanced construct with TLS and default certificate'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        const zone = new aws_route53_1.PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });
        // WHEN
        new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
            cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('test'),
            },
            domainName: 'api.example.com',
            domainZone: zone,
            protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTPS,
        });
        // THEN - stack contains a load balancer, a service, and a certificate
        assert_1.expect(stack).to(assert_1.haveResource('AWS::CloudFormation::CustomResource', {
            ServiceToken: {
                'Fn::GetAtt': [
                    'ServiceCertificateCertificateRequestorFunctionB69CD117',
                    'Arn',
                ],
            },
            DomainName: 'api.example.com',
            HostedZoneId: {
                Ref: 'HostedZoneDB99F866',
            },
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ElasticLoadBalancingV2::Listener', {
            Port: 443,
            Protocol: 'HTTPS',
            Certificates: [{
                    CertificateArn: { 'Fn::GetAtt': [
                            'ServiceCertificateCertificateRequestorResource0FC297E9',
                            'Arn',
                        ] },
                }],
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
            DesiredCount: 1,
            LaunchType: 'FARGATE',
        }));
        assert_1.expect(stack).to(assert_1.haveResource('AWS::Route53::RecordSet', {
            Name: 'api.example.com.',
            HostedZoneId: {
                Ref: 'HostedZoneDB99F866',
            },
            Type: 'A',
            AliasTarget: {
                HostedZoneId: { 'Fn::GetAtt': ['ServiceLBE9A1ADBC', 'CanonicalHostedZoneID'] },
                DNSName: { 'Fn::GetAtt': ['ServiceLBE9A1ADBC', 'DNSName'] },
            },
        }));
        test.done();
    },
    'errors when setting domainName but not domainZone'(test) {
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
                domainName: 'api.example.com',
            });
        });
        test.done();
    },
    'errors when setting both HTTP protocol and certificate'(test) {
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
                protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTP,
                certificate: aws_certificatemanager_1.Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
            });
        });
        test.done();
    },
    'errors when setting HTTPS protocol but not domain name'(test) {
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
                protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTPS,
            });
        });
        test.done();
    },
    'test Fargate loadbalanced construct with optional log driver input'(test) {
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
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                {
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
                },
            ],
        }));
        test.done();
    },
    'test Fargate loadbalanced construct with logging enabled'(test) {
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
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                {
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
                },
            ],
        }));
        test.done();
    },
    'test Fargate loadbalanced construct with both image and taskDefinition provided'(test) {
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
        test.throws(() => new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
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
        }));
        test.done();
    },
    'test Fargate application loadbalanced construct with taskDefinition provided'(test) {
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
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                {
                    Image: 'amazon/amazon-ecs-sample',
                    Memory: 512,
                    Name: 'passedTaskDef',
                    PortMappings: [
                        {
                            ContainerPort: 80,
                            Protocol: 'tcp',
                        },
                    ],
                },
            ],
        }));
        test.done();
    },
    'ALB - throws if desiredTaskCount is 0'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
        // THEN
        test.throws(() => new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
            cluster,
            memoryLimitMiB: 1024,
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('test'),
            },
            desiredCount: 0,
        }), /You must specify a desiredCount greater than 0/);
        test.done();
    },
    'NLB - throws if desiredTaskCount is 0'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
        // THEN
        test.throws(() => new ecsPatterns.NetworkLoadBalancedEc2Service(stack, 'Service', {
            cluster,
            memoryLimitMiB: 1024,
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('test'),
            },
            desiredCount: 0,
        }), /You must specify a desiredCount greater than 0/);
        test.done();
    },
    'ALBFargate - having *HealthyPercent properties'(test) {
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
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::Service', {
            DeploymentConfiguration: {
                MinimumHealthyPercent: 100,
                MaximumPercent: 200,
            },
        }));
        test.done();
    },
    'NLBFargate - having *HealthyPercent properties'(test) {
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
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::Service', {
            DeploymentConfiguration: {
                MinimumHealthyPercent: 100,
                MaximumPercent: 200,
            },
        }));
        test.done();
    },
    'ALB - having *HealthyPercent properties'(test) {
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
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            },
            desiredCount: 1,
            minHealthyPercent: 100,
            maxHealthyPercent: 200,
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::Service', {
            DeploymentConfiguration: {
                MinimumHealthyPercent: 100,
                MaximumPercent: 200,
            },
        }));
        test.done();
    },
    'NLB - having *HealthyPercent properties'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
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
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::Service', {
            DeploymentConfiguration: {
                MinimumHealthyPercent: 100,
                MaximumPercent: 200,
            },
        }));
        test.done();
    },
    'NetworkLoadbalancedEC2Service accepts previously created load balancer'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc, clusterName: 'MyCluster' });
        cluster.addCapacity('Capacity', { instanceType: new ec2.InstanceType('t2.micro') });
        const nlb = new aws_elasticloadbalancingv2_1.NetworkLoadBalancer(stack, 'NLB', { vpc });
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
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::Service', {
            LaunchType: 'EC2',
        }));
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            Type: 'network',
        }));
        test.done();
    },
    'NetworkLoadBalancedEC2Service accepts imported load balancer'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const nlbArn = 'arn:aws:elasticloadbalancing::000000000000::dummyloadbalancer';
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc, clusterName: 'MyCluster' });
        cluster.addCapacity('Capacity', { instanceType: new ec2.InstanceType('t2.micro') });
        const nlb = aws_elasticloadbalancingv2_1.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stack, 'NLB', {
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
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::Service', {
            LaunchType: 'EC2',
            LoadBalancers: [{ ContainerName: 'Container', ContainerPort: 80 }],
        }));
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::TargetGroup'));
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::Listener', {
            LoadBalancerArn: nlb.loadBalancerArn,
            Port: 80,
        }));
        test.done();
    },
    'ApplicationLoadBalancedEC2Service accepts previously created load balancer'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc, clusterName: 'MyCluster' });
        cluster.addCapacity('Capacity', { instanceType: new ec2.InstanceType('t2.micro') });
        const sg = new ec2.SecurityGroup(stack, 'SG', { vpc });
        const alb = new aws_elasticloadbalancingv2_1.ApplicationLoadBalancer(stack, 'NLB', {
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
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::Service', {
            LaunchType: 'EC2',
        }));
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            Type: 'application',
        }));
        test.done();
    },
    'ApplicationLoadBalancedEC2Service accepts imported load balancer'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const albArn = 'arn:aws:elasticloadbalancing::000000000000::dummyloadbalancer';
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc, clusterName: 'MyCluster' });
        cluster.addCapacity('Capacity', { instanceType: new ec2.InstanceType('t2.micro') });
        const sg = new ec2.SecurityGroup(stack, 'SG', { vpc });
        const alb = aws_elasticloadbalancingv2_1.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack, 'ALB', {
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
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::Service', {
            LaunchType: 'EC2',
            LoadBalancers: [{ ContainerName: 'Container', ContainerPort: 80 }],
        }));
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::TargetGroup'));
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::Listener', {
            LoadBalancerArn: alb.loadBalancerArn,
            Port: 80,
        }));
        test.done();
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5sM3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZXN0Lmwzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNENBQXlFO0FBQ3pFLDRFQUE4RDtBQUM5RCx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLG9GQUF3SDtBQUN4SCxzREFBd0Q7QUFDeEQsMERBQTBEO0FBQzFELHFDQUFxQztBQUVyQyx5Q0FBeUM7QUFFekMsaUJBQVM7SUFDUCxpQ0FBaUMsQ0FBQyxJQUFVO1FBQzFDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUMzRCxPQUFPLENBQUMsV0FBVyxDQUFDLHlCQUF5QixFQUFFLEVBQUUsWUFBWSxFQUFFLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFbkcsT0FBTztRQUNQLElBQUksV0FBVyxDQUFDLGlDQUFpQyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDbEUsT0FBTztZQUNQLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLGdCQUFnQixFQUFFO2dCQUNoQixLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO2dCQUM5QyxXQUFXLEVBQUU7b0JBQ1gsMEJBQTBCLEVBQUUsbUNBQW1DO29CQUMvRCwwQkFBMEIsRUFBRSxtQ0FBbUM7aUJBQ2hFO2FBQ0Y7WUFDRCxZQUFZLEVBQUUsQ0FBQztTQUNoQixDQUFDLENBQUM7UUFFSCxzREFBc0Q7UUFDdEQsZUFBTSxDQUFDLEtBQUssQ0FBQyxD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WUFBWSxDQUFDLDBCQUEwQixDQUFDO1lBQ2xFLGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUNILFNBQVMsQ0FBQyxlQUFlLENBQUM7WUFDeEIsYUFBYSxFQUFFLEVBQUU7U0FDbEIsQ0FBQyxDQUFDO1FBQ0gsT0FBTztRQUNQLElBQUksV0FBVyxDQUFDLGlDQUFpQyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDbEUsT0FBTztZQUNQLFlBQVksRUFBRSxHQUFHO1lBQ2pCLGNBQWMsRUFBRSxPQUFPO1NBQ3hCLENBQUMsQ0FBQztRQUNILE9BQU87UUFDUCxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLHlCQUFnQixDQUFDLG1CQUFtQixFQUFFO1lBQ3JELFVBQVUsRUFBRSxLQUFLO1lBQ2pCLGFBQWEsRUFBRSxDQUFDLEVBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsRUFBRSxFQUFDLENBQUM7U0FDakUsQ0FBQyxDQUFDLENBQUM7UUFDSixlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLHlCQUFnQixDQUFDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQztRQUMvRSxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLHlCQUFnQixDQUFDLHVDQUF1QyxFQUFFO1lBQ3pFLGVBQWUsRUFBRSxHQUFHLENBQUMsZUFBZTtZQUNwQyxJQUFJLEVBQUUsRUFBRTtTQUNULENBQUMsQ0FBQyxDQUFDO1FBRUosSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleHBlY3QsIGhhdmVSZXNvdXJjZSwgaGF2ZVJlc291cmNlTGlrZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydCc7XG5pbXBvcnQgeyBDZXJ0aWZpY2F0ZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1jZXJ0aWZpY2F0ZW1hbmFnZXInO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3MnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIsIEFwcGxpY2F0aW9uUHJvdG9jb2wsIE5ldHdvcmtMb2FkQmFsYW5jZXIgfSBmcm9tICdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mic7XG5pbXBvcnQgeyBQdWJsaWNIb3N0ZWRab25lIH0gZnJvbSAnQGF3cy1jZGsvYXdzLXJvdXRlNTMnO1xuaW1wb3J0ICogYXMgY2xvdWRtYXAgZnJvbSAnQGF3cy1jZGsvYXdzLXNlcnZpY2VkaXNjb3ZlcnknO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgVGVzdCB9IGZyb20gJ25vZGV1bml0JztcbmltcG9ydCAqIGFzIGVjc1BhdHRlcm5zIGZyb20gJy4uLy4uL2xpYic7XG5cbmV4cG9ydCA9IHtcbiAgJ3Rlc3QgRUNTIGxvYWRiYWxhbmNlZCBjb25zdHJ1Y3QnKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHsgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzUGF0dGVybnMuQXBwbGljYXRpb25Mb2FkQmFsYW5jZWRFYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMTogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMSB2YWx1ZScsXG4gICAgICAgICAgVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTI6ICd0ZXN0IGVudmlyb25tZW50IHZhcmlhYmxlIDIgdmFsdWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGRlc2lyZWRDb3VudDogMixcbiAgICB9KTtcblxuICAgIC8vIFRIRU4gLSBzdGFjayBjb250YWlucyBhIGxvYWQgYmFsYW5jZXIgYW5kIGEgc2VydmljZVxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OkxvYWRCYWxhbmNlcicpKTtcblxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgIERlc2lyZWRDb3VudDogMixcbiAgICAgIExhdW5jaFR5cGU6ICdFQzInLFxuICAgIH0pKTtcblxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZSgnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVudmlyb25tZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMScsXG4gICAgICAgICAgICAgIFZhbHVlOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAxIHZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMicsXG4gICAgICAgICAgICAgIFZhbHVlOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAyIHZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBNZW1vcnk6IDEwMjQsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pKTtcblxuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gICdzZXQgdnBjIGluc3RlYWQgb2YgY2x1c3RlcicodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzUGF0dGVybnMuQXBwbGljYXRpb25Mb2FkQmFsYW5jZWRFYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgIHZwYyxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIFRFU1RfRU5WSVJPTk1FTlRfVkFSSUFCTEUxOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAxIHZhbHVlJyxcbiAgICAgICAgICBURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMjogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMiB2YWx1ZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgZGVzaXJlZENvdW50OiAyLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTiAtIHN0YWNrIGRvZXMgbm90IGNvbnRhaW4gYSBMYXVuY2hDb25maWd1cmF0aW9uXG4gICAgZXhwZWN0KHN0YWNrLCB0cnVlKS5ub3RUbyhoYXZlUmVzb3VyY2UoJ0FXUzo6QXV0b1NjYWxpbmc6OkxhdW5jaENvbmZpZ3VyYXRpb24nKSk7XG5cbiAgICB0ZXN0LnRocm93cygoKSA9PiBleHBlY3Qoc3RhY2spKTtcblxuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gICdzZXR0aW5nIHZwYyBhbmQgY2x1c3RlciB0aHJvd3MgZXJyb3InKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICB0ZXN0LnRocm93cygoKSA9PiBuZXcgZWNzUGF0dGVybnMuTmV0d29ya0xvYWRCYWxhbmNlZEVjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHZwYyxcbiAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICB9LFxuICAgIH0pKTtcblxuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gICd0ZXN0IEVDUyBsb2FkYmFsYW5jZWQgY29uc3RydWN0IHdpdGggbWVtb3J5UmVzZXJ2YXRpb25NaUInKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHsgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzUGF0dGVybnMuQXBwbGljYXRpb25Mb2FkQmFsYW5jZWRFYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBtZW1vcnlSZXNlcnZhdGlvbk1pQjogMTAyNCxcbiAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOIC0gc3RhY2sgY29udGFpbnMgYSBsb2FkIGJhbGFuY2VyIGFuZCBhIHNlcnZpY2VcbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXInKSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBNZW1vcnlSZXNlcnZhdGlvbjogMTAyNCxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ2NyZWF0ZXMgQVdTIENsb3VkIE1hcCBzZXJ2aWNlIGZvciBQcml2YXRlIEROUyBuYW1lc3BhY2Ugd2l0aCBhcHBsaWNhdGlvbiBsb2FkIGJhbGFuY2VkIGVjMiBzZXJ2aWNlJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7IGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJykgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5hZGREZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2Uoe1xuICAgICAgbmFtZTogJ2Zvby5jb20nLFxuICAgICAgdHlwZTogY2xvdWRtYXAuTmFtZXNwYWNlVHlwZS5ETlNfUFJJVkFURSxcbiAgICB9KTtcblxuICAgIG5ldyBlY3NQYXR0ZXJucy5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlZEVjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgY29udGFpbmVyUG9ydDogODAwMCxcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2hlbGxvJyksXG4gICAgICB9LFxuICAgICAgY2xvdWRNYXBPcHRpb25zOiB7XG4gICAgICAgIG5hbWU6ICdteUFwcCcsXG4gICAgICB9LFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICBTZXJ2aWNlUmVnaXN0cmllczogW1xuICAgICAgICB7XG4gICAgICAgICAgQ29udGFpbmVyTmFtZTogJ3dlYicsXG4gICAgICAgICAgQ29udGFpbmVyUG9ydDogODAwMCxcbiAgICAgICAgICBSZWdpc3RyeUFybjoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdTZXJ2aWNlQ2xvdWRtYXBTZXJ2aWNlREU3NkIyOUQnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6U2VydmljZScsIHtcbiAgICAgIERuc0NvbmZpZzoge1xuICAgICAgICBEbnNSZWNvcmRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgVFRMOiA2MCxcbiAgICAgICAgICAgIFR5cGU6ICdTUlYnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIE5hbWVzcGFjZUlkOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnRWNzQ2x1c3RlckRlZmF1bHRTZXJ2aWNlRGlzY292ZXJ5TmFtZXNwYWNlQjA5NzFCMkYnLFxuICAgICAgICAgICAgJ0lkJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBSb3V0aW5nUG9saWN5OiAnTVVMVElWQUxVRScsXG4gICAgICB9LFxuICAgICAgSGVhbHRoQ2hlY2tDdXN0b21Db25maWc6IHtcbiAgICAgICAgRmFpbHVyZVRocmVzaG9sZDogMSxcbiAgICAgIH0sXG4gICAgICBOYW1lOiAnbXlBcHAnLFxuICAgICAgTmFtZXNwYWNlSWQ6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ0Vjc0NsdXN0ZXJEZWZhdWx0U2VydmljZURpc2NvdmVyeU5hbWVzcGFjZUIwOTcxQjJGJyxcbiAgICAgICAgICAnSWQnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAnY3JlYXRlcyBBV1MgQ2xvdWQgTWFwIHNlcnZpY2UgZm9yIFByaXZhdGUgRE5TIG5hbWVzcGFjZSB3aXRoIG5ldHdvcmsgbG9hZCBiYWxhbmNlZCBmYXJnYXRlIHNlcnZpY2UnKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHsgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICBuYW1lOiAnZm9vLmNvbScsXG4gICAgICB0eXBlOiBjbG91ZG1hcC5OYW1lc3BhY2VUeXBlLkROU19QUklWQVRFLFxuICAgIH0pO1xuXG4gICAgbmV3IGVjc1BhdHRlcm5zLk5ldHdvcmtMb2FkQmFsYW5jZWRGYXJnYXRlU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICBjb250YWluZXJQb3J0OiA4MDAwLFxuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnaGVsbG8nKSxcbiAgICAgIH0sXG4gICAgICBjbG91ZE1hcE9wdGlvbnM6IHtcbiAgICAgICAgbmFtZTogJ215QXBwJyxcbiAgICAgIH0sXG4gICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgIFNlcnZpY2VSZWdpc3RyaWVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWdpc3RyeUFybjoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdTZXJ2aWNlQ2xvdWRtYXBTZXJ2aWNlREU3NkIyOUQnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6U2VydmljZURpc2NvdmVyeTo6U2VydmljZScsIHtcbiAgICAgIERuc0NvbmZpZzoge1xuICAgICAgICBEbnNSZWNvcmRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgVFRMOiA2MCxcbiAgICAgICAgICAgIFR5cGU6ICdBJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBOYW1lc3BhY2VJZDoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0Vjc0NsdXN0ZXJEZWZhdWx0U2VydmljZURpc2NvdmVyeU5hbWVzcGFjZUIwOTcxQjJGJyxcbiAgICAgICAgICAgICdJZCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgUm91dGluZ1BvbGljeTogJ01VTFRJVkFMVUUnLFxuICAgICAgfSxcbiAgICAgIEhlYWx0aENoZWNrQ3VzdG9tQ29uZmlnOiB7XG4gICAgICAgIEZhaWx1cmVUaHJlc2hvbGQ6IDEsXG4gICAgICB9LFxuICAgICAgTmFtZTogJ215QXBwJyxcbiAgICAgIE5hbWVzcGFjZUlkOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdFY3NDbHVzdGVyRGVmYXVsdFNlcnZpY2VEaXNjb3ZlcnlOYW1lc3BhY2VCMDk3MUIyRicsXG4gICAgICAgICAgJ0lkJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ3Rlc3QgRmFyZ2F0ZSBsb2FkYmFsYW5jZWQgY29uc3RydWN0Jyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMTogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMSB2YWx1ZScsXG4gICAgICAgICAgVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTI6ICd0ZXN0IGVudmlyb25tZW50IHZhcmlhYmxlIDIgdmFsdWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGRlc2lyZWRDb3VudDogMixcbiAgICB9KTtcblxuICAgIC8vIFRIRU4gLSBzdGFjayBjb250YWlucyBhIGxvYWQgYmFsYW5jZXIgYW5kIGEgc2VydmljZVxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OkxvYWRCYWxhbmNlcicpKTtcbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBFbnZpcm9ubWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBOYW1lOiAnVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTEnLFxuICAgICAgICAgICAgICBWYWx1ZTogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMSB2YWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBOYW1lOiAnVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTInLFxuICAgICAgICAgICAgICBWYWx1ZTogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMiB2YWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgTG9nRHJpdmVyOiAnYXdzbG9ncycsXG4gICAgICAgICAgICBPcHRpb25zOiB7XG4gICAgICAgICAgICAgICdhd3Nsb2dzLWdyb3VwJzogeyBSZWY6ICdTZXJ2aWNlVGFza0RlZndlYkxvZ0dyb3VwMkE4OThGNjEnIH0sXG4gICAgICAgICAgICAgICdhd3Nsb2dzLXN0cmVhbS1wcmVmaXgnOiAnU2VydmljZScsXG4gICAgICAgICAgICAgICdhd3Nsb2dzLXJlZ2lvbic6IHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pKTtcblxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgIERlc2lyZWRDb3VudDogMixcbiAgICAgIExhdW5jaFR5cGU6ICdGQVJHQVRFJyxcbiAgICB9KSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIFBvcnQ6IDgwLFxuICAgICAgUHJvdG9jb2w6ICdIVFRQJyxcbiAgICB9KSk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAndGVzdCBGYXJnYXRlIGxvYWRiYWxhbmNlZCBjb25zdHJ1Y3Qgb3B0aW5nIG91dCBvZiBsb2cgZHJpdmVyIGNyZWF0aW9uJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgZW5hYmxlTG9nZ2luZzogZmFsc2UsXG4gICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTE6ICd0ZXN0IGVudmlyb25tZW50IHZhcmlhYmxlIDEgdmFsdWUnLFxuICAgICAgICAgIFRFU1RfRU5WSVJPTk1FTlRfVkFSSUFCTEUyOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAyIHZhbHVlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBkZXNpcmVkQ291bnQ6IDIsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOIC0gc3RhY2sgY29udGFpbnMgYSBsb2FkIGJhbGFuY2VyIGFuZCBhIHNlcnZpY2VcbiAgICBleHBlY3Qoc3RhY2spLm5vdFRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVudmlyb25tZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMScsXG4gICAgICAgICAgICAgIFZhbHVlOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAxIHZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMicsXG4gICAgICAgICAgICAgIFZhbHVlOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAyIHZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBMb2dEcml2ZXI6ICdhd3Nsb2dzJyxcbiAgICAgICAgICAgIE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgJ2F3c2xvZ3MtZ3JvdXAnOiB7IFJlZjogJ1NlcnZpY2VUYXNrRGVmd2ViTG9nR3JvdXAyQTg5OEY2MScgfSxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3Mtc3RyZWFtLXByZWZpeCc6ICdTZXJ2aWNlJyxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3MtcmVnaW9uJzogeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ3Rlc3QgRmFyZ2F0ZSBsb2FkYmFsYW5jZWQgY29uc3RydWN0IHdpdGggVExTJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgY29uc3Qgem9uZSA9IG5ldyBQdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnSG9zdGVkWm9uZScsIHsgem9uZU5hbWU6ICdleGFtcGxlLmNvbScgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgIH0sXG4gICAgICBkb21haW5OYW1lOiAnYXBpLmV4YW1wbGUuY29tJyxcbiAgICAgIGRvbWFpblpvbmU6IHpvbmUsXG4gICAgICBjZXJ0aWZpY2F0ZTogQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHN0YWNrLCAnQ2VydCcsICdoZWxsb3dvcmxkJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOIC0gc3RhY2sgY29udGFpbnMgYSBsb2FkIGJhbGFuY2VyIGFuZCBhIHNlcnZpY2VcbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXInKSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIFBvcnQ6IDQ0MyxcbiAgICAgIFByb3RvY29sOiAnSFRUUFMnLFxuICAgICAgQ2VydGlmaWNhdGVzOiBbe1xuICAgICAgICBDZXJ0aWZpY2F0ZUFybjogJ2hlbGxvd29ybGQnLFxuICAgICAgfV0sXG4gICAgfSkpO1xuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6VGFyZ2V0R3JvdXAnLCB7XG4gICAgICBQb3J0OiA4MCxcbiAgICAgIFByb3RvY29sOiAnSFRUUCcsXG4gICAgICBUYXJnZXRUeXBlOiAnaXAnLFxuICAgICAgVnBjSWQ6IHtcbiAgICAgICAgUmVmOiAnVlBDQjlFNUYwQjQnLFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICBEZXNpcmVkQ291bnQ6IDEsXG4gICAgICBMYXVuY2hUeXBlOiAnRkFSR0FURScsXG4gICAgfSkpO1xuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6Um91dGU1Mzo6UmVjb3JkU2V0Jywge1xuICAgICAgTmFtZTogJ2FwaS5leGFtcGxlLmNvbS4nLFxuICAgICAgSG9zdGVkWm9uZUlkOiB7XG4gICAgICAgIFJlZjogJ0hvc3RlZFpvbmVEQjk5Rjg2NicsXG4gICAgICB9LFxuICAgICAgVHlwZTogJ0EnLFxuICAgICAgQWxpYXNUYXJnZXQ6IHtcbiAgICAgICAgSG9zdGVkWm9uZUlkOiB7ICdGbjo6R2V0QXR0JzogWydTZXJ2aWNlTEJFOUExQURCQycsICdDYW5vbmljYWxIb3N0ZWRab25lSUQnXSB9LFxuICAgICAgICBETlNOYW1lOiB7ICdGbjo6R2V0QXR0JzogWydTZXJ2aWNlTEJFOUExQURCQycsICdETlNOYW1lJ10gfSxcbiAgICAgIH0sXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ3Rlc3QgRmFyZ2F0ZWxvYWRiYWxhbmNlZCBjb25zdHJ1Y3Qgd2l0aCBUTFMgYW5kIGRlZmF1bHQgY2VydGlmaWNhdGUnKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBjb25zdCB6b25lID0gbmV3IFB1YmxpY0hvc3RlZFpvbmUoc3RhY2ssICdIb3N0ZWRab25lJywgeyB6b25lTmFtZTogJ2V4YW1wbGUuY29tJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzUGF0dGVybnMuQXBwbGljYXRpb25Mb2FkQmFsYW5jZWRGYXJnYXRlU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgfSxcbiAgICAgIGRvbWFpbk5hbWU6ICdhcGkuZXhhbXBsZS5jb20nLFxuICAgICAgZG9tYWluWm9uZTogem9uZSxcbiAgICAgIHByb3RvY29sOiBBcHBsaWNhdGlvblByb3RvY29sLkhUVFBTLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTiAtIHN0YWNrIGNvbnRhaW5zIGEgbG9hZCBiYWxhbmNlciwgYSBzZXJ2aWNlLCBhbmQgYSBjZXJ0aWZpY2F0ZVxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkNsb3VkRm9ybWF0aW9uOjpDdXN0b21SZXNvdXJjZScsIHtcbiAgICAgIFNlcnZpY2VUb2tlbjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnU2VydmljZUNlcnRpZmljYXRlQ2VydGlmaWNhdGVSZXF1ZXN0b3JGdW5jdGlvbkI2OUNEMTE3JyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBEb21haW5OYW1lOiAnYXBpLmV4YW1wbGUuY29tJyxcbiAgICAgIEhvc3RlZFpvbmVJZDoge1xuICAgICAgICBSZWY6ICdIb3N0ZWRab25lREI5OUY4NjYnLFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXInKSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIFBvcnQ6IDQ0MyxcbiAgICAgIFByb3RvY29sOiAnSFRUUFMnLFxuICAgICAgQ2VydGlmaWNhdGVzOiBbe1xuICAgICAgICBDZXJ0aWZpY2F0ZUFybjogeyAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnU2VydmljZUNlcnRpZmljYXRlQ2VydGlmaWNhdGVSZXF1ZXN0b3JSZXNvdXJjZTBGQzI5N0U5JyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXX0sXG4gICAgICB9XSxcbiAgICB9KSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICBEZXNpcmVkQ291bnQ6IDEsXG4gICAgICBMYXVuY2hUeXBlOiAnRkFSR0FURScsXG4gICAgfSkpO1xuXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6Um91dGU1Mzo6UmVjb3JkU2V0Jywge1xuICAgICAgTmFtZTogJ2FwaS5leGFtcGxlLmNvbS4nLFxuICAgICAgSG9zdGVkWm9uZUlkOiB7XG4gICAgICAgIFJlZjogJ0hvc3RlZFpvbmVEQjk5Rjg2NicsXG4gICAgICB9LFxuICAgICAgVHlwZTogJ0EnLFxuICAgICAgQWxpYXNUYXJnZXQ6IHtcbiAgICAgICAgSG9zdGVkWm9uZUlkOiB7ICdGbjo6R2V0QXR0JzogWydTZXJ2aWNlTEJFOUExQURCQycsICdDYW5vbmljYWxIb3N0ZWRab25lSUQnXSB9LFxuICAgICAgICBETlNOYW1lOiB7ICdGbjo6R2V0QXR0JzogWydTZXJ2aWNlTEJFOUExQURCQycsICdETlNOYW1lJ10gfSxcbiAgICAgIH0sXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ2Vycm9ycyB3aGVuIHNldHRpbmcgZG9tYWluTmFtZSBidXQgbm90IGRvbWFpblpvbmUnKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIC8vIFRIRU5cbiAgICB0ZXN0LnRocm93cygoKSA9PiB7XG4gICAgICBuZXcgZWNzUGF0dGVybnMuQXBwbGljYXRpb25Mb2FkQmFsYW5jZWRGYXJnYXRlU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICB9LFxuICAgICAgICBkb21haW5OYW1lOiAnYXBpLmV4YW1wbGUuY29tJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ2Vycm9ycyB3aGVuIHNldHRpbmcgYm90aCBIVFRQIHByb3RvY29sIGFuZCBjZXJ0aWZpY2F0ZScodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIHRlc3QudGhyb3dzKCgpID0+IHtcbiAgICAgIG5ldyBlY3NQYXR0ZXJucy5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlZEZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgIH0sXG4gICAgICAgIHByb3RvY29sOiBBcHBsaWNhdGlvblByb3RvY29sLkhUVFAsXG4gICAgICAgIGNlcnRpZmljYXRlOiBDZXJ0aWZpY2F0ZS5mcm9tQ2VydGlmaWNhdGVBcm4oc3RhY2ssICdDZXJ0JywgJ2hlbGxvd29ybGQnKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ2Vycm9ycyB3aGVuIHNldHRpbmcgSFRUUFMgcHJvdG9jb2wgYnV0IG5vdCBkb21haW4gbmFtZScodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIHRlc3QudGhyb3dzKCgpID0+IHtcbiAgICAgIG5ldyBlY3NQYXR0ZXJucy5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlZEZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgIH0sXG4gICAgICAgIHByb3RvY29sOiBBcHBsaWNhdGlvblByb3RvY29sLkhUVFBTLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAndGVzdCBGYXJnYXRlIGxvYWRiYWxhbmNlZCBjb25zdHJ1Y3Qgd2l0aCBvcHRpb25hbCBsb2cgZHJpdmVyIGlucHV0Jyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgZW5hYmxlTG9nZ2luZzogZmFsc2UsXG4gICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTE6ICd0ZXN0IGVudmlyb25tZW50IHZhcmlhYmxlIDEgdmFsdWUnLFxuICAgICAgICAgIFRFU1RfRU5WSVJPTk1FTlRfVkFSSUFCTEUyOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAyIHZhbHVlJyxcbiAgICAgICAgfSxcbiAgICAgICAgbG9nRHJpdmVyOiBuZXcgZWNzLkF3c0xvZ0RyaXZlcih7XG4gICAgICAgICAgc3RyZWFtUHJlZml4OiAnVGVzdFN0cmVhbScsXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICAgIGRlc2lyZWRDb3VudDogMixcbiAgICB9KTtcblxuICAgIC8vIFRIRU4gLSBzdGFjayBjb250YWlucyBhIGxvYWQgYmFsYW5jZXIgYW5kIGEgc2VydmljZVxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZSgnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVudmlyb25tZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMScsXG4gICAgICAgICAgICAgIFZhbHVlOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAxIHZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMicsXG4gICAgICAgICAgICAgIFZhbHVlOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAyIHZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBMb2dEcml2ZXI6ICdhd3Nsb2dzJyxcbiAgICAgICAgICAgIE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgJ2F3c2xvZ3MtZ3JvdXAnOiB7IFJlZjogJ1NlcnZpY2VUYXNrRGVmd2ViTG9nR3JvdXAyQTg5OEY2MScgfSxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3Mtc3RyZWFtLXByZWZpeCc6ICdUZXN0U3RyZWFtJyxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3MtcmVnaW9uJzogeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ3Rlc3QgRmFyZ2F0ZSBsb2FkYmFsYW5jZWQgY29uc3RydWN0IHdpdGggbG9nZ2luZyBlbmFibGVkJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgZW5hYmxlTG9nZ2luZzogdHJ1ZSxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMTogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMSB2YWx1ZScsXG4gICAgICAgICAgVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTI6ICd0ZXN0IGVudmlyb25tZW50IHZhcmlhYmxlIDIgdmFsdWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGRlc2lyZWRDb3VudDogMixcbiAgICB9KTtcblxuICAgIC8vIFRIRU4gLSBzdGFjayBjb250YWlucyBhIGxvYWQgYmFsYW5jZXIgYW5kIGEgc2VydmljZVxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZSgnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEVudmlyb25tZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMScsXG4gICAgICAgICAgICAgIFZhbHVlOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAxIHZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMicsXG4gICAgICAgICAgICAgIFZhbHVlOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAyIHZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICBMb2dEcml2ZXI6ICdhd3Nsb2dzJyxcbiAgICAgICAgICAgIE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgJ2F3c2xvZ3MtZ3JvdXAnOiB7IFJlZjogJ1NlcnZpY2VUYXNrRGVmd2ViTG9nR3JvdXAyQTg5OEY2MScgfSxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3Mtc3RyZWFtLXByZWZpeCc6ICdTZXJ2aWNlJyxcbiAgICAgICAgICAgICAgJ2F3c2xvZ3MtcmVnaW9uJzogeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ3Rlc3QgRmFyZ2F0ZSBsb2FkYmFsYW5jZWQgY29uc3RydWN0IHdpdGggYm90aCBpbWFnZSBhbmQgdGFza0RlZmluaXRpb24gcHJvdmlkZWQnKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgdGVzdC50aHJvd3MoKCkgPT4gbmV3IGVjc1BhdHRlcm5zLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgZW5hYmxlTG9nZ2luZzogdHJ1ZSxcbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMTogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMSB2YWx1ZScsXG4gICAgICAgICAgVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTI6ICd0ZXN0IGVudmlyb25tZW50IHZhcmlhYmxlIDIgdmFsdWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGRlc2lyZWRDb3VudDogMixcbiAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgIH0pKTtcblxuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gICd0ZXN0IEZhcmdhdGUgYXBwbGljYXRpb24gbG9hZGJhbGFuY2VkIGNvbnN0cnVjdCB3aXRoIHRhc2tEZWZpbml0aW9uIHByb3ZpZGVkJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG5cbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnKTtcbiAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3Bhc3NlZFRhc2tEZWYnLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgIH0pO1xuICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3Moe1xuICAgICAgY29udGFpbmVyUG9ydDogODAsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgZGVzaXJlZENvdW50OiAyLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBJbWFnZTogJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScsXG4gICAgICAgICAgTWVtb3J5OiA1MTIsXG4gICAgICAgICAgTmFtZTogJ3Bhc3NlZFRhc2tEZWYnLFxuICAgICAgICAgIFBvcnRNYXBwaW5nczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBDb250YWluZXJQb3J0OiA4MCxcbiAgICAgICAgICAgICAgUHJvdG9jb2w6ICd0Y3AnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KSk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAnQUxCIC0gdGhyb3dzIGlmIGRlc2lyZWRUYXNrQ291bnQgaXMgMCcodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywgeyBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIHRlc3QudGhyb3dzKCgpID0+XG4gICAgICBuZXcgZWNzUGF0dGVybnMuQXBwbGljYXRpb25Mb2FkQmFsYW5jZWRFYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICB9LFxuICAgICAgICBkZXNpcmVkQ291bnQ6IDAsXG4gICAgICB9KVxuICAgICwgL1lvdSBtdXN0IHNwZWNpZnkgYSBkZXNpcmVkQ291bnQgZ3JlYXRlciB0aGFuIDAvKTtcblxuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gICdOTEIgLSB0aHJvd3MgaWYgZGVzaXJlZFRhc2tDb3VudCBpcyAwJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7IGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJykgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgdGVzdC50aHJvd3MoKCkgPT5cbiAgICAgIG5ldyBlY3NQYXR0ZXJucy5OZXR3b3JrTG9hZEJhbGFuY2VkRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgfSxcbiAgICAgICAgZGVzaXJlZENvdW50OiAwLFxuICAgICAgfSlcbiAgICAsIC9Zb3UgbXVzdCBzcGVjaWZ5IGEgZGVzaXJlZENvdW50IGdyZWF0ZXIgdGhhbiAwLyk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcbiAgJ0FMQkZhcmdhdGUgLSBoYXZpbmcgKkhlYWx0aHlQZXJjZW50IHByb3BlcnRpZXMnKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzUGF0dGVybnMuQXBwbGljYXRpb25Mb2FkQmFsYW5jZWRGYXJnYXRlU2VydmljZShzdGFjaywgJ0FMQjEyM1NlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICB9LFxuICAgICAgbWluSGVhbHRoeVBlcmNlbnQ6IDEwMCxcbiAgICAgIG1heEhlYWx0aHlQZXJjZW50OiAyMDAsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgIERlcGxveW1lbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIE1pbmltdW1IZWFsdGh5UGVyY2VudDogMTAwLFxuICAgICAgICBNYXhpbXVtUGVyY2VudDogMjAwLFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAnTkxCRmFyZ2F0ZSAtIGhhdmluZyAqSGVhbHRoeVBlcmNlbnQgcHJvcGVydGllcycodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3NQYXR0ZXJucy5OZXR3b3JrTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICB9LFxuICAgICAgZGVzaXJlZENvdW50OiAxLFxuICAgICAgbWluSGVhbHRoeVBlcmNlbnQ6IDEwMCxcbiAgICAgIG1heEhlYWx0aHlQZXJjZW50OiAyMDAsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgIERlcGxveW1lbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIE1pbmltdW1IZWFsdGh5UGVyY2VudDogMTAwLFxuICAgICAgICBNYXhpbXVtUGVyY2VudDogMjAwLFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAnQUxCIC0gaGF2aW5nICpIZWFsdGh5UGVyY2VudCBwcm9wZXJ0aWVzJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7IGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJykgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIH0sXG4gICAgICBkZXNpcmVkQ291bnQ6IDEsXG4gICAgICBtaW5IZWFsdGh5UGVyY2VudDogMTAwLFxuICAgICAgbWF4SGVhbHRoeVBlcmNlbnQ6IDIwMCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgRGVwbG95bWVudENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgTWluaW11bUhlYWx0aHlQZXJjZW50OiAxMDAsXG4gICAgICAgIE1heGltdW1QZXJjZW50OiAyMDAsXG4gICAgICB9LFxuICAgIH0pKTtcblxuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gICdOTEIgLSBoYXZpbmcgKkhlYWx0aHlQZXJjZW50IHByb3BlcnRpZXMnKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHsgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzUGF0dGVybnMuTmV0d29ya0xvYWRCYWxhbmNlZEVjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICB9LFxuICAgICAgZGVzaXJlZENvdW50OiAxLFxuICAgICAgbWluSGVhbHRoeVBlcmNlbnQ6IDEwMCxcbiAgICAgIG1heEhlYWx0aHlQZXJjZW50OiAyMDAsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgIERlcGxveW1lbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIE1pbmltdW1IZWFsdGh5UGVyY2VudDogMTAwLFxuICAgICAgICBNYXhpbXVtUGVyY2VudDogMjAwLFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAnTmV0d29ya0xvYWRiYWxhbmNlZEVDMlNlcnZpY2UgYWNjZXB0cyBwcmV2aW91c2x5IGNyZWF0ZWQgbG9hZCBiYWxhbmNlcicodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHt2cGMsIGNsdXN0ZXJOYW1lOiAnTXlDbHVzdGVyJyB9KTtcbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdDYXBhY2l0eScsIHtpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpfSk7XG4gICAgY29uc3QgbmxiID0gbmV3IE5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdOTEInLCB7IHZwYyB9KTtcbiAgICBjb25zdCB0YXNrRGVmID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcbiAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmLmFkZENvbnRhaW5lcignQ29udGFpbmVyJywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgfSk7XG4gICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3NQYXR0ZXJucy5OZXR3b3JrTG9hZEJhbGFuY2VkRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgbG9hZEJhbGFuY2VyOiBubGIsXG4gICAgICB0YXNrRGVmaW5pdGlvbjogdGFza0RlZixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgTGF1bmNoVHlwZTogJ0VDMicsXG4gICAgfSkpO1xuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZSgnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXInLCB7XG4gICAgICBUeXBlOiAnbmV0d29yaycsXG4gICAgfSkpO1xuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gICdOZXR3b3JrTG9hZEJhbGFuY2VkRUMyU2VydmljZSBhY2NlcHRzIGltcG9ydGVkIGxvYWQgYmFsYW5jZXInKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IG5sYkFybiA9ICdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOjowMDAwMDAwMDAwMDA6OmR1bW15bG9hZGJhbGFuY2VyJztcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge3ZwYywgY2x1c3Rlck5hbWU6ICdNeUNsdXN0ZXInIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0NhcGFjaXR5Jywge2luc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyl9KTtcbiAgICBjb25zdCBubGIgID0gTmV0d29ya0xvYWRCYWxhbmNlci5mcm9tTmV0d29ya0xvYWRCYWxhbmNlckF0dHJpYnV0ZXMoc3RhY2ssICdOTEInLCB7XG4gICAgICBsb2FkQmFsYW5jZXJBcm46IG5sYkFybixcbiAgICAgIHZwYyxcbiAgICB9KTtcbiAgICBjb25zdCB0YXNrRGVmID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcbiAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmLmFkZENvbnRhaW5lcignQ29udGFpbmVyJywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgfSk7XG4gICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7XG4gICAgICBjb250YWluZXJQb3J0OiA4MCxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzUGF0dGVybnMuTmV0d29ya0xvYWRCYWxhbmNlZEVjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGxvYWRCYWxhbmNlcjogbmxiLFxuICAgICAgZGVzaXJlZENvdW50OiAxLFxuICAgICAgdGFza0RlZmluaXRpb246IHRhc2tEZWYsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgIExhdW5jaFR5cGU6ICdFQzInLFxuICAgICAgTG9hZEJhbGFuY2VyczogW3tDb250YWluZXJOYW1lOiAnQ29udGFpbmVyJywgQ29udGFpbmVyUG9ydDogODB9XSxcbiAgICB9KSk7XG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJykpO1xuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZSgnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIExvYWRCYWxhbmNlckFybjogbmxiLmxvYWRCYWxhbmNlckFybixcbiAgICAgIFBvcnQ6IDgwLFxuICAgIH0pKTtcbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAnQXBwbGljYXRpb25Mb2FkQmFsYW5jZWRFQzJTZXJ2aWNlIGFjY2VwdHMgcHJldmlvdXNseSBjcmVhdGVkIGxvYWQgYmFsYW5jZXInKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7dnBjLCBjbHVzdGVyTmFtZTogJ015Q2x1c3RlcicgfSk7XG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnQ2FwYWNpdHknLCB7aW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKX0pO1xuICAgIGNvbnN0IHNnID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHN0YWNrLCAnU0cnLCB7IHZwYyB9KTtcbiAgICBjb25zdCBhbGIgPSBuZXcgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdOTEInLCB7XG4gICAgICB2cGMsXG4gICAgICBzZWN1cml0eUdyb3VwOiBzZyxcbiAgICB9KTtcbiAgICBjb25zdCB0YXNrRGVmID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcbiAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmLmFkZENvbnRhaW5lcignQ29udGFpbmVyJywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgfSk7XG4gICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7IGNvbnRhaW5lclBvcnQ6IDgwIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3NQYXR0ZXJucy5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlZEVjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGxvYWRCYWxhbmNlcjogYWxiLFxuICAgICAgdGFza0RlZmluaXRpb246IHRhc2tEZWYsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgIExhdW5jaFR5cGU6ICdFQzInLFxuICAgIH0pKTtcbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TG9hZEJhbGFuY2VyJywge1xuICAgICAgVHlwZTogJ2FwcGxpY2F0aW9uJyxcbiAgICB9KSk7XG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ0FwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRUMyU2VydmljZSBhY2NlcHRzIGltcG9ydGVkIGxvYWQgYmFsYW5jZXInKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFsYkFybiA9ICdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOjowMDAwMDAwMDAwMDA6OmR1bW15bG9hZGJhbGFuY2VyJztcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge3ZwYywgY2x1c3Rlck5hbWU6ICdNeUNsdXN0ZXInIH0pO1xuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0NhcGFjaXR5Jywge2luc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyl9KTtcbiAgICBjb25zdCBzZyA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cChzdGFjaywgJ1NHJywgeyB2cGMgfSk7XG4gICAgY29uc3QgYWxiID0gQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIuZnJvbUFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyQXR0cmlidXRlcyhzdGFjaywgJ0FMQicsIHtcbiAgICAgIGxvYWRCYWxhbmNlckFybjogYWxiQXJuLFxuICAgICAgdnBjLFxuICAgICAgc2VjdXJpdHlHcm91cElkOiBzZy5zZWN1cml0eUdyb3VwSWQsXG4gICAgICBsb2FkQmFsYW5jZXJEbnNOYW1lOiAnTXlOYW1lJyxcbiAgICB9KTtcbiAgICBjb25zdCB0YXNrRGVmID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcbiAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmLmFkZENvbnRhaW5lcignQ29udGFpbmVyJywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgfSk7XG4gICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7XG4gICAgICBjb250YWluZXJQb3J0OiA4MCxcbiAgICB9KTtcbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgbG9hZEJhbGFuY2VyOiBhbGIsXG4gICAgICB0YXNrRGVmaW5pdGlvbjogdGFza0RlZixcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgIExhdW5jaFR5cGU6ICdFQzInLFxuICAgICAgTG9hZEJhbGFuY2VyczogW3tDb250YWluZXJOYW1lOiAnQ29udGFpbmVyJywgQ29udGFpbmVyUG9ydDogODB9XSxcbiAgICB9KSk7XG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJykpO1xuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZSgnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIExvYWRCYWxhbmNlckFybjogYWxiLmxvYWRCYWxhbmNlckFybixcbiAgICAgIFBvcnQ6IDgwLFxuICAgIH0pKTtcblxuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxufTtcbiJdfQ==
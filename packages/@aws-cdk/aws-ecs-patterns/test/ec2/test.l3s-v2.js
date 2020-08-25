"use strict";
const assert_1 = require("@aws-cdk/assert");
const aws_certificatemanager_1 = require("@aws-cdk/aws-certificatemanager");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
const aws_elasticloadbalancingv2_1 = require("@aws-cdk/aws-elasticloadbalancingv2");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const aws_route53_1 = require("@aws-cdk/aws-route53");
const aws_servicediscovery_1 = require("@aws-cdk/aws-servicediscovery");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../../lib");
module.exports = {
    'When Application Load Balancer': {
        'test ECS ALB construct with default settings'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            // WHEN
            new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                cluster,
                memoryLimitMiB: 1024,
                taskImageOptions: {
                    image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                },
            });
            // THEN - stack contains a load balancer, a service, and a target group.
            assert_1.expect(stack).to(assert_1.haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));
            assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
                DesiredCount: 1,
                LaunchType: 'EC2',
            }));
            assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    {
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
                    },
                ],
                NetworkMode: 'bridge',
                RequiresCompatibilities: [
                    'EC2',
                ],
            }));
            test.done();
        },
        'test ECS ALB construct with all settings'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            const zone = new aws_route53_1.PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });
            // WHEN
            new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                cluster,
                memoryLimitMiB: 1024,
                taskImageOptions: {
                    image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                    containerName: 'myContainer',
                    containerPorts: [80, 90],
                    enableLogging: false,
                    environment: {
                        TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
                        TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
                    },
                    logDriver: new aws_ecs_1.AwsLogDriver({
                        streamPrefix: 'TestStream',
                    }),
                    family: 'Ec2TaskDef',
                    executionRole: new aws_iam_1.Role(stack, 'ExecutionRole', {
                        path: '/',
                        assumedBy: new aws_iam_1.CompositePrincipal(new aws_iam_1.ServicePrincipal('ecs.amazonaws.com'), new aws_iam_1.ServicePrincipal('ecs-tasks.amazonaws.com')),
                    }),
                    taskRole: new aws_iam_1.Role(stack, 'TaskRole', {
                        assumedBy: new aws_iam_1.ServicePrincipal('ecs-tasks.amazonaws.com'),
                    }),
                },
                cpu: 256,
                desiredCount: 3,
                enableECSManagedTags: true,
                healthCheckGracePeriod: core_1.Duration.millis(2000),
                loadBalancers: [
                    {
                        name: 'lb',
                        domainName: 'api.example.com',
                        domainZone: zone,
                        publicLoadBalancer: false,
                        listeners: [
                            {
                                name: 'listener',
                                protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTPS,
                                certificate: aws_certificatemanager_1.Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
                            },
                        ],
                    },
                ],
                propagateTags: aws_ecs_1.PropagatedTagSource.SERVICE,
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
                        protocol: aws_ecs_1.Protocol.TCP,
                    },
                ],
            });
            // THEN
            assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
                DesiredCount: 3,
                LaunchType: 'EC2',
                EnableECSManagedTags: true,
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
            }));
            assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
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
            }));
            test.done();
        },
        'set vpc instead of cluster'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            // WHEN
            new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                vpc,
                memoryLimitMiB: 1024,
                taskImageOptions: {
                    image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                },
            });
            // THEN - stack does not contain a LaunchConfiguration
            assert_1.expect(stack, true).notTo(assert_1.haveResource('AWS::AutoScaling::LaunchConfiguration'));
            test.throws(() => assert_1.expect(stack));
            test.done();
        },
        'able to pass pre-defined task definition'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            const taskDefinition = new aws_ecs_1.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            const container = taskDefinition.addContainer('web', {
                image: aws_ecs_1.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            container.addPortMappings({
                containerPort: 80,
            });
            // WHEN
            new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                cluster,
                taskDefinition,
            });
            // THEN
            assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
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
            }));
            test.done();
        },
        'able to output correct load balancer DNS and URLs for each protocol type'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            const zone = new aws_route53_1.PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });
            // WHEN
            new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                cluster,
                memoryLimitMiB: 1024,
                taskImageOptions: {
                    image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                },
                loadBalancers: [
                    {
                        name: 'lb1',
                        domainName: 'api.example.com',
                        domainZone: zone,
                        listeners: [
                            {
                                name: 'listener1',
                                protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTPS,
                                certificate: aws_certificatemanager_1.Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
                            },
                            {
                                name: 'listener2',
                                protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTP,
                            },
                        ],
                    },
                    {
                        name: 'lb3',
                        listeners: [
                            {
                                name: 'listener3',
                                protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTP,
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
            const template = assert_1.SynthUtils.synthesize(stack).template.Outputs;
            test.deepEqual(template, {
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
            test.done();
        },
        'errors if no essential container in pre-defined task definition'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            const taskDefinition = new aws_ecs_1.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            // THEN
            test.throws(() => {
                new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                    taskDefinition,
                });
            }, /At least one essential container must be specified/);
            test.done();
        },
        'set default load balancer, listener, target group correctly'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const zone = new aws_route53_1.PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });
            // WHEN
            const ecsService = new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                vpc,
                memoryLimitMiB: 1024,
                taskImageOptions: {
                    image: aws_ecs_1.ContainerImage.fromRegistry('test'),
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
                                protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTPS,
                                certificate: aws_certificatemanager_1.Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
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
            test.equal(ecsService.loadBalancer.node.id, 'lb1');
            test.equal(ecsService.listener.node.id, 'listener1');
            test.equal(ecsService.targetGroup.node.id, 'ECSTargetGroupweb80Group');
            test.done();
        },
        'setting vpc and cluster throws error'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            // WHEN
            test.throws(() => new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                cluster,
                vpc,
                taskImageOptions: {
                    image: aws_ecs_1.ContainerImage.fromRegistry('/aws/aws-example-app'),
                },
            }), /You can only specify either vpc or cluster. Alternatively, you can leave both blank/);
            test.done();
        },
        'creates AWS Cloud Map service for Private DNS namespace'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'MyVpc', {});
            const cluster = new aws_ecs_1.Cluster(stack, 'EcsCluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            // WHEN
            cluster.addDefaultCloudMapNamespace({
                name: 'foo.com',
                type: aws_servicediscovery_1.NamespaceType.DNS_PRIVATE,
            });
            new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                cluster,
                taskImageOptions: {
                    image: aws_ecs_1.ContainerImage.fromRegistry('hello'),
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
                        ContainerPort: 80,
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
        'errors when setting both taskDefinition and taskImageOptions'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            const taskDefinition = new aws_ecs_1.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('test', {
                image: aws_ecs_1.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            // THEN
            test.throws(() => {
                new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                    taskImageOptions: {
                        image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                    },
                    taskDefinition,
                });
            }, /You must specify only one of TaskDefinition or TaskImageOptions./);
            test.done();
        },
        'errors when setting neither taskDefinition nor taskImageOptions'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            // THEN
            test.throws(() => {
                new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                });
            }, /You must specify one of: taskDefinition or image/);
            test.done();
        },
        'errors when setting domainName but not domainZone'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            // THEN
            test.throws(() => {
                new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                    taskImageOptions: {
                        image: aws_ecs_1.ContainerImage.fromRegistry('test'),
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
            }, /A Route53 hosted domain zone name is required to configure the specified domain name/);
            test.done();
        },
        'errors when loadBalancers is empty'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            // THEN
            test.throws(() => {
                new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                    taskImageOptions: {
                        image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                    },
                    loadBalancers: [],
                });
            }, /At least one load balancer must be specified/);
            test.done();
        },
        'errors when targetGroups is empty'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            // THEN
            test.throws(() => {
                new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                    taskImageOptions: {
                        image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                    },
                    targetGroups: [],
                });
            }, /At least one target group should be specified/);
            test.done();
        },
        'errors when no listener specified'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            // THEN
            test.throws(() => {
                new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                    taskImageOptions: {
                        image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                    },
                    loadBalancers: [
                        {
                            name: 'lb',
                            listeners: [],
                        },
                    ],
                });
            }, /At least one listener must be specified/);
            test.done();
        },
        'errors when setting both HTTP protocol and certificate'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            // THEN
            test.throws(() => {
                new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                    taskImageOptions: {
                        image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                    },
                    loadBalancers: [
                        {
                            name: 'lb',
                            listeners: [
                                {
                                    name: 'listener',
                                    protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTP,
                                    certificate: aws_certificatemanager_1.Certificate.fromCertificateArn(stack, 'Cert', 'helloworld'),
                                },
                            ],
                        },
                    ],
                });
            }, /The HTTPS protocol must be used when a certificate is given/);
            test.done();
        },
        'errors when setting HTTPS protocol but not domain name'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            // THEN
            test.throws(() => {
                new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                    taskImageOptions: {
                        image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                    },
                    loadBalancers: [
                        {
                            name: 'lb',
                            listeners: [
                                {
                                    name: 'listener',
                                    protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTPS,
                                },
                            ],
                        },
                    ],
                });
            }, /A domain name and zone is required when using the HTTPS protocol/);
            test.done();
        },
        'errors when listener is not defined but used in creating target groups'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            // THEN
            test.throws(() => {
                new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                    taskImageOptions: {
                        image: aws_ecs_1.ContainerImage.fromRegistry('test'),
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
            }, /Listener listener2 is not defined. Did you define listener with name listener2?/);
            test.done();
        },
        'errors if desiredTaskCount is 0'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            // THEN
            test.throws(() => new lib_1.ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
                cluster,
                memoryLimitMiB: 1024,
                taskImageOptions: {
                    image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                },
                desiredCount: 0,
            }), /You must specify a desiredCount greater than 0/);
            test.done();
        },
    },
    'When Network Load Balancer': {
        'test ECS NLB construct with default settings'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            // WHEN
            new lib_1.NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
                cluster,
                memoryLimitMiB: 256,
                taskImageOptions: {
                    image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                },
            });
            // THEN - stack contains a load balancer and a service
            assert_1.expect(stack).to(assert_1.haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));
            assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
                DesiredCount: 1,
                LaunchType: 'EC2',
            }));
            assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
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
            }));
            test.done();
        },
        'test ECS NLB construct with all settings'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            const zone = new aws_route53_1.PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });
            // WHEN
            new lib_1.NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
                cluster,
                memoryLimitMiB: 256,
                taskImageOptions: {
                    image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                    containerName: 'myContainer',
                    containerPorts: [80, 90],
                    enableLogging: false,
                    environment: {
                        TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
                        TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
                    },
                    logDriver: new aws_ecs_1.AwsLogDriver({
                        streamPrefix: 'TestStream',
                    }),
                    family: 'Ec2TaskDef',
                    executionRole: new aws_iam_1.Role(stack, 'ExecutionRole', {
                        path: '/',
                        assumedBy: new aws_iam_1.CompositePrincipal(new aws_iam_1.ServicePrincipal('ecs.amazonaws.com'), new aws_iam_1.ServicePrincipal('ecs-tasks.amazonaws.com')),
                    }),
                    taskRole: new aws_iam_1.Role(stack, 'TaskRole', {
                        assumedBy: new aws_iam_1.ServicePrincipal('ecs-tasks.amazonaws.com'),
                    }),
                },
                cpu: 256,
                desiredCount: 3,
                enableECSManagedTags: true,
                healthCheckGracePeriod: core_1.Duration.millis(2000),
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
                propagateTags: aws_ecs_1.PropagatedTagSource.SERVICE,
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
            });
            // THEN
            assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
                DesiredCount: 3,
                EnableECSManagedTags: true,
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
            }));
            assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
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
            }));
            test.done();
        },
        'set vpc instead of cluster'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            // WHEN
            new lib_1.NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
                vpc,
                memoryLimitMiB: 256,
                taskImageOptions: {
                    image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                },
            });
            // THEN - stack does not contain a LaunchConfiguration
            assert_1.expect(stack, true).notTo(assert_1.haveResource('AWS::AutoScaling::LaunchConfiguration'));
            test.throws(() => assert_1.expect(stack));
            test.done();
        },
        'able to pass pre-defined task definition'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            const taskDefinition = new aws_ecs_1.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            const container = taskDefinition.addContainer('web', {
                image: aws_ecs_1.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            container.addPortMappings({
                containerPort: 80,
            });
            // WHEN
            new lib_1.NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
                cluster,
                taskDefinition,
            });
            // THEN
            assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::TaskDefinition', {
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
            }));
            test.done();
        },
        'errors if no essential container in pre-defined task definition'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            const taskDefinition = new aws_ecs_1.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            // THEN
            test.throws(() => {
                new lib_1.NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                    taskDefinition,
                });
            }, /At least one essential container must be specified/);
            test.done();
        },
        'set default load balancer, listener, target group correctly'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const zone = new aws_route53_1.PublicHostedZone(stack, 'HostedZone', { zoneName: 'example.com' });
            // WHEN
            const ecsService = new lib_1.NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
                vpc,
                memoryLimitMiB: 1024,
                taskImageOptions: {
                    image: aws_ecs_1.ContainerImage.fromRegistry('test'),
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
            test.equal(ecsService.loadBalancer.node.id, 'lb1');
            test.equal(ecsService.listener.node.id, 'listener1');
            test.equal(ecsService.targetGroup.node.id, 'ECSTargetGroupweb80Group');
            test.done();
        },
        'setting vpc and cluster throws error'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            // WHEN
            test.throws(() => new lib_1.NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
                cluster,
                vpc,
                taskImageOptions: {
                    image: aws_ecs_1.ContainerImage.fromRegistry('/aws/aws-example-app'),
                },
            }), /You can only specify either vpc or cluster. Alternatively, you can leave both blank/);
            test.done();
        },
        'creates AWS Cloud Map service for Private DNS namespace'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'MyVpc', {});
            const cluster = new aws_ecs_1.Cluster(stack, 'EcsCluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            // WHEN
            cluster.addDefaultCloudMapNamespace({
                name: 'foo.com',
                type: aws_servicediscovery_1.NamespaceType.DNS_PRIVATE,
            });
            new lib_1.NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
                cluster,
                taskImageOptions: {
                    image: aws_ecs_1.ContainerImage.fromRegistry('hello'),
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
                        ContainerPort: 80,
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
        'errors when setting both taskDefinition and taskImageOptions'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            const taskDefinition = new aws_ecs_1.Ec2TaskDefinition(stack, 'Ec2TaskDef');
            taskDefinition.addContainer('test', {
                image: aws_ecs_1.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            // THEN
            test.throws(() => {
                new lib_1.NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                    taskImageOptions: {
                        image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                    },
                    taskDefinition,
                });
            }, /You must specify only one of TaskDefinition or TaskImageOptions./);
            test.done();
        },
        'errors when setting neither taskDefinition nor taskImageOptions'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            // THEN
            test.throws(() => {
                new lib_1.NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                });
            }, /You must specify one of: taskDefinition or image/);
            test.done();
        },
        'errors when setting domainName but not domainZone'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            // THEN
            test.throws(() => {
                new lib_1.NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                    taskImageOptions: {
                        image: aws_ecs_1.ContainerImage.fromRegistry('test'),
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
            }, /A Route53 hosted domain zone name is required to configure the specified domain name/);
            test.done();
        },
        'errors when loadBalancers is empty'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            // THEN
            test.throws(() => {
                new lib_1.NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                    taskImageOptions: {
                        image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                    },
                    loadBalancers: [],
                });
            }, /At least one load balancer must be specified/);
            test.done();
        },
        'errors when targetGroups is empty'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            // THEN
            test.throws(() => {
                new lib_1.NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                    taskImageOptions: {
                        image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                    },
                    targetGroups: [],
                });
            }, /At least one target group should be specified/);
            test.done();
        },
        'errors when no listener specified'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            // THEN
            test.throws(() => {
                new lib_1.NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                    taskImageOptions: {
                        image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                    },
                    loadBalancers: [
                        {
                            name: 'lb',
                            listeners: [],
                        },
                    ],
                });
            }, /At least one listener must be specified/);
            test.done();
        },
        'errors when listener is not defined but used in creating target groups'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            // THEN
            test.throws(() => {
                new lib_1.NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
                    cluster,
                    taskImageOptions: {
                        image: aws_ecs_1.ContainerImage.fromRegistry('test'),
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
            }, /Listener listener2 is not defined. Did you define listener with name listener2?/);
            test.done();
        },
        'errors if desiredTaskCount is 0'(test) {
            // GIVEN
            const stack = new core_1.Stack();
            const vpc = new aws_ec2_1.Vpc(stack, 'VPC');
            const cluster = new aws_ecs_1.Cluster(stack, 'Cluster', { vpc });
            cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new aws_ec2_1.InstanceType('t2.micro') });
            // THEN
            test.throws(() => new lib_1.NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
                cluster,
                memoryLimitMiB: 1024,
                taskImageOptions: {
                    image: aws_ecs_1.ContainerImage.fromRegistry('test'),
                },
                desiredCount: 0,
            }), /You must specify a desiredCount greater than 0/);
            test.done();
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5sM3MtdjIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZXN0Lmwzcy12Mi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNENBQXFGO0FBQ3JGLDRFQUE4RDtBQUM5RCw4Q0FBcUQ7QUFDckQsOENBQTJIO0FBQzNILG9GQUEwRTtBQUMxRSw4Q0FBOEU7QUFDOUUsc0RBQXdEO0FBQ3hELHdFQUE4RDtBQUM5RCx3Q0FBZ0Q7QUFFaEQsbUNBQTZHO0FBRTdHLGlCQUFTO0lBQ1AsZ0NBQWdDLEVBQUU7UUFDaEMsOENBQThDLENBQUMsSUFBVTtZQUN2RCxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZELE9BQU8sQ0FBQyxXQUFXLENBQUMseUJBQXlCLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxzQkFBWSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUUvRixPQUFPO1lBQ1AsSUFBSSwrQ0FBeUMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO2dCQUM5RCxPQUFPO2dCQUNQLGNBQWMsRUFBRSxJQUFJO2dCQUNwQixnQkFBZ0IsRUFBRTtvQkFDaEIsS0FBSyxFQUFFLHdCQUFjLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztpQkFDM0M7YUFDRixDQUFDLENBQUM7WUFFSCx3RUFBd0U7WUFDeEUsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxxQkFBWSxDQUFDLDJDQUEyQyxDQUFDLENBQUMsQ0FBQztZQUU1RSxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFZLENBQUMsbUJBQW1CLEVBQUU7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LEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxzQkFBWSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUUvRixPQUFPO1lBQ1AsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FDZixJQUFJLDJDQUFxQyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7Z0JBQzFELE9BQU87Z0JBQ1AsY0FBYyxFQUFFLElBQUk7Z0JBQ3BCLGdCQUFnQixFQUFFO29CQUNoQixLQUFLLEVBQUUsd0JBQWMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO2lCQUMzQztnQkFDRCxZQUFZLEVBQUUsQ0FBQzthQUNoQixDQUFDLEVBQ0YsZ0RBQWdELENBQUMsQ0FBQztZQUVwRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZCxDQUFDO0tBQ0Y7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhwZWN0LCBoYXZlUmVzb3VyY2UsIGhhdmVSZXNvdXJjZUxpa2UsIFN5bnRoVXRpbHMgfSBmcm9tICdAYXdzLWNkay9hc3NlcnQnO1xuaW1wb3J0IHsgQ2VydGlmaWNhdGUgfSBmcm9tICdAYXdzLWNkay9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyJztcbmltcG9ydCB7IEluc3RhbmNlVHlwZSwgVnBjIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgeyBBd3NMb2dEcml2ZXIsIENsdXN0ZXIsIENvbnRhaW5lckltYWdlLCBFYzJUYXNrRGVmaW5pdGlvbiwgUHJvcGFnYXRlZFRhZ1NvdXJjZSwgUHJvdG9jb2wgfSBmcm9tICdAYXdzLWNkay9hd3MtZWNzJztcbmltcG9ydCB7IEFwcGxpY2F0aW9uUHJvdG9jb2wgfSBmcm9tICdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mic7XG5pbXBvcnQgeyBDb21wb3NpdGVQcmluY2lwYWwsIFJvbGUsIFNlcnZpY2VQcmluY2lwYWwgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IFB1YmxpY0hvc3RlZFpvbmUgfSBmcm9tICdAYXdzLWNkay9hd3Mtcm91dGU1Myc7XG5pbXBvcnQgeyBOYW1lc3BhY2VUeXBlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLXNlcnZpY2VkaXNjb3ZlcnknO1xuaW1wb3J0IHsgRHVyYXRpb24sIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBUZXN0IH0gZnJvbSAnbm9kZXVuaXQnO1xuaW1wb3J0IHsgQXBwbGljYXRpb25NdWx0aXBsZVRhcmdldEdyb3Vwc0VjMlNlcnZpY2UsIE5ldHdvcmtNdWx0aXBsZVRhcmdldEdyb3Vwc0VjMlNlcnZpY2UgfSBmcm9tICcuLi8uLi9saWInO1xuXG5leHBvcnQgPSB7XG4gICdXaGVuIEFwcGxpY2F0aW9uIExvYWQgQmFsYW5jZXInOiB7XG4gICAgJ3Rlc3QgRUNTIEFMQiBjb25zdHJ1Y3Qgd2l0aCBkZWZhdWx0IHNldHRpbmdzJyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywgeyBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJykgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBBcHBsaWNhdGlvbk11bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU4gLSBzdGFjayBjb250YWlucyBhIGxvYWQgYmFsYW5jZXIsIGEgc2VydmljZSwgYW5kIGEgdGFyZ2V0IGdyb3VwLlxuICAgICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2UoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TG9hZEJhbGFuY2VyJykpO1xuXG4gICAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgIERlc2lyZWRDb3VudDogMSxcbiAgICAgICAgTGF1bmNoVHlwZTogJ0VDMicsXG4gICAgICB9KSk7XG5cbiAgICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZSgnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEltYWdlOiAndGVzdCcsXG4gICAgICAgICAgICBMb2dDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgIExvZ0RyaXZlcjogJ2F3c2xvZ3MnLFxuICAgICAgICAgICAgICBPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgJ2F3c2xvZ3MtZ3JvdXAnOiB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdTZXJ2aWNlVGFza0RlZndlYkxvZ0dyb3VwMkE4OThGNjEnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2F3c2xvZ3Mtc3RyZWFtLXByZWZpeCc6ICdTZXJ2aWNlJyxcbiAgICAgICAgICAgICAgICAnYXdzbG9ncy1yZWdpb24nOiB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBNZW1vcnk6IDEwMjQsXG4gICAgICAgICAgICBOYW1lOiAnd2ViJyxcbiAgICAgICAgICAgIFBvcnRNYXBwaW5nczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ29udGFpbmVyUG9ydDogODAsXG4gICAgICAgICAgICAgICAgSG9zdFBvcnQ6IDAsXG4gICAgICAgICAgICAgICAgUHJvdG9jb2w6ICd0Y3AnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBOZXR3b3JrTW9kZTogJ2JyaWRnZScsXG4gICAgICAgIFJlcXVpcmVzQ29tcGF0aWJpbGl0aWVzOiBbXG4gICAgICAgICAgJ0VDMicsXG4gICAgICAgIF0sXG4gICAgICB9KSk7XG5cbiAgICAgIHRlc3QuZG9uZSgpO1xuICAgIH0sXG5cbiAgICAndGVzdCBFQ1MgQUxCIGNvbnN0cnVjdCB3aXRoIGFsbCBzZXR0aW5ncycodGVzdDogVGVzdCkge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IENsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHsgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpIH0pO1xuICAgICAgY29uc3Qgem9uZSA9IG5ldyBQdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnSG9zdGVkWm9uZScsIHsgem9uZU5hbWU6ICdleGFtcGxlLmNvbScgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBBcHBsaWNhdGlvbk11bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICAgIGNvbnRhaW5lck5hbWU6ICdteUNvbnRhaW5lcicsXG4gICAgICAgICAgY29udGFpbmVyUG9ydHM6IFs4MCwgOTBdLFxuICAgICAgICAgIGVuYWJsZUxvZ2dpbmc6IGZhbHNlLFxuICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICBURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMTogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMSB2YWx1ZScsXG4gICAgICAgICAgICBURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMjogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMiB2YWx1ZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBsb2dEcml2ZXI6IG5ldyBBd3NMb2dEcml2ZXIoe1xuICAgICAgICAgICAgc3RyZWFtUHJlZml4OiAnVGVzdFN0cmVhbScsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgZmFtaWx5OiAnRWMyVGFza0RlZicsXG4gICAgICAgICAgZXhlY3V0aW9uUm9sZTogbmV3IFJvbGUoc3RhY2ssICdFeGVjdXRpb25Sb2xlJywge1xuICAgICAgICAgICAgcGF0aDogJy8nLFxuICAgICAgICAgICAgYXNzdW1lZEJ5OiBuZXcgQ29tcG9zaXRlUHJpbmNpcGFsKFxuICAgICAgICAgICAgICBuZXcgU2VydmljZVByaW5jaXBhbCgnZWNzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgICAgICAgbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2Vjcy10YXNrcy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgICApLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHRhc2tSb2xlOiBuZXcgUm9sZShzdGFjaywgJ1Rhc2tSb2xlJywge1xuICAgICAgICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnZWNzLXRhc2tzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSxcbiAgICAgICAgY3B1OiAyNTYsXG4gICAgICAgIGRlc2lyZWRDb3VudDogMyxcbiAgICAgICAgZW5hYmxlRUNTTWFuYWdlZFRhZ3M6IHRydWUsXG4gICAgICAgIGhlYWx0aENoZWNrR3JhY2VQZXJpb2Q6IER1cmF0aW9uLm1pbGxpcygyMDAwKSxcbiAgICAgICAgbG9hZEJhbGFuY2VyczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdsYicsXG4gICAgICAgICAgICBkb21haW5OYW1lOiAnYXBpLmV4YW1wbGUuY29tJyxcbiAgICAgICAgICAgIGRvbWFpblpvbmU6IHpvbmUsXG4gICAgICAgICAgICBwdWJsaWNMb2FkQmFsYW5jZXI6IGZhbHNlLFxuICAgICAgICAgICAgbGlzdGVuZXJzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnbGlzdGVuZXInLFxuICAgICAgICAgICAgICAgIHByb3RvY29sOiBBcHBsaWNhdGlvblByb3RvY29sLkhUVFBTLFxuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRlOiBDZXJ0aWZpY2F0ZS5mcm9tQ2VydGlmaWNhdGVBcm4oc3RhY2ssICdDZXJ0JywgJ2hlbGxvd29ybGQnKSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgcHJvcGFnYXRlVGFnczogUHJvcGFnYXRlZFRhZ1NvdXJjZS5TRVJWSUNFLFxuICAgICAgICBtZW1vcnlSZXNlcnZhdGlvbk1pQjogMTAyNCxcbiAgICAgICAgc2VydmljZU5hbWU6ICdteVNlcnZpY2UnLFxuICAgICAgICB0YXJnZXRHcm91cHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb250YWluZXJQb3J0OiA4MCxcbiAgICAgICAgICAgIGxpc3RlbmVyOiAnbGlzdGVuZXInLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29udGFpbmVyUG9ydDogOTAsXG4gICAgICAgICAgICBsaXN0ZW5lcjogJ2xpc3RlbmVyJyxcbiAgICAgICAgICAgIHBhdGhQYXR0ZXJuOiAnYS9iL2MnLFxuICAgICAgICAgICAgcHJpb3JpdHk6IDEwLFxuICAgICAgICAgICAgcHJvdG9jb2w6IFByb3RvY29sLlRDUCxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgRGVzaXJlZENvdW50OiAzLFxuICAgICAgICBMYXVuY2hUeXBlOiAnRUMyJyxcbiAgICAgICAgRW5hYmxlRUNTTWFuYWdlZFRhZ3M6IHRydWUsXG4gICAgICAgIEhlYWx0aENoZWNrR3JhY2VQZXJpb2RTZWNvbmRzOiAyLFxuICAgICAgICBMb2FkQmFsYW5jZXJzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ29udGFpbmVyTmFtZTogJ215Q29udGFpbmVyJyxcbiAgICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgICAgVGFyZ2V0R3JvdXBBcm46IHtcbiAgICAgICAgICAgICAgUmVmOiAnU2VydmljZWxibGlzdGVuZXJFQ1NUYXJnZXRHcm91cG15Q29udGFpbmVyODBHcm91cEFEODM1ODRBJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDb250YWluZXJOYW1lOiAnbXlDb250YWluZXInLFxuICAgICAgICAgICAgQ29udGFpbmVyUG9ydDogOTAsXG4gICAgICAgICAgICBUYXJnZXRHcm91cEFybjoge1xuICAgICAgICAgICAgICBSZWY6ICdTZXJ2aWNlbGJsaXN0ZW5lckVDU1RhcmdldEdyb3VwbXlDb250YWluZXI5MEdyb3VwRjVBNkQzQTAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBQcm9wYWdhdGVUYWdzOiAnU0VSVklDRScsXG4gICAgICAgIFNlcnZpY2VOYW1lOiAnbXlTZXJ2aWNlJyxcbiAgICAgIH0pKTtcblxuICAgICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ3B1OiAyNTYsXG4gICAgICAgICAgICBFbnZpcm9ubWVudDogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgTmFtZTogJ1RFU1RfRU5WSVJPTk1FTlRfVkFSSUFCTEUxJyxcbiAgICAgICAgICAgICAgICBWYWx1ZTogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMSB2YWx1ZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBOYW1lOiAnVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTInLFxuICAgICAgICAgICAgICAgIFZhbHVlOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAyIHZhbHVlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFc3NlbnRpYWw6IHRydWUsXG4gICAgICAgICAgICBJbWFnZTogJ3Rlc3QnLFxuICAgICAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICBMb2dEcml2ZXI6ICdhd3Nsb2dzJyxcbiAgICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICAgICdhd3Nsb2dzLWdyb3VwJzoge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnU2VydmljZVRhc2tEZWZteUNvbnRhaW5lckxvZ0dyb3VwMEE4NzM2OEInLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2F3c2xvZ3Mtc3RyZWFtLXByZWZpeCc6ICdUZXN0U3RyZWFtJyxcbiAgICAgICAgICAgICAgICAnYXdzbG9ncy1yZWdpb24nOiB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBNZW1vcnk6IDEwMjQsXG4gICAgICAgICAgICBNZW1vcnlSZXNlcnZhdGlvbjogMTAyNCxcbiAgICAgICAgICAgIE5hbWU6ICdteUNvbnRhaW5lcicsXG4gICAgICAgICAgICBQb3J0TWFwcGluZ3M6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgICAgICAgIEhvc3RQb3J0OiAwLFxuICAgICAgICAgICAgICAgIFByb3RvY29sOiAndGNwJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDkwLFxuICAgICAgICAgICAgICAgIEhvc3RQb3J0OiAwLFxuICAgICAgICAgICAgICAgIFByb3RvY29sOiAndGNwJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgRXhlY3V0aW9uUm9sZUFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0V4ZWN1dGlvblJvbGU2MDVBMDQwQicsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBGYW1pbHk6ICdTZXJ2aWNlVGFza0RlZjc5RDc5NTIxJyxcbiAgICAgICAgTmV0d29ya01vZGU6ICdicmlkZ2UnLFxuICAgICAgICBSZXF1aXJlc0NvbXBhdGliaWxpdGllczogW1xuICAgICAgICAgICdFQzInLFxuICAgICAgICBdLFxuICAgICAgICBUYXNrUm9sZUFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ1Rhc2tSb2xlMzBGQzBGQkInLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdzZXQgdnBjIGluc3RlYWQgb2YgY2x1c3RlcicodGVzdDogVGVzdCkge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBBcHBsaWNhdGlvbk11bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTiAtIHN0YWNrIGRvZXMgbm90IGNvbnRhaW4gYSBMYXVuY2hDb25maWd1cmF0aW9uXG4gICAgICBleHBlY3Qoc3RhY2ssIHRydWUpLm5vdFRvKGhhdmVSZXNvdXJjZSgnQVdTOjpBdXRvU2NhbGluZzo6TGF1bmNoQ29uZmlndXJhdGlvbicpKTtcblxuICAgICAgdGVzdC50aHJvd3MoKCkgPT4gZXhwZWN0KHN0YWNrKSk7XG5cbiAgICAgIHRlc3QuZG9uZSgpO1xuICAgIH0sXG5cbiAgICAnYWJsZSB0byBwYXNzIHByZS1kZWZpbmVkIHRhc2sgZGVmaW5pdGlvbicodGVzdDogVGVzdCkge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IENsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHsgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpIH0pO1xuXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBFYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7XG4gICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBBcHBsaWNhdGlvbk11bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZSgnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEVzc2VudGlhbDogdHJ1ZSxcbiAgICAgICAgICAgIEltYWdlOiAnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyxcbiAgICAgICAgICAgIE1lbW9yeTogNTEyLFxuICAgICAgICAgICAgTmFtZTogJ3dlYicsXG4gICAgICAgICAgICBQb3J0TWFwcGluZ3M6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgICAgICAgIEhvc3RQb3J0OiAwLFxuICAgICAgICAgICAgICAgIFByb3RvY29sOiAndGNwJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgRmFtaWx5OiAnRWMyVGFza0RlZicsXG4gICAgICAgIE5ldHdvcmtNb2RlOiAnYnJpZGdlJyxcbiAgICAgICAgUmVxdWlyZXNDb21wYXRpYmlsaXRpZXM6IFtcbiAgICAgICAgICAnRUMyJyxcbiAgICAgICAgXSxcbiAgICAgIH0pKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdhYmxlIHRvIG91dHB1dCBjb3JyZWN0IGxvYWQgYmFsYW5jZXIgRE5TIGFuZCBVUkxzIGZvciBlYWNoIHByb3RvY29sIHR5cGUnKHRlc3Q6IFRlc3QpIHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7IGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgndDIubWljcm8nKSB9KTtcbiAgICAgIGNvbnN0IHpvbmUgPSBuZXcgUHVibGljSG9zdGVkWm9uZShzdGFjaywgJ0hvc3RlZFpvbmUnLCB7IHpvbmVOYW1lOiAnZXhhbXBsZS5jb20nIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgQXBwbGljYXRpb25NdWx0aXBsZVRhcmdldEdyb3Vwc0VjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICAgIGltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgfSxcbiAgICAgICAgbG9hZEJhbGFuY2VyczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdsYjEnLFxuICAgICAgICAgICAgZG9tYWluTmFtZTogJ2FwaS5leGFtcGxlLmNvbScsXG4gICAgICAgICAgICBkb21haW5ab25lOiB6b25lLFxuICAgICAgICAgICAgbGlzdGVuZXJzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnbGlzdGVuZXIxJyxcbiAgICAgICAgICAgICAgICBwcm90b2NvbDogQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQUyxcbiAgICAgICAgICAgICAgICBjZXJ0aWZpY2F0ZTogQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHN0YWNrLCAnQ2VydCcsICdoZWxsb3dvcmxkJyksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnbGlzdGVuZXIyJyxcbiAgICAgICAgICAgICAgICBwcm90b2NvbDogQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdsYjMnLFxuICAgICAgICAgICAgbGlzdGVuZXJzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnbGlzdGVuZXIzJyxcbiAgICAgICAgICAgICAgICBwcm90b2NvbDogQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0YXJnZXRHcm91cHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb250YWluZXJQb3J0OiA4MCxcbiAgICAgICAgICAgIGxpc3RlbmVyOiAnbGlzdGVuZXIxJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDkwLFxuICAgICAgICAgICAgbGlzdGVuZXI6ICdsaXN0ZW5lcjInLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29udGFpbmVyUG9ydDogNzAsXG4gICAgICAgICAgICBsaXN0ZW5lcjogJ2xpc3RlbmVyMycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IFN5bnRoVXRpbHMuc3ludGhlc2l6ZShzdGFjaykudGVtcGxhdGUuT3V0cHV0cztcbiAgICAgIHRlc3QuZGVlcEVxdWFsKHRlbXBsYXRlLCB7XG4gICAgICAgIFNlcnZpY2VMb2FkQmFsYW5jZXJETlNsYjE3NUU3OEJGRToge1xuICAgICAgICAgIFZhbHVlOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ1NlcnZpY2VsYjE1MkM3RjRGOScsXG4gICAgICAgICAgICAgICdETlNOYW1lJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgU2VydmljZVNlcnZpY2VVUkxsYjFodHRwczVDMEM0MDc5OiB7XG4gICAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnaHR0cHM6Ly8nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ1NlcnZpY2VETlNsYjEyQkExRkFEMycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgU2VydmljZVNlcnZpY2VVUkxsYjFodHRwNjVGMDU0NkE6IHtcbiAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdodHRwOi8vJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdTZXJ2aWNlRE5TbGIxMkJBMUZBRDMnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFNlcnZpY2VMb2FkQmFsYW5jZXJETlNsYjMyRjI3M0YyNzoge1xuICAgICAgICAgIFZhbHVlOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ1NlcnZpY2VsYjNBNTgzRDVFNycsXG4gICAgICAgICAgICAgICdETlNOYW1lJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgU2VydmljZVNlcnZpY2VVUkxsYjNodHRwNDBGOUNBREM6IHtcbiAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdodHRwOi8vJyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ1NlcnZpY2VsYjNBNTgzRDVFNycsXG4gICAgICAgICAgICAgICAgICAgICdETlNOYW1lJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0LmRvbmUoKTtcbiAgICB9LFxuXG4gICAgJ2Vycm9ycyBpZiBubyBlc3NlbnRpYWwgY29udGFpbmVyIGluIHByZS1kZWZpbmVkIHRhc2sgZGVmaW5pdGlvbicodGVzdDogVGVzdCkge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IENsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHsgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpIH0pO1xuXG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBFYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgdGVzdC50aHJvd3MoKCkgPT4ge1xuICAgICAgICBuZXcgQXBwbGljYXRpb25NdWx0aXBsZVRhcmdldEdyb3Vwc0VjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIH0pO1xuICAgICAgfSwgL0F0IGxlYXN0IG9uZSBlc3NlbnRpYWwgY29udGFpbmVyIG11c3QgYmUgc3BlY2lmaWVkLyk7XG5cbiAgICAgIHRlc3QuZG9uZSgpO1xuICAgIH0sXG5cbiAgICAnc2V0IGRlZmF1bHQgbG9hZCBiYWxhbmNlciwgbGlzdGVuZXIsIHRhcmdldCBncm91cCBjb3JyZWN0bHknKHRlc3Q6IFRlc3QpIHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3Qgem9uZSA9IG5ldyBQdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnSG9zdGVkWm9uZScsIHsgem9uZU5hbWU6ICdleGFtcGxlLmNvbScgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGVjc1NlcnZpY2UgPSBuZXcgQXBwbGljYXRpb25NdWx0aXBsZVRhcmdldEdyb3Vwc0VjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICB2cGMsXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICB9LFxuICAgICAgICBsb2FkQmFsYW5jZXJzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2xiMScsXG4gICAgICAgICAgICBsaXN0ZW5lcnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdsaXN0ZW5lcjEnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdsYjInLFxuICAgICAgICAgICAgZG9tYWluTmFtZTogJ2FwaS5leGFtcGxlLmNvbScsXG4gICAgICAgICAgICBkb21haW5ab25lOiB6b25lLFxuICAgICAgICAgICAgbGlzdGVuZXJzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnbGlzdGVuZXIyJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdsaXN0ZW5lcjMnLFxuICAgICAgICAgICAgICAgIHByb3RvY29sOiBBcHBsaWNhdGlvblByb3RvY29sLkhUVFBTLFxuICAgICAgICAgICAgICAgIGNlcnRpZmljYXRlOiBDZXJ0aWZpY2F0ZS5mcm9tQ2VydGlmaWNhdGVBcm4oc3RhY2ssICdDZXJ0JywgJ2hlbGxvd29ybGQnKSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgdGFyZ2V0R3JvdXBzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29udGFpbmVyUG9ydDogODAsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb250YWluZXJQb3J0OiA5MCxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIHRlc3QuZXF1YWwoZWNzU2VydmljZS5sb2FkQmFsYW5jZXIubm9kZS5pZCwgJ2xiMScpO1xuICAgICAgdGVzdC5lcXVhbChlY3NTZXJ2aWNlLmxpc3RlbmVyLm5vZGUuaWQsICdsaXN0ZW5lcjEnKTtcbiAgICAgIHRlc3QuZXF1YWwoZWNzU2VydmljZS50YXJnZXRHcm91cC5ub2RlLmlkLCAnRUNTVGFyZ2V0R3JvdXB3ZWI4MEdyb3VwJyk7XG5cbiAgICAgIHRlc3QuZG9uZSgpO1xuICAgIH0sXG5cbiAgICAnc2V0dGluZyB2cGMgYW5kIGNsdXN0ZXIgdGhyb3dzIGVycm9yJyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgdGVzdC50aHJvd3MoKCkgPT4gbmV3IEFwcGxpY2F0aW9uTXVsdGlwbGVUYXJnZXRHcm91cHNFYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgdnBjLFxuICAgICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnL2F3cy9hd3MtZXhhbXBsZS1hcHAnKSxcbiAgICAgICAgfSxcbiAgICAgIH0pLCAvWW91IGNhbiBvbmx5IHNwZWNpZnkgZWl0aGVyIHZwYyBvciBjbHVzdGVyLiBBbHRlcm5hdGl2ZWx5LCB5b3UgY2FuIGxlYXZlIGJvdGggYmxhbmsvKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdjcmVhdGVzIEFXUyBDbG91ZCBNYXAgc2VydmljZSBmb3IgUHJpdmF0ZSBETlMgbmFtZXNwYWNlJyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywgeyBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJykgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNsdXN0ZXIuYWRkRGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlKHtcbiAgICAgICAgbmFtZTogJ2Zvby5jb20nLFxuICAgICAgICB0eXBlOiBOYW1lc3BhY2VUeXBlLkROU19QUklWQVRFLFxuICAgICAgfSk7XG5cbiAgICAgIG5ldyBBcHBsaWNhdGlvbk11bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgICAgICB9LFxuICAgICAgICBjbG91ZE1hcE9wdGlvbnM6IHtcbiAgICAgICAgICBuYW1lOiAnbXlBcHAnLFxuICAgICAgICB9LFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgU2VydmljZVJlZ2lzdHJpZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDb250YWluZXJOYW1lOiAnd2ViJyxcbiAgICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgICAgUmVnaXN0cnlBcm46IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ1NlcnZpY2VDbG91ZG1hcFNlcnZpY2VERTc2QjI5RCcsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KSk7XG5cbiAgICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OlNlcnZpY2VEaXNjb3Zlcnk6OlNlcnZpY2UnLCB7XG4gICAgICAgIERuc0NvbmZpZzoge1xuICAgICAgICAgIERuc1JlY29yZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgVFRMOiA2MCxcbiAgICAgICAgICAgICAgVHlwZTogJ1NSVicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgTmFtZXNwYWNlSWQ6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnRWNzQ2x1c3RlckRlZmF1bHRTZXJ2aWNlRGlzY292ZXJ5TmFtZXNwYWNlQjA5NzFCMkYnLFxuICAgICAgICAgICAgICAnSWQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJvdXRpbmdQb2xpY3k6ICdNVUxUSVZBTFVFJyxcbiAgICAgICAgfSxcbiAgICAgICAgSGVhbHRoQ2hlY2tDdXN0b21Db25maWc6IHtcbiAgICAgICAgICBGYWlsdXJlVGhyZXNob2xkOiAxLFxuICAgICAgICB9LFxuICAgICAgICBOYW1lOiAnbXlBcHAnLFxuICAgICAgICBOYW1lc3BhY2VJZDoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0Vjc0NsdXN0ZXJEZWZhdWx0U2VydmljZURpc2NvdmVyeU5hbWVzcGFjZUIwOTcxQjJGJyxcbiAgICAgICAgICAgICdJZCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdlcnJvcnMgd2hlbiBzZXR0aW5nIGJvdGggdGFza0RlZmluaXRpb24gYW5kIHRhc2tJbWFnZU9wdGlvbnMnKHRlc3Q6IFRlc3QpIHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7IGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgndDIubWljcm8nKSB9KTtcblxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJyk7XG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3Rlc3QnLCB7XG4gICAgICAgIGltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIHRlc3QudGhyb3dzKCgpID0+IHtcbiAgICAgICAgbmV3IEFwcGxpY2F0aW9uTXVsdGlwbGVUYXJnZXRHcm91cHNFYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgICAgIGltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICB9KTtcbiAgICAgIH0sIC9Zb3UgbXVzdCBzcGVjaWZ5IG9ubHkgb25lIG9mIFRhc2tEZWZpbml0aW9uIG9yIFRhc2tJbWFnZU9wdGlvbnMuLyk7XG5cbiAgICAgIHRlc3QuZG9uZSgpO1xuICAgIH0sXG5cbiAgICAnZXJyb3JzIHdoZW4gc2V0dGluZyBuZWl0aGVyIHRhc2tEZWZpbml0aW9uIG5vciB0YXNrSW1hZ2VPcHRpb25zJyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywgeyBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJykgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIHRlc3QudGhyb3dzKCgpID0+IHtcbiAgICAgICAgbmV3IEFwcGxpY2F0aW9uTXVsdGlwbGVUYXJnZXRHcm91cHNFYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICB9KTtcbiAgICAgIH0sIC9Zb3UgbXVzdCBzcGVjaWZ5IG9uZSBvZjogdGFza0RlZmluaXRpb24gb3IgaW1hZ2UvKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdlcnJvcnMgd2hlbiBzZXR0aW5nIGRvbWFpbk5hbWUgYnV0IG5vdCBkb21haW5ab25lJyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywgeyBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJykgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIHRlc3QudGhyb3dzKCgpID0+IHtcbiAgICAgICAgbmV3IEFwcGxpY2F0aW9uTXVsdGlwbGVUYXJnZXRHcm91cHNFYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgICAgIGltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGxvYWRCYWxhbmNlcnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ2xiMScsXG4gICAgICAgICAgICAgIGRvbWFpbk5hbWU6ICdhcGkuZXhhbXBsZS5jb20nLFxuICAgICAgICAgICAgICBsaXN0ZW5lcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiAnbGlzdGVuZXIxJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgIH0sIC9BIFJvdXRlNTMgaG9zdGVkIGRvbWFpbiB6b25lIG5hbWUgaXMgcmVxdWlyZWQgdG8gY29uZmlndXJlIHRoZSBzcGVjaWZpZWQgZG9tYWluIG5hbWUvKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdlcnJvcnMgd2hlbiBsb2FkQmFsYW5jZXJzIGlzIGVtcHR5Jyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgdGVzdC50aHJvd3MoKCkgPT4ge1xuICAgICAgICBuZXcgQXBwbGljYXRpb25NdWx0aXBsZVRhcmdldEdyb3Vwc0VjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICAgICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbG9hZEJhbGFuY2VyczogW10sXG4gICAgICAgIH0pO1xuICAgICAgfSwgL0F0IGxlYXN0IG9uZSBsb2FkIGJhbGFuY2VyIG11c3QgYmUgc3BlY2lmaWVkLyk7XG5cbiAgICAgIHRlc3QuZG9uZSgpO1xuICAgIH0sXG5cbiAgICAnZXJyb3JzIHdoZW4gdGFyZ2V0R3JvdXBzIGlzIGVtcHR5Jyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgdGVzdC50aHJvd3MoKCkgPT4ge1xuICAgICAgICBuZXcgQXBwbGljYXRpb25NdWx0aXBsZVRhcmdldEdyb3Vwc0VjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICAgICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGFyZ2V0R3JvdXBzOiBbXSxcbiAgICAgICAgfSk7XG4gICAgICB9LCAvQXQgbGVhc3Qgb25lIHRhcmdldCBncm91cCBzaG91bGQgYmUgc3BlY2lmaWVkLyk7XG5cbiAgICAgIHRlc3QuZG9uZSgpO1xuICAgIH0sXG5cbiAgICAnZXJyb3JzIHdoZW4gbm8gbGlzdGVuZXIgc3BlY2lmaWVkJyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgdGVzdC50aHJvd3MoKCkgPT4ge1xuICAgICAgICBuZXcgQXBwbGljYXRpb25NdWx0aXBsZVRhcmdldEdyb3Vwc0VjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICAgICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbG9hZEJhbGFuY2VyczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAnbGInLFxuICAgICAgICAgICAgICBsaXN0ZW5lcnM6IFtdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgIH0sIC9BdCBsZWFzdCBvbmUgbGlzdGVuZXIgbXVzdCBiZSBzcGVjaWZpZWQvKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdlcnJvcnMgd2hlbiBzZXR0aW5nIGJvdGggSFRUUCBwcm90b2NvbCBhbmQgY2VydGlmaWNhdGUnKHRlc3Q6IFRlc3QpIHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICB0ZXN0LnRocm93cygoKSA9PiB7XG4gICAgICAgIG5ldyBBcHBsaWNhdGlvbk11bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgICAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBsb2FkQmFsYW5jZXJzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6ICdsYicsXG4gICAgICAgICAgICAgIGxpc3RlbmVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICdsaXN0ZW5lcicsXG4gICAgICAgICAgICAgICAgICBwcm90b2NvbDogQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQLFxuICAgICAgICAgICAgICAgICAgY2VydGlmaWNhdGU6IENlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybihzdGFjaywgJ0NlcnQnLCAnaGVsbG93b3JsZCcpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSwgL1RoZSBIVFRQUyBwcm90b2NvbCBtdXN0IGJlIHVzZWQgd2hlbiBhIGNlcnRpZmljYXRlIGlzIGdpdmVuLyk7XG5cbiAgICAgIHRlc3QuZG9uZSgpO1xuICAgIH0sXG5cbiAgICAnZXJyb3JzIHdoZW4gc2V0dGluZyBIVFRQUyBwcm90b2NvbCBidXQgbm90IGRvbWFpbiBuYW1lJyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgdGVzdC50aHJvd3MoKCkgPT4ge1xuICAgICAgICBuZXcgQXBwbGljYXRpb25NdWx0aXBsZVRhcmdldEdyb3Vwc0VjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICAgICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbG9hZEJhbGFuY2VyczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAnbGInLFxuICAgICAgICAgICAgICBsaXN0ZW5lcnM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiAnbGlzdGVuZXInLFxuICAgICAgICAgICAgICAgICAgcHJvdG9jb2w6IEFwcGxpY2F0aW9uUHJvdG9jb2wuSFRUUFMsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICB9LCAvQSBkb21haW4gbmFtZSBhbmQgem9uZSBpcyByZXF1aXJlZCB3aGVuIHVzaW5nIHRoZSBIVFRQUyBwcm90b2NvbC8pO1xuXG4gICAgICB0ZXN0LmRvbmUoKTtcbiAgICB9LFxuXG4gICAgJ2Vycm9ycyB3aGVuIGxpc3RlbmVyIGlzIG5vdCBkZWZpbmVkIGJ1dCB1c2VkIGluIGNyZWF0aW5nIHRhcmdldCBncm91cHMnKHRlc3Q6IFRlc3QpIHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICB0ZXN0LnRocm93cygoKSA9PiB7XG4gICAgICAgIG5ldyBBcHBsaWNhdGlvbk11bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgICAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBsb2FkQmFsYW5jZXJzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6ICdsYicsXG4gICAgICAgICAgICAgIGxpc3RlbmVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICdsaXN0ZW5lcjEnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgdGFyZ2V0R3JvdXBzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgICAgICBsaXN0ZW5lcjogJ2xpc3RlbmVyMicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSwgL0xpc3RlbmVyIGxpc3RlbmVyMiBpcyBub3QgZGVmaW5lZC4gRGlkIHlvdSBkZWZpbmUgbGlzdGVuZXIgd2l0aCBuYW1lIGxpc3RlbmVyMj8vKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdlcnJvcnMgaWYgZGVzaXJlZFRhc2tDb3VudCBpcyAwJyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywgeyBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJykgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIHRlc3QudGhyb3dzKCgpID0+XG4gICAgICAgIG5ldyBBcHBsaWNhdGlvbk11bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgICAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZXNpcmVkQ291bnQ6IDAsXG4gICAgICAgIH0pXG4gICAgICAsIC9Zb3UgbXVzdCBzcGVjaWZ5IGEgZGVzaXJlZENvdW50IGdyZWF0ZXIgdGhhbiAwLyk7XG5cbiAgICAgIHRlc3QuZG9uZSgpO1xuICAgIH0sXG4gIH0sXG5cbiAgJ1doZW4gTmV0d29yayBMb2FkIEJhbGFuY2VyJzoge1xuICAgICd0ZXN0IEVDUyBOTEIgY29uc3RydWN0IHdpdGggZGVmYXVsdCBzZXR0aW5ncycodGVzdDogVGVzdCkge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IENsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHsgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgTmV0d29ya011bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAyNTYsXG4gICAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTiAtIHN0YWNrIGNvbnRhaW5zIGEgbG9hZCBiYWxhbmNlciBhbmQgYSBzZXJ2aWNlXG4gICAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXInKSk7XG5cbiAgICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgRGVzaXJlZENvdW50OiAxLFxuICAgICAgICBMYXVuY2hUeXBlOiAnRUMyJyxcbiAgICAgIH0pKTtcblxuICAgICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgRXNzZW50aWFsOiB0cnVlLFxuICAgICAgICAgICAgSW1hZ2U6ICd0ZXN0JyxcbiAgICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgTG9nRHJpdmVyOiAnYXdzbG9ncycsXG4gICAgICAgICAgICAgIE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAnYXdzbG9ncy1ncm91cCc6IHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ1NlcnZpY2VUYXNrRGVmd2ViTG9nR3JvdXAyQTg5OEY2MScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnYXdzbG9ncy1zdHJlYW0tcHJlZml4JzogJ1NlcnZpY2UnLFxuICAgICAgICAgICAgICAgICdhd3Nsb2dzLXJlZ2lvbic6IHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE1lbW9yeTogMjU2LFxuICAgICAgICAgICAgTmFtZTogJ3dlYicsXG4gICAgICAgICAgICBQb3J0TWFwcGluZ3M6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgICAgICAgIEhvc3RQb3J0OiAwLFxuICAgICAgICAgICAgICAgIFByb3RvY29sOiAndGNwJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgRXhlY3V0aW9uUm9sZUFybjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ1NlcnZpY2VUYXNrRGVmRXhlY3V0aW9uUm9sZTkxOUY3QkUzJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIEZhbWlseTogJ1NlcnZpY2VUYXNrRGVmNzlENzk1MjEnLFxuICAgICAgICBOZXR3b3JrTW9kZTogJ2JyaWRnZScsXG4gICAgICAgIFJlcXVpcmVzQ29tcGF0aWJpbGl0aWVzOiBbXG4gICAgICAgICAgJ0VDMicsXG4gICAgICAgIF0sXG4gICAgICAgIFRhc2tSb2xlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnU2VydmljZVRhc2tEZWZUYXNrUm9sZTBDRkUyRjU3JyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KSk7XG5cbiAgICAgIHRlc3QuZG9uZSgpO1xuICAgIH0sXG5cbiAgICAndGVzdCBFQ1MgTkxCIGNvbnN0cnVjdCB3aXRoIGFsbCBzZXR0aW5ncycodGVzdDogVGVzdCkge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IENsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHsgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpIH0pO1xuICAgICAgY29uc3Qgem9uZSA9IG5ldyBQdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnSG9zdGVkWm9uZScsIHsgem9uZU5hbWU6ICdleGFtcGxlLmNvbScgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBOZXR3b3JrTXVsdGlwbGVUYXJnZXRHcm91cHNFYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDI1NixcbiAgICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICAgIGltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgICBjb250YWluZXJOYW1lOiAnbXlDb250YWluZXInLFxuICAgICAgICAgIGNvbnRhaW5lclBvcnRzOiBbODAsIDkwXSxcbiAgICAgICAgICBlbmFibGVMb2dnaW5nOiBmYWxzZSxcbiAgICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgICAgVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTE6ICd0ZXN0IGVudmlyb25tZW50IHZhcmlhYmxlIDEgdmFsdWUnLFxuICAgICAgICAgICAgVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTI6ICd0ZXN0IGVudmlyb25tZW50IHZhcmlhYmxlIDIgdmFsdWUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbG9nRHJpdmVyOiBuZXcgQXdzTG9nRHJpdmVyKHtcbiAgICAgICAgICAgIHN0cmVhbVByZWZpeDogJ1Rlc3RTdHJlYW0nLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGZhbWlseTogJ0VjMlRhc2tEZWYnLFxuICAgICAgICAgIGV4ZWN1dGlvblJvbGU6IG5ldyBSb2xlKHN0YWNrLCAnRXhlY3V0aW9uUm9sZScsIHtcbiAgICAgICAgICAgIHBhdGg6ICcvJyxcbiAgICAgICAgICAgIGFzc3VtZWRCeTogbmV3IENvbXBvc2l0ZVByaW5jaXBhbChcbiAgICAgICAgICAgICAgbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2Vjcy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgICAgIG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdlY3MtdGFza3MuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICB0YXNrUm9sZTogbmV3IFJvbGUoc3RhY2ssICdUYXNrUm9sZScsIHtcbiAgICAgICAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2Vjcy10YXNrcy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICAgIGNwdTogMjU2LFxuICAgICAgICBkZXNpcmVkQ291bnQ6IDMsXG4gICAgICAgIGVuYWJsZUVDU01hbmFnZWRUYWdzOiB0cnVlLFxuICAgICAgICBoZWFsdGhDaGVja0dyYWNlUGVyaW9kOiBEdXJhdGlvbi5taWxsaXMoMjAwMCksXG4gICAgICAgIGxvYWRCYWxhbmNlcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnbGIxJyxcbiAgICAgICAgICAgIGRvbWFpbk5hbWU6ICdhcGkuZXhhbXBsZS5jb20nLFxuICAgICAgICAgICAgZG9tYWluWm9uZTogem9uZSxcbiAgICAgICAgICAgIHB1YmxpY0xvYWRCYWxhbmNlcjogZmFsc2UsXG4gICAgICAgICAgICBsaXN0ZW5lcnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdsaXN0ZW5lcjEnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdsYjInLFxuICAgICAgICAgICAgbGlzdGVuZXJzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnbGlzdGVuZXIyJyxcbiAgICAgICAgICAgICAgICBwb3J0OiA4MSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgcHJvcGFnYXRlVGFnczogUHJvcGFnYXRlZFRhZ1NvdXJjZS5TRVJWSUNFLFxuICAgICAgICBtZW1vcnlSZXNlcnZhdGlvbk1pQjogMjU2LFxuICAgICAgICBzZXJ2aWNlTmFtZTogJ215U2VydmljZScsXG4gICAgICAgIHRhcmdldEdyb3VwczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgICAgbGlzdGVuZXI6ICdsaXN0ZW5lcjEnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29udGFpbmVyUG9ydDogOTAsXG4gICAgICAgICAgICBsaXN0ZW5lcjogJ2xpc3RlbmVyMicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICAgIERlc2lyZWRDb3VudDogMyxcbiAgICAgICAgRW5hYmxlRUNTTWFuYWdlZFRhZ3M6IHRydWUsXG4gICAgICAgIEhlYWx0aENoZWNrR3JhY2VQZXJpb2RTZWNvbmRzOiAyLFxuICAgICAgICBMYXVuY2hUeXBlOiAnRUMyJyxcbiAgICAgICAgTG9hZEJhbGFuY2VyczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIENvbnRhaW5lck5hbWU6ICdteUNvbnRhaW5lcicsXG4gICAgICAgICAgICBDb250YWluZXJQb3J0OiA4MCxcbiAgICAgICAgICAgIFRhcmdldEdyb3VwQXJuOiB7XG4gICAgICAgICAgICAgIFJlZjogJ1NlcnZpY2VsYjFsaXN0ZW5lcjFFQ1NUYXJnZXRHcm91cG15Q29udGFpbmVyODBHcm91cDQzMDk4RjhCJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDb250YWluZXJOYW1lOiAnbXlDb250YWluZXInLFxuICAgICAgICAgICAgQ29udGFpbmVyUG9ydDogOTAsXG4gICAgICAgICAgICBUYXJnZXRHcm91cEFybjoge1xuICAgICAgICAgICAgICBSZWY6ICdTZXJ2aWNlbGIybGlzdGVuZXIyRUNTVGFyZ2V0R3JvdXBteUNvbnRhaW5lcjkwR3JvdXBERUI0MTdFNCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFByb3BhZ2F0ZVRhZ3M6ICdTRVJWSUNFJyxcbiAgICAgICAgU2NoZWR1bGluZ1N0cmF0ZWd5OiAnUkVQTElDQScsXG4gICAgICAgIFNlcnZpY2VOYW1lOiAnbXlTZXJ2aWNlJyxcbiAgICAgIH0pKTtcblxuICAgICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQ3B1OiAyNTYsXG4gICAgICAgICAgICBFbnZpcm9ubWVudDogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgTmFtZTogJ1RFU1RfRU5WSVJPTk1FTlRfVkFSSUFCTEUxJyxcbiAgICAgICAgICAgICAgICBWYWx1ZTogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMSB2YWx1ZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBOYW1lOiAnVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTInLFxuICAgICAgICAgICAgICAgIFZhbHVlOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAyIHZhbHVlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFc3NlbnRpYWw6IHRydWUsXG4gICAgICAgICAgICBJbWFnZTogJ3Rlc3QnLFxuICAgICAgICAgICAgTG9nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgICAgICBMb2dEcml2ZXI6ICdhd3Nsb2dzJyxcbiAgICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICAgICdhd3Nsb2dzLWdyb3VwJzoge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnU2VydmljZVRhc2tEZWZteUNvbnRhaW5lckxvZ0dyb3VwMEE4NzM2OEInLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2F3c2xvZ3Mtc3RyZWFtLXByZWZpeCc6ICdUZXN0U3RyZWFtJyxcbiAgICAgICAgICAgICAgICAnYXdzbG9ncy1yZWdpb24nOiB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBNZW1vcnk6IDI1NixcbiAgICAgICAgICAgIE1lbW9yeVJlc2VydmF0aW9uOiAyNTYsXG4gICAgICAgICAgICBOYW1lOiAnbXlDb250YWluZXInLFxuICAgICAgICAgICAgUG9ydE1hcHBpbmdzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBDb250YWluZXJQb3J0OiA4MCxcbiAgICAgICAgICAgICAgICBIb3N0UG9ydDogMCxcbiAgICAgICAgICAgICAgICBQcm90b2NvbDogJ3RjcCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBDb250YWluZXJQb3J0OiA5MCxcbiAgICAgICAgICAgICAgICBIb3N0UG9ydDogMCxcbiAgICAgICAgICAgICAgICBQcm90b2NvbDogJ3RjcCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIEV4ZWN1dGlvblJvbGVBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdFeGVjdXRpb25Sb2xlNjA1QTA0MEInLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgRmFtaWx5OiAnU2VydmljZVRhc2tEZWY3OUQ3OTUyMScsXG4gICAgICAgIE5ldHdvcmtNb2RlOiAnYnJpZGdlJyxcbiAgICAgICAgUmVxdWlyZXNDb21wYXRpYmlsaXRpZXM6IFtcbiAgICAgICAgICAnRUMyJyxcbiAgICAgICAgXSxcbiAgICAgICAgVGFza1JvbGVBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdUYXNrUm9sZTMwRkMwRkJCJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KSk7XG5cbiAgICAgIHRlc3QuZG9uZSgpO1xuICAgIH0sXG5cbiAgICAnc2V0IHZwYyBpbnN0ZWFkIG9mIGNsdXN0ZXInKHRlc3Q6IFRlc3QpIHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgTmV0d29ya011bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDI1NixcbiAgICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICAgIGltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOIC0gc3RhY2sgZG9lcyBub3QgY29udGFpbiBhIExhdW5jaENvbmZpZ3VyYXRpb25cbiAgICAgIGV4cGVjdChzdGFjaywgdHJ1ZSkubm90VG8oaGF2ZVJlc291cmNlKCdBV1M6OkF1dG9TY2FsaW5nOjpMYXVuY2hDb25maWd1cmF0aW9uJykpO1xuXG4gICAgICB0ZXN0LnRocm93cygoKSA9PiBleHBlY3Qoc3RhY2spKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdhYmxlIHRvIHBhc3MgcHJlLWRlZmluZWQgdGFzayBkZWZpbml0aW9uJyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywgeyBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJykgfSk7XG5cbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IEVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG4gICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHtcbiAgICAgICAgY29udGFpbmVyUG9ydDogODAsXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IE5ldHdvcmtNdWx0aXBsZVRhcmdldEdyb3Vwc0VjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBFc3NlbnRpYWw6IHRydWUsXG4gICAgICAgICAgICBJbWFnZTogJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScsXG4gICAgICAgICAgICBNZW1vcnk6IDUxMixcbiAgICAgICAgICAgIE5hbWU6ICd3ZWInLFxuICAgICAgICAgICAgUG9ydE1hcHBpbmdzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBDb250YWluZXJQb3J0OiA4MCxcbiAgICAgICAgICAgICAgICBIb3N0UG9ydDogMCxcbiAgICAgICAgICAgICAgICBQcm90b2NvbDogJ3RjcCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIEZhbWlseTogJ0VjMlRhc2tEZWYnLFxuICAgICAgICBOZXR3b3JrTW9kZTogJ2JyaWRnZScsXG4gICAgICAgIFJlcXVpcmVzQ29tcGF0aWJpbGl0aWVzOiBbXG4gICAgICAgICAgJ0VDMicsXG4gICAgICAgIF0sXG4gICAgICB9KSk7XG5cbiAgICAgIHRlc3QuZG9uZSgpO1xuICAgIH0sXG5cbiAgICAnZXJyb3JzIGlmIG5vIGVzc2VudGlhbCBjb250YWluZXIgaW4gcHJlLWRlZmluZWQgdGFzayBkZWZpbml0aW9uJyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywgeyBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJykgfSk7XG5cbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IEVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICB0ZXN0LnRocm93cygoKSA9PiB7XG4gICAgICAgIG5ldyBOZXR3b3JrTXVsdGlwbGVUYXJnZXRHcm91cHNFYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICB9KTtcbiAgICAgIH0sIC9BdCBsZWFzdCBvbmUgZXNzZW50aWFsIGNvbnRhaW5lciBtdXN0IGJlIHNwZWNpZmllZC8pO1xuXG4gICAgICB0ZXN0LmRvbmUoKTtcbiAgICB9LFxuXG4gICAgJ3NldCBkZWZhdWx0IGxvYWQgYmFsYW5jZXIsIGxpc3RlbmVyLCB0YXJnZXQgZ3JvdXAgY29ycmVjdGx5Jyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IHpvbmUgPSBuZXcgUHVibGljSG9zdGVkWm9uZShzdGFjaywgJ0hvc3RlZFpvbmUnLCB7IHpvbmVOYW1lOiAnZXhhbXBsZS5jb20nIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBlY3NTZXJ2aWNlID0gbmV3IE5ldHdvcmtNdWx0aXBsZVRhcmdldEdyb3Vwc0VjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICB2cGMsXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICB9LFxuICAgICAgICBsb2FkQmFsYW5jZXJzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2xiMScsXG4gICAgICAgICAgICBsaXN0ZW5lcnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdsaXN0ZW5lcjEnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdsYjInLFxuICAgICAgICAgICAgZG9tYWluTmFtZTogJ2FwaS5leGFtcGxlLmNvbScsXG4gICAgICAgICAgICBkb21haW5ab25lOiB6b25lLFxuICAgICAgICAgICAgbGlzdGVuZXJzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnbGlzdGVuZXIyJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdsaXN0ZW5lcjMnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICB0YXJnZXRHcm91cHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb250YWluZXJQb3J0OiA4MCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDkwLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgdGVzdC5lcXVhbChlY3NTZXJ2aWNlLmxvYWRCYWxhbmNlci5ub2RlLmlkLCAnbGIxJyk7XG4gICAgICB0ZXN0LmVxdWFsKGVjc1NlcnZpY2UubGlzdGVuZXIubm9kZS5pZCwgJ2xpc3RlbmVyMScpO1xuICAgICAgdGVzdC5lcXVhbChlY3NTZXJ2aWNlLnRhcmdldEdyb3VwLm5vZGUuaWQsICdFQ1NUYXJnZXRHcm91cHdlYjgwR3JvdXAnKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdzZXR0aW5nIHZwYyBhbmQgY2x1c3RlciB0aHJvd3MgZXJyb3InKHRlc3Q6IFRlc3QpIHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB0ZXN0LnRocm93cygoKSA9PiBuZXcgTmV0d29ya011bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHZwYyxcbiAgICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICAgIGltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICAgIH0sXG4gICAgICB9KSwgL1lvdSBjYW4gb25seSBzcGVjaWZ5IGVpdGhlciB2cGMgb3IgY2x1c3Rlci4gQWx0ZXJuYXRpdmVseSwgeW91IGNhbiBsZWF2ZSBib3RoIGJsYW5rLyk7XG5cbiAgICAgIHRlc3QuZG9uZSgpO1xuICAgIH0sXG5cbiAgICAnY3JlYXRlcyBBV1MgQ2xvdWQgTWFwIHNlcnZpY2UgZm9yIFByaXZhdGUgRE5TIG5hbWVzcGFjZScodGVzdDogVGVzdCkge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IENsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHsgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICAgIG5hbWU6ICdmb28uY29tJyxcbiAgICAgICAgdHlwZTogTmFtZXNwYWNlVHlwZS5ETlNfUFJJVkFURSxcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgTmV0d29ya011bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdoZWxsbycpLFxuICAgICAgICB9LFxuICAgICAgICBjbG91ZE1hcE9wdGlvbnM6IHtcbiAgICAgICAgICBuYW1lOiAnbXlBcHAnLFxuICAgICAgICB9LFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgU2VydmljZVJlZ2lzdHJpZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDb250YWluZXJOYW1lOiAnd2ViJyxcbiAgICAgICAgICAgIENvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgICAgUmVnaXN0cnlBcm46IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ1NlcnZpY2VDbG91ZG1hcFNlcnZpY2VERTc2QjI5RCcsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KSk7XG5cbiAgICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlKCdBV1M6OlNlcnZpY2VEaXNjb3Zlcnk6OlNlcnZpY2UnLCB7XG4gICAgICAgIERuc0NvbmZpZzoge1xuICAgICAgICAgIERuc1JlY29yZHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgVFRMOiA2MCxcbiAgICAgICAgICAgICAgVHlwZTogJ1NSVicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgTmFtZXNwYWNlSWQ6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnRWNzQ2x1c3RlckRlZmF1bHRTZXJ2aWNlRGlzY292ZXJ5TmFtZXNwYWNlQjA5NzFCMkYnLFxuICAgICAgICAgICAgICAnSWQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJvdXRpbmdQb2xpY3k6ICdNVUxUSVZBTFVFJyxcbiAgICAgICAgfSxcbiAgICAgICAgSGVhbHRoQ2hlY2tDdXN0b21Db25maWc6IHtcbiAgICAgICAgICBGYWlsdXJlVGhyZXNob2xkOiAxLFxuICAgICAgICB9LFxuICAgICAgICBOYW1lOiAnbXlBcHAnLFxuICAgICAgICBOYW1lc3BhY2VJZDoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0Vjc0NsdXN0ZXJEZWZhdWx0U2VydmljZURpc2NvdmVyeU5hbWVzcGFjZUIwOTcxQjJGJyxcbiAgICAgICAgICAgICdJZCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdlcnJvcnMgd2hlbiBzZXR0aW5nIGJvdGggdGFza0RlZmluaXRpb24gYW5kIHRhc2tJbWFnZU9wdGlvbnMnKHRlc3Q6IFRlc3QpIHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7IGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgndDIubWljcm8nKSB9KTtcblxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdFYzJUYXNrRGVmJyk7XG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3Rlc3QnLCB7XG4gICAgICAgIGltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIHRlc3QudGhyb3dzKCgpID0+IHtcbiAgICAgICAgbmV3IE5ldHdvcmtNdWx0aXBsZVRhcmdldEdyb3Vwc0VjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICAgICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIH0pO1xuICAgICAgfSwgL1lvdSBtdXN0IHNwZWNpZnkgb25seSBvbmUgb2YgVGFza0RlZmluaXRpb24gb3IgVGFza0ltYWdlT3B0aW9ucy4vKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdlcnJvcnMgd2hlbiBzZXR0aW5nIG5laXRoZXIgdGFza0RlZmluaXRpb24gbm9yIHRhc2tJbWFnZU9wdGlvbnMnKHRlc3Q6IFRlc3QpIHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7IGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgndDIubWljcm8nKSB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgdGVzdC50aHJvd3MoKCkgPT4ge1xuICAgICAgICBuZXcgTmV0d29ya011bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgfSk7XG4gICAgICB9LCAvWW91IG11c3Qgc3BlY2lmeSBvbmUgb2Y6IHRhc2tEZWZpbml0aW9uIG9yIGltYWdlLyk7XG5cbiAgICAgIHRlc3QuZG9uZSgpO1xuICAgIH0sXG5cbiAgICAnZXJyb3JzIHdoZW4gc2V0dGluZyBkb21haW5OYW1lIGJ1dCBub3QgZG9tYWluWm9uZScodGVzdDogVGVzdCkge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IENsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHsgaW5zdGFuY2VUeXBlOiBuZXcgSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICB0ZXN0LnRocm93cygoKSA9PiB7XG4gICAgICAgIG5ldyBOZXR3b3JrTXVsdGlwbGVUYXJnZXRHcm91cHNFYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgICAgIGltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGxvYWRCYWxhbmNlcnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ2xiMScsXG4gICAgICAgICAgICAgIGRvbWFpbk5hbWU6ICdhcGkuZXhhbXBsZS5jb20nLFxuICAgICAgICAgICAgICBsaXN0ZW5lcnM6IFt7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2xpc3RlbmVyMScsXG4gICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgIH0sIC9BIFJvdXRlNTMgaG9zdGVkIGRvbWFpbiB6b25lIG5hbWUgaXMgcmVxdWlyZWQgdG8gY29uZmlndXJlIHRoZSBzcGVjaWZpZWQgZG9tYWluIG5hbWUvKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdlcnJvcnMgd2hlbiBsb2FkQmFsYW5jZXJzIGlzIGVtcHR5Jyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgdGVzdC50aHJvd3MoKCkgPT4ge1xuICAgICAgICBuZXcgTmV0d29ya011bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgICAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBsb2FkQmFsYW5jZXJzOiBbXSxcbiAgICAgICAgfSk7XG4gICAgICB9LCAvQXQgbGVhc3Qgb25lIGxvYWQgYmFsYW5jZXIgbXVzdCBiZSBzcGVjaWZpZWQvKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdlcnJvcnMgd2hlbiB0YXJnZXRHcm91cHMgaXMgZW1wdHknKHRlc3Q6IFRlc3QpIHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICB0ZXN0LnRocm93cygoKSA9PiB7XG4gICAgICAgIG5ldyBOZXR3b3JrTXVsdGlwbGVUYXJnZXRHcm91cHNFYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgICAgIGltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRhcmdldEdyb3VwczogW10sXG4gICAgICAgIH0pO1xuICAgICAgfSwgL0F0IGxlYXN0IG9uZSB0YXJnZXQgZ3JvdXAgc2hvdWxkIGJlIHNwZWNpZmllZC8pO1xuXG4gICAgICB0ZXN0LmRvbmUoKTtcbiAgICB9LFxuXG4gICAgJ2Vycm9ycyB3aGVuIG5vIGxpc3RlbmVyIHNwZWNpZmllZCcodGVzdDogVGVzdCkge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IENsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIHRlc3QudGhyb3dzKCgpID0+IHtcbiAgICAgICAgbmV3IE5ldHdvcmtNdWx0aXBsZVRhcmdldEdyb3Vwc0VjMlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgICAgIGNsdXN0ZXIsXG4gICAgICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICAgICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbG9hZEJhbGFuY2VyczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAnbGInLFxuICAgICAgICAgICAgICBsaXN0ZW5lcnM6IFtdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgIH0sIC9BdCBsZWFzdCBvbmUgbGlzdGVuZXIgbXVzdCBiZSBzcGVjaWZpZWQvKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdlcnJvcnMgd2hlbiBsaXN0ZW5lciBpcyBub3QgZGVmaW5lZCBidXQgdXNlZCBpbiBjcmVhdGluZyB0YXJnZXQgZ3JvdXBzJyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgdGVzdC50aHJvd3MoKCkgPT4ge1xuICAgICAgICBuZXcgTmV0d29ya011bHRpcGxlVGFyZ2V0R3JvdXBzRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICAgICAgY2x1c3RlcixcbiAgICAgICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgICAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgICAgfSxcbiAgICAgICAgICBsb2FkQmFsYW5jZXJzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6ICdsYicsXG4gICAgICAgICAgICAgIGxpc3RlbmVyczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICdsaXN0ZW5lcjEnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgdGFyZ2V0R3JvdXBzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgICAgICBsaXN0ZW5lcjogJ2xpc3RlbmVyMicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSwgL0xpc3RlbmVyIGxpc3RlbmVyMiBpcyBub3QgZGVmaW5lZC4gRGlkIHlvdSBkZWZpbmUgbGlzdGVuZXIgd2l0aCBuYW1lIGxpc3RlbmVyMj8vKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcblxuICAgICdlcnJvcnMgaWYgZGVzaXJlZFRhc2tDb3VudCBpcyAwJyh0ZXN0OiBUZXN0KSB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywgeyBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJykgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIHRlc3QudGhyb3dzKCgpID0+XG4gICAgICAgIG5ldyBOZXR3b3JrTXVsdGlwbGVUYXJnZXRHcm91cHNFYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgICAgICBjbHVzdGVyLFxuICAgICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgICAgIGltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlc2lyZWRDb3VudDogMCxcbiAgICAgICAgfSlcbiAgICAgICwgL1lvdSBtdXN0IHNwZWNpZnkgYSBkZXNpcmVkQ291bnQgZ3JlYXRlciB0aGFuIDAvKTtcblxuICAgICAgdGVzdC5kb25lKCk7XG4gICAgfSxcbiAgfSxcbn07Il19
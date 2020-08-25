"use strict";
const assert_1 = require("@aws-cdk/assert");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const aws_elasticloadbalancingv2_1 = require("@aws-cdk/aws-elasticloadbalancingv2");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const ecsPatterns = require("../../lib");
module.exports = {
    'setting loadBalancerType to Network creates an NLB Public'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        // WHEN
        new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
            cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
            },
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            Type: 'network',
            Scheme: 'internet-facing',
        }));
        test.done();
    },
    'setting loadBalancerType to Network and publicLoadBalancer to false creates an NLB Private'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        // WHEN
        new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
            cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
            },
            publicLoadBalancer: false,
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            Type: 'network',
            Scheme: 'internal',
        }));
        test.done();
    },
    'setting vpc and cluster throws error'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        // WHEN
        test.throws(() => new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
            cluster,
            vpc,
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
            },
        }));
        test.done();
    },
    'setting executionRole updated taskDefinition with given execution role'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        const executionRole = new iam.Role(stack, 'ExecutionRole', {
            path: '/',
            assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal('ecs.amazonaws.com'), new iam.ServicePrincipal('ecs-tasks.amazonaws.com')),
        });
        // WHEN
        new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
            cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                executionRole,
            },
        });
        // THEN
        const serviceTaskDefinition = assert_1.SynthUtils.synthesize(stack).template.Resources.ServiceTaskDef1922A00F;
        test.deepEqual(serviceTaskDefinition.Properties.ExecutionRoleArn, { 'Fn::GetAtt': ['ExecutionRole605A040B', 'Arn'] });
        test.done();
    },
    'setting taskRole updated taskDefinition with given task role'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        const taskRole = new iam.Role(stack, 'taskRoleTest', {
            path: '/',
            assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal('ecs.amazonaws.com'), new iam.ServicePrincipal('ecs-tasks.amazonaws.com')),
        });
        // WHEN
        new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
            cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                taskRole,
            },
        });
        // THEN
        const serviceTaskDefinition = assert_1.SynthUtils.synthesize(stack).template.Resources.ServiceTaskDef1922A00F;
        test.deepEqual(serviceTaskDefinition.Properties.TaskRoleArn, { 'Fn::GetAtt': ['taskRoleTest9DA66B6E', 'Arn'] });
        test.done();
    },
    'setting containerName updates container name with given name'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        // WHEN
        new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
            cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                containerName: 'bob',
            },
        });
        // THEN
        const serviceTaskDefinition = assert_1.SynthUtils.synthesize(stack).template.Resources.ServiceTaskDef1922A00F;
        test.deepEqual(serviceTaskDefinition.Properties.ContainerDefinitions[0].Name, 'bob');
        test.done();
    },
    'not setting containerName updates container name with default'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        // WHEN
        new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
            cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
            },
        });
        // THEN
        const serviceTaskDefinition = assert_1.SynthUtils.synthesize(stack).template.Resources.ServiceTaskDef1922A00F;
        test.deepEqual(serviceTaskDefinition.Properties.ContainerDefinitions[0].Name, 'web');
        test.done();
    },
    'setting servicename updates service name with given name'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        // WHEN
        new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
            cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
            },
            serviceName: 'bob',
        });
        // THEN
        const serviceTaskDefinition = assert_1.SynthUtils.synthesize(stack).template.Resources.Service9571FDD8;
        test.deepEqual(serviceTaskDefinition.Properties.ServiceName, 'bob');
        test.done();
    },
    'not setting servicename updates service name with default'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        // WHEN
        new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
            cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
            },
        });
        // THEN
        const serviceTaskDefinition = assert_1.SynthUtils.synthesize(stack).template.Resources.Service9571FDD8;
        test.equal(serviceTaskDefinition.Properties.ServiceName, undefined);
        test.done();
    },
    'setting healthCheckGracePeriod works'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
            },
            healthCheckGracePeriod: cdk.Duration.seconds(600),
        });
        // THEN
        const serviceTaskDefinition = assert_1.SynthUtils.synthesize(stack).template.Resources.Service9571FDD8;
        test.deepEqual(serviceTaskDefinition.Properties.HealthCheckGracePeriodSeconds, 600);
        test.done();
    },
    'setting platform version'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
            },
            platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
            PlatformVersion: ecs.FargatePlatformVersion.VERSION1_4,
        }));
        test.done();
    },
    'test load balanced service with family defined'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
        // WHEN
        new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
            cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                enableLogging: false,
                environment: {
                    TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
                    TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
                },
                family: 'fargate-task-family',
            },
            desiredCount: 2,
            memoryLimitMiB: 512,
            serviceName: 'fargate-test-service',
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResource('AWS::ECS::Service', {
            DesiredCount: 2,
            LaunchType: 'FARGATE',
            ServiceName: 'fargate-test-service',
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
                    Image: '/aws/aws-example-app',
                },
            ],
            Family: 'fargate-task-family',
        }));
        test.done();
    },
    'setting NLB special listener port to create the listener'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        // WHEN
        new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'FargateNlbService', {
            cluster,
            listenerPort: 2015,
            taskImageOptions: {
                containerPort: 2015,
                image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
            },
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::Listener', {
            DefaultActions: [
                {
                    Type: 'forward',
                },
            ],
            Port: 2015,
            Protocol: 'TCP',
        }));
        test.done();
    },
    'setting ALB special listener port to create the listener'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        // WHEN
        new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'FargateAlbService', {
            cluster,
            listenerPort: 2015,
            taskImageOptions: {
                containerPort: 2015,
                image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
            },
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::Listener', {
            DefaultActions: [
                {
                    Type: 'forward',
                },
            ],
            Port: 2015,
            Protocol: 'HTTP',
        }));
        test.done();
    },
    'setting ALB HTTPS protocol to create the listener on 443'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        // WHEN
        new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'FargateAlbService', {
            cluster,
            protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTPS,
            domainName: 'domain.com',
            domainZone: {
                hostedZoneId: 'fakeId',
                zoneName: 'domain.com',
                hostedZoneArn: 'arn:aws:route53:::hostedzone/fakeId',
                stack,
                node: stack.node,
            },
            taskImageOptions: {
                containerPort: 2015,
                image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
            },
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::Listener', {
            DefaultActions: [
                {
                    Type: 'forward',
                },
            ],
            Port: 443,
            Protocol: 'HTTPS',
        }));
        test.done();
    },
    'setting ALB HTTPS correctly sets the recordset name'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        // WHEN
        new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'FargateAlbService', {
            cluster,
            protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTPS,
            domainName: 'test.domain.com',
            domainZone: {
                hostedZoneId: 'fakeId',
                zoneName: 'domain.com.',
                hostedZoneArn: 'arn:aws:route53:::hostedzone/fakeId',
                stack,
                node: stack.node,
            },
            taskImageOptions: {
                containerPort: 2015,
                image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
            },
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::Route53::RecordSet', {
            Name: 'test.domain.com.',
        }));
        test.done();
    },
    'setting ALB HTTP protocol to create the listener on 80'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        // WHEN
        new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'FargateAlbService', {
            cluster,
            protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTP,
            taskImageOptions: {
                containerPort: 2015,
                image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
            },
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::Listener', {
            DefaultActions: [
                {
                    Type: 'forward',
                },
            ],
            Port: 80,
            Protocol: 'HTTP',
        }));
        test.done();
    },
    'setting ALB without any protocol or listenerPort to create the listener on 80'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
        // WHEN
        new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'FargateAlbService', {
            cluster,
            taskImageOptions: {
                containerPort: 2015,
                image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
            },
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::Listener', {
            DefaultActions: [
                {
                    Type: 'forward',
                },
            ],
            Port: 80,
            Protocol: 'HTTP',
        }));
        test.done();
    },
    'passing in existing network load balancer to NLB Fargate Service'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        const nlb = new aws_elasticloadbalancingv2_1.NetworkLoadBalancer(stack, 'NLB', { vpc });
        // WHEN
        new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
            vpc,
            loadBalancer: nlb,
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            },
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::Service', {
            LaunchType: 'FARGATE',
        }));
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            Type: 'network',
        }));
        test.done();
    },
    'passing in imported network load balancer and resources to NLB Fargate service'(test) {
        // GIVEN
        const stack1 = new cdk.Stack();
        const vpc1 = new ec2.Vpc(stack1, 'VPC');
        const cluster1 = new ecs.Cluster(stack1, 'Cluster', { vpc: vpc1 });
        const nlbArn = 'arn:aws:elasticloadbalancing::000000000000::dummyloadbalancer';
        const stack2 = new cdk.Stack(stack1, 'Stack2');
        const cluster2 = ecs.Cluster.fromClusterAttributes(stack2, 'ImportedCluster', {
            vpc: vpc1,
            securityGroups: cluster1.connections.securityGroups,
            clusterName: 'cluster-name',
        });
        // WHEN
        const nlb2 = aws_elasticloadbalancingv2_1.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stack2, 'ImportedNLB', {
            loadBalancerArn: nlbArn,
            vpc: vpc1,
        });
        const taskDef = new ecs.FargateTaskDefinition(stack2, 'TaskDef', {
            cpu: 1024,
            memoryLimitMiB: 1024,
        });
        const container = taskDef.addContainer('myContainer', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 1024,
        });
        container.addPortMappings({
            containerPort: 80,
        });
        new ecsPatterns.NetworkLoadBalancedFargateService(stack2, 'FargateNLBService', {
            cluster: cluster2,
            loadBalancer: nlb2,
            desiredCount: 1,
            taskDefinition: taskDef,
        });
        // THEN
        assert_1.expect(stack2).to(assert_1.haveResourceLike('AWS::ECS::Service', {
            LaunchType: 'FARGATE',
            LoadBalancers: [{ ContainerName: 'myContainer', ContainerPort: 80 }],
        }));
        assert_1.expect(stack2).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::TargetGroup'));
        assert_1.expect(stack2).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::Listener', {
            LoadBalancerArn: nlb2.loadBalancerArn,
            Port: 80,
        }));
        test.done();
    },
    'passing in previously created application load balancer to ALB Fargate Service'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const cluster = new ecs.Cluster(stack, 'Cluster', { vpc, clusterName: 'MyCluster' });
        const sg = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
        cluster.connections.addSecurityGroup(sg);
        const alb = new aws_elasticloadbalancingv2_1.ApplicationLoadBalancer(stack, 'ALB', { vpc, securityGroup: sg });
        // WHEN
        new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
            cluster,
            loadBalancer: alb,
            taskImageOptions: {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            },
        });
        // THEN
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ECS::Service', {
            LaunchType: 'FARGATE',
        }));
        assert_1.expect(stack).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::LoadBalancer', {
            Type: 'application',
        }));
        test.done();
    },
    'passing in imported application load balancer and resources to ALB Fargate Service'(test) {
        // GIVEN
        const stack1 = new cdk.Stack();
        const albArn = 'arn:aws:elasticloadbalancing::000000000000::dummyloadbalancer';
        const vpc = new ec2.Vpc(stack1, 'Vpc');
        const cluster = new ecs.Cluster(stack1, 'Cluster', { vpc, clusterName: 'MyClusterName' });
        const sg = new ec2.SecurityGroup(stack1, 'SecurityGroup', { vpc });
        cluster.connections.addSecurityGroup(sg);
        const alb = aws_elasticloadbalancingv2_1.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack1, 'ALB', {
            loadBalancerArn: albArn,
            vpc,
            securityGroupId: sg.securityGroupId,
            loadBalancerDnsName: 'MyDnsName',
        });
        // WHEN
        const taskDef = new ecs.FargateTaskDefinition(stack1, 'TaskDef', {
            cpu: 1024,
            memoryLimitMiB: 1024,
        });
        const container = taskDef.addContainer('Container', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 1024,
        });
        container.addPortMappings({
            containerPort: 80,
        });
        new ecsPatterns.ApplicationLoadBalancedFargateService(stack1, 'FargateALBService', {
            cluster,
            loadBalancer: alb,
            desiredCount: 1,
            taskDefinition: taskDef,
        });
        // THEN
        assert_1.expect(stack1).to(assert_1.haveResourceLike('AWS::ECS::Service', {
            LaunchType: 'FARGATE',
            LoadBalancers: [{ ContainerName: 'Container', ContainerPort: 80 }],
        }));
        assert_1.expect(stack1).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::TargetGroup'));
        assert_1.expect(stack1).to(assert_1.haveResourceLike('AWS::ElasticLoadBalancingV2::Listener', {
            LoadBalancerArn: alb.loadBalancerArn,
            Port: 80,
        }));
        test.done();
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5sb2FkLWJhbGFuY2VkLWZhcmdhdGUtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QubG9hZC1iYWxhbmNlZC1mYXJnYXRlLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRDQUFxRjtBQUNyRix3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLG9GQUF3SDtBQUN4SCx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBRXJDLHlDQUF5QztBQUV6QyxpQkFBUztJQUNQLDJEQUEyRCxDQUFDLElBQVU7UUFDcEUsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBRTNELE9BQU87UUFDUCxJQUFJLFdBQVcsQ0FBQyxpQ0FBaUMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ2xFLE9BQU87WUFDUCxnQkFBZ0IsRUFBRTtnQkFDaEIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLHNCQUFzQixDQUFDO2FBQy9EO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMseUJBQWdCLENBQUMsMkNBQTJDLEVBQUU7WUFDN0UsSUFBSSxFQUFFLFNBQVM7WUFDZixNQUFNLEVBQUUsaUJBQWlCO1NBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRUosSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVELDRGQUE0RixDQUFDLElBQVU7UUFDckcsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFH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LGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUNILFNBQVMsQ0FBQyxlQUFlLENBQUM7WUFDeEIsYUFBYSxFQUFFLEVBQUU7U0FDbEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxXQUFXLENBQUMscUNBQXFDLENBQUMsTUFBTSxFQUFFLG1CQUFtQixFQUFFO1lBQ2pGLE9BQU87WUFDUCxZQUFZLEVBQUUsR0FBRztZQUNqQixZQUFZLEVBQUUsQ0FBQztZQUNmLGNBQWMsRUFBRSxPQUFPO1NBQ3hCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxlQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLHlCQUFnQixDQUFDLG1CQUFtQixFQUFFO1lBQ3RELFVBQVUsRUFBRSxTQUFTO1lBQ3JCLGFBQWEsRUFBRSxDQUFDLEVBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsRUFBRSxFQUFDLENBQUM7U0FDakUsQ0FBQyxDQUFDLENBQUM7UUFDSixlQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLHlCQUFnQixDQUFDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQztRQUNoRixlQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLHlCQUFnQixDQUFDLHVDQUF1QyxFQUFFO1lBQzFFLGVBQWUsRUFBRSxHQUFHLENBQUMsZUFBZTtZQUNwQyxJQUFJLEVBQUUsRUFBRTtTQUNULENBQUMsQ0FBQyxDQUFDO1FBRUosSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQztDQUVGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleHBlY3QsIGhhdmVSZXNvdXJjZSwgaGF2ZVJlc291cmNlTGlrZSwgU3ludGhVdGlscyB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydCc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnQGF3cy1jZGsvYXdzLWVjcyc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlciwgQXBwbGljYXRpb25Qcm90b2NvbCwgTmV0d29ya0xvYWRCYWxhbmNlciB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1lbGFzdGljbG9hZGJhbGFuY2luZ3YyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFRlc3QgfSBmcm9tICdub2RldW5pdCc7XG5pbXBvcnQgKiBhcyBlY3NQYXR0ZXJucyBmcm9tICcuLi8uLi9saWInO1xuXG5leHBvcnQgPSB7XG4gICdzZXR0aW5nIGxvYWRCYWxhbmNlclR5cGUgdG8gTmV0d29yayBjcmVhdGVzIGFuIE5MQiBQdWJsaWMnKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzUGF0dGVybnMuTmV0d29ya0xvYWRCYWxhbmNlZEZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCcvYXdzL2F3cy1leGFtcGxlLWFwcCcpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TG9hZEJhbGFuY2VyJywge1xuICAgICAgVHlwZTogJ25ldHdvcmsnLFxuICAgICAgU2NoZW1lOiAnaW50ZXJuZXQtZmFjaW5nJyxcbiAgICB9KSk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAnc2V0dGluZyBsb2FkQmFsYW5jZXJUeXBlIHRvIE5ldHdvcmsgYW5kIHB1YmxpY0xvYWRCYWxhbmNlciB0byBmYWxzZSBjcmVhdGVzIGFuIE5MQiBQcml2YXRlJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLk5ldHdvcmtMb2FkQmFsYW5jZWRGYXJnYXRlU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnL2F3cy9hd3MtZXhhbXBsZS1hcHAnKSxcbiAgICAgIH0sXG4gICAgICBwdWJsaWNMb2FkQmFsYW5jZXI6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZSgnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXInLCB7XG4gICAgICBUeXBlOiAnbmV0d29yaycsXG4gICAgICBTY2hlbWU6ICdpbnRlcm5hbCcsXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ3NldHRpbmcgdnBjIGFuZCBjbHVzdGVyIHRocm93cyBlcnJvcicodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHRlc3QudGhyb3dzKCgpID0+IG5ldyBlY3NQYXR0ZXJucy5OZXR3b3JrTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHZwYyxcbiAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICB9LFxuICAgIH0pKTtcblxuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gICdzZXR0aW5nIGV4ZWN1dGlvblJvbGUgdXBkYXRlZCB0YXNrRGVmaW5pdGlvbiB3aXRoIGdpdmVuIGV4ZWN1dGlvbiByb2xlJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG5cbiAgICBjb25zdCBleGVjdXRpb25Sb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnRXhlY3V0aW9uUm9sZScsIHtcbiAgICAgIHBhdGg6ICcvJyxcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5Db21wb3NpdGVQcmluY2lwYWwoXG4gICAgICAgIG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWNzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlY3MtdGFza3MuYW1hem9uYXdzLmNvbScpLFxuICAgICAgKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzUGF0dGVybnMuTmV0d29ya0xvYWRCYWxhbmNlZEZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCcvYXdzL2F3cy1leGFtcGxlLWFwcCcpLFxuICAgICAgICBleGVjdXRpb25Sb2xlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBzZXJ2aWNlVGFza0RlZmluaXRpb24gPSBTeW50aFV0aWxzLnN5bnRoZXNpemUoc3RhY2spLnRlbXBsYXRlLlJlc291cmNlcy5TZXJ2aWNlVGFza0RlZjE5MjJBMDBGO1xuICAgIHRlc3QuZGVlcEVxdWFsKHNlcnZpY2VUYXNrRGVmaW5pdGlvbi5Qcm9wZXJ0aWVzLkV4ZWN1dGlvblJvbGVBcm4sIHsgJ0ZuOjpHZXRBdHQnOiBbJ0V4ZWN1dGlvblJvbGU2MDVBMDQwQicsICdBcm4nXSB9KTtcbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAnc2V0dGluZyB0YXNrUm9sZSB1cGRhdGVkIHRhc2tEZWZpbml0aW9uIHdpdGggZ2l2ZW4gdGFzayByb2xlJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgY29uc3QgdGFza1JvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICd0YXNrUm9sZVRlc3QnLCB7XG4gICAgICBwYXRoOiAnLycsXG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQ29tcG9zaXRlUHJpbmNpcGFsKFxuICAgICAgICBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Vjcy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgIG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWNzLXRhc2tzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLk5ldHdvcmtMb2FkQmFsYW5jZWRGYXJnYXRlU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnL2F3cy9hd3MtZXhhbXBsZS1hcHAnKSxcbiAgICAgICAgdGFza1JvbGUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHNlcnZpY2VUYXNrRGVmaW5pdGlvbiA9IFN5bnRoVXRpbHMuc3ludGhlc2l6ZShzdGFjaykudGVtcGxhdGUuUmVzb3VyY2VzLlNlcnZpY2VUYXNrRGVmMTkyMkEwMEY7XG4gICAgdGVzdC5kZWVwRXF1YWwoc2VydmljZVRhc2tEZWZpbml0aW9uLlByb3BlcnRpZXMuVGFza1JvbGVBcm4sIHsgJ0ZuOjpHZXRBdHQnOiBbJ3Rhc2tSb2xlVGVzdDlEQTY2QjZFJywgJ0FybiddIH0pO1xuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gICdzZXR0aW5nIGNvbnRhaW5lck5hbWUgdXBkYXRlcyBjb250YWluZXIgbmFtZSB3aXRoIGdpdmVuIG5hbWUnKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzUGF0dGVybnMuTmV0d29ya0xvYWRCYWxhbmNlZEZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCcvYXdzL2F3cy1leGFtcGxlLWFwcCcpLFxuICAgICAgICBjb250YWluZXJOYW1lOiAnYm9iJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3Qgc2VydmljZVRhc2tEZWZpbml0aW9uID0gU3ludGhVdGlscy5zeW50aGVzaXplKHN0YWNrKS50ZW1wbGF0ZS5SZXNvdXJjZXMuU2VydmljZVRhc2tEZWYxOTIyQTAwRjtcbiAgICB0ZXN0LmRlZXBFcXVhbChzZXJ2aWNlVGFza0RlZmluaXRpb24uUHJvcGVydGllcy5Db250YWluZXJEZWZpbml0aW9uc1swXS5OYW1lLCAnYm9iJyk7XG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ25vdCBzZXR0aW5nIGNvbnRhaW5lck5hbWUgdXBkYXRlcyBjb250YWluZXIgbmFtZSB3aXRoIGRlZmF1bHQnKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzUGF0dGVybnMuTmV0d29ya0xvYWRCYWxhbmNlZEZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCcvYXdzL2F3cy1leGFtcGxlLWFwcCcpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBzZXJ2aWNlVGFza0RlZmluaXRpb24gPSBTeW50aFV0aWxzLnN5bnRoZXNpemUoc3RhY2spLnRlbXBsYXRlLlJlc291cmNlcy5TZXJ2aWNlVGFza0RlZjE5MjJBMDBGO1xuICAgIHRlc3QuZGVlcEVxdWFsKHNlcnZpY2VUYXNrRGVmaW5pdGlvbi5Qcm9wZXJ0aWVzLkNvbnRhaW5lckRlZmluaXRpb25zWzBdLk5hbWUsICd3ZWInKTtcbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAnc2V0dGluZyBzZXJ2aWNlbmFtZSB1cGRhdGVzIHNlcnZpY2UgbmFtZSB3aXRoIGdpdmVuIG5hbWUnKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzUGF0dGVybnMuTmV0d29ya0xvYWRCYWxhbmNlZEZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCcvYXdzL2F3cy1leGFtcGxlLWFwcCcpLFxuICAgICAgfSxcbiAgICAgIHNlcnZpY2VOYW1lOiAnYm9iJyxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgY29uc3Qgc2VydmljZVRhc2tEZWZpbml0aW9uID0gU3ludGhVdGlscy5zeW50aGVzaXplKHN0YWNrKS50ZW1wbGF0ZS5SZXNvdXJjZXMuU2VydmljZTk1NzFGREQ4O1xuICAgIHRlc3QuZGVlcEVxdWFsKHNlcnZpY2VUYXNrRGVmaW5pdGlvbi5Qcm9wZXJ0aWVzLlNlcnZpY2VOYW1lLCAnYm9iJyk7XG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ25vdCBzZXR0aW5nIHNlcnZpY2VuYW1lIHVwZGF0ZXMgc2VydmljZSBuYW1lIHdpdGggZGVmYXVsdCcodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3NQYXR0ZXJucy5OZXR3b3JrTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHNlcnZpY2VUYXNrRGVmaW5pdGlvbiA9IFN5bnRoVXRpbHMuc3ludGhlc2l6ZShzdGFjaykudGVtcGxhdGUuUmVzb3VyY2VzLlNlcnZpY2U5NTcxRkREODtcbiAgICB0ZXN0LmVxdWFsKHNlcnZpY2VUYXNrRGVmaW5pdGlvbi5Qcm9wZXJ0aWVzLlNlcnZpY2VOYW1lLCB1bmRlZmluZWQpO1xuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gICdzZXR0aW5nIGhlYWx0aENoZWNrR3JhY2VQZXJpb2Qgd29ya3MnKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3NQYXR0ZXJucy5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlZEZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICB9LFxuICAgICAgaGVhbHRoQ2hlY2tHcmFjZVBlcmlvZDogY2RrLkR1cmF0aW9uLnNlY29uZHMoNjAwKSxcbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgY29uc3Qgc2VydmljZVRhc2tEZWZpbml0aW9uID0gU3ludGhVdGlscy5zeW50aGVzaXplKHN0YWNrKS50ZW1wbGF0ZS5SZXNvdXJjZXMuU2VydmljZTk1NzFGREQ4O1xuICAgIHRlc3QuZGVlcEVxdWFsKHNlcnZpY2VUYXNrRGVmaW5pdGlvbi5Qcm9wZXJ0aWVzLkhlYWx0aENoZWNrR3JhY2VQZXJpb2RTZWNvbmRzLCA2MDApO1xuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gICdzZXR0aW5nIHBsYXRmb3JtIHZlcnNpb24nKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3NQYXR0ZXJucy5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlZEZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICB9LFxuICAgICAgcGxhdGZvcm1WZXJzaW9uOiBlY3MuRmFyZ2F0ZVBsYXRmb3JtVmVyc2lvbi5WRVJTSU9OMV80LFxuICAgIH0pO1xuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICBQbGF0Zm9ybVZlcnNpb246IGVjcy5GYXJnYXRlUGxhdGZvcm1WZXJzaW9uLlZFUlNJT04xXzQsXG4gICAgfSkpO1xuICAgIHRlc3QuZG9uZSgpO1xuICB9LFxuXG4gICd0ZXN0IGxvYWQgYmFsYW5jZWQgc2VydmljZSB3aXRoIGZhbWlseSBkZWZpbmVkJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7IGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJykgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICAgIGVuYWJsZUxvZ2dpbmc6IGZhbHNlLFxuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIFRFU1RfRU5WSVJPTk1FTlRfVkFSSUFCTEUxOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSAxIHZhbHVlJyxcbiAgICAgICAgICBURVNUX0VOVklST05NRU5UX1ZBUklBQkxFMjogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMiB2YWx1ZScsXG4gICAgICAgIH0sXG4gICAgICAgIGZhbWlseTogJ2ZhcmdhdGUtdGFzay1mYW1pbHknLFxuICAgICAgfSxcbiAgICAgIGRlc2lyZWRDb3VudDogMixcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICBzZXJ2aWNlTmFtZTogJ2ZhcmdhdGUtdGVzdC1zZXJ2aWNlJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZSgnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICBEZXNpcmVkQ291bnQ6IDIsXG4gICAgICBMYXVuY2hUeXBlOiAnRkFSR0FURScsXG4gICAgICBTZXJ2aWNlTmFtZTogJ2ZhcmdhdGUtdGVzdC1zZXJ2aWNlJyxcbiAgICB9KSk7XG5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBFbnZpcm9ubWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBOYW1lOiAnVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTEnLFxuICAgICAgICAgICAgICBWYWx1ZTogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMSB2YWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBOYW1lOiAnVEVTVF9FTlZJUk9OTUVOVF9WQVJJQUJMRTInLFxuICAgICAgICAgICAgICBWYWx1ZTogJ3Rlc3QgZW52aXJvbm1lbnQgdmFyaWFibGUgMiB2YWx1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgSW1hZ2U6ICcvYXdzL2F3cy1leGFtcGxlLWFwcCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgRmFtaWx5OiAnZmFyZ2F0ZS10YXNrLWZhbWlseScsXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ3NldHRpbmcgTkxCIHNwZWNpYWwgbGlzdGVuZXIgcG9ydCB0byBjcmVhdGUgdGhlIGxpc3RlbmVyJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLk5ldHdvcmtMb2FkQmFsYW5jZWRGYXJnYXRlU2VydmljZShzdGFjaywgJ0ZhcmdhdGVObGJTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGxpc3RlbmVyUG9ydDogMjAxNSxcbiAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgY29udGFpbmVyUG9ydDogMjAxNSxcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FiaW9zb2Z0L2NhZGR5JyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZSgnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIERlZmF1bHRBY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBUeXBlOiAnZm9yd2FyZCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgUG9ydDogMjAxNSxcbiAgICAgIFByb3RvY29sOiAnVENQJyxcbiAgICB9KSk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAnc2V0dGluZyBBTEIgc3BlY2lhbCBsaXN0ZW5lciBwb3J0IHRvIGNyZWF0ZSB0aGUgbGlzdGVuZXInKHRlc3Q6IFRlc3QpIHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWNzUGF0dGVybnMuQXBwbGljYXRpb25Mb2FkQmFsYW5jZWRGYXJnYXRlU2VydmljZShzdGFjaywgJ0ZhcmdhdGVBbGJTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGxpc3RlbmVyUG9ydDogMjAxNSxcbiAgICAgIHRhc2tJbWFnZU9wdGlvbnM6IHtcbiAgICAgICAgY29udGFpbmVyUG9ydDogMjAxNSxcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FiaW9zb2Z0L2NhZGR5JyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZSgnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIERlZmF1bHRBY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBUeXBlOiAnZm9yd2FyZCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgUG9ydDogMjAxNSxcbiAgICAgIFByb3RvY29sOiAnSFRUUCcsXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ3NldHRpbmcgQUxCIEhUVFBTIHByb3RvY29sIHRvIGNyZWF0ZSB0aGUgbGlzdGVuZXIgb24gNDQzJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdGYXJnYXRlQWxiU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBwcm90b2NvbDogQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQUyxcbiAgICAgIGRvbWFpbk5hbWU6ICdkb21haW4uY29tJyxcbiAgICAgIGRvbWFpblpvbmU6IHtcbiAgICAgICAgaG9zdGVkWm9uZUlkOiAnZmFrZUlkJyxcbiAgICAgICAgem9uZU5hbWU6ICdkb21haW4uY29tJyxcbiAgICAgICAgaG9zdGVkWm9uZUFybjogJ2Fybjphd3M6cm91dGU1Mzo6Omhvc3RlZHpvbmUvZmFrZUlkJyxcbiAgICAgICAgc3RhY2ssXG4gICAgICAgIG5vZGU6IHN0YWNrLm5vZGUsXG4gICAgICB9LFxuICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICBjb250YWluZXJQb3J0OiAyMDE1LFxuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYWJpb3NvZnQvY2FkZHknKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyJywge1xuICAgICAgRGVmYXVsdEFjdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFR5cGU6ICdmb3J3YXJkJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBQb3J0OiA0NDMsXG4gICAgICBQcm90b2NvbDogJ0hUVFBTJyxcbiAgICB9KSk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAnc2V0dGluZyBBTEIgSFRUUFMgY29ycmVjdGx5IHNldHMgdGhlIHJlY29yZHNldCBuYW1lJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdGYXJnYXRlQWxiU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBwcm90b2NvbDogQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQUyxcbiAgICAgIGRvbWFpbk5hbWU6ICd0ZXN0LmRvbWFpbi5jb20nLFxuICAgICAgZG9tYWluWm9uZToge1xuICAgICAgICBob3N0ZWRab25lSWQ6ICdmYWtlSWQnLFxuICAgICAgICB6b25lTmFtZTogJ2RvbWFpbi5jb20uJyxcbiAgICAgICAgaG9zdGVkWm9uZUFybjogJ2Fybjphd3M6cm91dGU1Mzo6Omhvc3RlZHpvbmUvZmFrZUlkJyxcbiAgICAgICAgc3RhY2ssXG4gICAgICAgIG5vZGU6IHN0YWNrLm5vZGUsXG4gICAgICB9LFxuICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICBjb250YWluZXJQb3J0OiAyMDE1LFxuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYWJpb3NvZnQvY2FkZHknKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OlJvdXRlNTM6OlJlY29yZFNldCcsIHtcbiAgICAgIE5hbWU6ICd0ZXN0LmRvbWFpbi5jb20uJyxcbiAgICB9KSk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAnc2V0dGluZyBBTEIgSFRUUCBwcm90b2NvbCB0byBjcmVhdGUgdGhlIGxpc3RlbmVyIG9uIDgwJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdGYXJnYXRlQWxiU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICBwcm90b2NvbDogQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQLFxuICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICBjb250YWluZXJQb3J0OiAyMDE1LFxuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYWJpb3NvZnQvY2FkZHknKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyJywge1xuICAgICAgRGVmYXVsdEFjdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFR5cGU6ICdmb3J3YXJkJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBQb3J0OiA4MCxcbiAgICAgIFByb3RvY29sOiAnSFRUUCcsXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ3NldHRpbmcgQUxCIHdpdGhvdXQgYW55IHByb3RvY29sIG9yIGxpc3RlbmVyUG9ydCB0byBjcmVhdGUgdGhlIGxpc3RlbmVyIG9uIDgwJyh0ZXN0OiBUZXN0KSB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdGYXJnYXRlQWxiU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgIGNvbnRhaW5lclBvcnQ6IDIwMTUsXG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhYmlvc29mdC9jYWRkeScpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2spLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLCB7XG4gICAgICBEZWZhdWx0QWN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgVHlwZTogJ2ZvcndhcmQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFBvcnQ6IDgwLFxuICAgICAgUHJvdG9jb2w6ICdIVFRQJyxcbiAgICB9KSk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAncGFzc2luZyBpbiBleGlzdGluZyBuZXR3b3JrIGxvYWQgYmFsYW5jZXIgdG8gTkxCIEZhcmdhdGUgU2VydmljZScodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBjb25zdCBubGIgPSBuZXcgTmV0d29ya0xvYWRCYWxhbmNlcihzdGFjaywgJ05MQicsIHsgdnBjIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3NQYXR0ZXJucy5OZXR3b3JrTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgdnBjLFxuICAgICAgbG9hZEJhbGFuY2VyOiBubGIsXG4gICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgIExhdW5jaFR5cGU6ICdGQVJHQVRFJyxcbiAgICB9KSk7XG4gICAgZXhwZWN0KHN0YWNrKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OkxvYWRCYWxhbmNlcicsIHtcbiAgICAgIFR5cGU6ICduZXR3b3JrJyxcbiAgICB9KSk7XG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ3Bhc3NpbmcgaW4gaW1wb3J0ZWQgbmV0d29yayBsb2FkIGJhbGFuY2VyIGFuZCByZXNvdXJjZXMgdG8gTkxCIEZhcmdhdGUgc2VydmljZScodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYzEgPSBuZXcgZWMyLlZwYyhzdGFjazEsICdWUEMnKTtcbiAgICBjb25zdCBjbHVzdGVyMSA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjazEsICdDbHVzdGVyJywgeyB2cGM6IHZwYzEgfSk7XG4gICAgY29uc3QgbmxiQXJuID0gJ2Fybjphd3M6ZWxhc3RpY2xvYWRiYWxhbmNpbmc6OjAwMDAwMDAwMDAwMDo6ZHVtbXlsb2FkYmFsYW5jZXInO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBjZGsuU3RhY2soc3RhY2sxLCAnU3RhY2syJyk7XG4gICAgY29uc3QgY2x1c3RlcjIgPSBlY3MuQ2x1c3Rlci5mcm9tQ2x1c3RlckF0dHJpYnV0ZXMoc3RhY2syLCAnSW1wb3J0ZWRDbHVzdGVyJywge1xuICAgICAgdnBjOiB2cGMxLFxuICAgICAgc2VjdXJpdHlHcm91cHM6IGNsdXN0ZXIxLmNvbm5lY3Rpb25zLnNlY3VyaXR5R3JvdXBzLFxuICAgICAgY2x1c3Rlck5hbWU6ICdjbHVzdGVyLW5hbWUnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG5sYjIgPSBOZXR3b3JrTG9hZEJhbGFuY2VyLmZyb21OZXR3b3JrTG9hZEJhbGFuY2VyQXR0cmlidXRlcyhzdGFjazIsICdJbXBvcnRlZE5MQicsIHtcbiAgICAgIGxvYWRCYWxhbmNlckFybjogbmxiQXJuLFxuICAgICAgdnBjOiB2cGMxLFxuICAgIH0pO1xuICAgIGNvbnN0IHRhc2tEZWYgPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjazIsICdUYXNrRGVmJywge1xuICAgICAgY3B1OiAxMDI0LFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgfSk7XG4gICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZi5hZGRDb250YWluZXIoJ215Q29udGFpbmVyJywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgfSk7XG4gICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7XG4gICAgICBjb250YWluZXJQb3J0OiA4MCxcbiAgICB9KTtcblxuICAgIG5ldyBlY3NQYXR0ZXJucy5OZXR3b3JrTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2syLCAnRmFyZ2F0ZU5MQlNlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyOiBjbHVzdGVyMixcbiAgICAgIGxvYWRCYWxhbmNlcjogbmxiMixcbiAgICAgIGRlc2lyZWRDb3VudDogMSxcbiAgICAgIHRhc2tEZWZpbml0aW9uOiB0YXNrRGVmLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjazIpLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RUNTOjpTZXJ2aWNlJywge1xuICAgICAgTGF1bmNoVHlwZTogJ0ZBUkdBVEUnLFxuICAgICAgTG9hZEJhbGFuY2VyczogW3tDb250YWluZXJOYW1lOiAnbXlDb250YWluZXInLCBDb250YWluZXJQb3J0OiA4MH1dLFxuICAgIH0pKTtcbiAgICBleHBlY3Qoc3RhY2syKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJykpO1xuICAgIGV4cGVjdChzdGFjazIpLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLCB7XG4gICAgICBMb2FkQmFsYW5jZXJBcm46IG5sYjIubG9hZEJhbGFuY2VyQXJuLFxuICAgICAgUG9ydDogODAsXG4gICAgfSkpO1xuXG4gICAgdGVzdC5kb25lKCk7XG4gIH0sXG5cbiAgJ3Bhc3NpbmcgaW4gcHJldmlvdXNseSBjcmVhdGVkIGFwcGxpY2F0aW9uIGxvYWQgYmFsYW5jZXIgdG8gQUxCIEZhcmdhdGUgU2VydmljZScodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjLCBjbHVzdGVyTmFtZTogJ015Q2x1c3RlcicgfSk7XG4gICAgY29uc3Qgc2cgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTZWN1cml0eUdyb3VwJywgeyB2cGMgfSk7XG4gICAgY2x1c3Rlci5jb25uZWN0aW9ucy5hZGRTZWN1cml0eUdyb3VwKHNnKTtcbiAgICBjb25zdCBhbGIgPSBuZXcgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdBTEInLCB7IHZwYywgc2VjdXJpdHlHcm91cDogc2cgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjc1BhdHRlcm5zLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGxvYWRCYWxhbmNlcjogYWxiLFxuICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZSgnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICBMYXVuY2hUeXBlOiAnRkFSR0FURScsXG4gICAgfSkpO1xuICAgIGV4cGVjdChzdGFjaykudG8oaGF2ZVJlc291cmNlTGlrZSgnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMb2FkQmFsYW5jZXInLCB7XG4gICAgICBUeXBlOiAnYXBwbGljYXRpb24nLFxuICAgIH0pKTtcbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxuICAncGFzc2luZyBpbiBpbXBvcnRlZCBhcHBsaWNhdGlvbiBsb2FkIGJhbGFuY2VyIGFuZCByZXNvdXJjZXMgdG8gQUxCIEZhcmdhdGUgU2VydmljZScodGVzdDogVGVzdCkge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFsYkFybiA9ICdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOjowMDAwMDAwMDAwMDA6OmR1bW15bG9hZGJhbGFuY2VyJztcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjazEsICdWcGMnKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrMSwgJ0NsdXN0ZXInLCB7IHZwYywgY2x1c3Rlck5hbWU6ICdNeUNsdXN0ZXJOYW1lJyB9KTtcbiAgICBjb25zdCBzZyA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cChzdGFjazEsICdTZWN1cml0eUdyb3VwJywgeyB2cGMgfSk7XG4gICAgY2x1c3Rlci5jb25uZWN0aW9ucy5hZGRTZWN1cml0eUdyb3VwKHNnKTtcbiAgICBjb25zdCBhbGIgPSBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlci5mcm9tQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJBdHRyaWJ1dGVzKHN0YWNrMSwgJ0FMQicsIHtcbiAgICAgIGxvYWRCYWxhbmNlckFybjogYWxiQXJuLFxuICAgICAgdnBjLFxuICAgICAgc2VjdXJpdHlHcm91cElkOiBzZy5zZWN1cml0eUdyb3VwSWQsXG4gICAgICBsb2FkQmFsYW5jZXJEbnNOYW1lOiAnTXlEbnNOYW1lJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB0YXNrRGVmID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2sxLCAnVGFza0RlZicsIHtcbiAgICAgIGNwdTogMTAyNCxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgIH0pO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWYuYWRkQ29udGFpbmVyKCdDb250YWluZXInLCAge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgfSk7XG4gICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7XG4gICAgICBjb250YWluZXJQb3J0OiA4MCxcbiAgICB9KTtcblxuICAgIG5ldyBlY3NQYXR0ZXJucy5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlZEZhcmdhdGVTZXJ2aWNlKHN0YWNrMSwgJ0ZhcmdhdGVBTEJTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGxvYWRCYWxhbmNlcjogYWxiLFxuICAgICAgZGVzaXJlZENvdW50OiAxLFxuICAgICAgdGFza0RlZmluaXRpb246IHRhc2tEZWYsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrMSkudG8oaGF2ZVJlc291cmNlTGlrZSgnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICBMYXVuY2hUeXBlOiAnRkFSR0FURScsXG4gICAgICBMb2FkQmFsYW5jZXJzOiBbe0NvbnRhaW5lck5hbWU6ICdDb250YWluZXInLCBDb250YWluZXJQb3J0OiA4MH1dLFxuICAgIH0pKTtcbiAgICBleHBlY3Qoc3RhY2sxKS50byhoYXZlUmVzb3VyY2VMaWtlKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6OlRhcmdldEdyb3VwJykpO1xuICAgIGV4cGVjdChzdGFjazEpLnRvKGhhdmVSZXNvdXJjZUxpa2UoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLCB7XG4gICAgICBMb2FkQmFsYW5jZXJBcm46IGFsYi5sb2FkQmFsYW5jZXJBcm4sXG4gICAgICBQb3J0OiA4MCxcbiAgICB9KSk7XG5cbiAgICB0ZXN0LmRvbmUoKTtcbiAgfSxcblxufTsiXX0=
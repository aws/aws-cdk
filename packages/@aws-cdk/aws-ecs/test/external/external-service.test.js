"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const autoscaling = require("@aws-cdk/aws-autoscaling");
const ec2 = require("@aws-cdk/aws-ec2");
const elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
const cloudmap = require("@aws-cdk/aws-servicediscovery");
const cdk = require("@aws-cdk/core");
const ecs = require("../../lib");
const base_service_1 = require("../../lib/base/base-service");
const util_1 = require("../util");
describe('external service', () => {
    describe('When creating an External Service', () => {
        test('with only required properties set, it correctly sets default properties', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, 'MyVpc', {});
            const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
            util_1.addDefaultCapacityProvider(cluster, stack, vpc);
            const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef');
            taskDefinition.addContainer('web', {
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
                memoryLimitMiB: 512,
            });
            const service = new ecs.ExternalService(stack, 'ExternalService', {
                cluster,
                taskDefinition,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
                TaskDefinition: {
                    Ref: 'ExternalTaskDef6CCBDB87',
                },
                Cluster: {
                    Ref: 'EcsCluster97242B84',
                },
                DeploymentConfiguration: {
                    MaximumPercent: 100,
                    MinimumHealthyPercent: 0,
                },
                EnableECSManagedTags: false,
                LaunchType: base_service_1.LaunchType.EXTERNAL,
            });
            expect(service.node.defaultChild).toBeDefined();
        });
    });
    test('with all properties set', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        util_1.addDefaultCapacityProvider(cluster, stack, vpc);
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef');
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 512,
        });
        // WHEN
        new ecs.ExternalService(stack, 'ExternalService', {
            cluster,
            taskDefinition,
            desiredCount: 2,
            healthCheckGracePeriod: cdk.Duration.seconds(60),
            maxHealthyPercent: 150,
            minHealthyPercent: 55,
            securityGroups: [new ec2.SecurityGroup(stack, 'SecurityGroup1', {
                    allowAllOutbound: true,
                    description: 'Example',
                    securityGroupName: 'Bob',
                    vpc,
                })],
            serviceName: 'bonjour',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
            TaskDefinition: {
                Ref: 'ExternalTaskDef6CCBDB87',
            },
            Cluster: {
                Ref: 'EcsCluster97242B84',
            },
            DeploymentConfiguration: {
                MaximumPercent: 150,
                MinimumHealthyPercent: 55,
            },
            DesiredCount: 2,
            LaunchType: base_service_1.LaunchType.EXTERNAL,
            ServiceName: 'bonjour',
        });
    });
    test('with cloudmap set on cluster, throw error', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        util_1.addDefaultCapacityProvider(cluster, stack, vpc);
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef');
        cluster.addDefaultCloudMapNamespace({
            name: 'foo.com',
            type: cloudmap.NamespaceType.DNS_PRIVATE,
        });
        // THEN
        expect(() => new ecs.ExternalService(stack, 'ExternalService', {
            cluster,
            taskDefinition,
            desiredCount: 2,
            healthCheckGracePeriod: cdk.Duration.seconds(60),
            maxHealthyPercent: 150,
            minHealthyPercent: 55,
            securityGroups: [new ec2.SecurityGroup(stack, 'SecurityGroup1', {
                    allowAllOutbound: true,
                    description: 'Example',
                    securityGroupName: 'Bob',
                    vpc,
                })],
            serviceName: 'bonjour',
        })).toThrow('Cloud map integration is not supported for External service');
    });
    test('with multiple security groups, it correctly updates the cfn template', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        util_1.addDefaultCapacityProvider(cluster, stack, vpc);
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef');
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 512,
        });
        const securityGroup1 = new ec2.SecurityGroup(stack, 'SecurityGroup1', {
            allowAllOutbound: true,
            description: 'Example',
            securityGroupName: 'Bingo',
            vpc,
        });
        const securityGroup2 = new ec2.SecurityGroup(stack, 'SecurityGroup2', {
            allowAllOutbound: false,
            description: 'Example',
            securityGroupName: 'Rolly',
            vpc,
        });
        // WHEN
        new ecs.ExternalService(stack, 'ExternalService', {
            cluster,
            taskDefinition,
            desiredCount: 2,
            securityGroups: [securityGroup1, securityGroup2],
            serviceName: 'bonjour',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
            TaskDefinition: {
                Ref: 'ExternalTaskDef6CCBDB87',
            },
            Cluster: {
                Ref: 'EcsCluster97242B84',
            },
            DesiredCount: 2,
            LaunchType: base_service_1.LaunchType.EXTERNAL,
            ServiceName: 'bonjour',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
            GroupDescription: 'Example',
            GroupName: 'Bingo',
            SecurityGroupEgress: [
                {
                    CidrIp: '0.0.0.0/0',
                    Description: 'Allow all outbound traffic by default',
                    IpProtocol: '-1',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
            GroupDescription: 'Example',
            GroupName: 'Rolly',
            SecurityGroupEgress: [
                {
                    CidrIp: '255.255.255.255/32',
                    Description: 'Disallow all traffic',
                    FromPort: 252,
                    IpProtocol: 'icmp',
                    ToPort: 86,
                },
            ],
        });
    });
    test('throws when task definition is not External compatible', () => {
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        const taskDefinition = new ecs.TaskDefinition(stack, 'FargateTaskDef', {
            compatibility: ecs.Compatibility.FARGATE,
            cpu: '256',
            memoryMiB: '512',
        });
        taskDefinition.addContainer('BaseContainer', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryReservationMiB: 10,
        });
        expect(() => new ecs.ExternalService(stack, 'ExternalService', {
            cluster,
            taskDefinition,
        })).toThrow('Supplied TaskDefinition is not configured for compatibility with ECS Anywhere cluster');
    });
    test('errors if minimum not less than maximum', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        util_1.addDefaultCapacityProvider(cluster, stack, vpc);
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef');
        taskDefinition.addContainer('BaseContainer', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryReservationMiB: 10,
        });
        // THEN
        expect(() => new ecs.ExternalService(stack, 'ExternalService', {
            cluster,
            taskDefinition,
            minHealthyPercent: 100,
            maxHealthyPercent: 100,
        })).toThrow('Minimum healthy percent must be less than maximum healthy percent.');
    });
    test('error if cloudmap options provided with external service', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        util_1.addDefaultCapacityProvider(cluster, stack, vpc);
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'TaskDef');
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 512,
        });
        // THEN
        expect(() => new ecs.ExternalService(stack, 'ExternalService', {
            cluster,
            taskDefinition,
            cloudMapOptions: {
                name: 'myApp',
            },
        })).toThrow('Cloud map options are not supported for External service');
        // THEN
    });
    test('error if enableExecuteCommand options provided with external service', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        util_1.addDefaultCapacityProvider(cluster, stack, vpc);
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'TaskDef');
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 512,
        });
        // THEN
        expect(() => new ecs.ExternalService(stack, 'ExternalService', {
            cluster,
            taskDefinition,
            enableExecuteCommand: true,
        })).toThrow('Enable Execute Command options are not supported for External service');
        // THEN
    });
    test('error if capacityProviderStrategies options provided with external service', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        util_1.addDefaultCapacityProvider(cluster, stack, vpc);
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'TaskDef');
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 512,
        });
        // WHEN
        const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
            vpc,
            instanceType: new ec2.InstanceType('bogus'),
            machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
        });
        const capacityProvider = new ecs.AsgCapacityProvider(stack, 'provider', {
            autoScalingGroup,
            enableManagedTerminationProtection: false,
        });
        // THEN
        expect(() => new ecs.ExternalService(stack, 'ExternalService', {
            cluster,
            taskDefinition,
            capacityProviderStrategies: [{
                    capacityProvider: capacityProvider.capacityProviderName,
                }],
        })).toThrow('Capacity Providers are not supported for External service');
        // THEN
    });
    test('error when performing attachToApplicationTargetGroup to an external service', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        util_1.addDefaultCapacityProvider(cluster, stack, vpc);
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'TaskDef');
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 512,
        });
        const service = new ecs.ExternalService(stack, 'ExternalService', {
            cluster,
            taskDefinition,
        });
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
        const listener = lb.addListener('listener', { port: 80 });
        const targetGroup = listener.addTargets('target', {
            port: 80,
        });
        // THEN
        expect(() => service.attachToApplicationTargetGroup(targetGroup)).toThrow('Application load balancer cannot be attached to an external service');
        // THEN
    });
    test('error when performing loadBalancerTarget to an external service', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        util_1.addDefaultCapacityProvider(cluster, stack, vpc);
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'TaskDef');
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 512,
        });
        const service = new ecs.ExternalService(stack, 'ExternalService', {
            cluster,
            taskDefinition,
        });
        // THEN
        expect(() => service.loadBalancerTarget({
            containerName: 'MainContainer',
        })).toThrow('External service cannot be attached as load balancer targets');
        // THEN
    });
    test('error when performing registerLoadBalancerTargets to an external service', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        util_1.addDefaultCapacityProvider(cluster, stack, vpc);
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'TaskDef');
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 512,
        });
        const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
        const listener = lb.addListener('listener', { port: 80 });
        const service = new ecs.ExternalService(stack, 'ExternalService', {
            cluster,
            taskDefinition,
        });
        // THEN
        expect(() => service.registerLoadBalancerTargets({
            containerName: 'MainContainer',
            containerPort: 8000,
            listener: ecs.ListenerConfig.applicationListener(listener),
            newTargetGroupId: 'target1',
        })).toThrow('External service cannot be registered as load balancer targets');
        // THEN
    });
    test('error when performing autoScaleTaskCount to an external service', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        util_1.addDefaultCapacityProvider(cluster, stack, vpc);
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'TaskDef');
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 512,
        });
        const service = new ecs.ExternalService(stack, 'ExternalService', {
            cluster,
            taskDefinition,
        });
        // THEN
        expect(() => service.autoScaleTaskCount({
            maxCapacity: 2,
            minCapacity: 1,
        })).toThrow('Autoscaling not supported for external service');
        // THEN
    });
    test('error when performing enableCloudMap to an external service', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        util_1.addDefaultCapacityProvider(cluster, stack, vpc);
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'TaskDef');
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 512,
        });
        const service = new ecs.ExternalService(stack, 'ExternalService', {
            cluster,
            taskDefinition,
        });
        // THEN
        expect(() => service.enableCloudMap({})).toThrow('Cloud map integration not supported for an external service');
        // THEN
    });
    test('error when performing associateCloudMapService to an external service', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        util_1.addDefaultCapacityProvider(cluster, stack, vpc);
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'TaskDef');
        const container = taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 512,
        });
        const service = new ecs.ExternalService(stack, 'ExternalService', {
            cluster,
            taskDefinition,
        });
        const cloudMapNamespace = new cloudmap.PrivateDnsNamespace(stack, 'TestCloudMapNamespace', {
            name: 'scorekeep.com',
            vpc,
        });
        const cloudMapService = new cloudmap.Service(stack, 'Service', {
            name: 'service-name',
            namespace: cloudMapNamespace,
            dnsRecordType: cloudmap.DnsRecordType.SRV,
        });
        // THEN
        expect(() => service.associateCloudMapService({
            service: cloudMapService,
            container: container,
            containerPort: 8000,
        })).toThrow('Cloud map service association is not supported for an external service');
    });
    test('add warning to annotations if circuitBreaker is specified with a non-ECS DeploymentControllerType', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc', {});
        const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
        util_1.addDefaultCapacityProvider(cluster, stack, vpc);
        const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'TaskDef');
        taskDefinition.addContainer('web', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            memoryLimitMiB: 512,
        });
        const service = new ecs.ExternalService(stack, 'ExternalService', {
            cluster,
            taskDefinition,
            deploymentController: {
                type: base_service_1.DeploymentControllerType.EXTERNAL,
            },
            circuitBreaker: { rollback: true },
        });
        // THEN
        expect(service.node.metadata[0].data).toEqual('taskDefinition and launchType are blanked out when using external deployment controller.');
        expect(service.node.metadata[1].data).toEqual('Deployment circuit breaker requires the ECS deployment controller.');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZXJuYWwtc2VydmljZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXh0ZXJuYWwtc2VydmljZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdEQUF3RDtBQUN4RCx3Q0FBd0M7QUFDeEMsNkRBQTZEO0FBQzdELDBEQUEwRDtBQUMxRCxxQ0FBcUM7QUFDckMsaUNBQWlDO0FBQ2pDLDhEQUFtRjtBQUNuRixrQ0FBcUQ7QUFFckQsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUNoQyxRQUFRLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBQ2pELElBQUksQ0FBQyx5RUFBeUUsRUFBRSxHQUFHLEVBQUU7WUFDbkYsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUM5RCxpQ0FBMEIsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2hELE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBRWhGLGNBQWMsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFO2dCQUNqQyxLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUM7Z0JBQ2xFLGNBQWMsRUFBRSxHQUFHO2FBQ3BCLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFL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LE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM5RCxpQ0FBMEIsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUV4RSxjQUFjLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRTtZQUNqQyxLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUM7WUFDbEUsY0FBYyxFQUFFLEdBQUc7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRTtZQUNoRSxPQUFPO1lBQ1AsY0FBYztZQUNkLG9CQUFvQixFQUFFO2dCQUNwQixJQUFJLEVBQUUsdUNBQXdCLENBQUMsUUFBUTthQUN4QztZQUNELGNBQWMsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsMEZBQTBGLENBQUMsQ0FBQztRQUMxSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLG9FQUFvRSxDQUFDLENBQUM7SUFFdEgsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBhdXRvc2NhbGluZyBmcm9tICdAYXdzLWNkay9hd3MtYXV0b3NjYWxpbmcnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWxidjIgZnJvbSAnQGF3cy1jZGsvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjInO1xuaW1wb3J0ICogYXMgY2xvdWRtYXAgZnJvbSAnQGF3cy1jZGsvYXdzLXNlcnZpY2VkaXNjb3ZlcnknO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJy4uLy4uL2xpYic7XG5pbXBvcnQgeyBEZXBsb3ltZW50Q29udHJvbGxlclR5cGUsIExhdW5jaFR5cGUgfSBmcm9tICcuLi8uLi9saWIvYmFzZS9iYXNlLXNlcnZpY2UnO1xuaW1wb3J0IHsgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIgfSBmcm9tICcuLi91dGlsJztcblxuZGVzY3JpYmUoJ2V4dGVybmFsIHNlcnZpY2UnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdXaGVuIGNyZWF0aW5nIGFuIEV4dGVybmFsIFNlcnZpY2UnLCAoKSA9PiB7XG4gICAgdGVzdCgnd2l0aCBvbmx5IHJlcXVpcmVkIHByb3BlcnRpZXMgc2V0LCBpdCBjb3JyZWN0bHkgc2V0cyBkZWZhdWx0IHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkV4dGVybmFsVGFza0RlZmluaXRpb24oc3RhY2ssICdFeHRlcm5hbFRhc2tEZWYnKTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5FeHRlcm5hbFNlcnZpY2Uoc3RhY2ssICdFeHRlcm5hbFNlcnZpY2UnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgICAgVGFza0RlZmluaXRpb246IHtcbiAgICAgICAgICBSZWY6ICdFeHRlcm5hbFRhc2tEZWY2Q0NCREI4NycsXG4gICAgICAgIH0sXG4gICAgICAgIENsdXN0ZXI6IHtcbiAgICAgICAgICBSZWY6ICdFY3NDbHVzdGVyOTcyNDJCODQnLFxuICAgICAgICB9LFxuICAgICAgICBEZXBsb3ltZW50Q29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIE1heGltdW1QZXJjZW50OiAxMDAsXG4gICAgICAgICAgTWluaW11bUhlYWx0aHlQZXJjZW50OiAwLFxuICAgICAgICB9LFxuICAgICAgICBFbmFibGVFQ1NNYW5hZ2VkVGFnczogZmFsc2UsXG4gICAgICAgIExhdW5jaFR5cGU6IExhdW5jaFR5cGUuRVhURVJOQUwsXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KHNlcnZpY2Uubm9kZS5kZWZhdWx0Q2hpbGQpLnRvQmVEZWZpbmVkKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggYWxsIHByb3BlcnRpZXMgc2V0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FeHRlcm5hbFRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRXh0ZXJuYWxUYXNrRGVmJyk7XG5cbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjcy5FeHRlcm5hbFNlcnZpY2Uoc3RhY2ssICdFeHRlcm5hbFNlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICBkZXNpcmVkQ291bnQ6IDIsXG4gICAgICBoZWFsdGhDaGVja0dyYWNlUGVyaW9kOiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MCksXG4gICAgICBtYXhIZWFsdGh5UGVyY2VudDogMTUwLFxuICAgICAgbWluSGVhbHRoeVBlcmNlbnQ6IDU1LFxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTZWN1cml0eUdyb3VwMScsIHtcbiAgICAgICAgYWxsb3dBbGxPdXRib3VuZDogdHJ1ZSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdFeGFtcGxlJyxcbiAgICAgICAgc2VjdXJpdHlHcm91cE5hbWU6ICdCb2InLFxuICAgICAgICB2cGMsXG4gICAgICB9KV0sXG4gICAgICBzZXJ2aWNlTmFtZTogJ2JvbmpvdXInLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICAgIFRhc2tEZWZpbml0aW9uOiB7XG4gICAgICAgIFJlZjogJ0V4dGVybmFsVGFza0RlZjZDQ0JEQjg3JyxcbiAgICAgIH0sXG4gICAgICBDbHVzdGVyOiB7XG4gICAgICAgIFJlZjogJ0Vjc0NsdXN0ZXI5NzI0MkI4NCcsXG4gICAgICB9LFxuICAgICAgRGVwbG95bWVudENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgTWF4aW11bVBlcmNlbnQ6IDE1MCxcbiAgICAgICAgTWluaW11bUhlYWx0aHlQZXJjZW50OiA1NSxcbiAgICAgIH0sXG4gICAgICBEZXNpcmVkQ291bnQ6IDIsXG4gICAgICBMYXVuY2hUeXBlOiBMYXVuY2hUeXBlLkVYVEVSTkFMLFxuICAgICAgU2VydmljZU5hbWU6ICdib25qb3VyJyxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggY2xvdWRtYXAgc2V0IG9uIGNsdXN0ZXIsIHRocm93IGVycm9yJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FeHRlcm5hbFRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRXh0ZXJuYWxUYXNrRGVmJyk7XG5cbiAgICBjbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSh7XG4gICAgICBuYW1lOiAnZm9vLmNvbScsXG4gICAgICB0eXBlOiBjbG91ZG1hcC5OYW1lc3BhY2VUeXBlLkROU19QUklWQVRFLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgZWNzLkV4dGVybmFsU2VydmljZShzdGFjaywgJ0V4dGVybmFsU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIGRlc2lyZWRDb3VudDogMixcbiAgICAgIGhlYWx0aENoZWNrR3JhY2VQZXJpb2Q6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDYwKSxcbiAgICAgIG1heEhlYWx0aHlQZXJjZW50OiAxNTAsXG4gICAgICBtaW5IZWFsdGh5UGVyY2VudDogNTUsXG4gICAgICBzZWN1cml0eUdyb3VwczogW25ldyBlYzIuU2VjdXJpdHlHcm91cChzdGFjaywgJ1NlY3VyaXR5R3JvdXAxJywge1xuICAgICAgICBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0V4YW1wbGUnLFxuICAgICAgICBzZWN1cml0eUdyb3VwTmFtZTogJ0JvYicsXG4gICAgICAgIHZwYyxcbiAgICAgIH0pXSxcbiAgICAgIHNlcnZpY2VOYW1lOiAnYm9uam91cicsXG4gICAgfSkpLnRvVGhyb3coJ0Nsb3VkIG1hcCBpbnRlZ3JhdGlvbiBpcyBub3Qgc3VwcG9ydGVkIGZvciBFeHRlcm5hbCBzZXJ2aWNlJyApO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBtdWx0aXBsZSBzZWN1cml0eSBncm91cHMsIGl0IGNvcnJlY3RseSB1cGRhdGVzIHRoZSBjZm4gdGVtcGxhdGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkV4dGVybmFsVGFza0RlZmluaXRpb24oc3RhY2ssICdFeHRlcm5hbFRhc2tEZWYnKTtcbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgfSk7XG4gICAgY29uc3Qgc2VjdXJpdHlHcm91cDEgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTZWN1cml0eUdyb3VwMScsIHtcbiAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXG4gICAgICBkZXNjcmlwdGlvbjogJ0V4YW1wbGUnLFxuICAgICAgc2VjdXJpdHlHcm91cE5hbWU6ICdCaW5nbycsXG4gICAgICB2cGMsXG4gICAgfSk7XG4gICAgY29uc3Qgc2VjdXJpdHlHcm91cDIgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTZWN1cml0eUdyb3VwMicsIHtcbiAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246ICdFeGFtcGxlJyxcbiAgICAgIHNlY3VyaXR5R3JvdXBOYW1lOiAnUm9sbHknLFxuICAgICAgdnBjLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3MuRXh0ZXJuYWxTZXJ2aWNlKHN0YWNrLCAnRXh0ZXJuYWxTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgZGVzaXJlZENvdW50OiAyLFxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtzZWN1cml0eUdyb3VwMSwgc2VjdXJpdHlHcm91cDJdLFxuICAgICAgc2VydmljZU5hbWU6ICdib25qb3VyJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCB7XG4gICAgICBUYXNrRGVmaW5pdGlvbjoge1xuICAgICAgICBSZWY6ICdFeHRlcm5hbFRhc2tEZWY2Q0NCREI4NycsXG4gICAgICB9LFxuICAgICAgQ2x1c3Rlcjoge1xuICAgICAgICBSZWY6ICdFY3NDbHVzdGVyOTcyNDJCODQnLFxuICAgICAgfSxcbiAgICAgIERlc2lyZWRDb3VudDogMixcbiAgICAgIExhdW5jaFR5cGU6IExhdW5jaFR5cGUuRVhURVJOQUwsXG4gICAgICBTZXJ2aWNlTmFtZTogJ2JvbmpvdXInLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgR3JvdXBEZXNjcmlwdGlvbjogJ0V4YW1wbGUnLFxuICAgICAgR3JvdXBOYW1lOiAnQmluZ28nLFxuICAgICAgU2VjdXJpdHlHcm91cEVncmVzczogW1xuICAgICAgICB7XG4gICAgICAgICAgQ2lkcklwOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgICBEZXNjcmlwdGlvbjogJ0FsbG93IGFsbCBvdXRib3VuZCB0cmFmZmljIGJ5IGRlZmF1bHQnLFxuICAgICAgICAgIElwUHJvdG9jb2w6ICctMScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgICAgR3JvdXBEZXNjcmlwdGlvbjogJ0V4YW1wbGUnLFxuICAgICAgR3JvdXBOYW1lOiAnUm9sbHknLFxuICAgICAgU2VjdXJpdHlHcm91cEVncmVzczogW1xuICAgICAgICB7XG4gICAgICAgICAgQ2lkcklwOiAnMjU1LjI1NS4yNTUuMjU1LzMyJyxcbiAgICAgICAgICBEZXNjcmlwdGlvbjogJ0Rpc2FsbG93IGFsbCB0cmFmZmljJyxcbiAgICAgICAgICBGcm9tUG9ydDogMjUyLFxuICAgICAgICAgIElwUHJvdG9jb2w6ICdpY21wJyxcbiAgICAgICAgICBUb1BvcnQ6IDg2LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIHRhc2sgZGVmaW5pdGlvbiBpcyBub3QgRXh0ZXJuYWwgY29tcGF0aWJsZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRmFyZ2F0ZVRhc2tEZWYnLCB7XG4gICAgICBjb21wYXRpYmlsaXR5OiBlY3MuQ29tcGF0aWJpbGl0eS5GQVJHQVRFLFxuICAgICAgY3B1OiAnMjU2JyxcbiAgICAgIG1lbW9yeU1pQjogJzUxMicsXG4gICAgfSk7XG4gICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdCYXNlQ29udGFpbmVyJywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgIG1lbW9yeVJlc2VydmF0aW9uTWlCOiAxMCxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgZWNzLkV4dGVybmFsU2VydmljZShzdGFjaywgJ0V4dGVybmFsU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICB9KSkudG9UaHJvdygnU3VwcGxpZWQgVGFza0RlZmluaXRpb24gaXMgbm90IGNvbmZpZ3VyZWQgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBFQ1MgQW55d2hlcmUgY2x1c3RlcicpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnZXJyb3JzIGlmIG1pbmltdW0gbm90IGxlc3MgdGhhbiBtYXhpbXVtJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FeHRlcm5hbFRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRXh0ZXJuYWxUYXNrRGVmJyk7XG4gICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdCYXNlQ29udGFpbmVyJywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgIG1lbW9yeVJlc2VydmF0aW9uTWlCOiAxMCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gbmV3IGVjcy5FeHRlcm5hbFNlcnZpY2Uoc3RhY2ssICdFeHRlcm5hbFNlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICBtaW5IZWFsdGh5UGVyY2VudDogMTAwLFxuICAgICAgbWF4SGVhbHRoeVBlcmNlbnQ6IDEwMCxcbiAgICB9KSkudG9UaHJvdygnTWluaW11bSBoZWFsdGh5IHBlcmNlbnQgbXVzdCBiZSBsZXNzIHRoYW4gbWF4aW11bSBoZWFsdGh5IHBlcmNlbnQuJyk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdlcnJvciBpZiBjbG91ZG1hcCBvcHRpb25zIHByb3ZpZGVkIHdpdGggZXh0ZXJuYWwgc2VydmljZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRXh0ZXJuYWxUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcblxuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gbmV3IGVjcy5FeHRlcm5hbFNlcnZpY2Uoc3RhY2ssICdFeHRlcm5hbFNlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICBjbG91ZE1hcE9wdGlvbnM6IHtcbiAgICAgICAgbmFtZTogJ215QXBwJyxcbiAgICAgIH0sXG4gICAgfSkpLnRvVGhyb3coJ0Nsb3VkIG1hcCBvcHRpb25zIGFyZSBub3Qgc3VwcG9ydGVkIGZvciBFeHRlcm5hbCBzZXJ2aWNlJyk7XG5cbiAgICAvLyBUSEVOXG5cbiAgfSk7XG5cbiAgdGVzdCgnZXJyb3IgaWYgZW5hYmxlRXhlY3V0ZUNvbW1hbmQgb3B0aW9ucyBwcm92aWRlZCB3aXRoIGV4dGVybmFsIHNlcnZpY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkV4dGVybmFsVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG5cbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBlY3MuRXh0ZXJuYWxTZXJ2aWNlKHN0YWNrLCAnRXh0ZXJuYWxTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgZW5hYmxlRXhlY3V0ZUNvbW1hbmQ6IHRydWUsXG4gICAgfSkpLnRvVGhyb3coJ0VuYWJsZSBFeGVjdXRlIENvbW1hbmQgb3B0aW9ucyBhcmUgbm90IHN1cHBvcnRlZCBmb3IgRXh0ZXJuYWwgc2VydmljZScpO1xuXG4gICAgLy8gVEhFTlxuXG4gIH0pO1xuXG4gIHRlc3QoJ2Vycm9yIGlmIGNhcGFjaXR5UHJvdmlkZXJTdHJhdGVnaWVzIG9wdGlvbnMgcHJvdmlkZWQgd2l0aCBleHRlcm5hbCBzZXJ2aWNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FeHRlcm5hbFRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuXG4gICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGF1dG9TY2FsaW5nR3JvdXAgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ2FzZycsIHtcbiAgICAgIHZwYyxcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2JvZ3VzJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IGVjcy5FY3NPcHRpbWl6ZWRJbWFnZS5hbWF6b25MaW51eDIoKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNhcGFjaXR5UHJvdmlkZXIgPSBuZXcgZWNzLkFzZ0NhcGFjaXR5UHJvdmlkZXIoc3RhY2ssICdwcm92aWRlcicsIHtcbiAgICAgIGF1dG9TY2FsaW5nR3JvdXAsXG4gICAgICBlbmFibGVNYW5hZ2VkVGVybWluYXRpb25Qcm90ZWN0aW9uOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gbmV3IGVjcy5FeHRlcm5hbFNlcnZpY2Uoc3RhY2ssICdFeHRlcm5hbFNlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICBjYXBhY2l0eVByb3ZpZGVyU3RyYXRlZ2llczogW3tcbiAgICAgICAgY2FwYWNpdHlQcm92aWRlcjogY2FwYWNpdHlQcm92aWRlci5jYXBhY2l0eVByb3ZpZGVyTmFtZSxcbiAgICAgIH1dLFxuICAgIH0pKS50b1Rocm93KCdDYXBhY2l0eSBQcm92aWRlcnMgYXJlIG5vdCBzdXBwb3J0ZWQgZm9yIEV4dGVybmFsIHNlcnZpY2UnKTtcblxuICAgIC8vIFRIRU5cblxuICB9KTtcblxuICB0ZXN0KCdlcnJvciB3aGVuIHBlcmZvcm1pbmcgYXR0YWNoVG9BcHBsaWNhdGlvblRhcmdldEdyb3VwIHRvIGFuIGV4dGVybmFsIHNlcnZpY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkV4dGVybmFsVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG5cbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5FeHRlcm5hbFNlcnZpY2Uoc3RhY2ssICdFeHRlcm5hbFNlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgfSk7XG5cbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ2xiJywgeyB2cGMgfSk7XG4gICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignbGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuICAgIGNvbnN0IHRhcmdldEdyb3VwID0gbGlzdGVuZXIuYWRkVGFyZ2V0cygndGFyZ2V0Jywge1xuICAgICAgcG9ydDogODAsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHNlcnZpY2UuYXR0YWNoVG9BcHBsaWNhdGlvblRhcmdldEdyb3VwKHRhcmdldEdyb3VwKSkudG9UaHJvdygnQXBwbGljYXRpb24gbG9hZCBiYWxhbmNlciBjYW5ub3QgYmUgYXR0YWNoZWQgdG8gYW4gZXh0ZXJuYWwgc2VydmljZScpO1xuXG4gICAgLy8gVEhFTlxuXG4gIH0pO1xuXG4gIHRlc3QoJ2Vycm9yIHdoZW4gcGVyZm9ybWluZyBsb2FkQmFsYW5jZXJUYXJnZXQgdG8gYW4gZXh0ZXJuYWwgc2VydmljZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRXh0ZXJuYWxUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcblxuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkV4dGVybmFsU2VydmljZShzdGFjaywgJ0V4dGVybmFsU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gc2VydmljZS5sb2FkQmFsYW5jZXJUYXJnZXQoe1xuICAgICAgY29udGFpbmVyTmFtZTogJ01haW5Db250YWluZXInLFxuICAgIH0pKS50b1Rocm93KCdFeHRlcm5hbCBzZXJ2aWNlIGNhbm5vdCBiZSBhdHRhY2hlZCBhcyBsb2FkIGJhbGFuY2VyIHRhcmdldHMnKTtcblxuICAgIC8vIFRIRU5cblxuICB9KTtcblxuICB0ZXN0KCdlcnJvciB3aGVuIHBlcmZvcm1pbmcgcmVnaXN0ZXJMb2FkQmFsYW5jZXJUYXJnZXRzIHRvIGFuIGV4dGVybmFsIHNlcnZpY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkV4dGVybmFsVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG5cbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgfSk7XG5cbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ2xiJywgeyB2cGMgfSk7XG4gICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignbGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkV4dGVybmFsU2VydmljZShzdGFjaywgJ0V4dGVybmFsU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gc2VydmljZS5yZWdpc3RlckxvYWRCYWxhbmNlclRhcmdldHMoXG4gICAgICB7XG4gICAgICAgIGNvbnRhaW5lck5hbWU6ICdNYWluQ29udGFpbmVyJyxcbiAgICAgICAgY29udGFpbmVyUG9ydDogODAwMCxcbiAgICAgICAgbGlzdGVuZXI6IGVjcy5MaXN0ZW5lckNvbmZpZy5hcHBsaWNhdGlvbkxpc3RlbmVyKGxpc3RlbmVyKSxcbiAgICAgICAgbmV3VGFyZ2V0R3JvdXBJZDogJ3RhcmdldDEnLFxuICAgICAgfSxcbiAgICApKS50b1Rocm93KCdFeHRlcm5hbCBzZXJ2aWNlIGNhbm5vdCBiZSByZWdpc3RlcmVkIGFzIGxvYWQgYmFsYW5jZXIgdGFyZ2V0cycpO1xuXG4gICAgLy8gVEhFTlxuXG4gIH0pO1xuXG4gIHRlc3QoJ2Vycm9yIHdoZW4gcGVyZm9ybWluZyBhdXRvU2NhbGVUYXNrQ291bnQgdG8gYW4gZXh0ZXJuYWwgc2VydmljZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRXh0ZXJuYWxUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcblxuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkV4dGVybmFsU2VydmljZShzdGFjaywgJ0V4dGVybmFsU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gc2VydmljZS5hdXRvU2NhbGVUYXNrQ291bnQoe1xuICAgICAgbWF4Q2FwYWNpdHk6IDIsXG4gICAgICBtaW5DYXBhY2l0eTogMSxcbiAgICB9KSkudG9UaHJvdygnQXV0b3NjYWxpbmcgbm90IHN1cHBvcnRlZCBmb3IgZXh0ZXJuYWwgc2VydmljZScpO1xuXG4gICAgLy8gVEhFTlxuXG4gIH0pO1xuXG4gIHRlc3QoJ2Vycm9yIHdoZW4gcGVyZm9ybWluZyBlbmFibGVDbG91ZE1hcCB0byBhbiBleHRlcm5hbCBzZXJ2aWNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycsIHt9KTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrLCB2cGMpO1xuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FeHRlcm5hbFRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuXG4gICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRXh0ZXJuYWxTZXJ2aWNlKHN0YWNrLCAnRXh0ZXJuYWxTZXJ2aWNlJywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBzZXJ2aWNlLmVuYWJsZUNsb3VkTWFwKHt9KSkudG9UaHJvdygnQ2xvdWQgbWFwIGludGVncmF0aW9uIG5vdCBzdXBwb3J0ZWQgZm9yIGFuIGV4dGVybmFsIHNlcnZpY2UnKTtcblxuICAgIC8vIFRIRU5cblxuICB9KTtcblxuICB0ZXN0KCdlcnJvciB3aGVuIHBlcmZvcm1pbmcgYXNzb2NpYXRlQ2xvdWRNYXBTZXJ2aWNlIHRvIGFuIGV4dGVybmFsIHNlcnZpY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJywge30pO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gICAgYWRkRGVmYXVsdENhcGFjaXR5UHJvdmlkZXIoY2x1c3Rlciwgc3RhY2ssIHZwYyk7XG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkV4dGVybmFsVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG5cbiAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5FeHRlcm5hbFNlcnZpY2Uoc3RhY2ssICdFeHRlcm5hbFNlcnZpY2UnLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgfSk7XG5cbiAgICBjb25zdCBjbG91ZE1hcE5hbWVzcGFjZSA9IG5ldyBjbG91ZG1hcC5Qcml2YXRlRG5zTmFtZXNwYWNlKHN0YWNrLCAnVGVzdENsb3VkTWFwTmFtZXNwYWNlJywge1xuICAgICAgbmFtZTogJ3Njb3Jla2VlcC5jb20nLFxuICAgICAgdnBjLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2xvdWRNYXBTZXJ2aWNlID0gbmV3IGNsb3VkbWFwLlNlcnZpY2Uoc3RhY2ssICdTZXJ2aWNlJywge1xuICAgICAgbmFtZTogJ3NlcnZpY2UtbmFtZScsXG4gICAgICBuYW1lc3BhY2U6IGNsb3VkTWFwTmFtZXNwYWNlLFxuICAgICAgZG5zUmVjb3JkVHlwZTogY2xvdWRtYXAuRG5zUmVjb3JkVHlwZS5TUlYsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHNlcnZpY2UuYXNzb2NpYXRlQ2xvdWRNYXBTZXJ2aWNlKHtcbiAgICAgIHNlcnZpY2U6IGNsb3VkTWFwU2VydmljZSxcbiAgICAgIGNvbnRhaW5lcjogY29udGFpbmVyLFxuICAgICAgY29udGFpbmVyUG9ydDogODAwMCxcbiAgICB9KSkudG9UaHJvdygnQ2xvdWQgbWFwIHNlcnZpY2UgYXNzb2NpYXRpb24gaXMgbm90IHN1cHBvcnRlZCBmb3IgYW4gZXh0ZXJuYWwgc2VydmljZScpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnYWRkIHdhcm5pbmcgdG8gYW5ub3RhdGlvbnMgaWYgY2lyY3VpdEJyZWFrZXIgaXMgc3BlY2lmaWVkIHdpdGggYSBub24tRUNTIERlcGxveW1lbnRDb250cm9sbGVyVHlwZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWcGMnLCB7fSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbiAgICBhZGREZWZhdWx0Q2FwYWNpdHlQcm92aWRlcihjbHVzdGVyLCBzdGFjaywgdnBjKTtcbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRXh0ZXJuYWxUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcblxuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignd2ViJywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkV4dGVybmFsU2VydmljZShzdGFjaywgJ0V4dGVybmFsU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgIGRlcGxveW1lbnRDb250cm9sbGVyOiB7XG4gICAgICAgIHR5cGU6IERlcGxveW1lbnRDb250cm9sbGVyVHlwZS5FWFRFUk5BTCxcbiAgICAgIH0sXG4gICAgICBjaXJjdWl0QnJlYWtlcjogeyByb2xsYmFjazogdHJ1ZSB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzZXJ2aWNlLm5vZGUubWV0YWRhdGFbMF0uZGF0YSkudG9FcXVhbCgndGFza0RlZmluaXRpb24gYW5kIGxhdW5jaFR5cGUgYXJlIGJsYW5rZWQgb3V0IHdoZW4gdXNpbmcgZXh0ZXJuYWwgZGVwbG95bWVudCBjb250cm9sbGVyLicpO1xuICAgIGV4cGVjdChzZXJ2aWNlLm5vZGUubWV0YWRhdGFbMV0uZGF0YSkudG9FcXVhbCgnRGVwbG95bWVudCBjaXJjdWl0IGJyZWFrZXIgcmVxdWlyZXMgdGhlIEVDUyBkZXBsb3ltZW50IGNvbnRyb2xsZXIuJyk7XG5cbiAgfSk7XG59KTtcbiJdfQ==
import { expect, haveResource, haveResourceLike, SynthUtils } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancer, ApplicationProtocol, NetworkLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ecsPatterns from '../../lib';

export = {
  'setting loadBalancerType to Network creates an NLB'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app")
      },
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Type: 'network'
    }));

    test.done();
  },

  'setting vpc and cluster throws error'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    test.throws(() => new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      vpc,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app")
      },
    }));

    test.done();
  },

  'setting executionRole updated taskDefinition with given execution role'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    const executionRole = new iam.Role(stack, 'ExecutionRole', {
      path: '/',
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal("ecs.amazonaws.com"),
        new iam.ServicePrincipal("ecs-tasks.amazonaws.com")
      )
    });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
        executionRole
      },
    });

    // THEN
    const serviceTaskDefinition = SynthUtils.synthesize(stack).template.Resources.ServiceTaskDef1922A00F;
    test.deepEqual(serviceTaskDefinition.Properties.ExecutionRoleArn, { 'Fn::GetAtt': ['ExecutionRole605A040B', 'Arn'] });
    test.done();
  },

  'setting taskRole updated taskDefinition with given task role'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    const taskRole = new iam.Role(stack, 'taskRoleTest', {
      path: '/',
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal("ecs.amazonaws.com"),
        new iam.ServicePrincipal("ecs-tasks.amazonaws.com")
      )
    });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
        taskRole
      },
    });

    // THEN
    const serviceTaskDefinition = SynthUtils.synthesize(stack).template.Resources.ServiceTaskDef1922A00F;
    test.deepEqual(serviceTaskDefinition.Properties.TaskRoleArn, { 'Fn::GetAtt': ['taskRoleTest9DA66B6E', 'Arn'] });
    test.done();
  },

  'setting containerName updates container name with given name'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
        containerName: 'bob'
      },
    });

    // THEN
    const serviceTaskDefinition = SynthUtils.synthesize(stack).template.Resources.ServiceTaskDef1922A00F;
    test.deepEqual(serviceTaskDefinition.Properties.ContainerDefinitions[0].Name, 'bob');
    test.done();
  },

  'not setting containerName updates container name with default'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
      },
    });

    // THEN
    const serviceTaskDefinition = SynthUtils.synthesize(stack).template.Resources.ServiceTaskDef1922A00F;
    test.deepEqual(serviceTaskDefinition.Properties.ContainerDefinitions[0].Name, 'web');
    test.done();
  },

  'setting servicename updates service name with given name'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
      },
      serviceName: 'bob',
    });
    // THEN
    const serviceTaskDefinition = SynthUtils.synthesize(stack).template.Resources.Service9571FDD8;
    test.deepEqual(serviceTaskDefinition.Properties.ServiceName, 'bob');
    test.done();
  },

  'not setting servicename updates service name with default'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
      },
    });

    // THEN
    const serviceTaskDefinition = SynthUtils.synthesize(stack).template.Resources.Service9571FDD8;
    test.equal(serviceTaskDefinition.Properties.ServiceName, undefined);
    test.done();
  },

  'setting healthCheckGracePeriod works'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
      },
      healthCheckGracePeriod: cdk.Duration.seconds(600),
    });
    // THEN
    const serviceTaskDefinition = SynthUtils.synthesize(stack).template.Resources.Service9571FDD8;
    test.deepEqual(serviceTaskDefinition.Properties.HealthCheckGracePeriodSeconds, 600);
    test.done();
  },

  'test load balanced service with family defined'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
        enableLogging: false,
        environment: {
          TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
          TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
        },
        family: "fargate-task-family",
      },
      desiredCount: 2,
      memoryLimitMiB: 512,
      serviceName: "fargate-test-service",
    });

    // THEN
    expect(stack).to(haveResource("AWS::ECS::Service", {
      DesiredCount: 2,
      LaunchType: "FARGATE",
      ServiceName: "fargate-test-service"
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
          Image: "/aws/aws-example-app",
        }
      ],
      Family: "fargate-task-family"
    }));

    test.done();
  },

  'setting NLB special listener port to create the listener'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, "FargateNlbService", {
      cluster,
      listenerPort: 2015,
      taskImageOptions: {
        containerPort: 2015,
        image: ecs.ContainerImage.fromRegistry('abiosoft/caddy')
      },
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          Type: "forward"
        }
      ],
      Port: 2015,
      Protocol: "TCP"
    }));

    test.done();
  },

  'setting ALB special listener port to create the listener'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, "FargateAlbService", {
      cluster,
      listenerPort: 2015,
      taskImageOptions: {
        containerPort: 2015,
        image: ecs.ContainerImage.fromRegistry('abiosoft/caddy')
      },
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          Type: "forward"
        }
      ],
      Port: 2015,
      Protocol: "HTTP"
    }));

    test.done();
  },

  'setting ALB HTTPS protocol to create the listener on 443'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, "FargateAlbService", {
      cluster,
      protocol: ApplicationProtocol.HTTPS,
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
        image: ecs.ContainerImage.fromRegistry('abiosoft/caddy')
      },
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          Type: "forward"
        }
      ],
      Port: 443,
      Protocol: "HTTPS"
    }));

    test.done();
  },

  'setting ALB HTTP protocol to create the listener on 80'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, "FargateAlbService", {
      cluster,
      protocol: ApplicationProtocol.HTTP,
      taskImageOptions: {
        containerPort: 2015,
        image: ecs.ContainerImage.fromRegistry('abiosoft/caddy')
      },
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          Type: "forward"
        }
      ],
      Port: 80,
      Protocol: "HTTP"
    }));

    test.done();
  },

  'setting ALB without any protocol or listenerPort to create the listener on 80'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, "FargateAlbService", {
      cluster,
      taskImageOptions: {
        containerPort: 2015,
        image: ecs.ContainerImage.fromRegistry('abiosoft/caddy')
      },
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          Type: "forward"
        }
      ],
      Port: 80,
      Protocol: "HTTP"
    }));

    test.done();
  },

  'passing in existing network load balancer to NLB Fargate Service'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const nlb = new NetworkLoadBalancer(stack, 'NLB', { vpc });

    // WHEN
    new ecsPatterns.NetworkLoadBalancedFargateService(stack, "Service", {
      vpc,
      loadBalancer: nlb,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      },
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::Service', {
      LaunchType: "FARGATE",
    }));
    expect(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Type: 'network'
    }));
    test.done();
  },

  'passing in imported network load balancer and resources to NLB Fargate service'(test: Test) {
    // GIVEN
    const stack1 = new cdk.Stack();
    const vpc1 = new ec2.Vpc(stack1, 'VPC');
    const cluster1 = new ecs.Cluster(stack1, 'Cluster', { vpc: vpc1 });
    const nlbArn = "arn:aws:elasticloadbalancing::000000000000::dummyloadbalancer";
    const stack2 = new cdk.Stack(stack1, 'Stack2');
    const cluster2 = ecs.Cluster.fromClusterAttributes(stack2, 'ImportedCluster', {
      vpc: vpc1,
      securityGroups: cluster1.connections.securityGroups,
      clusterName: 'cluster-name'
    });

    // WHEN
    const nlb2 = NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stack2, "ImportedNLB", {
      loadBalancerArn: nlbArn,
      loadBalancerVpc: vpc1,
    });
    const taskDef = new ecs.FargateTaskDefinition(stack2, 'TaskDef', {
      cpu: 1024,
      memoryLimitMiB: 1024,
    });
    const container = taskDef.addContainer('myContainer', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 1024
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
    expect(stack2).to(haveResourceLike('AWS::ECS::Service', {
      LaunchType: "FARGATE",
      LoadBalancers: [{ContainerName: 'myContainer', ContainerPort: 80}]
    }));
    expect(stack2).to(haveResourceLike('AWS::ElasticLoadBalancingV2::TargetGroup'));
    expect(stack2).to(haveResourceLike('AWS::ElasticLoadBalancingV2::Listener', {
      LoadBalancerArn: nlb2.loadBalancerArn,
      Port: 80,
    }));

    test.done();
  },

  'passing in previously created application load balancer to ALB Fargate Service'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, "Vpc");
    const cluster = new ecs.Cluster(stack, "Cluster", { vpc, clusterName: "MyCluster" });
    const sg = new ec2.SecurityGroup(stack, "SecurityGroup", { vpc });
    cluster.connections.addSecurityGroup(sg);
    const alb = new ApplicationLoadBalancer(stack, "ALB", { vpc, securityGroup: sg });

    // WHEN
    new ecsPatterns.ApplicationLoadBalancedFargateService(stack, "Service", {
      cluster,
      loadBalancer: alb,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      }
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::Service', {
      LaunchType: 'FARGATE',
    }));
    expect(stack).to(haveResourceLike('AWS::ElasticLoadBalancingV2::LoadBalancer', {
      Type: 'application'
    }));
    test.done();
  },

  'passing in imported application load balancer and resources to ALB Fargate Service'(test: Test) {
    // GIVEN
    const stack1 = new cdk.Stack();
    const albArn = "arn:aws:elasticloadbalancing::000000000000::dummyloadbalancer";
    const vpc = new ec2.Vpc(stack1, "Vpc");
    const cluster = new ecs.Cluster(stack1, "Cluster", { vpc, clusterName: "MyClusterName", });
    const sg = new ec2.SecurityGroup(stack1, "SecurityGroup", { vpc });
    cluster.connections.addSecurityGroup(sg);
    const alb = ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(stack1, "ALB", {
      loadBalancerArn: albArn,
      vpc,
      securityGroupId: sg.securityGroupId,
      loadBalancerDnsName: "MyDnsName"
    });

    // WHEN
    const taskDef = new ecs.FargateTaskDefinition(stack1, 'TaskDef', {
      cpu: 1024,
      memoryLimitMiB: 1024,
    });
    const container = taskDef.addContainer('Container',  {
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
    expect(stack1).to(haveResourceLike('AWS::ECS::Service', {
      LaunchType: "FARGATE",
      LoadBalancers: [{ContainerName: 'Container', ContainerPort: 80}]
    }));
    expect(stack1).to(haveResourceLike('AWS::ElasticLoadBalancingV2::TargetGroup'));
    expect(stack1).to(haveResourceLike('AWS::ElasticLoadBalancingV2::Listener', {
      LoadBalancerArn: alb.loadBalancerArn,
      Port: 80,
    }));

    test.done();
  },

};
import { expect, haveResource, haveResourceLike, SynthUtils } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import ecsPatterns = require('../../lib');

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
    test.deepEqual(serviceTaskDefinition.Properties.ExecutionRoleArn, { 'Fn::GetAtt': [ 'ExecutionRole605A040B', 'Arn' ] });
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
    test.deepEqual(serviceTaskDefinition.Properties.TaskRoleArn, { 'Fn::GetAtt': [ 'taskRoleTest9DA66B6E', 'Arn' ] });
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

};

import '@aws-cdk/assert-internal/jest';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as ecs from '../../lib';
import { LaunchType, PropagatedTagSource } from '../../lib/base/base-service';

nodeunitShim({
  'When creating an External Service': {
    'with only required properties set, it correctly sets default properties'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'MyVpc', {});
      const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
      cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
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
      expect(stack).toHaveResource('AWS::ECS::Service', {
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
        LaunchType: LaunchType.EXTERNAL,
      });

      test.notEqual(service.node.defaultChild, undefined);

      test.done();
    },
  },

  'with all properties set'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
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
    expect(stack).toHaveResource('AWS::ECS::Service', {
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
      LaunchType: LaunchType.EXTERNAL,
      ServiceName: 'bonjour',
    });

    test.done();
  },

  'with cloudmap set on cluster, throw error'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
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
    })).toThrow('Cloud map integration is not supported for External service' );

    test.done();
  },

  'with multiple security groups, it correctly updates the cfn template'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
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
    expect(stack).toHaveResource('AWS::ECS::Service', {
      TaskDefinition: {
        Ref: 'ExternalTaskDef6CCBDB87',
      },
      Cluster: {
        Ref: 'EcsCluster97242B84',
      },
      DesiredCount: 2,
      LaunchType: LaunchType.EXTERNAL,
      ServiceName: 'bonjour',
    });

    expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
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

    expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
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

    test.done();
  },

  'throws when task definition is not External compatible'(test: Test) {
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

    test.done();
  },

  'errors if minimum not less than maximum'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
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

    test.done();
  },

  'error if cloudmap options provided with external service'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
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
    test.done();
  },

  'with both propagateTags and propagateTaskTagsFrom defined'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'MyVpc', {});
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
    const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'ExternalTaskDef');

    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 512,
    });

    test.throws(() => new ecs.ExternalService(stack, 'ExternalService', {
      cluster,
      taskDefinition,
      propagateTags: PropagatedTagSource.SERVICE,
      propagateTaskTagsFrom: PropagatedTagSource.SERVICE,
    }));

    test.done();
  },
});

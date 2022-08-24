import { Match, Template } from '@aws-cdk/assertions';
import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';
import * as autoscaling from '@aws-cdk/aws-autoscaling';
import { MachineImage } from '@aws-cdk/aws-ec2';
import * as ec2 from '@aws-cdk/aws-ec2';
import { AsgCapacityProvider } from '@aws-cdk/aws-ecs';
import * as ecs from '@aws-cdk/aws-ecs';
import * as sqs from '@aws-cdk/aws-sqs';
import { Queue } from '@aws-cdk/aws-sqs';
import { testDeprecated, testLegacyBehavior } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as ecsPatterns from '../../lib';

test('test ECS queue worker service construct - with only required props', () => {
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
  new ecsPatterns.QueueProcessingEc2Service(stack, 'Service', {
    cluster,
    memoryLimitMiB: 512,
    image: ecs.ContainerImage.fromRegistry('test'),
  });

  // THEN - QueueWorker is of EC2 launch type, an SQS queue is created and all default properties are set.
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    LaunchType: 'EC2',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
    RedrivePolicy: {
      deadLetterTargetArn: {
        'Fn::GetAtt': [
          'ServiceEcsProcessingDeadLetterQueue4A89196E',
          'Arn',
        ],
      },
      maxReceiveCount: 3,
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
    MessageRetentionPeriod: 1209600,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      Match.objectLike({
        Environment: [
          {
            Name: 'QUEUE_NAME',
            Value: {
              'Fn::GetAtt': [
                'ServiceEcsProcessingQueueC266885C',
                'QueueName',
              ],
            },
          },
        ],
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-group': {
              Ref: 'ServiceQueueProcessingTaskDefQueueProcessingContainerLogGroupD52338D1',
            },
            'awslogs-stream-prefix': 'Service',
            'awslogs-region': {
              Ref: 'AWS::Region',
            },
          },
        },
        Essential: true,
        Image: 'test',
        Memory: 512,
      }),
    ],
    Family: 'ServiceQueueProcessingTaskDef83DB34F1',
  });
});

testLegacyBehavior('test ECS queue worker service construct - with remove default desiredCount feature flag', cdk.App, (app) => {
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
  new ecsPatterns.QueueProcessingEc2Service(stack, 'Service', {
    cluster,
    memoryLimitMiB: 512,
    image: ecs.ContainerImage.fromRegistry('test'),
  });

  // THEN - QueueWorker is of EC2 launch type, and desiredCount is not defined on the Ec2Service.
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DesiredCount: Match.absent(),
    LaunchType: 'EC2',
  });
});

test('test ECS queue worker service construct - with optional props for queues', () => {
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
  new ecsPatterns.QueueProcessingEc2Service(stack, 'Service', {
    cluster,
    memoryLimitMiB: 512,
    image: ecs.ContainerImage.fromRegistry('test'),
    maxReceiveCount: 42,
    retentionPeriod: cdk.Duration.days(7),
    visibilityTimeout: cdk.Duration.minutes(5),
  });

  // THEN - QueueWorker is of EC2 launch type, an SQS queue is created and all default properties are set.
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    LaunchType: 'EC2',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
    RedrivePolicy: {
      deadLetterTargetArn: {
        'Fn::GetAtt': [
          'ServiceEcsProcessingDeadLetterQueue4A89196E',
          'Arn',
        ],
      },
      maxReceiveCount: 42,
    },
    VisibilityTimeout: 300,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
    MessageRetentionPeriod: 604800,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      Match.objectLike({
        Environment: [
          {
            Name: 'QUEUE_NAME',
            Value: {
              'Fn::GetAtt': [
                'ServiceEcsProcessingQueueC266885C',
                'QueueName',
              ],
            },
          },
        ],
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-group': {
              Ref: 'ServiceQueueProcessingTaskDefQueueProcessingContainerLogGroupD52338D1',
            },
            'awslogs-stream-prefix': 'Service',
            'awslogs-region': {
              Ref: 'AWS::Region',
            },
          },
        },
        Essential: true,
        Image: 'test',
        Memory: 512,
      }),
    ],
    Family: 'ServiceQueueProcessingTaskDef83DB34F1',
  });
});

test('test ECS queue worker service construct - with ECS Exec', () => {
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
  new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
    cluster,
    memoryLimitMiB: 512,
    image: ecs.ContainerImage.fromRegistry('test'),
    enableExecuteCommand: true,
  });


  // THEN
  // ECS Exec
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    EnableExecuteCommand: true,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            'ssmmessages:CreateControlChannel',
            'ssmmessages:CreateDataChannel',
            'ssmmessages:OpenControlChannel',
            'ssmmessages:OpenDataChannel',
          ],
          Effect: 'Allow',
          Resource: '*',
        },
        {
          Action: 'logs:DescribeLogGroups',
          Effect: 'Allow',
          Resource: '*',
        },
        {
          Action: [
            'logs:CreateLogStream',
            'logs:DescribeLogStreams',
            'logs:PutLogEvents',
          ],
          Effect: 'Allow',
          Resource: '*',
        },
        {
          Action: [
            'sqs:ReceiveMessage',
            'sqs:ChangeMessageVisibility',
            'sqs:GetQueueUrl',
            'sqs:DeleteMessage',
            'sqs:GetQueueAttributes',
          ],
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [
              'ServiceEcsProcessingQueueC266885C',
              'Arn',
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'ServiceQueueProcessingTaskDefTaskRoleDefaultPolicy11D50174',
    Roles: [
      {
        Ref: 'ServiceQueueProcessingTaskDefTaskRoleBDE5D3C6',
      },
    ],
  });
});

testDeprecated('test ECS queue worker service construct - with optional props', () => {
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
  const queue = new sqs.Queue(stack, 'ecs-test-queue', {
    queueName: 'ecs-test-sqs-queue',
  });

  // WHEN
  new ecsPatterns.QueueProcessingEc2Service(stack, 'Service', {
    cluster,
    memoryLimitMiB: 1024,
    image: ecs.ContainerImage.fromRegistry('test'),
    command: ['-c', '4', 'amazon.com'],
    enableLogging: false,
    environment: {
      TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
      TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
    },
    queue,
    maxScalingCapacity: 5,
    minHealthyPercent: 60,
    maxHealthyPercent: 150,
    serviceName: 'ecs-test-service',
    family: 'ecs-task-family',
    circuitBreaker: { rollback: true },
    gpuCount: 256,
    placementStrategies: [ecs.PlacementStrategy.spreadAcrossInstances(), ecs.PlacementStrategy.packedByCpu(), ecs.PlacementStrategy.randomly()],
    placementConstraints: [ecs.PlacementConstraint.memberOf('attribute:ecs.instance-type =~ m5a.*')],
  });

  // THEN - QueueWorker is of EC2 launch type, an SQS queue is created and all optional properties are set.
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DeploymentConfiguration: {
      MinimumHealthyPercent: 60,
      MaximumPercent: 150,
      DeploymentCircuitBreaker: {
        Enable: true,
        Rollback: true,
      },
    },
    LaunchType: 'EC2',
    ServiceName: 'ecs-test-service',
    DeploymentController: {
      Type: 'ECS',
    },
    PlacementConstraints: [{ Type: 'memberOf', Expression: 'attribute:ecs.instance-type =~ m5a.*' }],
    PlacementStrategies: [{ Field: 'instanceId', Type: 'spread' }, { Field: 'CPU', Type: 'binpack' }, { Type: 'random' }],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
    QueueName: 'ecs-test-sqs-queue',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      Match.objectLike({
        Command: [
          '-c',
          '4',
          'amazon.com',
        ],
        Environment: [
          {
            Name: 'TEST_ENVIRONMENT_VARIABLE1',
            Value: 'test environment variable 1 value',
          },
          {
            Name: 'TEST_ENVIRONMENT_VARIABLE2',
            Value: 'test environment variable 2 value',
          },
          {
            Name: 'QUEUE_NAME',
            Value: {
              'Fn::GetAtt': [
                'ecstestqueueD1FDA34B',
                'QueueName',
              ],
            },
          },
        ],
        Image: 'test',
        Memory: 1024,
        ResourceRequirements: [
          {
            Type: 'GPU',
            Value: '256',
          },
        ],
      }),
    ],
    Family: 'ecs-task-family',
  });
});

testLegacyBehavior('can set desiredTaskCount to 0', cdk.App, (app) => {
  // GIVEN
  const stack = new cdk.Stack(app);
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
  new ecsPatterns.QueueProcessingEc2Service(stack, 'Service', {
    cluster,
    desiredTaskCount: 0,
    maxScalingCapacity: 2,
    memoryLimitMiB: 512,
    image: ecs.ContainerImage.fromRegistry('test'),
  });

  // THEN - QueueWorker is of EC2 launch type, an SQS queue is created and all default properties are set.
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DesiredCount: 0,
    LaunchType: 'EC2',
  });
});

testDeprecated('throws if desiredTaskCount and maxScalingCapacity are 0', () => {
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
    new ecsPatterns.QueueProcessingEc2Service(stack, 'Service', {
      cluster,
      desiredTaskCount: 0,
      memoryLimitMiB: 512,
      image: ecs.ContainerImage.fromRegistry('test'),
    }),
  ).toThrow(/maxScalingCapacity must be set and greater than 0 if desiredCount is 0/);
});

test('can set custom containerName', () => {
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
  new ecsPatterns.QueueProcessingEc2Service(stack, 'Service', {
    cluster,
    memoryLimitMiB: 512,
    image: ecs.ContainerImage.fromRegistry('test'),
    containerName: 'my-container',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      Match.objectLike({
        Name: 'my-container',
      }),
    ],
  });
});

test('can set capacity provider strategies', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  const autoScalingGroup = new autoscaling.AutoScalingGroup(stack, 'asg', {
    vpc,
    instanceType: new ec2.InstanceType('bogus'),
    machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
  });
  const capacityProvider = new ecs.AsgCapacityProvider(stack, 'provider', {
    autoScalingGroup,
  });
  cluster.addAsgCapacityProvider(capacityProvider);

  // WHEN
  new ecsPatterns.QueueProcessingEc2Service(stack, 'Service', {
    cluster,
    image: ecs.ContainerImage.fromRegistry('test'),
    memoryLimitMiB: 512,
    capacityProviderStrategies: [
      {
        capacityProvider: capacityProvider.capacityProviderName,
      },
    ],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    LaunchType: Match.absent(),
    CapacityProviderStrategy: [
      {
        CapacityProvider: {
          Ref: 'providerD3FF4D3A',
        },
      },
    ],
  });
});

it('can set queue props by queue construct', () => {
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
  const queue = new Queue(stack, 'Queue', {
    queueName: 'custom-queue',
    visibilityTimeout: cdk.Duration.seconds(200),
    deadLetterQueue: {
      queue: new Queue(stack, 'DeadLetterQueue', {
        queueName: 'custom-dead-letter-queue',
        retentionPeriod: cdk.Duration.seconds(100),
      }),
      maxReceiveCount: 10,
    },
  });

  // WHEN
  new ecsPatterns.QueueProcessingEc2Service(stack, 'Service', {
    cluster: cluster,
    memoryLimitMiB: 512,
    image: ecs.ContainerImage.fromRegistry('test'),
    queue: queue,
  });

  // Queue
  Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
    QueueName: 'custom-queue',
    VisibilityTimeout: 200,
    RedrivePolicy: {
      maxReceiveCount: 10,
    },
  });
  // DLQ
  Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
    QueueName: 'custom-dead-letter-queue',
    MessageRetentionPeriod: 100,
  });
});

it('can set queue props by QueueProcessingServiceBaseProps', () => {
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
  new ecsPatterns.QueueProcessingEc2Service(stack, 'Service', {
    cluster: cluster,
    memoryLimitMiB: 512,
    image: ecs.ContainerImage.fromRegistry('test'),
    retentionPeriod: cdk.Duration.seconds(100),
    visibilityTimeout: cdk.Duration.seconds(200),
    maxReceiveCount: 10,
  });

  // Queue
  Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
    QueueName: Match.absent(),
    VisibilityTimeout: 200,
    RedrivePolicy: {
      maxReceiveCount: 10,
    },
  });
  // DLQ
  Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', {
    QueueName: Match.absent(),
    MessageRetentionPeriod: 100,
  });
});

it('throws validation errors of the specific queue prop, when setting queue and queue related props at same time', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const queue = new Queue(stack, 'Queue');
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
  cluster.addAsgCapacityProvider(new AsgCapacityProvider(stack, 'DefaultAutoScalingGroupProvider', {
    autoScalingGroup: new AutoScalingGroup(stack, 'DefaultAutoScalingGroup', {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: MachineImage.latestAmazonLinux(),
    }),
  }));

  // Setting all retentionPeriod, visibilityTimeout and maxReceiveCount
  expect(() => {
    new ecsPatterns.QueueProcessingEc2Service(stack, 'Service1', {
      cluster: cluster,
      memoryLimitMiB: 512,
      image: ecs.ContainerImage.fromRegistry('test'),
      queue: queue,
      retentionPeriod: cdk.Duration.seconds(100),
      visibilityTimeout: cdk.Duration.seconds(200),
      maxReceiveCount: 10,
    });
  }).toThrow(new Error('retentionPeriod, visibilityTimeout, maxReceiveCount can be set only when queue is not set. Specify them in the QueueProps of the queue'));

  // Setting only visibilityTimeout
  expect(() => {
    new ecsPatterns.QueueProcessingFargateService(stack, 'Service2', {
      image: ecs.ContainerImage.fromRegistry('test'),
      queue: queue,
      visibilityTimeout: cdk.Duration.seconds(200),
    });
  }).toThrow(new Error('visibilityTimeout can be set only when queue is not set. Specify them in the QueueProps of the queue'));
});

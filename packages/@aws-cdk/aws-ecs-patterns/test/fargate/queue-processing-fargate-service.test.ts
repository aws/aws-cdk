import { Match, Template } from '@aws-cdk/assertions';
import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import { MachineImage } from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { AsgCapacityProvider } from '@aws-cdk/aws-ecs';
import * as sqs from '@aws-cdk/aws-sqs';
import { Queue } from '@aws-cdk/aws-sqs';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import * as ecsPatterns from '../../lib';

test('test fargate queue worker service construct - with only required props', () => {
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
  });

  // THEN - QueueWorker is of FARGATE launch type, an SQS queue is created and all default properties are set.
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    LaunchType: 'FARGATE',
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

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
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
        Image: 'test',
      }),
    ],
    Family: 'ServiceQueueProcessingTaskDef83DB34F1',
  });
});

test('test fargate queue worker service construct - with remove default desiredCount feature flag', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  // WHEN
  new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
    cluster,
    memoryLimitMiB: 512,
    image: ecs.ContainerImage.fromRegistry('test'),
  });

  // THEN - QueueWorker is of FARGATE launch type, and desiredCount is not defined on the FargateService.
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DesiredCount: Match.absent(),
    LaunchType: 'FARGATE',
  });
});

test('test fargate queue worker service construct - with optional props for queues', () => {
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
    maxReceiveCount: 42,
    retentionPeriod: cdk.Duration.days(7),
    visibilityTimeout: cdk.Duration.minutes(5),
  });

  // THEN - QueueWorker is of FARGATE launch type, an SQS queue is created and all default properties are set.
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    LaunchType: 'FARGATE',
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

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
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
        Image: 'test',
      }),
    ],
    Family: 'ServiceQueueProcessingTaskDef83DB34F1',
  });
});

test('test Fargate queue worker service construct - with ECS Exec', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  // WHEN
  new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
    cluster,
    memoryLimitMiB: 512,
    image: ecs.ContainerImage.fromRegistry('test'),
    enableExecuteCommand: true,
  });

  // THEN
  // ECS Exec
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

test('test Fargate queue worker service construct - without desiredCount specified', () => {
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
  const queue = new sqs.Queue(stack, 'fargate-test-queue', {
    queueName: 'fargate-test-sqs-queue',
  });

  // WHEN
  new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
    cluster,
    memoryLimitMiB: 512,
    image: ecs.ContainerImage.fromRegistry('test'),
    command: ['-c', '4', 'amazon.com'],
    enableLogging: false,
    environment: {
      TEST_ENVIRONMENT_VARIABLE1: 'test environment variable 1 value',
      TEST_ENVIRONMENT_VARIABLE2: 'test environment variable 2 value',
    },
    queue,
    maxScalingCapacity: 5,
    minScalingCapacity: 2,
    minHealthyPercent: 60,
    maxHealthyPercent: 150,
    serviceName: 'fargate-test-service',
    family: 'fargate-task-family',
    platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    deploymentController: {
      type: ecs.DeploymentControllerType.CODE_DEPLOY,
    },
  });

  // THEN - QueueWorker is of FARGATE launch type, an SQS queue is created and all optional properties are set.
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DeploymentConfiguration: {
      MinimumHealthyPercent: 60,
      MaximumPercent: 150,
    },
    LaunchType: 'FARGATE',
    ServiceName: 'fargate-test-service',
    PlatformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    DeploymentController: {
      Type: 'CODE_DEPLOY',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalableTarget', {
    MaxCapacity: 5,
    MinCapacity: 2,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', { QueueName: 'fargate-test-sqs-queue' });

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
                'fargatetestqueue28B43841',
                'QueueName',
              ],
            },
          },
        ],
        Image: 'test',
      }),
    ],
    Family: 'fargate-task-family',
  });
});

testDeprecated('test Fargate queue worker service construct - with optional props', () => {
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
  const queue = new sqs.Queue(stack, 'fargate-test-queue', {
    queueName: 'fargate-test-sqs-queue',
  });

  // WHEN
  new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
    cluster,
    memoryLimitMiB: 512,
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
    serviceName: 'fargate-test-service',
    family: 'fargate-task-family',
    platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    circuitBreaker: { rollback: true },
  });

  // THEN - QueueWorker is of FARGATE launch type, an SQS queue is created and all optional properties are set.
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DeploymentConfiguration: {
      MinimumHealthyPercent: 60,
      MaximumPercent: 150,
      DeploymentCircuitBreaker: {
        Enable: true,
        Rollback: true,
      },
    },
    LaunchType: 'FARGATE',
    ServiceName: 'fargate-test-service',
    PlatformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    DeploymentController: {
      Type: 'ECS',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SQS::Queue', { QueueName: 'fargate-test-sqs-queue' });

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
                'fargatetestqueue28B43841',
                'QueueName',
              ],
            },
          },
        ],
        Image: 'test',
      }),
    ],
    Family: 'fargate-task-family',
  });
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
  new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
    cluster,
    containerName: 'my-container',
    image: ecs.ContainerImage.fromRegistry('test'),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      Match.objectLike({
        Name: 'my-container',
      }),
    ],
  });
});

test('can set custom networking options', () => {
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC', {
    subnetConfiguration: [
      {
        cidrMask: 24,
        name: 'Public',
        subnetType: ec2.SubnetType.PUBLIC,
      },
      {
        cidrMask: 24,
        name: 'Isolated',
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    ],
  });
  const securityGroup = new ec2.SecurityGroup(stack, 'MyCustomSG', {
    vpc,
  });

  // WHEN - SecurityGroups and taskSubnets selection is defined
  new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
    vpc,
    memoryLimitMiB: 512,
    image: ecs.ContainerImage.fromRegistry('test'),
    securityGroups: [securityGroup],
    taskSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
  });

  // THEN - NetworkConfiguration is created with the specific security groups and selected subnets
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    LaunchType: 'FARGATE',
    NetworkConfiguration: {
      AwsvpcConfiguration: {
        AssignPublicIp: 'DISABLED',
        SecurityGroups: [
          {
            'Fn::GetAtt': [
              'MyCustomSGDE27C661',
              'GroupId',
            ],
          },
        ],
        Subnets: [
          {
            Ref: 'VPCIsolatedSubnet1SubnetEBD00FC6',
          },
          {
            Ref: 'VPCIsolatedSubnet2Subnet4B1C8CAA',
          },
        ],
      },
    },
  });
});

test('can set use public IP', () => {
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');

  // WHEN - Assign Public IP is set to True
  new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
    vpc,
    memoryLimitMiB: 512,
    image: ecs.ContainerImage.fromRegistry('test'),
    assignPublicIp: true,
  });

  // THEN - The Subnets defaults to Public and AssignPublicIp settings change to ENABLED
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    LaunchType: 'FARGATE',
    NetworkConfiguration: {
      AwsvpcConfiguration: {
        AssignPublicIp: 'ENABLED',
        SecurityGroups: [
          {
            'Fn::GetAtt': [
              'ServiceQueueProcessingFargateServiceSecurityGroup6E981512',
              'GroupId',
            ],
          },
        ],
        Subnets: [
          {
            Ref: 'VPCPublicSubnet1SubnetB4246D30',
          },
          {
            Ref: 'VPCPublicSubnet2Subnet74179F39',
          },
        ],
      },
    },
  });
});

test('can set capacity provider strategies', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'MyVpc', {});
  const cluster = new ecs.Cluster(stack, 'EcsCluster', {
    vpc,
  });
  cluster.enableFargateCapacityProviders();

  // WHEN
  new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
    cluster,
    image: ecs.ContainerImage.fromRegistry('test'),
    capacityProviderStrategies: [
      {
        capacityProvider: 'FARGATE_SPOT',
        weight: 2,
      },
      {
        capacityProvider: 'FARGATE',
        weight: 1,
      },
    ],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    LaunchType: Match.absent(),
    CapacityProviderStrategy: [
      {
        CapacityProvider: 'FARGATE_SPOT',
        Weight: 2,
      },
      {
        CapacityProvider: 'FARGATE',
        Weight: 1,
      },
    ],
  });
});

it('can set queue props by queue construct', () => {
  // GIVEN
  const stack = new cdk.Stack();
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
  new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
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

  // WHEN
  new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
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

  // Setting all retentionPeriod, visibilityTimeout and maxReceiveCount
  expect(() => {
    new ecsPatterns.QueueProcessingFargateService(stack, 'Service1', {
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

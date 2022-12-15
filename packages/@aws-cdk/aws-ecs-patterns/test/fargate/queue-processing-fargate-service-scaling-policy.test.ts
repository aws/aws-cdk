import { Match, Template } from '@aws-cdk/assertions';
import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import { MachineImage } from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { AsgCapacityProvider } from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import * as ecsPatterns from '../../lib';

test('test fargate queue worker service construct - with the default scaling policies', () => {
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

  Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
    TargetTrackingScalingPolicyConfiguration: Match.objectLike({
      PredefinedMetricSpecification: {
        PredefinedMetricType: 'ECSServiceAverageCPUUtilization',
      },
      TargetValue: 50,
    }),
  });
});

test('test fargate queue worker service construct - with specific scaling policies', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

  // WHEN
  new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
    cluster,
    memoryLimitMiB: 512,
    image: ecs.ContainerImage.fromRegistry('test'),
    cpuBasedScalingTargetUtilization: 90,
  });

  // THEN - QueueWorker is of FARGATE launch type, and desiredCount is not defined on the FargateService.
  Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
    DesiredCount: Match.absent(),
    LaunchType: 'FARGATE',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::ApplicationAutoScaling::ScalingPolicy', {
    TargetTrackingScalingPolicyConfiguration: Match.objectLike({
      PredefinedMetricSpecification: {
        PredefinedMetricType: 'ECSServiceAverageCPUUtilization',
      },
      TargetValue: 90,
    }),
  });
});

test('test fargate queue worker service construct - with cpu scaling diasbled', () => {
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
    cpuBasedScalingTargetUtilization: -1,
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

  Template.fromStack(stack).resourceCountIs('AWS::ApplicationAutoScaling::ScalingPolicy', 2);

});

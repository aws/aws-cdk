import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import ecsPatterns = require('../../lib');

export = {
  'test fargate queue worker service construct - with only required props'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });

    // WHEN
    new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
      cluster,
      memoryLimitMiB: 512,
      image: ecs.ContainerImage.fromRegistry('test')
    });

    // THEN - QueueWorker is of FARGATE launch type, an SQS queue is created and all default properties are set.
    expect(stack).to(haveResource("AWS::ECS::Service", {
      DesiredCount: 1,
      LaunchType: "FARGATE",
    }));

    expect(stack).to(haveResource("AWS::SQS::Queue"));

    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [
            {
              Name: "QUEUE_NAME",
              Value: {
                "Fn::GetAtt": [
                  "ServiceEcsProcessingQueueC266885C",
                  "QueueName"
                ]
              }
            }
          ],
          LogConfiguration: {
            LogDriver: "awslogs",
            Options: {
              "awslogs-group": {
                Ref: "ServiceQueueProcessingTaskDefQueueProcessingContainerLogGroupD52338D1"
              },
              "awslogs-stream-prefix": "Service",
              "awslogs-region": {
                Ref: "AWS::Region"
              }
            }
          },
          Image: "test",
        }
      ]
    }));

    test.done();
  },

  'test Fargate queue worker service construct - with optional props'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new ec2.InstanceType('t2.micro') });
    const queue = new sqs.Queue(stack, 'fargate-test-queue', {
      queueName: 'fargate-test-sqs-queue',
    });

    // WHEN
    new ecsPatterns.QueueProcessingFargateService(stack, 'Service', {
      cluster,
      memoryLimitMiB: 512,
      image: ecs.ContainerImage.fromRegistry('test'),
      command: ["-c", "4", "amazon.com"],
      enableLogging: false,
      desiredTaskCount: 2,
      environment: {
        TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
        TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
      },
      queue,
      maxScalingCapacity: 5
    });

    // THEN - QueueWorker is of FARGATE launch type, an SQS queue is created and all optional properties are set.
    expect(stack).to(haveResource("AWS::ECS::Service", {
      DesiredCount: 2,
      LaunchType: "FARGATE"
    }));

    expect(stack).to(haveResource("AWS::SQS::Queue", { QueueName: 'fargate-test-sqs-queue' }));

    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Command: [
            "-c",
            "4",
            "amazon.com"
          ],
          Environment: [
            {
              Name: "TEST_ENVIRONMENT_VARIABLE1",
              Value: "test environment variable 1 value"
            },
            {
              Name: "TEST_ENVIRONMENT_VARIABLE2",
              Value: "test environment variable 2 value"
            },
            {
              Name: "QUEUE_NAME",
              Value: {
                "Fn::GetAtt": [
                  "fargatetestqueue28B43841",
                  "QueueName"
                ]
              }
            }
          ],
          Image: "test",
        }
      ]
    }));

    test.done();
  }
};

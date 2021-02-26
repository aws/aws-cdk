import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { App, Stack } from '@aws-cdk/core';

import { QueueProcessingFargateService } from '../../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-patterns-queue-isolated');
const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
  subnetConfiguration: [
    {
      cidrMask: 24,
      name: 'Public',
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      cidrMask: 24,
      name: 'Isolated',
      subnetType: ec2.SubnetType.ISOLATED,
    },
  ],
});


vpc.addS3Endpoint('S3Endpoint', [{ subnetType: ec2.SubnetType.ISOLATED }]);

const securityGroup = new ec2.SecurityGroup(stack, 'MyCustomSG', {
  vpc,
});

const queueProcessing = new QueueProcessingFargateService(stack, 'IsolatedQueueService', {
  vpc,
  memoryLimitMiB: 512,
  image: new ecs.AssetImage(path.join(__dirname, '..', 'sqs-reader')),
  securityGroups: [securityGroup],
  taskSubnets: { subnetType: ec2.SubnetType.ISOLATED },
});

queueProcessing.service.node.addDependency(
  vpc.addInterfaceEndpoint('SqsEndpoint', {
    service: ec2.InterfaceVpcEndpointAwsService.SQS,
  }),
  vpc.addInterfaceEndpoint('EcrEndpoint', {
    service: ec2.InterfaceVpcEndpointAwsService.ECR,
  }),
  vpc.addInterfaceEndpoint('EcrImageEndpoint', {
    service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
  }),
  vpc.addInterfaceEndpoint('CloudWatchLogsEndpoint', {
    service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
  }),
);

app.synth();

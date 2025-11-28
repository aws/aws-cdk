import { IPipe, ISource, Pipe, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { EcsTaskTarget } from '../lib';

/**
 * Stack verification steps:
 * 1. A message "updated" is sent to the SQS queue, which triggers the ECS task from the pipe.
 * 2. The ECS task updates the SSM Parameter with the value from the SQS message.
 * 3. The assertion verifies that the SSM Parameter value is "updated".
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-targets-ecs');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1, natGateways: 1 });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
const sourceQueue = new sqs.Queue(stack, 'SourceQueue');

const parameterName = '/pipes/ecs/test-value';
const parameter = new ssm.StringParameter(stack, 'Parameter', {
  parameterName,
  stringValue: 'initial',
});

class TestSource implements ISource {
  sourceArn: string;
  sourceParameters = undefined;
  constructor(private readonly queue: sqs.Queue) {
    this.queue = queue;
    this.sourceArn = queue.queueArn;
  }
  bind(_pipe: IPipe): SourceConfig {
    return {
      sourceParameters: this.sourceParameters,
    };
  }
  grantRead(pipeRole: iam.IRole): void {
    this.queue.grantConsumeMessages(pipeRole);
  }
}

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  cpu: 256,
  memoryLimitMiB: 512,
});

taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/aws-cli/aws-cli:latest'),
  entryPoint: ['sh', '-c'],
  command: [
    `aws ssm put-parameter --name ${parameterName} --value "$MESSAGE" --overwrite --region ${stack.region}`,
  ],
  logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'ecs' }),
});

parameter.grantWrite(taskDefinition.taskRole);

const target = new EcsTaskTarget(cluster, {
  taskDefinition,
  containerOverrides: [
    {
      containerName: 'Container',
      environment: [
        { name: 'MESSAGE', value: '$.body' },
      ],
    },
  ],
});

new Pipe(stack, 'Pipe', {
  source: new TestSource(sourceQueue),
  target,
});

const test = new IntegTest(app, 'integtest-pipe-target-ecs', {
  testCases: [stack],
});

const putMessageOnQueue = test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: 'updated',
});

putMessageOnQueue
  .next(
    test.assertions.awsApiCall('SSM', 'getParameter', {
      Name: parameterName,
    }),
  )
  .expect(
    ExpectedResult.objectLike({
      Parameter: {
        Value: 'updated',
      },
    }),
  )
  .waitForAssertions({
    totalTimeout: cdk.Duration.minutes(5),
    interval: cdk.Duration.seconds(15),
  });

app.synth();

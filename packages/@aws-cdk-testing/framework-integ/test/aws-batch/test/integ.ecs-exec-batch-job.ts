import * as batch from 'aws-cdk-lib/aws-batch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

class EcsExecBatchStack extends cdk.Stack {
  public readonly ec2ComputeEnvironment: batch.ManagedEc2EcsComputeEnvironment;
  public readonly fargateComputeEnvironment: batch.FargateComputeEnvironment;
  public readonly ec2JobQueue: batch.JobQueue;
  public readonly fargateJobQueue: batch.JobQueue;
  public readonly ec2JobDefinition: batch.EcsJobDefinition;
  public readonly fargateJobDefinition: batch.EcsJobDefinition;

  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
    });

    this.ec2ComputeEnvironment = new batch.ManagedEc2EcsComputeEnvironment(this, 'ComputeEnv', {
      vpc,
      instanceTypes: [ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE)],
      minvCpus: 0,
      maxvCpus: 256,
    });

    this.ec2JobQueue = new batch.JobQueue(this, 'JobQueue', {
      computeEnvironments: [
        {
          order: 1,
          computeEnvironment: this.ec2ComputeEnvironment,
        },
      ],
    });

    this.ec2JobDefinition = new batch.EcsJobDefinition(this, 'EcsExecEc2JobDefinition', {
      jobDefinitionName: 'EcsExecEc2TestJob',
      container: new batch.EcsEc2ContainerDefinition(this, 'Ec2Container', {
        image: ecs.ContainerImage.fromRegistry('public.ecr.aws/amazonlinux/amazonlinux:latest'),
        cpu: 2,
        memory: cdk.Size.mebibytes(2048),
        enableExecuteCommand: true,
        command: ['sh', '-c', 'echo "Job started with ECS Exec enabled"; sleep 300'], // Keep container running
      }),
    });

    this.fargateJobDefinition = new batch.EcsJobDefinition(this, 'EcsExecFargateJobDefinition', {
      container: new batch.EcsFargateContainerDefinition(this, 'FargateContainer', {
        image: ecs.ContainerImage.fromRegistry('public.ecr.aws/amazonlinux/amazonlinux:latest'),
        cpu: 0.25,
        memory: cdk.Size.gibibytes(1),
        enableExecuteCommand: true, // Enable ECS Exec
        command: ['sh', '-c', 'echo "Fargate Job started with ECS Exec enabled"; sleep 300'], // Keep container running
      }),
    });

    // Create Fargate compute environment
    this.fargateComputeEnvironment = new batch.FargateComputeEnvironment(this, 'FargateComputeEnv', {
      vpc,
    });

    this.fargateJobQueue = new batch.JobQueue(this, 'FargateJobQueue', {
      computeEnvironments: [
        {
          order: 1,
          computeEnvironment: this.fargateComputeEnvironment,
        },
      ],
    });
  }
}

const app = new cdk.App();
const stack = new EcsExecBatchStack(app, 'EcsExecBatchStack');

const integ = new IntegTest(app, 'EcsExecBatchTest', {
  testCases: [stack],
});

// Submit the job
const submitJobResult = integ.assertions.awsApiCall('Batch', 'submitJob', {
  jobName: 'test-ecs-exec-ec2-job',
  jobQueue: stack.ec2JobQueue.jobQueueArn,
  jobDefinition: stack.ec2JobDefinition.jobDefinitionArn,
}).waitForAssertions();

// Get the job ID from the submit response
const jobId = submitJobResult.getAttString('jobId');

// Wait for job to reach RUNNING state and have a task ARN
const waitForJobRunning = integ.assertions.awsApiCall('Batch', 'describeJobs', {
  jobs: [jobId],
}).assertAtPath('jobs.0.status', ExpectedResult.stringLikeRegexp('RUNNING'))
  .assertAtPath('jobs.0.container.taskArn', ExpectedResult.stringLikeRegexp('arn:aws:ecs:.*'))
  .waitForAssertions({
    totalTimeout: cdk.Duration.minutes(10),
    interval: cdk.Duration.seconds(30),
  });

// Extract task ARN from job details
const taskArn = waitForJobRunning.getAttString('jobs.0.container.taskArn');

// Extract cluster ARN from task ARN
const describeTask = waitForJobRunning.next(
  integ.assertions.awsApiCall('ECS', 'describeTasks', {
    cluster: taskArn.split('/')[1], // Extract cluster name from task ARN
    tasks: [taskArn],
  }),
);

const clusterArn = describeTask.getAttString('tasks.0.clusterArn');

// Execute ECS command to verify ECS Exec is enabled
describeTask.next(
  integ.assertions.awsApiCall('ECS', 'executeCommand', {
    cluster: clusterArn,
    task: taskArn,
    container: 'Default',
    interactive: false,
    command: 'echo "ECS Exec test successful"',
  }),
);

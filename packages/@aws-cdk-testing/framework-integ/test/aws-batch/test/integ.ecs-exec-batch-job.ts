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

// Helper function to test ECS Exec for a job
function testEcsExecForJob(
  jobName: string,
  jobQueue: batch.JobQueue,
  jobDefinition: batch.EcsJobDefinition,
  computeEnvironment: batch.IManagedComputeEnvironment,
) {
  // Get cluster ARN from compute environment
  const describeComputeEnv = integ.assertions.awsApiCall('Batch', 'describeComputeEnvironments', {
    computeEnvironments: [computeEnvironment.computeEnvironmentArn],
  });

  const clusterArn = describeComputeEnv.getAttString('computeEnvironments.0.ecsClusterArn');

  // Submit the job
  const submitJobResult = describeComputeEnv.next(
    integ.assertions.awsApiCall('Batch', 'submitJob', {
      jobName,
      jobQueue: jobQueue.jobQueueArn,
      jobDefinition: jobDefinition.jobDefinitionArn,
    }),
  ).waitForAssertions();

  // Get the job ID from the submit response
  const jobId = submitJobResult.getAttString('jobId');

  // Wait for job to reach RUNNING state and have a task ARN
  const waitForJobRunning = integ.assertions.awsApiCall('Batch', 'describeJobs', {
    jobs: [jobId],
  }).assertAtPath('jobs.0.status', ExpectedResult.stringLikeRegexp('RUNNING'))
    .waitForAssertions({
      totalTimeout: cdk.Duration.minutes(10),
      interval: cdk.Duration.seconds(30),
    });

  const taskArn = waitForJobRunning.getAttString('jobs.0.container.taskArn');

  // Execute ECS command to verify ECS Exec is enabled
  waitForJobRunning.next(
    integ.assertions.awsApiCall('ECS', 'executeCommand', {
      cluster: clusterArn,
      task: taskArn,
      container: 'default',
      interactive: true,
      command: '/bin/bash',
    }).waitForAssertions({
      totalTimeout: cdk.Duration.minutes(10),
      interval: cdk.Duration.seconds(30),
    }),
  );
}

// Test EC2 job
testEcsExecForJob(
  'test-ecs-exec-ec2-job',
  stack.ec2JobQueue,
  stack.ec2JobDefinition,
  stack.ec2ComputeEnvironment,
);

// Test Fargate job
testEcsExecForJob(
  'test-ecs-exec-fargate-job',
  stack.fargateJobQueue,
  stack.fargateJobDefinition,
  stack.fargateComputeEnvironment,
);

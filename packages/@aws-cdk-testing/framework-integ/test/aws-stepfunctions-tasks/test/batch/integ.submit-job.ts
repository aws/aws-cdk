import * as path from 'path';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as batch from 'aws-cdk-lib/aws-batch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { BatchSubmitJob } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { STEPFUNCTIONS_TASKS_FIX_BATCH_SUBMIT_JOB_POLICY } from 'aws-cdk-lib/cx-api';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws batch list-jobs --job-queue <deployed job queue name or arn> --job-status RUNNABLE : should return jobs-list with size greater than 0
 * *
 * * aws batch describe-jobs --jobs <job-id returned by list-jobs> --query 'jobs[0].status': wait until the status is 'SUCCEEDED'
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'status': should return status as SUCCEEDED
 */

class RunBatchStack extends cdk.Stack {
  public readonly stateMachine: sfn.StateMachine;

  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'vpc', { restrictDefaultSecurityGroup: false });

    const batchQueue = new batch.JobQueue(this, 'JobQueue', {
      computeEnvironments: [
        {
          order: 1,
          computeEnvironment: new batch.ManagedEc2EcsComputeEnvironment(this, 'ComputeEnv', {
            vpc,
          }),
        },
      ],
    });

    // A plain job definition name (accepted by SubmitJob) lets the scoped
    // policy from STEPFUNCTIONS_TASKS_FIX_BATCH_SUBMIT_JOB_POLICY be exercised at runtime.
    const jobDefinitionName = 'submit-job-definition';
    new batch.EcsJobDefinition(this, 'JobDefinition', {
      jobDefinitionName,
      container: new batch.EcsEc2ContainerDefinition(this, 'Container', {
        image: ecs.ContainerImage.fromAsset(
          path.resolve(__dirname, 'batchjob-image'),
        ),
        cpu: 256,
        memory: cdk.Size.mebibytes(2048),
      }),
    });

    const submitJob = new BatchSubmitJob(this, 'Submit Job', {
      jobDefinitionArn: jobDefinitionName,
      jobQueueArn: batchQueue.jobQueueArn,
      jobName: 'MyJob',
      containerOverrides: {
        environment: { key: 'value' },
        memory: cdk.Size.mebibytes(256),
        vcpus: 1,
      },
      payload: sfn.TaskInput.fromObject({
        foo: sfn.JsonPath.stringAt('$.bar'),
      }),
      attempts: 3,
      taskTimeout: sfn.Timeout.duration(cdk.Duration.seconds(60)),
      tags: {
        key: 'value',
      },
    });

    const definition = new sfn.Pass(this, 'Start', {
      result: sfn.Result.fromObject({ bar: 'SomeValue' }),
    }).next(submitJob);

    this.stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definitionBody: sfn.DefinitionBody.fromChainable(definition),
    });

    new cdk.CfnOutput(this, 'JobQueueArn', {
      value: batchQueue.jobQueueArn,
    });
    new cdk.CfnOutput(this, 'StateMachineArn', {
      value: this.stateMachine.stateMachineArn,
    });
  }
}

const app = new cdk.App({
  context: {
    [STEPFUNCTIONS_TASKS_FIX_BATCH_SUBMIT_JOB_POLICY]: true,
  },
});
const stack = new RunBatchStack(app, 'aws-stepfunctions-integ');

const integTest = new integ.IntegTest(app, 'aws-stepfunctions-integ-submit-job', {
  testCases: [stack],
});

const startExecutionCall = integTest.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stack.stateMachine.stateMachineArn,
});

integTest.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: startExecutionCall.getAttString('executionArn'),
  includedData: 'METADATA_ONLY',
})
  .expect(integ.ExpectedResult.objectLike({
    status: 'SUCCEEDED',
  }))
  .waitForAssertions({
    totalTimeout: cdk.Duration.minutes(10),
    interval: cdk.Duration.seconds(30),
  });

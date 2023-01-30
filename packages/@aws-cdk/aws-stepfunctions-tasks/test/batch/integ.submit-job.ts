import * as path from 'path';
import * as batch from '@aws-cdk/aws-batch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { BatchSubmitJob } from '../../lib';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws batch list-jobs --job-queue <deployed job queue name or arn> --job-status RUNNABLE : should return jobs-list with size greater than 0
 * *
 * * aws batch describe-jobs --jobs <job-id returned by list-jobs> --query 'jobs[0].status': wait until the status is 'SUCCEEDED'
 * * aws stepfunctions describe-execution --execution-arn <execution-arn generated before> --query 'status': should return status as SUCCEEDED
 */

class RunBatchStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'vpc');

    const batchQueue = new batch.JobQueue(this, 'JobQueue', {
      computeEnvironments: [
        {
          order: 1,
          computeEnvironment: new batch.ComputeEnvironment(this, 'ComputeEnv', {
            computeResources: { vpc },
          }),
        },
      ],
    });

    const batchJobDefinition = new batch.JobDefinition(this, 'JobDefinition', {
      container: {
        image: ecs.ContainerImage.fromAsset(
          path.resolve(__dirname, 'batchjob-image'),
        ),
      },
    });

    const submitJob = new BatchSubmitJob(this, 'Submit Job', {
      jobDefinitionArn: batchJobDefinition.jobDefinitionArn,
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
    });

    const definition = new sfn.Pass(this, 'Start', {
      result: sfn.Result.fromObject({ bar: 'SomeValue' }),
    }).next(submitJob);

    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition,
    });

    new cdk.CfnOutput(this, 'JobQueueArn', {
      value: batchQueue.jobQueueArn,
    });
    new cdk.CfnOutput(this, 'StateMachineArn', {
      value: stateMachine.stateMachineArn,
    });
  }
}

const app = new cdk.App();
new RunBatchStack(app, 'aws-stepfunctions-integ');
app.synth();

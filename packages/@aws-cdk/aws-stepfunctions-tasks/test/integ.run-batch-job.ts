import * as batch from '@aws-cdk/aws-batch';
import * as ecs from '@aws-cdk/aws-ecs';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as path from 'path';
import * as tasks from '../lib';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws batch list-jobs --job-queue <deployed job queue name or arn> --job-status RUNNABLE : should return jobs-list with size greater than 0
 */

class RunBatchStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const batchQueue = new batch.JobQueue(this, 'JobQueue');

    const batchJobDefinition = new batch.JobDefinition(this, 'JobDefinition', {
      container: {
        image: ecs.ContainerImage.fromAsset(
          path.resolve(__dirname, 'batchjob-image')
        )
      }
    });

    const submitJob = new sfn.Task(this, 'Submit Job', {
      task: new tasks.RunBatchJob({
        jobDefinition: batchJobDefinition,
        jobName: 'MyJob',
        jobQueue: batchQueue,
        containerOverrides: {
          environment: { key: 'value' },
          memory: 256,
          vcpus: 1
        },
        payload: {
          foo: sfn.Data.stringAt('$.bar')
        },
        attempts: 3,
        timeout: cdk.Duration.seconds(60)
      })
    });

    const definition = new sfn.Pass(this, 'Start', {
      result: sfn.Result.fromObject({ bar: 'SomeValue' })
    }).next(submitJob);

    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition
    });

    new cdk.CfnOutput(this, 'JobQueueArn', {
      value: batchQueue.jobQueueArn
    });
    new cdk.CfnOutput(this, 'StateMachineArn', {
      value: stateMachine.stateMachineArn
    });
  }
}

const app = new cdk.App();
new RunBatchStack(app, 'aws-stepfunctions-integ');
app.synth();

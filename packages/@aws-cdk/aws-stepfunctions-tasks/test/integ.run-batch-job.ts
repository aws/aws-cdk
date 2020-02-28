import * as batch from '@aws-cdk/aws-batch';
import * as ecs from '@aws-cdk/aws-ecs';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as path from 'path';
import * as tasks from '../lib';

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
        array: { size: 15 },
        containerOverrides: {
          command: ['sudo', 'rm'],
          environment: [{ name: 'key', value: 'value' }],
          instanceType: 'MULTI',
          memory: 1024,
          gpuCount: 1,
          vcpus: 10
        },
        dependsOn: [{ jobId: '1234', type: 'some_type' }],
        payload: {
          foo: sfn.Data.stringAt('$.bar')
        },
        retryAttempts: 3,
        timeout: cdk.Duration.seconds(30)
      })
    });

    const definition = new sfn.Pass(this, 'Start', {
      result: sfn.Result.fromObject({ SomeKey: 'SomeValue' })
    }).next(submitJob);

    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition,
      timeout: cdk.Duration.seconds(30)
    });

    stateMachine.node.addDependency(batchQueue);
    stateMachine.node.addDependency(batchJobDefinition);
  }
}

const app = new cdk.App();
new RunBatchStack(app, 'aws-stepfunctions-integ');
app.synth();

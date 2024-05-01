import * as path from 'path';
import * as batch from 'aws-cdk-lib/aws-batch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import { BatchSubmitJob } from 'aws-cdk-lib/aws-stepfunctions-tasks';

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

    const batchJobDefinition = new batch.EcsJobDefinition(this, 'JobDefinition', {
      container: new batch.EcsEc2ContainerDefinition(this, 'Container', {
        image: ecs.ContainerImage.fromAsset(
          path.resolve(__dirname, 'batchjob-image'),
        ),
        cpu: 256,
        memory: cdk.Size.mebibytes(2048),
      }),
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
      tags: {
        key: 'value',
      },
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

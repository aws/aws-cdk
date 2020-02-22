import * as batch from '@aws-cdk/aws-batch';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../lib';

class InvokeBatchStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const role = new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSBatchServiceRole'
        )
      ]
    });

    const batchComputeEnv = new batch.CfnComputeEnvironment(
      this,
      'BatchCompute',
      {
        type: 'UNMANAGED',
        serviceRole: role.roleArn,
        computeEnvironmentName: 'SfnCompute'
      }
    );

    const batchQueue = new batch.CfnJobQueue(this, 'BatchQueue', {
      priority: 1,
      jobQueueName: 'SfnJobQueue',
      computeEnvironmentOrder: [
        {
          order: 1,
          computeEnvironment: batchComputeEnv.computeEnvironmentName as string
        }
      ]
    });
    batchQueue.addDependsOn(batchComputeEnv);

    const batchJob = new batch.CfnJobDefinition(this, 'BatchJob', {
      type: 'container',
      jobDefinitionName: 'SfnJob',
      containerProperties: {
        image: 'amazonlinux',
        vcpus: 16,
        memory: 1024
      }
    });
    batchJob.addDependsOn(batchQueue);

    const submitJob = new sfn.Task(this, 'Submit Job', {
      task: new tasks.InvokeBatchJob({
        jobDefinition: `${batchJob.jobDefinitionName}`,
        jobName: 'MyJob',
        jobQueue: `${batchQueue.jobQueueName}`,
        arrayProperties: {
          Size: 15
        },
        containerOverrides: {
          Command: ['sudo', 'rm'],
          Environment: [{ Name: 'key', Value: 'value' }],
          InstanceType: 'MULTI',
          Memory: 1024,
          ResourceRequirements: [{ Type: 'GPU', Value: '1' }],
          Vcpus: 10
        },
        dependsOn: [{ JobId: '1234', Type: 'some_type' }],
        payload: {
          foo: sfn.Data.stringAt('$.bar')
        },
        retryStrategy: { Attempts: 3 },
        timeout: { AttemptDurationSeconds: 30 }
      })
    });

    const definition = new sfn.Pass(this, 'Start', {
      result: sfn.Result.fromObject({ SomeKey: 'SomeValue' })
    }).next(submitJob);

    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition,
      timeout: cdk.Duration.seconds(30)
    });
    stateMachine.node.addDependency(batchJob);
  }
}

const app = new cdk.App();
new InvokeBatchStack(app, 'aws-stepfunctions-integ');
app.synth();

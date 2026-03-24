import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Size, Stack } from 'aws-cdk-lib';
import * as batch from 'aws-cdk-lib/aws-batch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

const app = new App();
const stack = new Stack(app, 'BatchSubmitJobScopedStack');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 1 });

const jobDef = new batch.EcsJobDefinition(stack, 'JobDef', {
  container: new batch.EcsEc2ContainerDefinition(stack, 'Container', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memory: Size.mebibytes(512),
    cpu: 1,
  }),
});

const queue = new batch.JobQueue(stack, 'Queue', {
  computeEnvironments: [{
    computeEnvironment: new batch.ManagedEc2EcsComputeEnvironment(stack, 'CE', { vpc }),
    order: 1,
  }],
});

const task = new tasks.BatchSubmitJob(stack, 'Task', {
  jobDefinitionArn: jobDef.jobDefinitionArn,
  jobName: 'MyJob',
  jobQueueArn: queue.jobQueueArn,
});

new sfn.StateMachine(stack, 'SM', {
  definitionBody: sfn.DefinitionBody.fromChainable(task),
});

new IntegTest(app, 'BatchSubmitJobScopedInteg', {
  testCases: [stack],
});

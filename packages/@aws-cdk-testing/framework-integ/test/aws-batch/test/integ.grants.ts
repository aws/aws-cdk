import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, Stack, Size } from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as batch from 'aws-cdk-lib/aws-batch';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new App();
const stack = new Stack(app, 'stack');
const vpc = new Vpc(stack, 'vpc', { restrictDefaultSecurityGroup: false });

const queue = new batch.JobQueue(stack, 'joBBQ', {
  computeEnvironments: [{
    computeEnvironment: new batch.ManagedEc2EcsComputeEnvironment(stack, 'managedEc2CE', {
      vpc,
    }),
    order: 1,
  }],
  priority: 10,
});

const ecsJob = new batch.EcsJobDefinition(stack, 'ECSJob', {
  container: new batch.EcsEc2ContainerDefinition(stack, 'EcsContainer', {
    cpu: 256,
    memory: Size.mebibytes(2048),
    image: ecs.ContainerImage.fromRegistry('foorepo/fooimage'),
  }),
});

const user = new iam.User(stack, 'MyUser');
ecsJob.grantSubmitJob(user, queue);

new integ.IntegTest(app, 'BatchEcsJobDefinitionTest', {
  testCases: [stack],
});

app.synth();

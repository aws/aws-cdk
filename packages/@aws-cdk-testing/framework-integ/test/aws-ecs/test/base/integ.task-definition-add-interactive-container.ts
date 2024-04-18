import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDefinition', {
  memoryLimitMiB: 512,
  cpu: 256,
});

taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  interactive: true,
});

new integ.IntegTest(app, 'aws-ecs-container-definition-interactive', {
  testCases: [stack],
});

app.synth();

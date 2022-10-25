import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage } from '@aws-cdk/aws-ecs';
import { App, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { ApplicationLoadBalancedFargateService } from '../../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ-circuit-breaker-no-dc');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new Cluster(stack, 'Cluster', { vpc });

new ApplicationLoadBalancedFargateService(stack, 'myService', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  circuitBreaker: { rollback: true },
});

new integ.IntegTest(app, 'circuitBreakerNoDeploymentControllerFargateTest', {
  testCases: [stack],
});

app.synth();

import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { App, Duration, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});
const stack = new Stack(app, 'aws-ecs-integ-alb-fg-idletimeout');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new Cluster(stack, 'Cluster', { vpc });

// Loadbalancer with idleTimeout set to 120 seconds
new ApplicationLoadBalancedFargateService(stack, 'myService', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  idleTimeout: Duration.seconds(120),
});

new integ.IntegTest(app, 'idleTimeoutTest', {
  testCases: [stack],
});

app.synth();

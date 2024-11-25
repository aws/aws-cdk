import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { Protocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

import { ApplicationMultipleTargetGroupsFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { ECS_PATTERNS_FARGATE_SERVICE_BASE_HAS_PUBLIC_LB_BY_DEFAULT } from 'aws-cdk-lib/cx-api';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ-fargate-multi-alb-health');
stack.node.setContext(ECS_PATTERNS_FARGATE_SERVICE_BASE_HAS_PUBLIC_LB_BY_DEFAULT, true);

const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new Cluster(stack, 'Cluster', { vpc });

// Two load balancers with two listeners and two target groups.
const applicationMultipleTargetGroupsFargateService = new ApplicationMultipleTargetGroupsFargateService(stack, 'myService', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  loadBalancers: [
    {
      name: 'lb1',
      listeners: [
        {
          name: 'listener1',
        },
      ],
    },
    {
      name: 'lb2',
      listeners: [
        {
          name: 'listener2',
        },
      ],
    },
  ],
  targetGroups: [
    {
      containerPort: 80,
      listener: 'listener1',
    },
    {
      containerPort: 90,
      listener: 'listener2',
    },
  ],
});

applicationMultipleTargetGroupsFargateService.targetGroups[0].configureHealthCheck({
  protocol: Protocol.HTTP,
  healthyThresholdCount: 2,
  unhealthyThresholdCount: 2,
  timeout: Duration.seconds(10),
  interval: Duration.seconds(30),
  healthyHttpCodes: '200',
});

applicationMultipleTargetGroupsFargateService.targetGroups[1].configureHealthCheck({
  protocol: Protocol.HTTP,
  healthyThresholdCount: 2,
  unhealthyThresholdCount: 2,
  timeout: Duration.seconds(10),
  interval: Duration.seconds(30),
  healthyHttpCodes: '200',
});

new IntegTest(app, 'Integ', { testCases: [stack] });

app.synth();

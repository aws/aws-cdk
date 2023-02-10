import { InstanceType, Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage } from '@aws-cdk/aws-ecs';
import { Protocol } from '@aws-cdk/aws-elasticloadbalancingv2';
import { App, Duration, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';

import { ApplicationMultipleTargetGroupsEc2Service } from '../../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ-multiple-alb-healthchecks');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new Cluster(stack, 'Cluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new InstanceType('t2.micro') });

// Two load balancers with two listeners and two target groups.
const applicationMultipleTargetGroupsFargateService = new ApplicationMultipleTargetGroupsEc2Service(stack, 'myService', {
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

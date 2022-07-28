import { InstanceType, Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage } from '@aws-cdk/aws-ecs';
import { App, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { ApplicationMultipleTargetGroupsEc2Service } from '../../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new Cluster(stack, 'Cluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new InstanceType('t2.micro') });

// One load balancer with one listener and two target groups.
new ApplicationMultipleTargetGroupsEc2Service(stack, 'myService', {
  cluster,
  memoryLimitMiB: 256,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  enableExecuteCommand: true,
  targetGroups: [
    {
      containerPort: 80,
    },
    {
      containerPort: 90,
      pathPattern: 'a/b/c',
      priority: 10,
    },
  ],
});

new integ.IntegTest(app, 'applicationMultipleTargetGroupsEc2ServiceTest', {
  testCases: [stack],
});

app.synth();
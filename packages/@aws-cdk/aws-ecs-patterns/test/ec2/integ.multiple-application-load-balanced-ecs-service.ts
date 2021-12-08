import { InstanceType, Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, ContainerImage, Ec2TaskDefinition } from '@aws-cdk/aws-ecs';
import { App, Stack } from '@aws-cdk/core';

import { ApplicationMultipleTargetGroupsEc2Service } from '../../lib';

const app = new App();
const stack = new Stack(app, 'aws-ecs-integ');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new Cluster(stack, 'Cluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', { instanceType: new InstanceType('t2.micro') });

const taskDefinition = new Ec2TaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('web', {
  image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  command: ['/usr/sbin/apache2', '-D', 'FOREGROUND', '-C', 'Listen 90'],
  memoryLimitMiB: 256,
});

// One load balancer with one listener and two target groups.
new ApplicationMultipleTargetGroupsEc2Service(stack, 'myService', {
  cluster,
  memoryLimitMiB: 256,
  taskDefinition,
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

app.synth();
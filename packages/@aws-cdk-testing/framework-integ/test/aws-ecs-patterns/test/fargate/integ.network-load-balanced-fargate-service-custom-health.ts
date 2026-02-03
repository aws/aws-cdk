import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { NetworkMultipleTargetGroupsFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new App();

// Stack with custom health percentage settings
const CustomHealthStack = new Stack(app, 'aws-ecs-integ-fargate-health-percentage');
const CustomHealthStackVpc = new Vpc(CustomHealthStack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const CustomHealthStackCluster = new Cluster(CustomHealthStack, 'Cluster', { vpc: CustomHealthStackVpc });

new NetworkMultipleTargetGroupsFargateService(CustomHealthStack, 'myService', {
  cluster: CustomHealthStackCluster,
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
  ],
  targetGroups: [
    {
      containerPort: 80,
      listener: 'listener1',
    },
  ],
  minHealthyPercent: 60,
  maxHealthyPercent: 120,
});

new integ.IntegTest(app, 'networkMultipleTargetGroupsFargateServiceTest', {
  testCases: [CustomHealthStack],
});

app.synth();

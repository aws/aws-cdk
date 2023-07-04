import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import { AUTOSCALING_GENERATE_LAUNCH_TEMPLATE } from 'aws-cdk-lib/cx-api';

const app = new cdk.App({ postCliContext: { [AUTOSCALING_GENERATE_LAUNCH_TEMPLATE]: false } });
const stack = new cdk.Stack(app, 'aws-ecs-integ-alb-ec2-cmd-entrypoint');

// Create VPC and ECS Cluster
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'Ec2Cluster', { vpc });
const provider = new ecs.AsgCapacityProvider(stack, 'CapacityProvier', {
  autoScalingGroup: new autoscaling.AutoScalingGroup(
    stack,
    'AutoScalingGroup',
    {
      vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
    },
  ),
  capacityProviderName: 'test-capacity-provider',
});
cluster.addAsgCapacityProvider(provider);

// Create ALB service with Command and EntryPoint
new ecsPatterns.ApplicationLoadBalancedEc2Service(
  stack,
  'ALBECSServiceWithCommandEntryPoint',
  {
    cluster,
    memoryLimitMiB: 512,
    cpu: 256,
    taskImageOptions: {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      command: ['/usr/sbin/apache2', '-D', 'FOREGROUND'],
      entryPoint: ['/bin/bash', '-l', '-c'],
    },
    capacityProviderStrategies: [
      {
        capacityProvider: provider.capacityProviderName,
        base: 1,
        weight: 1,
      },
    ],
  },
);

new integ.IntegTest(app, 'AlbEc2ServiceWithCommandAndEntryPoint', {
  testCases: [stack],
});

app.synth();

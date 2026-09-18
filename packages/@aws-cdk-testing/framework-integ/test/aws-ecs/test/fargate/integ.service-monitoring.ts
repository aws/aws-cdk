import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-service-monitoring');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
});

// Both metrics share the 20-second (high) resolution.
new ecs.FargateService(stack, 'HighResolutionService', {
  cluster,
  taskDefinition,
  monitoring: {
    metricConfigurations: [{
      metricNames: ['CPUUtilization', 'MemoryUtilization'],
      resolutionSeconds: 20,
    }],
  },
});

// Each metric gets its own resolution.
new ecs.FargateService(stack, 'MixedResolutionService', {
  cluster,
  taskDefinition,
  monitoring: {
    metricConfigurations: [
      { metricNames: ['CPUUtilization'], resolutionSeconds: 20 },
      { metricNames: ['MemoryUtilization'], resolutionSeconds: 60 },
    ],
  },
});

new IntegTest(app, 'ServiceMonitoring', {
  testCases: [stack],
});

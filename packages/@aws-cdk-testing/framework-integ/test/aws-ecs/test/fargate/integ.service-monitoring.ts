import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-fargate-service-monitoring');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 512,
  cpu: 256,
});

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  portMappings: [{ containerPort: 80 }],
});

const service = new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
  monitoring: {
    metricConfigurations: [{
      metricNames: [ecs.ServiceMetricName.CPU_UTILIZATION, ecs.ServiceMetricName.MEMORY_UTILIZATION],
      resolution: ecs.MetricResolution.TWENTY_SECONDS,
    }],
  },
});

const test = new IntegTest(app, 'FargateServiceMonitoring', {
  testCases: [stack],
});

// A monitoring configuration change triggers a new service deployment. Asserting
// that the deployment reaches a COMPLETED rollout state confirms Amazon ECS
// accepted and successfully applied the requested high-resolution metrics.
test.assertions.awsApiCall('ECS', 'describeServices', {
  cluster: cluster.clusterName,
  services: [service.serviceName],
}).assertAtPath('services.0.deployments.0.rolloutState', ExpectedResult.stringLikeRegexp('COMPLETED'));

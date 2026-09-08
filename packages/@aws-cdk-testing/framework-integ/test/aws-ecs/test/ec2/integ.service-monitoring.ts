import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-service-monitoring');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryReservationMiB: 256,
});

const cp = new ecs.AsgCapacityProvider(stack, 'EC2CapacityProvider', {
  autoScalingGroup: new autoscaling.AutoScalingGroup(stack, 'ASG', {
    vpc,
    instanceType: new ec2.InstanceType('t2.micro'),
    machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
  }),
  // This is to allow cdk destroy to work; otherwise deletion will hang bc ASG cannot be deleted
  enableManagedTerminationProtection: false,
});

const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
cluster.addAsgCapacityProvider(cp);

const service = new ecs.Ec2Service(stack, 'Service', {
  cluster,
  taskDefinition,
  monitoring: {
    metricConfigurations: [{
      metricNames: [ecs.ServiceMetricName.CPU_UTILIZATION, ecs.ServiceMetricName.MEMORY_UTILIZATION],
      resolution: ecs.MetricResolution.TWENTY_SECONDS,
    }],
  },
});

const test = new IntegTest(app, 'ServiceMonitoring', {
  testCases: [stack],
});

// A monitoring configuration change triggers a new service deployment. Asserting
// that the deployment reaches a COMPLETED rollout state confirms Amazon ECS
// accepted and successfully applied the requested high-resolution metrics.
test.assertions.awsApiCall('ECS', 'describeServices', {
  cluster: cluster.clusterName,
  services: [service.serviceName],
}).assertAtPath('services.0.deployments.0.rolloutState', ExpectedResult.stringLikeRegexp('COMPLETED'));

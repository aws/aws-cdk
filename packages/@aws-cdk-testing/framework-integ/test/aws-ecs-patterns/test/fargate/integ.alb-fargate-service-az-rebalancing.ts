import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { AvailabilityZoneRebalancing, ContainerImage } from 'aws-cdk-lib/aws-ecs';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});
const stack = new Stack(app, 'aws-ecs-patterns-az-rebalancing');
const vpc = new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });

const service = new ApplicationLoadBalancedFargateService(stack, 'AzRebalancingService', {
  vpc,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  // AvailabilityZoneRebalancing requires maxHealthyPercent > 100.
  maxHealthyPercent: 200,
  availabilityZoneRebalancing: AvailabilityZoneRebalancing.ENABLED,
});

const test = new integ.IntegTest(app, 'AlbFargateAzRebalancingTest', {
  testCases: [stack],
});

// describeServices returns a large object; assert only the one field via a
// filtered output path to avoid a "Response object is too long" failure.
test.assertions.awsApiCall('ECS', 'describeServices', {
  cluster: service.cluster.clusterName,
  services: [service.service.serviceName],
}).assertAtPath('services.0.availabilityZoneRebalancing', integ.ExpectedResult.stringLikeRegexp('ENABLED'));

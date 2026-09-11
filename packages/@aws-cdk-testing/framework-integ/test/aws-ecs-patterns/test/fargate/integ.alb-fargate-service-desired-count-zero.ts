import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

/*
 * Stack verification steps:
 * * the service deploys without waiting for any task to reach a steady state
 * * `aws ecs describe-services --cluster <cluster> --services <service>` reports a desiredCount
 *   and a runningCount of 0
 */

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});

const stack = new Stack(app, 'aws-ecs-integ-alb-fg-desired-count-zero');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new Cluster(stack, 'Cluster', { vpc });

// A suspended service: the load balancer and the service are created, but no task is started.
const albFargateService = new ApplicationLoadBalancedFargateService(stack, 'myService', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  desiredCount: 0,
  openListener: false,
});

const integTest = new integ.IntegTest(app, 'albFargateServiceDesiredCountZero', {
  testCases: [stack],
});

integTest.assertions.awsApiCall('ECS', 'describeServices', {
  cluster: cluster.clusterName,
  services: [albFargateService.service.serviceName],
}).expect(integ.ExpectedResult.objectLike({
  services: [integ.Match.objectLike({
    desiredCount: 0,
    runningCount: 0,
  })],
}));

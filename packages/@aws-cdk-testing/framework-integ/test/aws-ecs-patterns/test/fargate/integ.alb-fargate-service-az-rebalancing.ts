import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-patterns-az-rebalancing');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
  cluster,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  availabilityZoneRebalancing: ecs.AvailabilityZoneRebalancing.ENABLED,
});

new integ.IntegTest(app, 'AlbFargateAzRebalancingTest', {
  testCases: [stack],
});

app.synth();

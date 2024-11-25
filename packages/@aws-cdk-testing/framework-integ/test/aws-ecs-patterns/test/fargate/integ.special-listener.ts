import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import { ECS_PATTERNS_FARGATE_SERVICE_BASE_HAS_PUBLIC_LB_BY_DEFAULT } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-fargate-special-listener');
stack.node.setContext(ECS_PATTERNS_FARGATE_SERVICE_BASE_HAS_PUBLIC_LB_BY_DEFAULT, true);

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

const fargateNlbService = new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'FargateNlbService', {
  cluster,
  listenerPort: 2015,
  taskImageOptions: {
    containerPort: 2015,
    image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
  },
});

const fargateAlbService = new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'FargateAlbService', {
  cluster,
  listenerPort: 2015,
  taskImageOptions: {
    containerPort: 2015,
    image: ecs.ContainerImage.fromRegistry('abiosoft/caddy'),
  },
});

new cdk.CfnOutput(stack, 'AlbDnsName', { value: fargateAlbService.loadBalancer.loadBalancerDnsName });
new cdk.CfnOutput(stack, 'NlbDnsName', { value: fargateNlbService.loadBalancer.loadBalancerDnsName });

new integ.IntegTest(app, 'publicQueueProcessingFargateServiceTest', {
  testCases: [stack],
});

app.synth();

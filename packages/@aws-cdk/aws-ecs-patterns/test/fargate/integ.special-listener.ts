import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as ecsPatterns from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
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

new integ.IntegTest(app, 'specialListenerFargateTest', {
  testCases: [stack],
});

app.synth();

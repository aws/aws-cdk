import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/core');
import ecsPatterns = require('../../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

const fargateNlbService = new ecsPatterns.NetworkLoadBalancedFargateService(stack, "FargateNlbService", {
  cluster,
  listenerPort: 2015,
  taskImageOptions: {
    containerPort: 2015,
    image: ecs.ContainerImage.fromRegistry('abiosoft/caddy')
  },
});

const fargateAlbService = new ecsPatterns.ApplicationLoadBalancedFargateService(stack, "FargateAlbService", {
  cluster,
  listenerPort: 2015,
  taskImageOptions: {
    containerPort: 2015,
    image: ecs.ContainerImage.fromRegistry('abiosoft/caddy')
  },
});

new cdk.CfnOutput(stack, 'AlbDnsName', { value: fargateAlbService.loadBalancer.loadBalancerDnsName });
new cdk.CfnOutput(stack, 'NlbDnsName', { value: fargateNlbService.loadBalancer.loadBalancerDnsName });

app.synth();

import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/core');
import ecsPatterns = require('../../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'L3', {
  cluster,
  memoryLimitMiB: 1024,
  cpu: 512,
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
});

app.synth();

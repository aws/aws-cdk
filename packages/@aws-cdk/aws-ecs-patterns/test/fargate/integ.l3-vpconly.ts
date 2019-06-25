import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/core');
import ecsPatterns = require('../../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAZs: 2 });
new ecsPatterns.LoadBalancedFargateService(stack, 'L3', {
  vpc,
  memoryLimitMiB: 1024,
  cpu: 512,
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
});

const vpc2 = new ec2.Vpc(stack, 'Vpc2', { maxAZs: 2 });
new ecsPatterns.LoadBalancedFargateService(stack, 'L3b', {
  vpc: vpc2,
  memoryLimitMiB: 1024,
  cpu: 512,
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
});

new ecsPatterns.LoadBalancedFargateService(stack, 'L3c', {
  vpc: vpc2,
  memoryLimitMiB: 1024,
  cpu: 512,
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
});

app.synth();

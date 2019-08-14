import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/core');
import ecsPatterns = require('../../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');

new ecsPatterns.LoadBalancedFargateService(stack, 'L3', {
  memoryLimitMiB: 1024,
  cpu: 512,
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
});

new ecsPatterns.LoadBalancedFargateService(stack, 'L3b', {
  memoryLimitMiB: 1024,
  cpu: 512,
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
});

app.synth();

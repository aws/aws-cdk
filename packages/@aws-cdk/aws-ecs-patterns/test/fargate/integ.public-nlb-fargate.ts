import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/core');
import ecsPatterns = require('../../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');

new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'NLBFgSvc', {
  memoryLimitMiB: 1024,
  cpu: 512,
  publicLoadBalancer: true,
  assignPublicIp: true,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
    containerPort: 80
  },
});

app.synth();

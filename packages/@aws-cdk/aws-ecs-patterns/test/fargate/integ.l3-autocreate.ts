import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/cdk');
import ecsPatterns = require('../../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');

new ecsPatterns.LoadBalancedFargateService(stack, 'L3', {
  memoryMiB: '1GB',
  cpu: '512',
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
});

app.synth();

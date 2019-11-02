import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/core');
import ecsPatterns = require('../../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-fargate-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'NLBSpacialPortService', {
  assignPublicIp: true,
  cluster,
  listenerPort: 2015,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("abiosoft/caddy"),
    enableLogging: true,
    containerPort: 2015
  }
});

app.synth();

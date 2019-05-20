import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import ecs = require('../../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAZs: 2 });

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

new ecs.LoadBalancedFargateService(stack, 'L3', {
  cluster,
  memoryMiB: '1GB',
  cpu: '512',
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
});

app.run();

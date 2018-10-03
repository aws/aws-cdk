import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import cdk = require('@aws-cdk/cdk');
import ecs = require('../../lib');

const app = new cdk.App(process.argv);
const stack = new cdk.Stack(app, 'aws-ecs-integ');

const vpc = new ec2.VpcNetwork(stack, 'Vpc', { maxAZs: 2 });
const cluster = new ecs.FargateCluster(stack, 'EcsCluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryMiB: '1GB',
  cpu: '512'
});
taskDefinition.addContainer('web', {
  image: ecs.DockerHub.image("amazon/amazon-ecs-sample"),
  memoryLimitMiB: 1024,
});

const service = new ecs.FargateService(stack, "Service", {
  cluster,
  taskDefinition,
});

const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
const listener = lb.addListener('PublicListener', { port: 80 });
listener.addTargets('ECS', {
  port: 80,
  targets: [service]
});

new cdk.Output(stack, 'LoadBalancerDNS', { value: lb.dnsName });

process.stdout.write(app.run());
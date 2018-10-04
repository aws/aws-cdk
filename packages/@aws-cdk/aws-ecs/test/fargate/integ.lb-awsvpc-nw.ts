import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import cdk = require('@aws-cdk/cdk');
import ecs = require('../../lib');

const app = new cdk.App(process.argv);
const stack = new cdk.Stack(app, 'aws-ecs-integ-fargate');

const vpc = new ec2.VpcNetwork(stack, 'Vpc', { maxAZs: 2 });

const cluster = new ecs.FargateCluster(stack, 'EcsCluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryMiB: '1GB',
  cpu: '512'
});
const container = taskDefinition.addContainer('web', {
  image: ecs.DockerHub.image("amazon/amazon-ecs-sample"),
});
container.addPortMappings({
  containerPort: 80,
  protocol: ecs.Protocol.Tcp
});

const service = new ecs.FargateService(stack, "Service", {
  cluster,
  taskDefinition,
});

const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc, internetFacing: true });
const listener = lb.addListener('PublicListener', { port: 80, open: true });
listener.addTargets('ECS', {
  port: 80,
  targets: [service]
});

new cdk.Output(stack, 'LoadBalancerDNS', { value: lb.dnsName, });

process.stdout.write(app.run());
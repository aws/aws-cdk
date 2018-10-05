import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import cdk = require('@aws-cdk/cdk');
import ecs = require('../../lib');
import { NetworkMode } from '../../lib';

const app = new cdk.App(process.argv);
const stack = new cdk.Stack(app, 'aws-ecs-integ');

const vpc = new ec2.VpcNetwork(stack, 'Vpc', { maxAZs: 2 });

const cluster = new ecs.EcsCluster(stack, 'EcsCluster', { vpc });

const taskDefinition = new ecs.EcsTaskDefinition(stack, 'TaskDef', {
  networkMode: NetworkMode.AwsVpc
});

const container = taskDefinition.addContainer('web', {
  image: ecs.DockerHub.image("amazon/amazon-ecs-sample"),
  memoryLimitMiB: 256,
});

container.addPortMappings({
  containerPort: 80,
  protocol: ecs.Protocol.Tcp
});

const service = new ecs.EcsService(stack, "Service", {
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
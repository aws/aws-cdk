import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 1024,
  cpu: 512,
});

const container = taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
});

container.addPortMappings({
  containerPort: 80,
  protocol: ecs.Protocol.TCP,
});

const service = new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
});

const scaling = service.autoScaleTaskCount({ maxCapacity: 10 });
// Quite low to try and force it to scale
scaling.scaleOnCpuUtilization('ReasonableCpu', { targetUtilizationPercent: 10 });

const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc, internetFacing: true });
const listener = lb.addListener('PublicListener', { port: 80 });

service.registerLoadBalancerTargets(
  {
    containerName: 'web',
    containerPort: 80,
    listener: ecs.ListenerConfig.networkListener(listener),
    newTargetGroupId: 'ECS',
  },
);

new cdk.CfnOutput(stack, 'LoadBalancerDNS', { value: lb.loadBalancerDnsName });

app.synth();

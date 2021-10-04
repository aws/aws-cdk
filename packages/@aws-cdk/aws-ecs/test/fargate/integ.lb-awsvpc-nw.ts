import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';
import * as path from 'path';
import { DockerPlatform } from '@aws-cdk/aws-ecr-assets';

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

const stack = new cdk.Stack(app, 'aws-ecs-integ', { env });

// const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const vpc = ec2.Vpc.fromLookup(stack, 'Vpc', { isDefault: true })

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 1024,
  cpu: 512,
});

// taskDefinition.addContainer('web', {
//   image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
//   portMappings: [{
//     containerPort: 80,
//     protocol: ecs.Protocol.TCP,
//   }],
// });

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../demo-image'), {
    platform: DockerPlatform.AMD_64,
  }),
  portMappings: [{
    containerPort: 8000,
  }],
});

const service = new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
});

const scaling = service.autoScaleTaskCount({ maxCapacity: 10 });
// Quite low to try and force it to scale
scaling.scaleOnCpuUtilization('ReasonableCpu', { targetUtilizationPercent: 10 });

const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc, internetFacing: true });
const listener = lb.addListener('PublicListener', { port: 80, open: true });
listener.addTargets('Fargate', {
  port: 80,
  targets: [service],
});

new cdk.CfnOutput(stack, 'LoadBalancerDNS', { value: lb.loadBalancerDnsName });

app.synth();

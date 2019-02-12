import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import ecs = require('../../lib');
import { NetworkMode } from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-ecs');

const vpc = new ec2.VpcNetwork(stack, 'Vpc', { maxAZs: 2 });

const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro')
});

// Add Private DNS Namespace
const domainName = "scorekeep.com";
cluster.addNamespace({
  name: domainName,
});

// Create frontend service
const frontendTD = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
  networkMode: NetworkMode.AwsVpc
});

const frontend = frontendTD.addContainer('frontend', {
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  memoryLimitMiB: 256,
});

frontend.addPortMappings({
  containerPort: 80,
  hostPort: 80,
  protocol: ecs.Protocol.Tcp
});

const frontendService = new ecs.Ec2Service(stack, "FrontendService", {
  cluster,
  taskDefinition: frontendTD,
});

frontendService.enableServiceDiscovery({
  name: "frontend",
});

app.run();

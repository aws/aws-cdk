import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/core');
import ecs = require('../../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');

// Create a cluster
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro'),
});

const prox = ecs.ProxyConfigurations.appMeshProxyConfiguration({
  containerName: 'envoy',
  properties: {
    ignoredUID: 1337,
    proxyIngressPort: 15000,
    proxyEgressPort: 15001,
    appPorts: [9080, 9081],
    egressIgnoredIPs: ["169.254.170.2", "169.254.169.254"]
  }
});
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', { networkMode: ecs.NetworkMode.AWS_VPC, proxyConfiguration: prox });

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  memoryLimitMiB: 256,
});

taskDefinition.addContainer('envoy', {
  image: ecs.ContainerImage.fromRegistry("envoyproxy/envoy"),
  memoryLimitMiB: 256,
});

new ecs.Ec2Service(stack, "Service", {
  cluster,
  taskDefinition
});

app.synth();
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 1024,
  cpu: 512,
});

// Main container
const mainContainer = taskDefinition.addContainer('nginx', {
  image: ecs.ContainerImage.fromRegistry('nginx'),
});

mainContainer.addPortMappings({
  containerPort: 80,
  protocol: ecs.Protocol.TCP,
});

// Name container SRV
const nameContainer = taskDefinition.addContainer('name', {
  image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
  environment: {
    PORT: '81',
  },
});

nameContainer.addPortMappings({
  containerPort: 81,
  protocol: ecs.Protocol.TCP,
});

// Create a security group that allows tcp @ port 80 & 81
const securityGroup = new ec2.SecurityGroup(stack, 'websvc-sg', { vpc });
securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));
securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(81));

const fargateService = new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
  securityGroup,
  assignPublicIp: true,
  desiredCount: 3,
});

// Create a cloudmap namespace & service
const cloudMapNamespace = new cloudmap.PrivateDnsNamespace(stack, 'namespace', {
  name: 'aws-ecs-integ',
  vpc,
});

const cloudMapService = new cloudmap.Service(stack, 'nameContainerService', {
  namespace: cloudMapNamespace,
  dnsRecordType: cloudmap.DnsRecordType.SRV,
});

// Register the container & port with the namespace.
fargateService.addCloudMapService({
  cloudMapService: cloudMapService,
  container: nameContainer,
  containerPort: 81,
});

app.synth();

// To manually verify, look inside the private dns zone for the records.
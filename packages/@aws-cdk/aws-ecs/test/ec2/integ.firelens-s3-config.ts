import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro'),
});

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
  networkMode: ecs.NetworkMode.AWS_VPC,
});

const asset = new s3_assets.Asset(stack, 'SampleAsset', {
  path: path.join(__dirname, 'firelens.conf'),
});

// firelens log router with custom s3 configuration file
taskDefinition.addFirelensLogRouter('log_router', {
  image: ecs.obtainDefaultFluentBitECRImage(taskDefinition, undefined, '2.1.0'),
  firelensConfig: {
    type: ecs.FirelensLogRouterType.FLUENTBIT,
    options: {
      enableECSLogMetadata: false,
      configFileValue: `${asset.bucket.bucketArn}/${asset.s3ObjectKey}`,
    },
  },
  logging: new ecs.AwsLogDriver({ streamPrefix: 'firelens' }),
  memoryReservationMiB: 50,
});

// new container with firelens log driver
const container = taskDefinition.addContainer('nginx', {
  image: ecs.ContainerImage.fromRegistry('nginx'),
  memoryLimitMiB: 256,
  logging: ecs.LogDrivers.firelens({
    options: {
      Name: 'cloudwatch',
      region: stack.region,
      log_group_name: 'ecs-integ-test',
      auto_create_group: 'true',
      log_stream_prefix: 'nginx',
    },
  }),
});

container.addPortMappings({
  containerPort: 80,
  protocol: ecs.Protocol.TCP,
});

// Create a security group that allows tcp @ port 80
const securityGroup = new ec2.SecurityGroup(stack, 'websvc-sg', { vpc });
securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));
new ecs.Ec2Service(stack, 'Service', {
  cluster,
  taskDefinition,
  securityGroup,
});

app.synth();

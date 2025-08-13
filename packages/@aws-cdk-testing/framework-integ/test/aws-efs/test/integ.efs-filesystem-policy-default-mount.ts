import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App({
  context: {
    '@aws-cdk/aws-efs:defaultAllowClientMount': true,
  },
});

const stack = new Stack(app, 'integ-efs-simple-mount-test');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
});

const taskSecurityGroup = new ec2.SecurityGroup(stack, 'TaskSecurityGroup', {
  vpc,
  description: 'Security group for Fargate tasks',
});

const efsSecurityGroup = new ec2.SecurityGroup(stack, 'EfsSecurityGroup', {
  vpc,
  description: 'Security group for EFS',
});

efsSecurityGroup.addIngressRule(
  taskSecurityGroup,
  ec2.Port.tcp(2049),
  'Allow NFS traffic from Fargate tasks',
);

const fileSystem = new efs.FileSystem(stack, 'FileSystem', {
  vpc,
  securityGroup: efsSecurityGroup,
  allowAnonymousAccess: false,
});

const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

taskDefinition.addVolume({
  name: 'efs-volume',
  efsVolumeConfiguration: {
    fileSystemId: fileSystem.fileSystemId,
    transitEncryption: 'ENABLED',
  },
});

const container = taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 512,
  logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'efs-mount-test' }),
  environment: {
    // Reduced mount retries and timeout for faster failure
    AWS_EFS_MOUNT_RETRIES: '1',
    AWS_EFS_MOUNT_TIMEOUT_SECONDS: '15',
  },
});

container.addMountPoints({
  sourceVolume: 'efs-volume',
  containerPath: '/mnt/efs',
  readOnly: false,
});

new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
  desiredCount: 1,
  securityGroups: [taskSecurityGroup],
});

new integ.IntegTest(app, 'EfsSimpleMountTest', {
  testCases: [stack],
});

app.synth();

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-exec-command');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const kmsKey = new kms.Key(stack, 'KmsKey');

const logGroup = new logs.LogGroup(stack, 'LogGroup', {
  encryptionKey: kmsKey,
});

const execBucket = new s3.Bucket(stack, 'EcsExecBucket', {
  encryptionKey: kmsKey,
});

const cluster = new ecs.Cluster(stack, 'FargateCluster', {
  vpc,
  executeCommandConfiguration: {
    kmsKey,
    logConfiguration: {
      cloudWatchLogGroup: logGroup,
      cloudWatchEncryptionEnabled: true,
      s3Bucket: execBucket,
      s3EncryptionEnabled: true,
      s3KeyPrefix: 'exec-output',
    },
    logging: ecs.ExecuteCommandLogging.OVERRIDE,
  },
});

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  healthCheck: {
    command: ['CMD-SHELL', 'curl localhost:8000'],
    interval: Duration.seconds(60),
    timeout: Duration.seconds(40),
  },
});

new ecs.FargateService(stack, 'FargateService', {
  cluster,
  taskDefinition,
  enableExecuteCommand: true,
});

new integ.IntegTest(app, 'exec-command-integ-test', {
  testCases: [stack],
  diffAssets: true,
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});

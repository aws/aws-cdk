import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature': false,
    '@aws-cdk/aws-ecs:disableEcsImdsBlocking': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new cdk.Stack(app, 'aws-ecs-integ-exec-command');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const kmsKey = new kms.Key(stack, 'KmsKey');

const logGroup = new logs.LogGroup(stack, 'LogGroup', {
  encryptionKey: kmsKey,
});

const execBucket = new s3.Bucket(stack, 'EcsExecBucket', {
  encryptionKey: kmsKey,
});

const cluster = new ecs.Cluster(stack, 'Ec2Cluster', {
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
cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro'),
});

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 256,
});

new ecs.Ec2Service(stack, 'Ec2Service', {
  cluster,
  taskDefinition,
  enableExecuteCommand: true,
});

app.synth();

import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as efs from '@aws-cdk/aws-efs';
import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as batch from '../lib/';

export const app = new cdk.App();

const stack = new cdk.Stack(app, 'batch-stack');

const vpc = new ec2.Vpc(stack, 'vpc');

const efsFs = new efs.FileSystem(stack, 'EFS', {
  vpc,
  performanceMode: efs.PerformanceMode.GENERAL_PURPOSE,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const accessPoint = new efs.AccessPoint(
  stack,
  'EFSAccessPoint',
  {
    fileSystem: efsFs,
    createAcl: {
      ownerUid: '1000',
      ownerGid: '1000',
      permissions: '750',
    },
    posixUser: {
      uid: '1000',
      gid: '1000',
    },
  },
);

const volumes: ecs.Volume[] = [{
  name: cdk.Names.uniqueId(efsFs),
  efsVolumeConfiguration: {
    fileSystemId: efsFs.fileSystemId,
    transitEncryption: 'ENABLED',
    authorizationConfig: {
      accessPointId: accessPoint.accessPointId,
      iam: 'ENABLED',
    },
  },
}];

const mountPoints: ecs.MountPoint[] = [{
  containerPath: '/mnt',
  sourceVolume: volumes[0].name,
  readOnly: true,
}];

const jobRole = new iam.Role(stack, 'DefaultJobRole', {
  assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
});

efsFs.grant(jobRole, 'elasticfilesystem:ClientRead');

const launchTemplate = new ec2.CfnLaunchTemplate(stack, 'ec2-launch-template', {
  launchTemplateName: 'EC2LaunchTemplate',
  launchTemplateData: {
    blockDeviceMappings: [
      {
        deviceName: '/dev/xvdcz',
        ebs: {
          encrypted: true,
          volumeSize: 100,
          volumeType: 'gp2',
        },
      },
    ],
  },
});

const computeEnvironments = [
  {
    computeEnvironment: new batch.ComputeEnvironment(stack, 'batch-demand-compute-env-launch-template', {
      managed: true,
      computeResources: {
        type: batch.ComputeResourceType.ON_DEMAND,
        vpc,
        launchTemplate: {
          launchTemplateName: launchTemplate.launchTemplateName as string,
        },
        computeResourcesTags: {
          'compute-env-tag': '123XYZ',
        },
      },
    }),
    order: 2,
  },
  {
    computeEnvironment: new batch.ComputeEnvironment(stack, 'batch-spot-compute-env', {
      managed: true,
      computeResources: {
        type: batch.ComputeResourceType.SPOT,
        vpc,
        bidPercentage: 80,
      },
    }),
    order: 3,
  },
  {
    computeEnvironment: new batch.ComputeEnvironment(stack, 'batch-demand-compute-env-launch-template-2', {
      managed: true,
      computeResources: {
        type: batch.ComputeResourceType.ON_DEMAND,
        vpc,
        launchTemplate: {
          launchTemplateId: launchTemplate.ref as string,
        },
        computeResourcesTags: {
          'compute-env-tag': '123XYZ',
        },
      },
    }),
    order: 4,
  },
];

// Allow Comppute Environments to access the filesystem
computeEnvironments.forEach((ce) => {
  efsFs.connections.allowDefaultPortFrom(ce.computeEnvironment);
});

new batch.JobQueue(stack, 'batch-job-queue', { computeEnvironments });

const fargateEnvironments = [
  {
    computeEnvironment: new batch.ComputeEnvironment(stack, 'batch-fargate-compute-env', {
      managed: true,
      computeResources: {
        type: batch.ComputeResourceType.FARGATE,
        vpc,
      },
    }),
    order: 1,
  },
  {
    computeEnvironment: new batch.ComputeEnvironment(stack, 'batch-fargate-spot-compute-env', {
      managed: true,
      computeResources: {
        type: batch.ComputeResourceType.FARGATE_SPOT,
        vpc,
      },
    }),
    order: 2,
  },
];

fargateEnvironments.forEach((ce) => {
  efsFs.connections.allowDefaultPortFrom(ce.computeEnvironment);
});

// Split out into two job queues because each queue
// supports a max of 3 compute environments
new batch.JobQueue(stack, 'batch-job-fargate-queue', {
  computeEnvironments: fargateEnvironments,
});

const repo = new ecr.Repository(stack, 'batch-job-repo');

new batch.JobDefinition(stack, 'batch-job-def-from-ecr', {
  container: {
    jobRole,
    image: new ecs.EcrImage(repo, 'latest'),
    mountPoints,
    volumes,
  },
});

const secret = new secretsmanager.Secret(stack, 'batch-secret');
const executionRole = new iam.Role(stack, 'execution-role', {
  assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
});

new batch.JobDefinition(stack, 'batch-job-def-fargate', {
  platformCapabilities: [batch.PlatformCapabilities.FARGATE],
  container: {
    image: ecs.ContainerImage.fromRegistry('docker/whalesay'),
    // Have to specify 1.4 here rather than LATEST - stack fails to deploy with
    // 'LATEST' which is a bug somewhere in CloudFormation/Fargate
    platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    executionRole,
    jobRole,
    secrets: {
      SECRET: ecs.Secret.fromSecretsManager(secret),
    },
    mountPoints,
    volumes,
  },
});

new integ.IntegTest(app, 'BatchWithEFSTest', {
  testCases: [stack],
});

app.synth();
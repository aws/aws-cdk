import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import * as batch from '../lib/';

export const app = new cdk.App();

const stack = new cdk.Stack(app, 'batch-stack');

const vpc = new ec2.Vpc(stack, 'vpc');

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

new batch.JobQueue(stack, 'batch-job-queue', {
  computeEnvironments: [
    {
      computeEnvironment: new batch.ComputeEnvironment(stack, 'batch-unmanaged-compute-env', {
        managed: false,
      }),
      order: 1,
    },
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
  ],
});

// Split out into two job queues because each queue
// supports a max of 3 compute environments
new batch.JobQueue(stack, 'batch-job-fargate-queue', {
  computeEnvironments: [
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
  ],
});

const repo = new ecr.Repository(stack, 'batch-job-repo');
const secret = new secretsmanager.Secret(stack, 'batch-secret');

new batch.JobDefinition(stack, 'batch-job-def-from-ecr', {
  container: {
    image: new ecs.EcrImage(repo, 'latest'),
  },
});

new batch.JobDefinition(stack, 'batch-job-def-from-', {
  container: {
    image: ecs.ContainerImage.fromRegistry('docker/whalesay'),
  },
});

const executionRole = new iam.Role(stack, 'execution-role', {
  assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
});

new batch.JobDefinition(stack, 'batch-job-def-fargate', {
  platformCapabilities: [batch.PlatformCapabilities.FARGATE],
  container: {
    image: ecs.ContainerImage.fromRegistry('docker/whalesay'),
    executionRole,
    secrets: {
      SECRET: ecs.Secret.fromSecretsManager(secret),
    },
  },
});

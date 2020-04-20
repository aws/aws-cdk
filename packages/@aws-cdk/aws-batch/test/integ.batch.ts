import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
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
  ],
});

const repo = new ecr.Repository(stack, 'batch-job-repo');

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

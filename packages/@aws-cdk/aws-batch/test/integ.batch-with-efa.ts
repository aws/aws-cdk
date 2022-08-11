import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as batch from '../lib/';

export const app = new cdk.App();

const stack = new cdk.Stack(app, 'batch-stack');

const vpc = new ec2.Vpc(stack, 'vpc');

const launchTemplate = new ec2.CfnLaunchTemplate(stack, 'ec2-launch-template', {
  launchTemplateName: 'EC2LaunchTemplate',
  launchTemplateData: {
    networkInterfaces: [{
      deviceIndex: 0,
      subnetId: vpc.privateSubnets[0].subnetId,
      interfaceType: 'efa',
    }],
  },
});

const computeEnvironment = new batch.ComputeEnvironment(stack, 'EFABatch', {
  managed: true,
  computeResources: {
    type: batch.ComputeResourceType.ON_DEMAND,
    instanceTypes: [new ec2.InstanceType('c5n')],
    vpc,
    launchTemplate: {
      launchTemplateName: launchTemplate.launchTemplateName as string,
    },
  },
});

new batch.JobQueue(stack, 'batch-job-queue', {
  computeEnvironments: [
    {
      computeEnvironment,
      order: 1,
    },
  ],
});

new integ.IntegTest(app, 'BatchWithEFSTest', {
  testCases: [stack],
});

app.synth();
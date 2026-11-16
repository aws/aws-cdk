import { App, Stack } from 'aws-cdk-lib';
import { BuildSpec, HostKernel, LinuxArmBuildImage, LinuxBuildImage, Project } from 'aws-cdk-lib/aws-codebuild';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'codebuild-project-host-kernel');

const buildSpec = BuildSpec.fromObject({
  version: '0.2',
  phases: {
    build: {
      commands: ['uname -r'],
    },
  },
});

new Project(stack, 'Kernel6Project', {
  buildSpec,
  environment: {
    buildImage: LinuxBuildImage.STANDARD_7_0,
    hostKernel: HostKernel.LINUX_KERNEL_6,
  },
});

new Project(stack, 'Kernel4Project', {
  buildSpec,
  environment: {
    buildImage: LinuxBuildImage.STANDARD_7_0,
    hostKernel: HostKernel.LINUX_KERNEL_4,
  },
});

new Project(stack, 'LatestKernelArmProject', {
  buildSpec,
  environment: {
    buildImage: LinuxArmBuildImage.AMAZON_LINUX_2023_STANDARD_3_0,
    hostKernel: HostKernel.LINUX_KERNEL_LATEST,
  },
});

new IntegTest(app, 'codebuild-project-host-kernel-integ', {
  testCases: [stack],
});

import { App, Stack } from 'aws-cdk-lib';
import { BuildSpec, HostKernel, LinuxArmBuildImage, LinuxBuildImage, Project } from 'aws-cdk-lib/aws-codebuild';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

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

const kernel6Project = new Project(stack, 'Kernel6Project', {
  buildSpec,
  environment: {
    buildImage: LinuxBuildImage.STANDARD_7_0,
    hostKernel: HostKernel.LINUX_KERNEL_6,
  },
});

const kernel4Project = new Project(stack, 'Kernel4Project', {
  buildSpec,
  environment: {
    buildImage: LinuxBuildImage.STANDARD_7_0,
    hostKernel: HostKernel.LINUX_KERNEL_4,
  },
});

const latestKernelArmProject = new Project(stack, 'LatestKernelArmProject', {
  buildSpec,
  environment: {
    buildImage: LinuxArmBuildImage.AMAZON_LINUX_2023_STANDARD_3_0,
    hostKernel: HostKernel.LINUX_KERNEL_LATEST,
  },
});

const integ = new IntegTest(app, 'codebuild-project-host-kernel-integ', {
  testCases: [stack],
});

for (const [project, expectedHostKernel] of [
  [kernel6Project, 'LINUX_KERNEL_6'],
  [kernel4Project, 'LINUX_KERNEL_4'],
  [latestKernelArmProject, 'LINUX_KERNEL_LATEST'],
] as const) {
  integ.assertions.awsApiCall('CodeBuild', 'batchGetProjects', {
    names: [project.projectName],
  }).expect(ExpectedResult.objectLike({
    projects: [{
      environment: {
        hostKernel: expectedHostKernel,
      },
    }],
  }));
}

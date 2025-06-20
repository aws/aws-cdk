import { App, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BuildSpec, ComputeType, LinuxBuildImage, LinuxArmBuildImage, Project } from 'aws-cdk-lib/aws-codebuild';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class AmazonLinuxArmTestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new Project(this, 'MyProjectMedium', {
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
      }),
      environment: {
        buildImage: LinuxBuildImage.AMAZON_LINUX_2_ARM_3,
        computeType: ComputeType.MEDIUM,
      },
    });

    new Project(this, 'MyProjectXLarge', {
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
      }),
      environment: {
        buildImage: LinuxBuildImage.AMAZON_LINUX_2_ARM_3,
        computeType: ComputeType.X_LARGE,
      },
    });

    new Project(this, 'MyProjectX2Large', {
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
      }),
      environment: {
        buildImage: LinuxBuildImage.AMAZON_LINUX_2_ARM_3,
        computeType: ComputeType.X2_LARGE,
      },
    });

    new Project(this, 'MyProjectARMAL2023', {
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
      }),
      environment: {
        buildImage: LinuxArmBuildImage.AMAZON_LINUX_2023_AMI,
        computeType: ComputeType.MEDIUM,
      },
    });

    new Project(this, 'MyProjectAL2023', {
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
      }),
      environment: {
        buildImage: LinuxBuildImage.AMAZON_LINUX_2023_AMI,
        computeType: ComputeType.MEDIUM,
      },
    });
  }
}

const app = new App();

const codebuildArm = new AmazonLinuxArmTestStack(app, 'codebuild-project-arm');

new IntegTest(app, 'integ-test-codebuild-project-arm', {
  testCases: [codebuildArm],
});

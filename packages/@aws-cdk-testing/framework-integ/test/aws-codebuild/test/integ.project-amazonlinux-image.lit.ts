import { App, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import type { IBuildImage } from 'aws-cdk-lib/aws-codebuild';
import { BuildSpec, LinuxBuildImage, Project } from 'aws-cdk-lib/aws-codebuild';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class AmazonLinuxImageTestStack extends Stack {
  constructor(scope: Construct, id: string, image: IBuildImage) {
    super(scope, id);

    new Project(this, 'MyProject', {
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
      }),
      environment: {
        buildImage: image,
      },
    });
  }
}

const app = new App();

new IntegTest(app, 'amazon-linux-codebuild', {
  testCases: [
    new AmazonLinuxImageTestStack(app, 'codebuild-project-amazonlinux-2-5', LinuxBuildImage.AMAZON_LINUX_2_5),
    new AmazonLinuxImageTestStack(app, 'codebuild-project-amazonlinux-2023-6', LinuxBuildImage.AMAZON_LINUX_2023_6),
  ],
  stackUpdateWorkflow: true,
});

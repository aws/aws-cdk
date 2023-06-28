import { App, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BuildSpec, LinuxBuildImage, Project } from 'aws-cdk-lib/aws-codebuild';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class AmazonLinuxImageTestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new Project(this, 'MyProject', {
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
      }),
      environment: {
        buildImage: LinuxBuildImage.AMAZON_LINUX_2_5,
      },
    });
  }
}

const app = new App();

const codebuildamazonlinux25 = new AmazonLinuxImageTestStack(app, 'codebuild-project-amazonlinux-2-5');

new IntegTest(app, 'amazon-linux-2-5-codebuild', {
  testCases: [codebuildamazonlinux25],
  stackUpdateWorkflow: true,
});

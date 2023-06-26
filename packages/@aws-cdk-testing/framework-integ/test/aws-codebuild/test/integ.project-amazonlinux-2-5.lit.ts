/// !cdk-integ *
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib/core';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    /// !show
    new codebuild.Project(this, 'MyProject', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              'echo "Hello, CodeBuild!"',
            ],
          },
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_5,
      },
    });
    /// !hide
  }
}

const app = new cdk.App();

const codebuildamazonlinux25 = new TestStack(app, 'codebuild-default-project');

// THEN
new IntegTest(app, 'amazon-linux-2-5-codebuild', {
  testCases: [codebuildamazonlinux25],
  stackUpdateWorkflow: false,
});

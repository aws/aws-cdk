import * as ecr from '@aws-cdk/aws-ecr';
import * as cdk from '@aws-cdk/core';
import * as codebuild from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const repository = new ecr.Repository(this, 'my-repo');

    new codebuild.Project(this, 'Project', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: { commands: ['ls'] },
        },
      }),
      environment: {
        buildImage: codebuild.LinuxGpuBuildImage.fromEcrRepository(repository),
      },
    });
  }
}

const app = new cdk.App();

new TestStack(app, 'test-codebuild-linux-gpu');

app.synth();

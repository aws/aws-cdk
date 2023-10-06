import * as ecr from '../../aws-ecr';
import * as cdk from '../../core';
import * as codebuild from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const ecrRepository = new ecr.Repository(this, 'MyRepo');

    new codebuild.Project(this, 'MyProject', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: ['ls'],
          },
        },
      }),
      grantReportGroupPermissions: false,
      /// !show
      environment: {
        buildImage: codebuild.LinuxBuildImage.fromEcrRepository(ecrRepository, 'v1.0'),
      },
      /// !hide
    });
  }
}

const app = new cdk.App();

new TestStack(app, 'test-codebuild-docker-asset');

app.synth();

import { App, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BuildSpec, IBuildImage, Project, WindowsBuildImage } from 'aws-cdk-lib/aws-codebuild';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class ImageTestStack extends Stack {
  constructor(scope: Construct, id: string, image: IBuildImage) {
    super(scope, id);
    new Project(this, 'Project', {
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
      }),
      environment: {
        buildImage: image,
        computeType: image.defaultComputeType,
      },
    });
  }
}

const app = new App();

new IntegTest(app, 'integ-project-windows-images', {
  testCases: [
    new ImageTestStack(app, 'WinCore2019-1', WindowsBuildImage.WIN_SERVER_CORE_2019_BASE),
    new ImageTestStack(app, 'WinCore2019-2', WindowsBuildImage.WIN_SERVER_CORE_2019_BASE_2_0),
    new ImageTestStack(app, 'WinCore2019-3', WindowsBuildImage.WIN_SERVER_CORE_2019_BASE_3_0),
    new ImageTestStack(app, 'WinCore2022-3', WindowsBuildImage.WIN_SERVER_CORE_2022_BASE_3_0),
  ],
});

app.synth();

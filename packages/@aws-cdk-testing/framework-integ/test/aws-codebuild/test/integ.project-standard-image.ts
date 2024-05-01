import { App, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BuildSpec, IBuildImage, LinuxBuildImage, Project } from 'aws-cdk-lib/aws-codebuild';
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
      },
    });
  }
}

const app = new App();

new IntegTest(app, 'integ-project-standard-images', {
  testCases: [
    new ImageTestStack(app, 'Standard1', LinuxBuildImage.STANDARD_1_0),
    new ImageTestStack(app, 'Standard2', LinuxBuildImage.STANDARD_2_0),
    new ImageTestStack(app, 'Standard3', LinuxBuildImage.STANDARD_3_0),
    new ImageTestStack(app, 'Standard4', LinuxBuildImage.STANDARD_4_0),
    new ImageTestStack(app, 'Standard5', LinuxBuildImage.STANDARD_5_0),
    new ImageTestStack(app, 'Standard6', LinuxBuildImage.STANDARD_6_0),
    new ImageTestStack(app, 'Standard7', LinuxBuildImage.STANDARD_7_0),
  ],
});

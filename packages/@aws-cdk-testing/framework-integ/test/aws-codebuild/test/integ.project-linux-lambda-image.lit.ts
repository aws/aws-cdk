import { App, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LinuxLambdaBuildImage, Project, BuildSpec, ComputeType } from 'aws-cdk-lib/aws-codebuild';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class LinuxLambdaImageTestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new Project(this, 'MyProject', {
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
      }),
      environment: {
        computeType: ComputeType.LAMBDA_1GB,
        buildImage: LinuxLambdaBuildImage.AMAZON_LINUX_2_NODE_18,
      },
    });
  }
}

const app = new App();

const codebuildLinuxLambda = new LinuxLambdaImageTestStack(app, 'codebuild-project-linux-lambda');

new IntegTest(app, 'linux-lambda-codebuild', {
  testCases: [codebuildLinuxLambda],
  stackUpdateWorkflow: true,
});

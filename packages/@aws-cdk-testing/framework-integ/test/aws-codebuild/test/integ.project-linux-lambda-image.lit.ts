import { App, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LinuxLambdaBuildImage, Project, BuildSpec, ComputeType } from 'aws-cdk-lib/aws-codebuild';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class LinuxLambdaImageTestStack extends Stack {
  public readonly project: Project;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.project = new Project(this, 'MyProject', {
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: ['ls'],
          },
        },
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

const integ = new IntegTest(app, 'linux-lambda-codebuild', {
  testCases: [codebuildLinuxLambda],
  stackUpdateWorkflow: true,
});

// Execute the `startBuild` API to confirm that the build can be done correctly using Lambda compute.
integ.assertions.awsApiCall('CodeBuild', 'startBuild', {
  projectName: codebuildLinuxLambda.project.projectName,
}).waitForAssertions();

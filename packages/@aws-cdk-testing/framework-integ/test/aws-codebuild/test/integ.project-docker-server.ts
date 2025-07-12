import { App, Stack } from 'aws-cdk-lib';
import { Project, BuildSpec, DockerServerComputeType, Source, ComputeType } from 'aws-cdk-lib/aws-codebuild';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'codebuild-project-docker-server');

const project = new Project(stack, 'MyProject', {
  source: Source.gitHub({
    owner: 'dockersamples',
    repo: 'helloworld-demo-python',
  }),
  buildSpec: BuildSpec.fromObject({
    version: '0.2',
    phases: {
      build: {
        commands: [
          'cd sample',
          'docker buildx build .',
        ],
      },
    },
  }),
  environment: {
    computeType: ComputeType.SMALL,
    dockerServer: {
      computeType: DockerServerComputeType.SMALL,
    },
  },
});

const integ = new IntegTest(app, 'codebuild-project-docker-server-integ', {
  testCases: [stack],
});

// Execute the `startBuild` API to confirm that the build can be done correctly.
integ.assertions.awsApiCall('CodeBuild', 'startBuild', {
  projectName: project.projectName,
}).waitForAssertions();

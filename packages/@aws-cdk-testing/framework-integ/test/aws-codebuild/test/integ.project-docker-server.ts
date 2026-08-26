import { App, Stack } from 'aws-cdk-lib';
import { Project, BuildSpec, DockerServerComputeType, Source, ComputeType } from 'aws-cdk-lib/aws-codebuild';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new App();
const stack = new Stack(app, 'codebuild-project-docker-server');

const vpc = new ec2.Vpc(stack, 'Vpc', { restrictDefaultSecurityGroup: false });
const sg = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

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
      securityGroups: [sg],
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

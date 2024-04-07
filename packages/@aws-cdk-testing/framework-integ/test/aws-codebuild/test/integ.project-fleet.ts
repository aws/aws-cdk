import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-project-fleet');

const fleet = new codebuild.Fleet(stack, 'MyFleet', {
  baseCapacity: 1,
  computeType: codebuild.FleetComputeType.SMALL,
  environmentType: codebuild.FleetEnvironmentType.LINUX_CONTAINER,
});

new codebuild.Project(stack, 'MyProject', {
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: {
      build: {
        commands: ['echo "Nothing to do!"'],
      },
    },
  }),
  environment: {
    fleet,
    buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
    // TODO probably an error, add check
    // computeType: codebuild.ComputeType.SMALL,
  },
});

new integ.IntegTest(app, 'FleetIntegTest', {
  testCases: [stack],
});

app.synth();

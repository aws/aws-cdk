import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
/**
 * Deployment notice:
 *
 * The fleet allocation might take >10 minutes to complete,
 * which can cause the integ test to timeout and fail.
 *
 * You can try deploying to a different region, or
 * or Deploying the stack without integ tests first, with the --no-clean flag,
 * waiting for the fleet allocation to reach its capacity,
 * and then running the integ test was the workaround used.
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-project-macos');

const fleet = new codebuild.Fleet(stack, 'MacOsFleet', {
  fleetName: 'MacOsFleet',
  baseCapacity: 1,
  computeType: codebuild.FleetComputeType.MEDIUM,
  environmentType: codebuild.EnvironmentType.MAC_ARM,
});

const project = new codebuild.Project(stack, 'MacOsProject', {
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: {
      build: { commands: ['echo "Nothing to do!"'] },
    },
  }),
  environment: {
    fleet,
    buildImage: codebuild.MacBuildImage.BASE_14,
    computeType: codebuild.ComputeType.MEDIUM,
  },
});

const test = new integ.IntegTest(app, 'MacOsProjectIntegTest', {
  testCases: [stack],
});

const listFleets = test.assertions.awsApiCall('Codebuild', 'listFleets');
listFleets.expect(integ.ExpectedResult.objectLike({
  fleets: integ.Match.arrayWith([fleet.fleetArn]),
}));

const startBuild = test.assertions.awsApiCall('Codebuild', 'startBuild', { projectName: project.projectName });

// Describe the build and wait for the status to be successful
test.assertions.awsApiCall('CodeBuild', 'batchGetBuilds', {
  ids: [startBuild.getAttString('build.id')],
}).assertAtPath(
  'builds.0.buildStatus',
  integ.ExpectedResult.stringLikeRegexp('SUCCEEDED'),
).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(10), // Spin up time for Mac can be slow
  interval: cdk.Duration.seconds(30),
});

app.synth();

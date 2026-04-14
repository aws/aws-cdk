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
const stack = new cdk.Stack(app, 'aws-cdk-project-fleet-imageId');

const fleet = new codebuild.Fleet(stack, 'MyFleet', {
  baseCapacity: 1,
  computeType: codebuild.FleetComputeType.SMALL,
  environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
  imageId: 'aws/codebuild/amazonlinux-x86_64-standard:2024',
});

const project = new codebuild.Project(stack, 'MyProject', {
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: {
      build: { commands: ['echo "Nothing to do!"'] },
    },
  }),
  environment: {
    fleet,
    buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
  },
});

const test = new integ.IntegTest(app, 'FleetImageIdIntegTest', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ap-southeast-2', 'eu-central-1'],
  cdkCommandOptions: {
    destroy: {
      // CodeBuild fleet instances have a 1-hour minimum runtime before deletion completes.
      expectError: true,
    },
  },
});

const listFleets = test.assertions.awsApiCall('Codebuild', 'listFleets');
listFleets.expect(integ.ExpectedResult.objectLike({
  fleets: integ.Match.arrayWith([fleet.fleetArn]),
}));

test.assertions.awsApiCall('CodeBuild', 'batchGetFleets', {
  names: [fleet.fleetArn],
}).assertAtPath(
  'fleets.0.imageId',
  integ.ExpectedResult.stringLikeRegexp('aws/codebuild/amazonlinux-x86_64-standard:2024'),
);

const startBuild = test.assertions.awsApiCall('Codebuild', 'startBuild', { projectName: project.projectName });

test.assertions.awsApiCall('CodeBuild', 'batchGetBuilds', {
  ids: [startBuild.getAttString('build.id')],
}).assertAtPath(
  'builds.0.buildStatus',
  integ.ExpectedResult.stringLikeRegexp('SUCCEEDED'),
).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(15),
  interval: cdk.Duration.seconds(30),
});

app.synth();

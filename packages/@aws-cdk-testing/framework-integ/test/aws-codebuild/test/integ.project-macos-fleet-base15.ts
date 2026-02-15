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
const stack = new cdk.Stack(app, 'aws-cdk-project-macos-base15');

const fleet = new codebuild.Fleet(stack, 'MacOsFleet', {
  baseCapacity: 1,
  computeType: codebuild.FleetComputeType.MEDIUM,
  environmentType: codebuild.EnvironmentType.MAC_ARM,
});

new codebuild.Project(stack, 'MacOsProject', {
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: {
      build: { commands: ['echo "Nothing to do!"'] },
    },
  }),
  environment: {
    fleet,
    buildImage: codebuild.MacBuildImage.BASE_15,
    computeType: codebuild.ComputeType.MEDIUM,
  },
});

const test = new integ.IntegTest(app, 'MacOsProjectIntegTest', {
  testCases: [stack],
  // MAC_ARM environment type is only available in us-east-1, us-east-2, us-west-2, ap-southeast-2, eu-central-1
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ap-southeast-2', 'eu-central-1'],
  cdkCommandOptions: {
    destroy: {
      // Fleet resource deletion takes ~40 minutes, exceeding the CFN resource handler's
      // ~21 minute stabilization timeout, causing DELETE_FAILED (NotStabilized).
      expectError: true,
    },
  },
});

// Verify the fleet was created. startBuild/batchGetBuilds assertions are omitted because
// macOS dedicated hosts take 1+ hour to provision, which exceeds session
// and assertion timeout limits. Build execution on fleets is validated by the Linux fleet tests.
const listFleets = test.assertions.awsApiCall('Codebuild', 'listFleets');
listFleets.expect(integ.ExpectedResult.objectLike({
  fleets: integ.Match.arrayWith([fleet.fleetArn]),
}));

app.synth();

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
 * deploying the stack without integ tests first, with the --no-clean flag,
 * waiting for the fleet allocation to reach its capacity,
 * and then running the integ test as the workaround.
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-project-fleet-proxy');

// Create a fleet with proxy configuration.
// Proxy configuration is only supported for container-based environment types.
const fleet = new codebuild.Fleet(stack, 'ProxyFleet', {
  baseCapacity: 1,
  computeType: codebuild.FleetComputeType.SMALL,
  environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
  proxyConfiguration: {
    defaultBehavior: codebuild.FleetProxyRuleBehavior.ALLOW_ALL,
    orderedProxyRules: [
      {
        type: codebuild.FleetProxyRuleType.DOMAIN,
        effect: codebuild.FleetProxyRuleEffect.DENY,
        entities: ['blocked.example.com'],
      },
    ],
  },
});

const project = new codebuild.Project(stack, 'ProxyProject', {
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: {
      build: { commands: ['echo "Build with proxy configuration"'] },
    },
  }),
  environment: {
    fleet,
    buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
  },
});

const test = new integ.IntegTest(app, 'FleetProxyIntegTest', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'ap-southeast-2', 'eu-central-1'],
  cdkCommandOptions: {
    destroy: {
      // CodeBuild fleet instances have a 1-hour minimum runtime before deletion completes.
      expectError: true,
    },
  },
});

// Verify the fleet was created with the correct proxy configuration.
const listFleets = test.assertions.awsApiCall('CodeBuild', 'listFleets');
listFleets.expect(integ.ExpectedResult.objectLike({
  fleets: integ.Match.arrayWith([fleet.fleetArn]),
}));

const batchGetFleets = test.assertions.awsApiCall('CodeBuild', 'batchGetFleets', {
  names: [fleet.fleetArn],
});

// Verify the default behavior is set correctly
batchGetFleets.assertAtPath(
  'fleets.0.proxyConfiguration.defaultBehavior',
  integ.ExpectedResult.stringLikeRegexp('ALLOW_ALL'),
);

// Verify the ordered proxy rules are set correctly
batchGetFleets.assertAtPath(
  'fleets.0.proxyConfiguration.orderedProxyRules.0.effect',
  integ.ExpectedResult.stringLikeRegexp('^DENY$'),
);
batchGetFleets.assertAtPath(
  'fleets.0.proxyConfiguration.orderedProxyRules.0.type',
  integ.ExpectedResult.stringLikeRegexp('^DOMAIN$'),
);

// Start a build to verify the fleet works with proxy configuration.
const startBuild = test.assertions.awsApiCall('CodeBuild', 'startBuild', {
  projectName: project.projectName,
});

test.assertions.awsApiCall('CodeBuild', 'batchGetBuilds', {
  ids: [startBuild.getAttString('build.id')],
}).assertAtPath(
  'builds.0.buildStatus',
  integ.ExpectedResult.stringLikeRegexp('SUCCEEDED'),
).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(15),
  interval: cdk.Duration.seconds(30),
});

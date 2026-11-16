import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

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
 *
 * This test verifies that proxy configuration works WITH a VPC.
 * See integ.project-fleet-proxy.ts for the test without VPC.
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-project-fleet-proxy-vpc');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  // CodeBuild Fleet VPC config allows maximum 1 subnet.
  // See integ.project-fleet-attribute-based-compute.ts for details.
  maxAzs: 1,
  natGateways: 1,
  restrictDefaultSecurityGroup: false,
});

// Create a fleet with proxy configuration AND VPC.
// Proxy configuration is only supported for container-based environment types.
// VPC is optional - proxy works with or without VPC.
const fleet = new codebuild.Fleet(stack, 'ProxyVpcFleet', {
  baseCapacity: 1,
  computeType: codebuild.FleetComputeType.SMALL,
  environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
  vpc,
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

const test = new integ.IntegTest(app, 'FleetProxyVpcIntegTest', {
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

test.assertions.awsApiCall('CodeBuild', 'batchGetFleets', {
  names: [fleet.fleetArn],
}).assertAtPath(
  'fleets.0.proxyConfiguration.defaultBehavior',
  integ.ExpectedResult.stringLikeRegexp('ALLOW_ALL'),
);

// Note: We intentionally don't start a build here.
// The fleet allocation with VPC can take >15 minutes, causing timeouts.
// The proxy+VPC combination is verified by successful stack deployment
// and the batchGetFleets assertion above.
// See integ.project-fleet-proxy.ts for a test that runs a build (without VPC).

app.synth();

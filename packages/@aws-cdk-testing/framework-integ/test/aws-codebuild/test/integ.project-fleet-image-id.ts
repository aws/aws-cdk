import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
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
const stack = new cdk.Stack(app, 'aws-cdk-project-fleet-image-id');

// Custom AMI resolved from the public SSM parameter, so the template does not pin an AMI ID.
const fleet = new codebuild.Fleet(stack, 'CustomAmiFleet', {
  baseCapacity: 1,
  computeType: codebuild.FleetComputeType.SMALL,
  environmentType: codebuild.EnvironmentType.LINUX_EC2,
  image: codebuild.FleetImage.fromMachineImage(ec2.MachineImage.latestAmazonLinux2023()),
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

// The fleet uses the custom AMI with the generated service role and becomes active.
test.assertions.awsApiCall('CodeBuild', 'batchGetFleets', {
  names: [fleet.fleetArn],
}).expect(integ.ExpectedResult.objectLike({
  fleets: [integ.Match.objectLike({
    imageId: integ.Match.stringLikeRegexp('^ami-'),
    fleetServiceRole: integ.Match.stringLikeRegexp('^arn:aws:iam::'),
    status: integ.Match.objectLike({ statusCode: 'ACTIVE' }),
  })],
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(15),
  interval: cdk.Duration.seconds(30),
});

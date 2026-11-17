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

// imageId is only supported for EC2-based environment types.
// LINUX_EC2 with CUSTOM_INSTANCE_TYPE is the most practical combination to test.
const fleet = new codebuild.Fleet(stack, 'ImageIdFleet', {
  baseCapacity: 1,
  computeType: codebuild.FleetComputeType.CUSTOM_INSTANCE_TYPE,
  environmentType: codebuild.EnvironmentType.LINUX_EC2,
  computeConfiguration: {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
  },
  imageId: codebuild.LinuxBuildImage.AMAZON_LINUX_2023_6.imageId,
});

const project = new codebuild.Project(stack, 'ImageIdProject', {
  buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: {
      build: { commands: ['echo "Nothing to do!"'] },
    },
  }),
  environment: {
    fleet,
    buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2023_6,
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

// Verify the fleet was created with the correct imageId.
test.assertions.awsApiCall('CodeBuild', 'batchGetFleets', {
  names: [fleet.fleetArn],
}).expect(integ.ExpectedResult.objectLike({
  fleets: [integ.Match.objectLike({
    imageId: codebuild.LinuxBuildImage.AMAZON_LINUX_2023_6.imageId,
  })],
}));

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

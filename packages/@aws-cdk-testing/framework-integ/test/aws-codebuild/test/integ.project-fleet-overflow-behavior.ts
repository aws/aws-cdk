import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { Construct } from 'constructs';

class FleetStack extends cdk.Stack {
  public readonly fleet: codebuild.Fleet;
  public readonly project: codebuild.Project;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.fleet = new codebuild.Fleet(this, 'MyFleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.SMALL,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      overflowBehavior: codebuild.FleetOverflowBehavior.ON_DEMAND,
    });

    this.project = new codebuild.Project(this, 'MyProject', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: { commands: ['echo "Nothing to do!"'] },
        },
      }),
      environment: {
        fleet: this.fleet,
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
      },
    });
  }
}

const app = new cdk.App();
const stack= new FleetStack(
  app,
  'OverflowBehaviorFleetStack',
);

const test = new integ.IntegTest(app, 'OverflowBehaviorFleetInteg', {
  testCases: [stack],
});

const listFleets = test.assertions.awsApiCall('Codebuild', 'listFleets');
listFleets.expect(integ.ExpectedResult.objectLike({
  fleets: integ.Match.arrayWith([stack.fleet.fleetArn]),
}));

const startBuild = test.assertions.awsApiCall('Codebuild', 'startBuild', { projectName: stack.project.projectName });

// Describe the build and wait for the status to be successful
test.assertions.awsApiCall('CodeBuild', 'batchGetBuilds', {
  ids: [startBuild.getAttString('build.id')],
}).assertAtPath(
  'builds.0.buildStatus',
  integ.ExpectedResult.stringLikeRegexp('SUCCEEDED'),
).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(5),
  interval: cdk.Duration.seconds(30),
});

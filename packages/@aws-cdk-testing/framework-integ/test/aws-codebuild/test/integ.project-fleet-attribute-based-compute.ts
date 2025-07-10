import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { Construct } from 'constructs';

const configurations: codebuild.ComputeConfiguration[] = [
  {
    machineType: codebuild.MachineType.GENERAL,
  },
  {
    machineType: codebuild.MachineType.GENERAL,
    vCpu: 2,
    memory: cdk.Size.gibibytes(4),
    disk: cdk.Size.gibibytes(10),
  },
];

class FleetStack extends cdk.Stack {
  public readonly fleet: codebuild.Fleet;
  public readonly project: codebuild.Project;

  constructor(scope: Construct, id: string, computeConfiguration: codebuild.ComputeConfiguration) {
    super(scope, id);

    this.fleet = new codebuild.Fleet(this, 'MyFleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.ATTRIBUTE_BASED,
      computeConfiguration,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
    });

    this.project = new codebuild.Project(this, 'MyProject', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: { commands: ['echo "Nothing to do!"'] },
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
      },
    });
  }
}

const app = new cdk.App();
const stacks = configurations.map(
  (config, index) => new FleetStack(
    app,
    `AttributeBasedComputeFleetIntegStack${index}`,
    config,
  ),
);

const test = new integ.IntegTest(app, 'AttributeBasedComputeFleetIntegTest', {
  testCases: stacks,
});

const listFleets = test.assertions.awsApiCall('Codebuild', 'listFleets');
for (const { fleet, project } of stacks) {
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
    totalTimeout: cdk.Duration.minutes(5),
    interval: cdk.Duration.seconds(30),
  });
}

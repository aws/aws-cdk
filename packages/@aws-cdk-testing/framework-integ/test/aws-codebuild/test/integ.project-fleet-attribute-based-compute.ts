import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { Construct } from 'constructs';

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

interface Confguration {
  computeConfiguration: codebuild.FleetComputeConfiguration;
  expectedInstanceType: string;
}

const configurations: Confguration[] = [
  {
    computeConfiguration: { machineType: codebuild.FleetComputeConfigurationMachineType.GENERAL },
    expectedInstanceType: 'reserved.x86-64.2cpu.4gib',
  },
  {
    computeConfiguration: {
      machineType: codebuild.FleetComputeConfigurationMachineType.GENERAL,
      disk: 128,
      memory: 8,
      vCpu: 4,
    },
    expectedInstanceType: 'reserved.x86-64.4cpu.8gib',
  },

  // Failed configurations on deployment:

  // No NVME instance is available with this much memory, and the deployment fails.
  // Throws error: The specified compute configurations do not match any available instance type
  // When creating a fleet in the web console with the same constraints,
  // "reserved.x86-64.96cpu.192gib" is selected as the instance type, despite not meeting the NVME criteria
  /* {
    computeConfiguration: {
      memory: 192,
      machineType: codebuild.FleetComputeConfigurationMachineType.NVME,
    },
    expectedInstanceType: 'reserved.x86-64.96cpu.192gib',
  }, */

  // A default account wasn't allowed to deploy the smallest available NVME instance in us-east-1
  // Throws error: The number of instances of type c5d.12xlarge exceeded limit 0
  // Skipping this test instead of opening a quota increase support ticket to save myself and future integ runners the trouble
  /* {
    computeConfiguration: {
      machineType: codebuild.FleetComputeConfigurationMachineType.NVME,
      disk: 824,
      memory: 96,
      vCpu: 48,
    },
    expectedInstanceType: 'reserved.x86-64.48cpu.96gib.NVME',
  }, */

  // Prior to setting default values for numeric attributes internally, the CloudFormation template fails on deployment:
  // Throws error: Resource handler returned message: "Cannot invoke "java.lang.Integer.intValue()" because the return value of "software.amazon.codebuild.fleet.ComputeConfiguration.getMemory()" is null"
  // { vCpu: 1 },
  // Throws error: Resource handler returned message: "Cannot invoke "java.lang.Integer.intValue()" because the return value of "software.amazon.codebuild.fleet.ComputeConfiguration.getvCpu()" is null"
  // { memory: 1 },
  // Throws error: Resource handler returned message: "Cannot invoke "java.lang.Integer.intValue()" because the return value of "software.amazon.codebuild.fleet.ComputeConfiguration.getDisk()" is null"
  // { memory: 1, vCpu: 1 },
];

function getConfigurationName({ expectedInstanceType }: Confguration) {
  return expectedInstanceType.split('.').slice(2).join('');
}

class FleetStack extends cdk.Stack {
  public readonly fleet: codebuild.Fleet;
  public readonly project: codebuild.Project;

  constructor(scope: Construct, id: string, { computeConfiguration }: Confguration) {
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

const stacks = configurations.map((configuration) =>
  new FleetStack(app, `FleetStack${getConfigurationName(configuration)}`, configuration),
);

const test = new integ.IntegTest(app, 'FleetIntegTest', {
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

  // Ideally the expectedInstanceType would be asserted here,
  // but the fleet instance type is not given out by the API, only the provided configuration,
  // neither for batchGetFleets, batchGetBuilds, nor batchGetProjects.
  // The "Machine Type" field is available in the "Compute fleets" section of CodeBuild AWS Console,
  // and was manually validated there
}

app.synth();

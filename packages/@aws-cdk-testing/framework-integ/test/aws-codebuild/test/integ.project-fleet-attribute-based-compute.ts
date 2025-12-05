import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { Construct } from 'constructs';

type StackConfiguration = {
  computeConfiguration: codebuild.ComputeConfiguration;
  vpcProps?: ec2.VpcProps;
  subnetSelection?: ec2.SubnetSelection;
  securityGroupProps?: Array<Omit<ec2.SecurityGroupProps, 'vpc'>>;
};
const configurations: Array<StackConfiguration> = [
  {
    computeConfiguration: {
      machineType: codebuild.MachineType.GENERAL,
    },
  },
  {
    computeConfiguration: {
      machineType: codebuild.MachineType.GENERAL,
      vCpu: 2,
      memory: cdk.Size.gibibytes(4),
      disk: cdk.Size.gibibytes(10),
    },
  },
  {
    computeConfiguration: {
      machineType: codebuild.MachineType.GENERAL,
    },
    vpcProps: {
      maxAzs: 1,
      restrictDefaultSecurityGroup: false,
    },
  },
  {
    computeConfiguration: {
      machineType: codebuild.MachineType.GENERAL,
    },
    vpcProps: {
      maxAzs: 1,
      // Incredibly, if you pass a SubnetSelection that produces more than 1
      // subnet, you currently get this error:
      // > Resource handler returned message: "Invalid vpc config: the maximum number of subnets is 1
      // This seems like a terrible limitation from the CodeBuild team.
      // maxAzs: 2,
    },
    subnetSelection: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    securityGroupProps: [
      { allowAllOutbound: true },
      { allowAllIpv6Outbound: true },
    ],
  },
];

class FleetStack extends cdk.Stack {
  public readonly fleet: codebuild.Fleet;
  public readonly project: codebuild.Project;

  constructor(scope: Construct, id: string, { computeConfiguration, vpcProps, subnetSelection, securityGroupProps }: StackConfiguration) {
    super(scope, id);

    let vpc: ec2.Vpc | undefined;
    let securityGroups: Array<ec2.SecurityGroup> | undefined;
    if (vpcProps) {
      vpc = new ec2.Vpc(this, 'Vpc', vpcProps);
      const refinedVpc = vpc;
      securityGroups = securityGroupProps?.map((props, i) =>
        new ec2.SecurityGroup(this, `SecurityGroup${i}`, { ...props, vpc: refinedVpc }),
      );
    }

    this.fleet = new codebuild.Fleet(this, 'MyFleet', {
      baseCapacity: 1,
      computeType: codebuild.FleetComputeType.ATTRIBUTE_BASED,
      computeConfiguration,
      environmentType: codebuild.EnvironmentType.LINUX_CONTAINER,
      vpc,
      securityGroups,
      subnetSelection,
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
        fleet: this.fleet,
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

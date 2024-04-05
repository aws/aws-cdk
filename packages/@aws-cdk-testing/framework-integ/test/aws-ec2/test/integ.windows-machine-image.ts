import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';
import { Construct } from 'constructs';

type Version = ec2.WindowsVersion | ec2.WindowsSpecificVersion;

const env = {
  account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
};

interface TestCaseProps extends StackProps {
  machineImage: ec2.IMachineImage;
}

export class ImageIdTestCase extends Stack {
  constructor(scope: Construct, id: string, props: TestCaseProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
    const machineImage = props.machineImage;

    new CfnOutput(this, 'ImageId', { value: machineImage.getImage(this).imageId });
  }
}

export class InstanceTestCase extends Stack {
  constructor(scope: Construct, id: string, props: TestCaseProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
    const machineImage = props.machineImage;

    const vpc = new ec2.Vpc(this, 'Vpc');
    const instanceType = ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO);
    new ec2.Instance(this, 'Instance', { instanceType, machineImage, vpc });
  }
}

const app = new App();

const instanceVersions: Version[] = [
  ec2.WindowsVersion.WINDOWS_SERVER_2016_ENGLISH_CORE_BASE,
  ec2.WindowsSpecificVersion.WINDOWS_SERVER_2022_ENGLISH_FULL_BASE_2024_02_14,
];

// Ideally, all the versions would be tested, but just the integration snapshot verification takes forever
// const imageVersions: Version[] = ([Object.values(ec2.WindowsVersion), Object.values(ec2.WindowsSpecificVersion)].flat());

const imageVersions: Version[] = [
  ec2.WindowsVersion.WINDOWS_SERVER_2022_JAPANESE_FULL_SQL_2017_WEB,
  ec2.WindowsVersion.WINDOWS_SERVER_2016_ENGLISH_FULL_BASE,
  ec2.WindowsVersion.WINDOWS_SERVER_2019_ENGLISH_FULL_BASE,
  ec2.WindowsVersion.WINDOWS_SERVER_2022_ENGLISH_CORE_ECS_OPTIMIZED,

  ec2.WindowsSpecificVersion.WINDOWS_SERVER_2022_JAPANESE_FULL_SQL_2017_WEB_2023_12_13,
  ec2.WindowsSpecificVersion.WINDOWS_SERVER_2016_ENGLISH_FULL_BASE_2023_11_15,
  ec2.WindowsSpecificVersion.WINDOWS_SERVER_2019_ENGLISH_FULL_BASE_2023_12_13,
  ec2.WindowsSpecificVersion.WINDOWS_SERVER_2022_ENGLISH_CORE_ECS_OPTIMIZED_2024_01_10,
];

new IntegTest(app, 'windows-machine-image-integ-test', {
  testCases: [
    ...imageVersions
      .map((version) => version).map((version) => new ImageIdTestCase(
        app,
        generateStackName('image-id', version),
        { machineImage: getMachineImage(version), env },
      )),

    ...instanceVersions.map((version) => new InstanceTestCase(
      app,
      generateStackName('instance', version),
      { machineImage: getMachineImage(version), env },
    )),
  ],
  enableLookups: true,
});

function getMachineImage (version: Version) {
  return Object.values(ec2.WindowsVersion).includes(version as ec2.WindowsVersion) ?
    ec2.MachineImage.latestWindows(version as ec2.WindowsVersion) :
    ec2.MachineImage.specificWindows(version as ec2.WindowsSpecificVersion);
}

function generateStackName (prefix: string, version: string) {
  return `integ-ec2-windows-${prefix}-${version.replace(/[_.]/g, '-')}`;
}

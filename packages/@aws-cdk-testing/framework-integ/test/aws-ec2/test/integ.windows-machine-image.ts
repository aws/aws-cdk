import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';
import { Construct } from 'constructs';

const env = {
  account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
};

interface TestCaseProps extends StackProps {
  machineImage: ec2.IMachineImage;
}

export class TestCase extends Stack {
  constructor(scope: Construct, id: string, props: TestCaseProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
    const machineImage = props.machineImage;

    const vpc = new ec2.Vpc(this, 'Vpc');
    const instanceType = ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO);
    new ec2.Instance(this, 'Instance', { instanceType, machineImage, vpc });
  }
}

const latestWindowsVersions = [
  ec2.WindowsVersion.WINDOWS_SERVER_2022_ENGLISH_FULL_BASE,
];
const specificWindowsVersions = [
  ec2.WindowsSpecificVersion.WINDOWS_SERVER_2022_ENGLISH_FULL_BASE_2024_02_14,
];

const app = new App();
const generateStackName = (version: string) => `integ-ec2-windows-image-test-${version.replace(/[_.]/g, '-')}`;

new IntegTest(app, 'windows-machine-image-integ-test', {
  testCases: [
    ...latestWindowsVersions.map((version) => new TestCase(
      app,
      generateStackName(version),
      { machineImage: ec2.MachineImage.latestWindows(version), env },
    )),

    ...specificWindowsVersions.map((version) => new TestCase(
      app,
      generateStackName(version),
      { machineImage: ec2.MachineImage.specificWindows(version), env },
    )),
  ],
  enableLookups: true,
});

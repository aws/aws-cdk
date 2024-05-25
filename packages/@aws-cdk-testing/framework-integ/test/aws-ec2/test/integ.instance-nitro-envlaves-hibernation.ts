import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');
    const securityGroup = new ec2.SecurityGroup(this, 'IntegSg', {
      vpc,
      allowAllIpv6Outbound: true,
    });

    new ec2.Instance(this, 'InstanceNitroEnclavesEnabled', {
      vpc,
      securityGroup,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023 }),
      enclaveEnabled: true,
      hibernationEnabled: false,
    });

    new ec2.Instance(this, 'InstanceHibernationEnabled', {
      vpc,
      securityGroup,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023 }),
      enclaveEnabled: false,
      hibernationEnabled: true,
      blockDevices: [{
        deviceName: '/dev/xvda',
        volume: ec2.BlockDeviceVolume.ebs(30, {
          volumeType: ec2.EbsDeviceVolumeType.GP3,
          encrypted: true,
          deleteOnTermination: true,
        }),
      }],
    });
  }
}

const testCase = new TestStack(app, 'integ-ec2-instance-nitro-enclaves-hibernation');

new IntegTest(app, 'instance-nitro-enclaves-hibernation', {
  testCases: [testCase],
});

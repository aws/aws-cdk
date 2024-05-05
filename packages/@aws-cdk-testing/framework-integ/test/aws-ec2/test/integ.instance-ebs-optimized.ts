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

    const instance = new ec2.Instance(this, 'Instance', {
      vpc,
      securityGroup,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.C3, ec2.InstanceSize.XLARGE),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023 }),
      ebsOptimized: true,
      blockDevices: [{
        deviceName: '/dev/xvda',
        volume: ec2.BlockDeviceVolume.ebs(8, {
          volumeType: ec2.EbsDeviceVolumeType.GP3,
          encrypted: true,
          deleteOnTermination: true,
        }),
      }],
    });

    instance.connections.allowFromAnyIpv4(ec2.Port.icmpPing());
  }
}

const testCase = new TestStack(app, 'integ-ec2-instance-ebs-optimized');

new IntegTest(app, 'instance-ebs-optimized-test', {
  testCases: [testCase],
});

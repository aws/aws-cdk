import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const az = 'us-east-1b';

    const vpc = new ec2.Vpc(this, 'VPC', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      availabilityZones: [az],
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    const privateSubnet = vpc.selectSubnets({
      availabilityZones: [az],
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    }).subnets[0];

    const instanceType = ec2.InstanceType.of(ec2.InstanceClass.MAC2_M1ULTRA, ec2.InstanceSize.METAL);

    const dedicatedHost = new ec2.CfnHost(this, 'MyDedicatedHost', {
      availabilityZone: az,
      instanceType: instanceType.toString(),
    });

    const instance = new ec2.Instance(this, 'Instance', {
      vpc,
      availabilityZone: az,
      vpcSubnets: {
        subnets: [privateSubnet],
      },
      instanceType,
      machineImage: ec2.MachineImage.genericLinux({
        'us-east-1': 'ami-0c45f2bf394dee00c',
      }),
      keyPair: new ec2.KeyPair(this, 'MyKeyPair'),
    });

    const CfnInstance = instance.node.defaultChild as ec2.CfnInstance;
    CfnInstance.addPropertyOverride('HostId', dedicatedHost.ref);
  }
}

const testCase = new TestStack(app, 'MacM1UltraEc2InstanceStack');

new IntegTest(app, 'IntegMacM1UltraEc2Instance', {
  testCases: [testCase],
});

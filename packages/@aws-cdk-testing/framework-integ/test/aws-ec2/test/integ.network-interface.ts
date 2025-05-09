import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { AmazonLinuxCpuType, CfnEIP, CfnEIPAssociation, Instance, InstanceClass, InstanceSize, InstanceType, MachineImage, NetworkInterface, Port, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';

class MultiVpcEniAttachmentsStack extends cdk.Stack {
  readonly publicIpAddress: string
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc1 = new Vpc(this, 'Vpc1');
    const webServer = new Instance(vpc1, 'WebServer', {
      vpc: vpc1,
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.NANO),
      machineImage: MachineImage.latestAmazonLinux2023({ cpuType: AmazonLinuxCpuType.ARM_64 }),
    });
    webServer.addUserData('dnf install -y nginx', 'systemctl start nginx.service');

    const vpc2 = new Vpc(this, 'Vpc2');
    const eni = new NetworkInterface(vpc2, 'NetworkInterface', {
      vpc: vpc2,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
    });
    eni.connections.allowFromAnyIpv4(Port.tcp(80));
    const eip = new CfnEIP(vpc2, 'EIP');
    new CfnEIPAssociation(eip, 'Association', {
      allocationId: eip.attrAllocationId,
      networkInterfaceId: eni.networkInterfaceId,
    });
    this.publicIpAddress = eip.attrPublicIp;

    webServer.addNetworkInterface(eni);
  }
}

const app = new cdk.App();
const multiVpcEniAttachmentsStack = new MultiVpcEniAttachmentsStack(app, 'aws-cdk-ec2-multi-vpc-eni-attachments');
const test = new integ.IntegTest(app, 'network-interface-integ', {
  testCases: [multiVpcEniAttachmentsStack],
});
const call = test.assertions.httpApiCall(`http://${multiVpcEniAttachmentsStack.publicIpAddress}`);
call.expect(integ.ExpectedResult.objectLike({
  status: 200,
  body: integ.Match.stringLikeRegexp('Welcome to nginx'),
})).waitForAssertions({
  interval: cdk.Duration.seconds(10),
  totalTimeout: cdk.Duration.minutes(3),
});
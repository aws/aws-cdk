import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { IpCidr, SubnetV2 } from '../lib';
import * as VpcV2 from '../lib/vpc-v2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'vpcv2-import-integ-test');

/**
 * Test VPC import functionality by creating a VPC and then importing it
 */
const vpc = new VpcV2.VpcV2(stack, 'TestVPC', {
  primaryAddressBlock: VpcV2.IpAddresses.ipv4('10.1.0.0/16'),
  secondaryAddressBlocks: [
    VpcV2.IpAddresses.ipv4('10.2.0.0/16', {
      cidrBlockName: 'SecondaryBlock1',
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
  vpcName: 'TestVPCForImport',
});

// Create a subnet in the VPC
const subnet = new SubnetV2(stack, 'TestSubnet', {
  availabilityZone: cdk.Fn.select(0, cdk.Fn.getAzs()),
  ipv4CidrBlock: new IpCidr('10.1.1.0/24'),
  vpc: vpc,
  subnetType: SubnetType.PUBLIC,
  subnetName: 'TestSubnetForImport',
});

// Test importing the VPC using its attributes
const importedVpc = VpcV2.VpcV2.fromVpcV2Attributes(stack, 'ImportedVPC', {
  vpcId: vpc.vpcId,
  vpcCidrBlock: '10.1.0.0/16',
  secondaryCidrBlocks: [{
    cidrBlock: '10.2.0.0/16',
    cidrBlockName: 'SecondaryBlock1',
  }],
});

// Test adding a new subnet to the imported VPC
new SubnetV2(stack, 'NewSubnetOnImported', {
  availabilityZone: cdk.Fn.select(1, cdk.Fn.getAzs()),
  ipv4CidrBlock: new IpCidr('10.2.1.0/24'),
  vpc: importedVpc,
  subnetType: SubnetType.PRIVATE_ISOLATED,
  subnetName: 'NewSubnetOnImported',
});

// Test importing a subnet
SubnetV2.fromSubnetV2Attributes(stack, 'ImportedSubnet', {
  subnetId: subnet.subnetId,
  subnetType: SubnetType.PUBLIC,
  availabilityZone: cdk.Fn.select(0, cdk.Fn.getAzs()),
  ipv4CidrBlock: '10.1.1.0/24',
});

// Test adding gateways to imported VPC
importedVpc.addInternetGateway();

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});

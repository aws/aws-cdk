import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { IpCidr, SubnetV2 } from '../lib';
import * as VpcV2 from '../lib/vpc-v2';

const app = new cdk.App();

/**
 * Source stack: creates a VPC with secondary CIDRs and subnets,
 * then exports their IDs for the import stack to consume.
 */
const sourceStack = new cdk.Stack(app, 'vpcv2-source-stack');

const sourceVpc = new VpcV2.VpcV2(sourceStack, 'SourceVpc', {
  primaryAddressBlock: VpcV2.IpAddresses.ipv4('10.1.0.0/16'),
  secondaryAddressBlocks: [
    VpcV2.IpAddresses.ipv4('10.2.0.0/16', { cidrBlockName: 'Secondary1' }),
    VpcV2.IpAddresses.ipv4('10.3.0.0/16', { cidrBlockName: 'Secondary2' }),
    VpcV2.IpAddresses.amazonProvidedIpv6({ cidrBlockName: 'AmazonIpv6' }),
  ],
});

const isolatedSubnet = new SubnetV2(sourceStack, 'IsolatedSubnet', {
  vpc: sourceVpc,
  availabilityZone: sourceStack.availabilityZones[0],
  ipv4CidrBlock: new IpCidr('10.2.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
  subnetName: 'IsolatedSubnet',
});

const publicSubnet = new SubnetV2(sourceStack, 'PublicSubnet', {
  vpc: sourceVpc,
  availabilityZone: sourceStack.availabilityZones[1],
  ipv4CidrBlock: new IpCidr('10.3.0.0/24'),
  subnetType: SubnetType.PUBLIC,
  subnetName: 'PublicSubnet',
});

// Export values for the import stack
new cdk.CfnOutput(sourceStack, 'VpcId', { value: sourceVpc.vpcId, exportName: 'SourceVpcId' });
new cdk.CfnOutput(sourceStack, 'IsolatedSubnetId', { value: isolatedSubnet.subnetId, exportName: 'IsolatedSubnetId' });
new cdk.CfnOutput(sourceStack, 'IsolatedSubnetRtId', { value: isolatedSubnet.routeTable.routeTableId, exportName: 'IsolatedSubnetRtId' });
new cdk.CfnOutput(sourceStack, 'PublicSubnetId', { value: publicSubnet.subnetId, exportName: 'PublicSubnetId' });
new cdk.CfnOutput(sourceStack, 'PublicSubnetRtId', { value: publicSubnet.routeTable.routeTableId, exportName: 'PublicSubnetRtId' });

/**
 * Import stack: imports the VPC using fromVpcV2Attributes and
 * adds new subnets and gateways to verify import functionality.
 */
const importStack = new cdk.Stack(app, 'vpcv2-import-integ-test');
importStack.addDependency(sourceStack);

const importedVpc = VpcV2.VpcV2.fromVpcV2Attributes(importStack, 'ImportedVpc', {
  vpcId: cdk.Fn.importValue('SourceVpcId'),
  vpcCidrBlock: '10.1.0.0/16',
  secondaryCidrBlocks: [
    { cidrBlock: '10.2.0.0/16', cidrBlockName: 'ImportedBlock1' },
    { cidrBlock: '10.3.0.0/16', cidrBlockName: 'ImportedBlock2' },
    { amazonProvidedIpv6CidrBlock: true },
  ],
  subnets: [{
    subnetName: 'ImportedIsolatedSubnet',
    subnetId: cdk.Fn.importValue('IsolatedSubnetId'),
    subnetType: SubnetType.PRIVATE_ISOLATED,
    availabilityZone: sourceStack.availabilityZones[0],
    ipv4CidrBlock: '10.2.0.0/24',
    routeTableId: cdk.Fn.importValue('IsolatedSubnetRtId'),
  }, {
    subnetName: 'ImportedPublicSubnet',
    subnetId: cdk.Fn.importValue('PublicSubnetId'),
    subnetType: SubnetType.PUBLIC,
    availabilityZone: sourceStack.availabilityZones[1],
    ipv4CidrBlock: '10.3.0.0/24',
    routeTableId: cdk.Fn.importValue('PublicSubnetRtId'),
  }],
});

// Add new subnets to imported VPC against secondary ranges
new SubnetV2(importStack, 'NewSubnet1', {
  vpc: importedVpc,
  availabilityZone: importStack.availabilityZones[0],
  ipv4CidrBlock: new IpCidr('10.2.2.0/24'),
  subnetType: SubnetType.PUBLIC,
});

new SubnetV2(importStack, 'NewSubnet2', {
  vpc: importedVpc,
  availabilityZone: importStack.availabilityZones[0],
  ipv4CidrBlock: new IpCidr('10.3.2.0/24'),
  subnetType: SubnetType.PUBLIC,
});

// Add gateways to imported VPC
importedVpc.addInternetGateway();
importedVpc.addEgressOnlyInternetGateway();

// Use an imported subnet as NAT gateway target
const importedSubnet = SubnetV2.fromSubnetV2Attributes(importStack, 'ReImportedSubnet', {
  subnetId: cdk.Fn.importValue('IsolatedSubnetId'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
  availabilityZone: importStack.availabilityZones[0],
  ipv4CidrBlock: '10.2.0.0/24',
  routeTableId: cdk.Fn.importValue('IsolatedSubnetRtId'),
});

importedVpc.addNatGateway({ subnet: importedSubnet });

new IntegTest(app, 'integtest-model', {
  testCases: [importStack],
  stackUpdateWorkflow: false,
});

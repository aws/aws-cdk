import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { IpCidr, SubnetV2, RouteTable } from '../lib';
import * as VpcV2 from '../lib/vpc-v2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'vpcv2-import-integ-test');

/**
 * Create a VPC first, then import it to test the import functionality
 */
const vpc = new VpcV2.VpcV2(stack, 'TestVPC', {
  primaryAddressBlock: VpcV2.IpAddresses.ipv4('10.1.0.0/16'),
  secondaryAddressBlocks: [
    VpcV2.IpAddresses.ipv4('10.2.0.0/16', {
      cidrBlockName: 'SecondaryBlock1',
    }),
    VpcV2.IpAddresses.ipv4('10.3.0.0/16', {
      cidrBlockName: 'SecondaryBlock2',
    }),
    VpcV2.IpAddresses.amazonProvidedIpv6({
      cidrBlockName: 'AmazonProvided',
    }),
  ],
  enableDnsHostnames: true,
  enableDnsSupport: true,
});

const routeTable1 = new RouteTable(stack, 'RouteTable1', {
  vpc: vpc,
  routeTableName: 'RouteTable1',
});

const routeTable2 = new RouteTable(stack, 'RouteTable2', {
  vpc: vpc,
  routeTableName: 'RouteTable2',
});

const subnet1 = new SubnetV2(stack, 'TestSubnet1', {
  vpc,
  availabilityZone: cdk.Fn.select(0, cdk.Fn.getAzs()),
  ipv4CidrBlock: new IpCidr('10.2.0.0/24'),
  subnetType: SubnetType.PRIVATE_ISOLATED,
  subnetName: 'TestSubnet1',
  routeTable: routeTable1,
});

const subnet2 = new SubnetV2(stack, 'TestSubnet2', {
  vpc,
  availabilityZone: cdk.Fn.select(1, cdk.Fn.getAzs()),
  ipv4CidrBlock: new IpCidr('10.3.0.0/24'),
  subnetType: SubnetType.PUBLIC,
  subnetName: 'TestSubnet2',
  routeTable: routeTable2,
});

// Now test importing the VPC we just created
const imported_new_vpc = VpcV2.VpcV2.fromVpcV2Attributes(stack, 'ImportedNewVPC', {
  vpcId: vpc.vpcId,
  vpcCidrBlock: '10.1.0.0/16',
  secondaryCidrBlocks: [{
    cidrBlock: '10.2.0.0/16',
    cidrBlockName: 'ImportedBlock1',
  },
  {
    cidrBlock: '10.3.0.0/16',
    cidrBlockName: 'ImportedBlock2',
  }, {
    amazonProvidedIpv6CidrBlock: true,
  }],
  subnets: [{
    subnetName: 'TestSubnet1',
    subnetId: subnet1.subnetId,
    subnetType: SubnetType.PRIVATE_ISOLATED,
    availabilityZone: subnet1.availabilityZone,
    ipv4CidrBlock: '10.2.0.0/24',
    routeTableId: routeTable1.routeTableId,
  }, {
    subnetId: subnet2.subnetId,
    subnetType: SubnetType.PUBLIC,
    availabilityZone: subnet2.availabilityZone,
    ipv4CidrBlock: '10.3.0.0/24',
    routeTableId: routeTable2.routeTableId,
  }],
});

// Test to add new subnet to imported VPC against secondary range
new SubnetV2(stack, 'AddnewImportedSubnet', {
  availabilityZone: 'us-west-2a',
  ipv4CidrBlock: new IpCidr('10.2.2.0/24'),
  // can be uncommented and modified after allocation is done using Amazon Provided Ipv6
  // ipv6CidrBlock: new IpCidr('2600:1f14:b1d:6500::/64'),
  vpc: imported_new_vpc,
  subnetType: SubnetType.PUBLIC,
});

// Test to add new subnet to imported VPC against secondary range
new SubnetV2(stack, 'AddnewImportedSubnet2', {
  availabilityZone: 'us-west-2a',
  ipv4CidrBlock: new IpCidr('10.3.2.0/24'),
  // can be uncommented and modified after allocation is done using Amazon Provided Ipv6
  // ipv6CidrBlock: new IpCidr('2600:1f14:b1d:6500::/64'),
  vpc: imported_new_vpc,
  subnetType: SubnetType.PUBLIC,
});

const ImportedSubnet = SubnetV2.fromSubnetV2Attributes(stack, 'IsolatedSubnet1', {
  subnetId: 'subnet-0d441651f6653d4a7',
  subnetType: SubnetType.PRIVATE_ISOLATED,
  availabilityZone: 'us-west-2b',
  ipv4CidrBlock: '10.2.0.0/24',
  routeTableId: 'rtb-0f02fab3ed3fb4ba9',
});

// Test to add different types of gateways
imported_new_vpc.addInternetGateway();

imported_new_vpc.addNatGateway({
  subnet: ImportedSubnet,
});

imported_new_vpc.addEgressOnlyInternetGateway();

// Import another IPAM enabled VPC
const ipamvpc = VpcV2.VpcV2.fromVpcV2Attributes(stack, 'ImportedIPAMVPC', {
  vpcId: 'vpc-02407f4a207815a97',
  vpcCidrBlock: '10.0.0.0/16',
  secondaryCidrBlocks: [{
    ipv6IpamPoolId: 'ipam-pool-0316c6848898c09e0',
    ipv6NetmaskLength: 52,
    cidrBlockName: 'ImportedIpamIpv6',
  },
  {
    ipv4IpamPoolId: 'ipam-pool-0d53ae29b3b8ca8de',
    ipv4IpamProvisionedCidrs: ['10.2.0.0/16'],
    cidrBlockName: 'ImportedIpamIpv4',
  }],
});

// Test to add different types of gateways
ipamvpc.addEgressOnlyInternetGateway();

// Test to add new subnet to imported VPC against IPAM range
new SubnetV2(stack, 'AddnewSubnettoImportedIpam', {
  availabilityZone: 'us-west-2a',
  ipv4CidrBlock: new IpCidr('10.2.1.0/28'),
  // can be uncommented and modified after allocation is done using IPAM - Amazon Provided Ipv6
  ipv6CidrBlock: new IpCidr('2600:1f24:6c:4000::/64'),
  vpc: ipamvpc,
  subnetType: SubnetType.PUBLIC,
});

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});

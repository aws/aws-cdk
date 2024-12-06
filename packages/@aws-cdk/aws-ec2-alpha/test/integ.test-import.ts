import * as VpcV2 from '../lib/vpc-v2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { IpCidr, SubnetV2 } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'vpcv2-import-integ-test', {
  env: {
    region: 'us-west-2',
  },
});

/**
 * To deploy these test for importing VPCs
 * Create VPC in account using integ.vpc-v2-alpha
 * and integ.ipam.ts for IPAM related test
 * Once created, change the subnet and VPCID
 * according to the one alloted on creation
 */
const imported_new_vpc = VpcV2.VpcV2.fromVpcV2Attributes(stack, 'ImportedNewVPC', {
  vpcId: 'vpc-08193db3ccc4f909f', //VPC id
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
    subnetName: 'IsolatedSubnet2',
    subnetId: 'subnet-03cd773c0fe08ed26', //Subnet Id
    subnetType: SubnetType.PRIVATE_ISOLATED,
    availabilityZone: 'us-west-2a',
    ipv4CidrBlock: '10.2.0.0/24',
    routeTableId: 'rtb-0871c310f98da2cbb', //RouteTable id
  }, {
    subnetId: 'subnet-0fa477e01db27d820',
    subnetType: SubnetType.PUBLIC,
    availabilityZone: 'us-west-2b',
    ipv4CidrBlock: '10.3.0.0/24',
    routeTableId: 'rtb-014f3043098fe4b96',
  }],
});

//Test to add new subnet to imported VPC against secondary range
new SubnetV2(stack, 'AddnewImportedSubnet', {
  availabilityZone: 'us-west-2a',
  ipv4CidrBlock: new IpCidr('10.2.2.0/24'),
  //can be uncommented and modified after allocation is done using Amazon Provided Ipv6
  //ipv6CidrBlock: new IpCidr('2600:1f14:b1d:6500::/64'),
  vpc: imported_new_vpc,
  subnetType: SubnetType.PUBLIC,
});

//Test to add new subnet to imported VPC against secondary range
new SubnetV2(stack, 'AddnewImportedSubnet2', {
  availabilityZone: 'us-west-2a',
  ipv4CidrBlock: new IpCidr('10.3.2.0/24'),
  //can be uncommented and modified after allocation is done using Amazon Provided Ipv6
  //ipv6CidrBlock: new IpCidr('2600:1f14:b1d:6500::/64'),
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

//Test to add different types of gateways
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

//Test to add different types of gateways
ipamvpc.addEgressOnlyInternetGateway();

//Test to add new subnet to imported VPC against IPAM range
new SubnetV2(stack, 'AddnewSubnettoImportedIpam', {
  availabilityZone: 'us-west-2a',
  ipv4CidrBlock: new IpCidr('10.2.1.0/28'),
  //can be uncommented and modified after allocation is done using IPAM - Amazon Provided Ipv6
  ipv6CidrBlock: new IpCidr('2600:1f24:6c:4000::/64'),
  vpc: ipamvpc,
  subnetType: SubnetType.PUBLIC,
});

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});

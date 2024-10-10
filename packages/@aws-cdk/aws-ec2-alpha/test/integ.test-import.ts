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
 * Testing VPC import
 */
// const imported_vpc = VpcV2.VpcV2.fromVpcV2attributes(stack, 'ImportedVPC', {
//   vpcId: 'vpc-058cd322b857c8c0d',
//   vpcCidrBlock: '10.0.0.0/16',
//   privateSubnets: [{
//     subnetId: 'subnet-0b29e0804726920a9',
//     subnetType: SubnetType.PRIVATE,
//     availabilityZone: 'us-west-2a',
//     ipv4CidrBlock: '10.0.128.0/18',
//     routeTableId: 'rtb-05d7e8cb38a502040',
//   }],
// });

// imported_vpc.addInterfaceEndpoint('ec2Endpoint', {
//   service: ec2.InterfaceVpcEndpointAwsService.EC2,
//});

const imported_new_vpc = VpcV2.VpcV2.fromVpcV2attributes(stack, 'ImportedNewVPC', {
  vpcId: 'vpc-08193db3ccc4f909f',
  vpcCidrBlock: '10.1.0.0/16',
  secondaryCidrBlocks: [{
    vpcId: 'vpc-08193db3ccc4f909f', //eliminate VPC id and fetch it from above
    cidrBlock: '10.2.0.0/16',
    cidrBlockName: 'ImportedBlock1',
  },
  {
    vpcId: 'vpc-08193db3ccc4f909f', //another secondary address to test
    cidrBlock: '10.3.0.0/16',
    cidrBlockName: 'ImportedBlock2',
  }],
  privateSubnets: [{
    subnetId: 'subnet-03cd773c0fe08ed26',
    subnetType: SubnetType.PRIVATE_ISOLATED,
    availabilityZone: 'us-west-2a',
    ipv4CidrBlock: '10.1.0.0/24',
    routeTableId: 'rtb-0871c310f98da2cbb',
  }],
  publicSubnets: [{
    subnetId: 'subnet-0fa477e01db27d820',
    subnetType: SubnetType.PUBLIC,
    availabilityZone: 'us-west-2b',
    ipv4CidrBlock: '10.3.0.0/24',
    routeTableId: 'rtb-014f3043098fe4b96',
  }],
});

new SubnetV2(stack, 'AddnewImportedSubnet', {
  availabilityZone: 'us-west-2a',
  ipv4CidrBlock: new IpCidr('10.2.2.0/24'),
  vpc: imported_new_vpc,
  subnetType: SubnetType.PUBLIC,
});
new SubnetV2(stack, 'AddnewImportedSubnet', {
  availabilityZone: 'us-west-2a',
  ipv4CidrBlock: new IpCidr('10.3.2.0/24'),
  vpc: imported_new_vpc,
  subnetType: SubnetType.PUBLIC,
});

imported_new_vpc.addInternetGateway();

new IntegTest(app, 'integtest-model', {
  testCases: [stack],
});
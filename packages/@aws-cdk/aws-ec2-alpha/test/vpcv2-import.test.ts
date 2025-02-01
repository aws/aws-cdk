import * as cdk from 'aws-cdk-lib';
import { VpcV2 } from '../lib/vpc-v2';
import { IpCidr, NatGateway, SubnetV2, VpcV2Base } from '../lib/';
import { Template } from 'aws-cdk-lib/assertions';
import { InterfaceVpcEndpointAwsService, SubnetType } from 'aws-cdk-lib/aws-ec2';

describe('Vpc V2 with full control', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
    stack = new cdk.Stack(app);
  });

  test('VpcV2.fromVpcV2Attributes creates correct vpcArn', () => {
    const importedVpc = VpcV2.fromVpcV2Attributes(stack, 'VpcWithArn', {
      vpcId: 'vpc-12345',
      vpcCidrBlock: '10.0.0.0/16',
    });
    expect(importedVpc.vpcArn).toBe(`arn:${cdk.Stack.of(stack).partition}:ec2:${cdk.Stack.of(stack).region}:${cdk.Stack.of(stack).account}:vpc/vpc-12345`);
  });

  test('VpcV2.fromVpcV2Attributes returns an instance of IVpcV2', () => {
    const importedVpc = VpcV2.fromVpcV2Attributes(stack, 'VpcInstance', {
      vpcId: 'vpc-12345',
      vpcCidrBlock: '10.0.0.0/16',
    });
    expect(importedVpc).toBeInstanceOf(VpcV2Base);
  });

  test('Import VPC successfully', () => {
    const vpc = VpcV2.fromVpcV2Attributes(stack, 'ImportedVpc', {
      vpcId: 'XXXXXXXXX',
      vpcCidrBlock: '10.1.0.0/16',
      subnets: [{
        subnetId: 'subnet-isolated1',
        availabilityZone: 'us-east-1a',
        ipv4CidrBlock: '10.0.4.0/24',
        subnetType: SubnetType.PUBLIC,
        routeTableId: 'mockRouteTableId',
      }],
    });
    vpc.addInterfaceEndpoint('ec2', {
      service: InterfaceVpcEndpointAwsService.SNS,
    });
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::EC2::VPCEndpoint', 1);
  });

  test('Import different type of subnets successfully', () => {
    const importedVpc = VpcV2.fromVpcV2Attributes(stack, 'ImportedVpc', {
      vpcId: 'vpc-12345',
      vpcCidrBlock: '10.0.0.0/16',
      secondaryCidrBlocks: [
        {
          amazonProvidedIpv6CidrBlock: true,
        },
      ],
      subnets: [{
        subnetId: 'subnet-isolated1',
        subnetName: 'mockisolatedsubnet',
        availabilityZone: 'us-east-1a',
        ipv4CidrBlock: '10.0.4.0/24',
        subnetType: SubnetType.PRIVATE_ISOLATED,
        routeTableId: 'mockRouteTableId',
      }, {
        subnetId: 'subnet-isolated2',
        subnetName: 'mockisolatedsubnet2',
        availabilityZone: 'us-east-1b',
        ipv4CidrBlock: '10.0.5.0/24',
        subnetType: SubnetType.PRIVATE_ISOLATED,
        routeTableId: 'mockRouteTableId',
      }],
    });

    importedVpc.addEgressOnlyInternetGateway({ subnets: [{ subnetType: SubnetType.PRIVATE_ISOLATED }] } );

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::EgressOnlyInternetGateway', {
      VpcId: 'vpc-12345',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
      EgressOnlyInternetGatewayId: { 'Fn::GetAtt': ['ImportedVpcEgressOnlyGWEIGW5788B31B', 'Id'] },
      DestinationIpv6CidrBlock: '::/0',
      RouteTableId: 'mockRouteTableId',
    });

    expect(importedVpc.isolatedSubnets.length).toBe(2);
  });

  test('Import VPC with secondary address Ipv4 successfully', () => {
    const vpc = VpcV2.fromVpcV2Attributes(stack, 'ImportedVpc', {
      vpcId: 'mockVpcID',
      vpcCidrBlock: '10.0.0.0/16',
      secondaryCidrBlocks: [
        {
          cidrBlock: '10.1.0.0/16',
        },
      ],
    });
      // Subnet with secondary address
    new SubnetV2(stack, 'testsubnet', {
      vpc,
      availabilityZone: 'us-west-2a',
      ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
      subnetType: SubnetType.PRIVATE_ISOLATED,
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      CidrBlock: '10.1.0.0/24',
    });
  });

  test('Import VPC with IPAM IPv4', () => {
    const vpc = VpcV2.fromVpcV2Attributes(stack, 'ImportedVpc', {
      vpcId: 'mockVpcID',
      vpcCidrBlock: '10.0.0.0/16',
      secondaryCidrBlocks: [{
        ipv4IpamPoolId: 'ipam-pool-0d53ae29b3b8ca8de',
        ipv4IpamProvisionedCidrs: ['10.2.0.0/16'],
        cidrBlockName: 'ImportedIpamIpv4',
      }],
    });
      // Subnet with secondary address from IPAM range
    new SubnetV2(stack, 'testsubnet', {
      vpc,
      availabilityZone: 'us-west-2a',
      ipv4CidrBlock: new IpCidr('10.2.0.0/24'),
      subnetType: SubnetType.PRIVATE_ISOLATED,
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      CidrBlock: '10.2.0.0/24',
    });
  });

  test('Import VPC with IPAM IPv6', () => {
    const vpc = VpcV2.fromVpcV2Attributes(stack, 'ImportedVpc', {
      vpcId: 'mockVpcID',
      vpcCidrBlock: '10.0.0.0/16',
      secondaryCidrBlocks: [{
        ipv6IpamPoolId: 'ipam-pool-0316c6848898c09e0',
        ipv6NetmaskLength: 52,
        cidrBlockName: 'ImportedIpamIpv6',
      }],
    });
      // will throw error if IPv6 not enabled using IPAM ipv6
    vpc.addEgressOnlyInternetGateway();

    // will throw error if IPv6 not enabled using Amazon Provided IPv6
    new SubnetV2(stack, 'AddnewSubnettoImportedIpam', {
      availabilityZone: 'us-west-2a',
      ipv4CidrBlock: new IpCidr('10.0.1.0/28'),
      // can be uncommented and modified after allocation is done using IPAM - Amazon Provided Ipv6
      ipv6CidrBlock: new IpCidr('2600:1f24:6c:4000::/64'),
      vpc: vpc,
      subnetType: SubnetType.PUBLIC,
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      Ipv6CidrBlock: '2600:1f24:6c:4000::/64',
    });
  });

  test('Import VPC with secondary address amazon provided Ipv6 successfully', () => {
    const vpc = VpcV2.fromVpcV2Attributes(stack, 'ImportedVpc', {
      vpcId: 'mockVpcID',
      vpcCidrBlock: '10.0.0.0/16',
      secondaryCidrBlocks: [{
        amazonProvidedIpv6CidrBlock: true,
      }],
    });
    // will throw error if IPv6 not enabled using Amazon Provided IPv6
    vpc.addEgressOnlyInternetGateway();
    // will throw error if IPv6 not enabled using Amazon Provided IPv6
    new SubnetV2(stack, 'AddnewSubnettoImportedIpam', {
      availabilityZone: 'us-west-2a',
      ipv4CidrBlock: new IpCidr('10.0.1.0/28'),
      // can be uncommented and modified after allocation is done using IPAM - Amazon Provided Ipv6
      ipv6CidrBlock: new IpCidr('2600:1f24:6c:4000::/64'),
      vpc: vpc,
      subnetType: SubnetType.PUBLIC,
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
      Ipv6CidrBlock: '2600:1f24:6c:4000::/64',
    });
  });
  test('Populate correct arn using account id and region ', () => {
    const vpc = VpcV2.fromVpcV2Attributes(stack, 'ImportedVpc', {
      vpcId: 'mockVpcID',
      vpcCidrBlock: '10.0.0.0/16',
      secondaryCidrBlocks: [{
        amazonProvidedIpv6CidrBlock: true,
      }],
      ownerAccountId: '123456789012',
      region: 'us-west-2',
    });
    expect(vpc.vpcArn).toBe('arn:aws:ec2:us-west-2:123456789012:vpc/mockVpcID');
  });
  test('Successfully import subnet using fromSubnetV2Attributes', () => {
    const importedSubnet = SubnetV2.fromSubnetV2Attributes(stack, 'ImportedSubnet', {
      availabilityZone: 'us-west-2a',
      ipv4CidrBlock: '10.0.1.0/28',
      subnetId: 'mockSubnetId',
      subnetType: SubnetType.PRIVATE_ISOLATED,
      routeTableId: 'mockRouteTableId',
    });
    new NatGateway(stack, 'NatGateway', {
      subnet: importedSubnet,
      allocationId: 'mockAllocationId',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::NatGateway', {
      SubnetId: 'mockSubnetId',
    });
  });

  test('Import method fromVpcV2Attributes correctly categorizes subnets by type', () => {
    const vpc = VpcV2.fromVpcV2Attributes(stack, 'ImportedVPC', {
      vpcId: 'vpc-123456',
      vpcCidrBlock: '10.0.0.0/16',
      subnets: [
        {
          subnetId: 'subnet-private1',
          availabilityZone: 'us-east-1a',
          ipv4CidrBlock: '10.0.1.0/24',
          routeTableId: 'rt-private1',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          subnetName: 'Private1',
        },
        {
          subnetId: 'subnet-private2',
          availabilityZone: 'us-east-1b',
          ipv4CidrBlock: '10.0.2.0/24',
          routeTableId: 'rt-private2',
          subnetType: SubnetType.PRIVATE_WITH_NAT,
          subnetName: 'Private2',
        },
        {
          subnetId: 'subnet-public1',
          availabilityZone: 'us-east-1a',
          ipv4CidrBlock: '10.0.4.0/24',
          routeTableId: 'rt-public1',
          subnetType: SubnetType.PUBLIC,
          subnetName: 'Public1',
        },
        {
          subnetId: 'subnet-isolated1',
          availabilityZone: 'us-east-1b',
          ipv4CidrBlock: '10.0.5.0/24',
          routeTableId: 'rt-isolated1',
          subnetType: SubnetType.PRIVATE_ISOLATED,
          subnetName: 'Isolated1',
        },
      ],
    });

    // Verify private subnets
    expect(vpc.privateSubnets.length).toBe(2);

    // Verify public subnets
    expect(vpc.publicSubnets.length).toBe(1);

    // Verify isolated subnets
    expect(vpc.isolatedSubnets.length).toBe(1);
  });

  test('Import method fromVpcV2Attributes use default names for subnets if not set under field `subnetName` while importing', () => {
    const vpc = VpcV2.fromVpcV2Attributes(stack, 'ImportedVPC', {
      vpcId: 'vpc-123456',
      vpcCidrBlock: '10.0.0.0/16',
      subnets: [
        {
          subnetId: 'subnet-private1',
          availabilityZone: 'us-east-1a',
          ipv4CidrBlock: '10.0.1.0/24',
          routeTableId: 'rt-private1',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          subnetId: 'subnet-public1',
          availabilityZone: 'us-east-1a',
          ipv4CidrBlock: '10.0.2.0/24',
          routeTableId: 'rt-public1',
          subnetType: SubnetType.PUBLIC,
        },
        {
          subnetId: 'subnet-isolated1',
          availabilityZone: 'us-east-1a',
          ipv4CidrBlock: '10.0.3.0/24',
          routeTableId: 'rt-isolated1',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Verify default names are used
    expect(vpc.privateSubnets[0].node.id).toBe('ImportedPrivateSubnet');
    expect(vpc.publicSubnets[0].node.id).toBe('ImportedPublicSubnet');
    expect(vpc.isolatedSubnets[0].node.id).toBe('ImportedIsolatedSubnet');
  });

  test('handles undefined subnets', () => {
    const vpc = VpcV2.fromVpcV2Attributes(stack, 'ImportedVPC', {
      vpcId: 'vpc-123456',
      vpcCidrBlock: '10.0.0.0/16',
    });

    expect(vpc.privateSubnets).toHaveLength(0);
    expect(vpc.publicSubnets).toHaveLength(0);
    expect(vpc.isolatedSubnets).toHaveLength(0);
  });
});

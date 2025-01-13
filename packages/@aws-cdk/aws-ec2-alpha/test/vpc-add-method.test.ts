import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import * as vpc from '../lib/vpc-v2';
import { IpCidr, SubnetV2 } from '../lib/subnet-v2';
import * as route from '../lib/route';
import { CfnEIP, SubnetType, VpnConnectionType } from 'aws-cdk-lib/aws-ec2';

describe('Vpc V2 with full control', () => {
  let stack: cdk.Stack;
  let myVpc: vpc.VpcV2;
  let mySubnet: SubnetV2;

  beforeEach(() => {
    const app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
    stack = new cdk.Stack(app);
    myVpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6( { cidrBlockName: 'AmazonProvided' })],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
    mySubnet = new SubnetV2(stack, 'TestSubnet', {
      vpc: myVpc,
      ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
      availabilityZone: 'ap-south-1b',
      subnetType: SubnetType.PUBLIC,
      ipv6CidrBlock: new IpCidr('2001:db8::/48'),
    });
  });
  test('Method to add a new Egress-Only IGW', () => {
    myVpc.addEgressOnlyInternetGateway({});
    Template.fromStack(stack).hasResource('AWS::EC2::EgressOnlyInternetGateway', 1);
  });

  test('addEIGW throws error if VPC does not have IPv6', () => {
    const vpc1 = new vpc.VpcV2(stack, 'TestIpv4Vpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
    });
    expect(() => {
      vpc1.addEgressOnlyInternetGateway({});
    }).toThrow('Egress only IGW can only be added to Ipv6 enabled VPC');
  });

  test('addEIGW defines a route under subnet to default destination', () => {
    myVpc.addEgressOnlyInternetGateway({
      subnets: [{ subnetType: SubnetType.PUBLIC }],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
      DestinationIpv6CidrBlock: '::/0',
    });
  });

  test('addEIGW defines a route under subnet to given destination', () => {
    myVpc.addEgressOnlyInternetGateway({
      subnets: [{ subnetType: SubnetType.PUBLIC }],
      destination: '::/48',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Route', {
      DestinationIpv6CidrBlock: '::/48',
    });
  });

  test('addEIGW should not associate a route to an incorrect subnet', () => {
    const vpc1 = new vpc.VpcV2(stack, 'TestPrivateVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6( { cidrBlockName: 'AmazonProvided' })],
    });
    new SubnetV2(stack, 'validateIpv6', {
      vpc: vpc1,
      ipv4CidrBlock: new IpCidr('10.1.0.0/24'),
      availabilityZone: 'ap-south-1b',
      //Test secondary ipv6 address after IPAM pool creation
      ipv6CidrBlock: new IpCidr('2001:db8::/48'),
      subnetType: SubnetType.PRIVATE_ISOLATED,
    });
    expect(() => {
      vpc1.addEgressOnlyInternetGateway({
        subnets: [{ subnetType: SubnetType.PUBLIC }],
        destination: '::/48',
      });
    }).toThrow("There are no 'Public' subnet groups in this VPC. Available types: Isolated,Deprecated_Isolated");
  });

  test('addNatGateway defines a private gateway', () => {
    myVpc.addNatGateway({
      subnet: mySubnet,
      connectivityType: route.NatConnectivityType.PRIVATE,
      privateIpAddress: '10.0.0.42',
    });
    const template = Template.fromStack(stack);
    template.hasResource('AWS::EC2::NatGateway', {
      Properties: {
        ConnectivityType: 'private',
        PrivateIpAddress: '10.0.0.42',
        SubnetId: {
          Ref: 'TestSubnet2A4BE4CA',
        },
      },
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
  });

  test('addNatGateway defines private gateway with secondary IP addresses', () => {
    myVpc.addNatGateway({
      subnet: mySubnet,
      connectivityType: route.NatConnectivityType.PRIVATE,
      privateIpAddress: '10.0.0.42',
      secondaryPrivateIpAddresses: [
        '10.0.1.0/28',
        '10.0.2.0/28',
      ],
    });
    const template = Template.fromStack(stack);
    // NAT Gateway should be in stack
    template.hasResource('AWS::EC2::NatGateway', {
      Properties: {
        ConnectivityType: 'private',
        PrivateIpAddress: '10.0.0.42',
        SecondaryPrivateIpAddresses: [
          '10.0.1.0/28',
          '10.0.2.0/28',
        ],
        SubnetId: {
          Ref: 'TestSubnet2A4BE4CA',
        },
      },
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
  });

  test('addNatGateway defines private gateway with secondary IP address count', () => {
    myVpc.addNatGateway({
      subnet: mySubnet,
      connectivityType: route.NatConnectivityType.PRIVATE,
      privateIpAddress: '10.0.0.42',
      secondaryPrivateIpAddressCount: 2,
    });
    const template = Template.fromStack(stack);
    // NAT Gateway should be in stack
    template.hasResource('AWS::EC2::NatGateway', {
      Properties: {
        ConnectivityType: 'private',
        PrivateIpAddress: '10.0.0.42',
        SecondaryPrivateIpAddressCount: 2,
        SubnetId: {
          Ref: 'TestSubnet2A4BE4CA',
        },
      },
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
  });

  test('addNatGateway defines public gateway', () => {
    myVpc.addNatGateway({
      subnet: mySubnet,
    });
    const template = Template.fromStack(stack);
    // NAT Gateway should be in stack
    template.hasResource('AWS::EC2::NatGateway', {
      Properties: {
        SubnetId: {
          Ref: 'TestSubnet2A4BE4CA',
        },
      },
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
    // EIP should be created when not provided
    template.hasResource('AWS::EC2::EIP', {
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
  });

  test('addNatGateway defines public gateway with provided EIP', () => {
    const eip = new CfnEIP(stack, 'MyEIP', {
      domain: myVpc.vpcId,
    });
    myVpc.addNatGateway({
      subnet: mySubnet,
      allocationId: eip.attrAllocationId,
    });
    const template = Template.fromStack(stack);
    template.hasResource('AWS::EC2::NatGateway', {
      Properties: {
        SubnetId: {
          Ref: 'TestSubnet2A4BE4CA',
        },
      },
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
    // EIP should be in stack
    template.hasResourceProperties('AWS::EC2::EIP', {
      Domain: {
        'Fn::GetAtt': [
          'TestVpcE77CE678',
          'VpcId',
        ],
      },
    });
  });

  test('addNatGateway defines public gateway with many parameters', () => {
    myVpc.addInternetGateway();
    myVpc.addNatGateway({
      subnet: mySubnet,
      connectivityType: route.NatConnectivityType.PUBLIC,
      maxDrainDuration: cdk.Duration.seconds(2001),
    });
    const template = Template.fromStack(stack);
    // NAT Gateway should be in stack
    template.hasResource('AWS::EC2::NatGateway', {
      Properties: {
        ConnectivityType: 'public',
        MaxDrainDurationSeconds: 2001,
        SubnetId: {
          Ref: 'TestSubnet2A4BE4CA',
        },
      },
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
    // EIP should be created when not provided
    template.hasResource('AWS::EC2::EIP', {
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
  });

  test('addNatGateway fails for public gateway without IGW attached', () => {
    expect (() => {
      myVpc.addNatGateway({
        subnet: mySubnet,
        connectivityType: route.NatConnectivityType.PUBLIC,
        maxDrainDuration: cdk.Duration.seconds(2001),
      });
    }).toThrow('Cannot add a Public NAT Gateway without an Internet Gateway enabled on VPC');
  });

  test('addinternetGateway defines a new internet gateway with attachment and no route', () => {
    const vpc2 = new vpc.VpcV2(stack, 'TestVpcNoSubnet', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6( { cidrBlockName: 'AmazonProvided' })],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
    vpc2.addInternetGateway();
    const template = Template.fromStack(stack);
    // Internet Gateway should be in stack
    template.hasResource('AWS::EC2::InternetGateway', {});
    template.hasResourceProperties('AWS::EC2::VPCGatewayAttachment', {
      InternetGatewayId: {
        'Fn::GetAtt': ['TestVpcNoSubnetInternetGatewayIGWC957CF52', 'InternetGatewayId'],
      },
      VpcId: {
        'Fn::GetAtt': ['TestVpcNoSubnetF2A028F4', 'VpcId'],
      },
    });
    template.resourceCountIs('AWS::EC2::Route', 0);
  });

  test('addinternetGateway defines a new internet gateway with new route in case of public subnet', () => {
    myVpc.addInternetGateway();
    const template = Template.fromStack(stack);
    // Internet Gateway should be in stack
    template.hasResource('AWS::EC2::InternetGateway', {});
    template.hasResourceProperties('AWS::EC2::Route', {
      GatewayId: {
        'Fn::GetAtt': ['TestVpcInternetGatewayIGW4C825874', 'InternetGatewayId'],
      },
      RouteTableId: {
        'Fn::GetAtt': ['TestSubnetRouteTable5AF4379E', 'RouteTableId'],
      },
      DestinationCidrBlock: '0.0.0.0/0',
    });
  });

  test('addinternetGateway defines a new internet gateway with Ipv6 route in case of ipv6 enabled subnet', () => {
    myVpc.addInternetGateway();
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::EC2::Route', {
      GatewayId: {
        'Fn::GetAtt': ['TestVpcInternetGatewayIGW4C825874', 'InternetGatewayId'],
      },
      RouteTableId: {
        'Fn::GetAtt': ['TestSubnetRouteTable5AF4379E', 'RouteTableId'],
      },
      DestinationIpv6CidrBlock: '::/0',
    });
  });

  test('Throws error if there is already an IGW attached', () => {
    myVpc.addInternetGateway();
    expect(() => {
      myVpc.addInternetGateway();
    }).toThrow('The Internet Gateway has already been enabled.');
  });

  test('addinternetGateway defines a new route in case of input destination', () => {
    myVpc.addInternetGateway({
      ipv4Destination: '203.0.113.25',
      ipv6Destination: '2001:db8::/48',
    });
    const template = Template.fromStack(stack);
    //Route for custom IPv4 destination
    template.hasResourceProperties('AWS::EC2::Route', {
      GatewayId: {
        'Fn::GetAtt': ['TestVpcInternetGatewayIGW4C825874', 'InternetGatewayId'],
      },
      RouteTableId: {
        'Fn::GetAtt': ['TestSubnetRouteTable5AF4379E', 'RouteTableId'],
      },
      DestinationCidrBlock: '203.0.113.25',
    });
    //Route for custom IPv6 destination
    template.hasResourceProperties('AWS::EC2::Route', {
      GatewayId: {
        'Fn::GetAtt': ['TestVpcInternetGatewayIGW4C825874', 'InternetGatewayId'],
      },
      RouteTableId: {
        'Fn::GetAtt': ['TestSubnetRouteTable5AF4379E', 'RouteTableId'],
      },
      DestinationIpv6CidrBlock: '2001:db8::/48',
    });
  });

  //Tests for VPNGatewayV2
  test('enableVpnGatewayV2 defines a new VPNGateway with attachment', () => {
    myVpc.enableVpnGatewayV2({
      type: VpnConnectionType.IPSEC_1,
    });
    Template.fromStack(stack).hasResource('AWS::EC2::VPNGateway', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCGatewayAttachment', {
      VpnGatewayId: {
        'Fn::GetAtt': ['TestVpcVpnGatewayIGWF1052317', 'VPNGatewayId'],
      },
      VpcId: {
        'Fn::GetAtt': ['TestVpcE77CE678', 'VpcId'],
      },
    });
  });

  test('check vpngateway has correct connection type', () => {
    myVpc.enableVpnGatewayV2({
      type: VpnConnectionType.IPSEC_1,
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNGateway', {
      Type: 'ipsec.1',
    });
  });

  test('Check vpngateway has routePropogation for input subnets', () => {
    myVpc.enableVpnGatewayV2({
      type: VpnConnectionType.IPSEC_1,
      vpnRoutePropagation: [{ subnetType: SubnetType.PUBLIC }],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNGatewayRoutePropagation', {
      VpnGatewayId: {
        'Fn::GetAtt': ['TestVpcVpnGatewayIGWF1052317', 'VPNGatewayId'],
      },
      RouteTableIds: [
        {
          'Fn::GetAtt': ['TestSubnetRouteTable5AF4379E', 'RouteTableId'],
        },
      ],
    });
  });

  test('Throws error when no subnet identified for route propogation', () => {
    expect(() => {
      myVpc.enableVpnGatewayV2({
        type: VpnConnectionType.IPSEC_1,
        vpnRoutePropagation: [{ subnetType: SubnetType.PRIVATE_ISOLATED }],
      });
    }).toThrow("There are no 'Isolated' subnet groups in this VPC. Available types: Public");
  });

  test('Throws error when VPN GW is already enabled', () => {
    myVpc.enableVpnGatewayV2({ type: VpnConnectionType.IPSEC_1 });
    expect(() => {
      myVpc.enableVpnGatewayV2({ type: VpnConnectionType.IPSEC_1 });
    }).toThrow('The VPN Gateway has already been enabled.');
  });

  test('createAcceptorVpcRole creates a restricted role', () => {
    myVpc.createAcceptorVpcRole('123456789012');
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::123456789012:root']] },
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('createPeeringConnection establishes connection between 2 VPCs', () => {
    const acceptorVpc = new vpc.VpcV2(stack, 'TestAcceptorVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.0.0.0/16'),
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });

    myVpc.createPeeringConnection('testPeeringConnection', {
      acceptorVpc: acceptorVpc,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCPeeringConnection', {
      VpcId: {
        'Fn::GetAtt': ['TestVpcE77CE678', 'VpcId'],
      },
      PeerVpcId: {
        'Fn::GetAtt': ['TestAcceptorVpc4AE3E611', 'VpcId'],
      },
      PeerOwnerId: { Ref: 'AWS::AccountId' },
      PeerRegion: { Ref: 'AWS::Region' },
    });
  });
});

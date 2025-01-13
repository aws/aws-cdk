import * as cdk from 'aws-cdk-lib';
import * as vpc from '../lib/vpc-v2';
import * as subnet from '../lib/subnet-v2';
import { CfnEIP, GatewayVpcEndpoint, GatewayVpcEndpointAwsService, SubnetType, VpnConnectionType } from 'aws-cdk-lib/aws-ec2';
import * as route from '../lib/route';
import { Template } from 'aws-cdk-lib/assertions';

describe('EC2 Routing', () => {
  let stack: cdk.Stack;
  let myVpc: vpc.VpcV2;
  let mySubnet: subnet.SubnetV2;
  let routeTable: route.RouteTable;

  beforeEach(() => {
    const app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
    stack = new cdk.Stack(app);
    myVpc = new vpc.VpcV2(stack, 'TestVpc', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.0.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6({
        cidrBlockName: 'AmazonIpv6',
      })],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
    routeTable = new route.RouteTable(stack, 'TestRouteTable', {
      vpc: myVpc,
    });
    mySubnet = new subnet.SubnetV2(stack, 'TestSubnet', {
      vpc: myVpc,
      availabilityZone: 'us-east-1a',
      ipv4CidrBlock: new subnet.IpCidr('10.0.0.0/24'),
      ipv6CidrBlock: new subnet.IpCidr(cdk.Fn.select(0, myVpc.ipv6CidrBlocks)),
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      routeTable: routeTable,
    });
  });

  test('Route to EIGW', () => {
    const eigw = new route.EgressOnlyInternetGateway(stack, 'TestEIGW', {
      vpc: myVpc,
    });
    routeTable.addRoute('Route', '::/0', { gateway: eigw });

    const template = Template.fromStack(stack);
    // EIGW should be in stack
    template.hasResourceProperties('AWS::EC2::EgressOnlyInternetGateway', {
      VpcId: {
        'Fn::GetAtt': [
          'TestVpcE77CE678', 'VpcId',
        ],
      },
    });
    // Route linking IP to EIGW should be in stack
    template.hasResourceProperties('AWS::EC2::Route', {
      DestinationIpv6CidrBlock: '::/0',
      EgressOnlyInternetGatewayId: {
        'Fn::GetAtt': [
          'TestEIGW4E4CDA8D', 'Id',
        ],
      },
      RouteTableId: {
        'Fn::GetAtt': [
          'TestRouteTableC34C2E1C', 'RouteTableId',
        ],
      },
    });
  });

  test('Route to VPN Gateway', () => {
    const vpngw = new route.VPNGatewayV2(stack, 'TestVpnGw', {
      type: VpnConnectionType.IPSEC_1,
      vpc: myVpc,
    });
    routeTable.addRoute('Route', '0.0.0.0/0', { gateway: vpngw });
    const template = Template.fromStack(stack);
    // VPN Gateway should be in stack
    template.hasResourceProperties('AWS::EC2::VPNGateway', {
      Type: 'ipsec.1',
    });
    // Route linking IP to VPN GW should be in stack
    template.hasResourceProperties('AWS::EC2::Route', {
      DestinationCidrBlock: '0.0.0.0/0',
      GatewayId: {
        'Fn::GetAtt': [
          'TestVpnGwIGW11AF5344', 'VPNGatewayId',
        ],
      },
      RouteTableId: {
        'Fn::GetAtt': [
          'TestRouteTableC34C2E1C', 'RouteTableId',
        ],
      },
    });
    // Route Gateway attachment should be in stack
    template.hasResourceProperties('AWS::EC2::VPCGatewayAttachment', {
      VpcId: {
        'Fn::GetAtt': [
          'TestVpcE77CE678', 'VpcId',
        ],
      },
      VpnGatewayId: {
        'Fn::GetAtt': [
          'TestVpnGwIGW11AF5344', 'VPNGatewayId',
        ],
      },
    });
  }),

  test('Route to VPN Gateway with optional properties', () => {
    new route.VPNGatewayV2(stack, 'TestVpnGw', {
      type: VpnConnectionType.IPSEC_1,
      vpc: myVpc,
      amazonSideAsn: 12345678,
    });
    // VPN Gateway should be in stack
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPNGateway', {
      AmazonSideAsn: 12345678,
      Type: 'ipsec.1',
    });
  }),

  test('Route to Internet Gateway', () => {
    const igw = new route.InternetGateway(stack, 'TestIGW', {
      vpc: myVpc,
    });
    routeTable.addRoute('Route', '0.0.0.0/0', { gateway: igw });
    const template = Template.fromStack(stack);
    // Internet Gateway should be in stack
    template.hasResource('AWS::EC2::InternetGateway', {});
    // Route linking IP to IGW should be in stack
    template.hasResourceProperties('AWS::EC2::Route', {
      DestinationCidrBlock: '0.0.0.0/0',
      GatewayId: {
        'Fn::GetAtt': [
          'TestIGW1B4DB37D', 'InternetGatewayId',
        ],
      },
      RouteTableId: {
        'Fn::GetAtt': [
          'TestRouteTableC34C2E1C', 'RouteTableId',
        ],
      },
    });
    // Route Gateway attachment should be in stack
    template.hasResourceProperties('AWS::EC2::VPCGatewayAttachment', {
      VpcId: {
        'Fn::GetAtt': [
          'TestVpcE77CE678', 'VpcId',
        ],
      },
      InternetGatewayId: {
        'Fn::GetAtt': [
          'TestIGW1B4DB37D', 'InternetGatewayId',
        ],
      },
    });
  });

  test('Route to private NAT Gateway', () => {
    const natgw = new route.NatGateway(stack, 'TestNATGW', {
      subnet: mySubnet,
      connectivityType: route.NatConnectivityType.PRIVATE,
      privateIpAddress: '10.0.0.42',
    });
    routeTable.addRoute('Route', '0.0.0.0/0', { gateway: natgw });
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
    // Route linking private IP to NAT Gateway should be in stack
    template.hasResourceProperties('AWS::EC2::Route', {
      DestinationCidrBlock: '0.0.0.0/0',
      NatGatewayId: {
        'Fn::GetAtt': [
          'TestNATGWNATGatewayBE4F6F2D',
          'NatGatewayId',
        ],
      },
      RouteTableId: {
        'Fn::GetAtt': [
          'TestRouteTableC34C2E1C',
          'RouteTableId',
        ],
      },
    });
  });

  test('Route to private NAT Gateway with secondary IP addresses', () => {
    const natgw = new route.NatGateway(stack, 'TestNATGW', {
      subnet: mySubnet,
      connectivityType: route.NatConnectivityType.PRIVATE,
      privateIpAddress: '10.0.0.42',
      secondaryPrivateIpAddresses: [
        '10.0.1.0/28',
        '10.0.2.0/28',
      ],
    });
    routeTable.addRoute('Route', '0.0.0.0/0', { gateway: natgw });
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

  test('Route to private NAT Gateway with secondary IP count', () => {
    const natgw = new route.NatGateway(stack, 'TestNATGW', {
      subnet: mySubnet,
      connectivityType: route.NatConnectivityType.PRIVATE,
      privateIpAddress: '10.0.0.42',
      secondaryPrivateIpAddressCount: 2,
    });
    routeTable.addRoute('Route', '0.0.0.0/0', { gateway: natgw });
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
    // Route linking private IP to NAT Gateway should be in stack
    template.hasResourceProperties('AWS::EC2::Route', {
      DestinationCidrBlock: '0.0.0.0/0',
      NatGatewayId: {
        'Fn::GetAtt': [
          'TestNATGWNATGatewayBE4F6F2D',
          'NatGatewayId',
        ],
      },
      RouteTableId: {
        'Fn::GetAtt': [
          'TestRouteTableC34C2E1C',
          'RouteTableId',
        ],
      },
    });
  });

  test('Route to public NAT Gateway', () => {
    const natgw = new route.NatGateway(stack, 'TestNATGW', {
      subnet: mySubnet,
      vpc: myVpc,
    });
    routeTable.addRoute('Route', '0.0.0.0/0', { gateway: natgw });
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
    // Route linking private IP to NAT Gateway should be in stack
    template.hasResourceProperties('AWS::EC2::Route', {
      DestinationCidrBlock: '0.0.0.0/0',
      NatGatewayId: {
        'Fn::GetAtt': [
          'TestNATGWNATGatewayBE4F6F2D',
          'NatGatewayId',
        ],
      },
      RouteTableId: {
        'Fn::GetAtt': [
          'TestRouteTableC34C2E1C',
          'RouteTableId',
        ],
      },
    });
    // EIP should be created when not provided
    template.hasResource('AWS::EC2::EIP', {
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
  });

  test('Route to public NAT Gateway with provided EIP', () => {
    const eip = new CfnEIP(stack, 'MyEIP', {
      domain: myVpc.vpcId,
    });
    const natgw = new route.NatGateway(stack, 'TestNATGW', {
      subnet: mySubnet,
      allocationId: eip.attrAllocationId,
    });
    routeTable.addRoute('Route', '0.0.0.0/0', { gateway: natgw });
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
    // Route linking private IP to NAT Gateway should be in stack
    template.hasResourceProperties('AWS::EC2::Route', {
      DestinationCidrBlock: '0.0.0.0/0',
      NatGatewayId: {
        'Fn::GetAtt': [
          'TestNATGWNATGatewayBE4F6F2D',
          'NatGatewayId',
        ],
      },
      RouteTableId: {
        'Fn::GetAtt': [
          'TestRouteTableC34C2E1C',
          'RouteTableId',
        ],
      },
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

  test('Route to public NAT Gateway with many parameters', () => {
    const natgw = new route.NatGateway(stack, 'TestNATGW', {
      subnet: mySubnet,
      connectivityType: route.NatConnectivityType.PUBLIC,
      maxDrainDuration: cdk.Duration.seconds(2001),
      vpc: myVpc,
    });
    routeTable.addRoute('Route', '0.0.0.0/0', { gateway: natgw });
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
    // Route linking private IP to NAT Gateway should be in stack
    template.hasResourceProperties('AWS::EC2::Route', {
      DestinationCidrBlock: '0.0.0.0/0',
      NatGatewayId: {
        'Fn::GetAtt': [
          'TestNATGWNATGatewayBE4F6F2D',
          'NatGatewayId',
        ],
      },
      RouteTableId: {
        'Fn::GetAtt': [
          'TestRouteTableC34C2E1C',
          'RouteTableId',
        ],
      },
    });
    // EIP should be created when not provided
    template.hasResource('AWS::EC2::EIP', {
      DependsOn: [
        'TestSubnetRouteTableAssociationFE267B30',
      ],
    });
  });

  test('Route to DynamoDB Endpoint', () => {
    const dynamodb = new GatewayVpcEndpoint(stack, 'TestDB', {
      vpc: myVpc,
      service: GatewayVpcEndpointAwsService.DYNAMODB,
    });
    routeTable.addRoute('Route', '0.0.0.0/0', { endpoint: dynamodb });
    // DynamoDB endpoint should be in stack
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
      RouteTableIds: [
        {
          'Fn::GetAtt': [
            'TestRouteTableC34C2E1C',
            'RouteTableId',
          ],
        },
      ],
      ServiceName: {
        'Fn::Join': [
          '',
          [
            'com.amazonaws.',
            { Ref: 'AWS::Region' },
            '.dynamodb',
          ],
        ],
      },
      VpcEndpointType: 'Gateway',
      VpcId: {
        'Fn::GetAtt': [
          'TestVpcE77CE678',
          'VpcId',
        ],
      },
    });
  });

  test('Route to S3 Endpoint', () => {
    const dynamodb = new GatewayVpcEndpoint(stack, 'TestS3', {
      vpc: myVpc,
      service: GatewayVpcEndpointAwsService.S3,
    });
    routeTable.addRoute('Route', '0.0.0.0/0', { endpoint: dynamodb });
    // S3 endpoint should be in stack
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
      RouteTableIds: [
        {
          'Fn::GetAtt': [
            'TestRouteTableC34C2E1C',
            'RouteTableId',
          ],
        },
      ],
      ServiceName: {
        'Fn::Join': [
          '',
          [
            'com.amazonaws.',
            { Ref: 'AWS::Region' },
            '.s3',
          ],
        ],
      },
      VpcEndpointType: 'Gateway',
      VpcId: {
        'Fn::GetAtt': [
          'TestVpcE77CE678',
          'VpcId',
        ],
      },
    });
  });

  test('Route to S3 Express Endpoint', () => {
    const dynamodb = new GatewayVpcEndpoint(stack, 'TestS3E', {
      vpc: myVpc,
      service: GatewayVpcEndpointAwsService.S3_EXPRESS,
    });
    routeTable.addRoute('Route', '0.0.0.0/0', { endpoint: dynamodb });
    // S3 endpoint should be in stack
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpoint', {
      RouteTableIds: [
        {
          'Fn::GetAtt': [
            'TestRouteTableC34C2E1C',
            'RouteTableId',
          ],
        },
      ],
      ServiceName: {
        'Fn::Join': [
          '',
          [
            'com.amazonaws.',
            { Ref: 'AWS::Region' },
            '.s3express',
          ],
        ],
      },
      VpcEndpointType: 'Gateway',
      VpcId: {
        'Fn::GetAtt': [
          'TestVpcE77CE678',
          'VpcId',
        ],
      },
    });
  });
});

describe('VPCPeeringConnection', () => {

  let stackA: cdk.Stack;
  let stackB: cdk.Stack;
  let stackC: cdk.Stack;

  let vpcA: vpc.VpcV2;
  let vpcB: vpc.VpcV2;
  let vpcC: vpc.VpcV2;

  beforeEach(() => {
    const app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });

    stackA = new cdk.Stack(app, 'VpcStackA', { env: { account: '234567890123', region: 'us-east-1' } });
    stackB = new cdk.Stack(app, 'VpcStackB', { env: { account: '123456789012', region: 'us-east-1' } });
    stackC = new cdk.Stack(app, 'VpcStackC', { env: { account: '123456789012', region: 'us-west-2' }, crossRegionReferences: true });

    vpcA = new vpc.VpcV2(stackA, 'VpcA', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.0.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv4('10.1.0.0/16', { cidrBlockName: 'TempSecondaryBlock' })],
    });
    vpcB = new vpc.VpcV2(stackB, 'VpcB', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.2.0.0/16'),
    });
    vpcC = new vpc.VpcV2(stackC, 'VpcC', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.1.0.0/16'),
    });

  });

  test('Creates a cross account VPC peering connection', () => {

    const importedVpcB = vpc.VpcV2.fromVpcV2Attributes(stackA, 'VpcB', {
      vpcId: 'mockVpcBId', //cross account stack references are not supported
      vpcCidrBlock: '10.2.0.0/16',
      region: vpcB.env.region,
      ownerAccountId: '123456789012',
    });

    new route.VPCPeeringConnection(stackA, 'TestPeeringConnection', {
      requestorVpc: vpcA,
      acceptorVpc: importedVpcB,
      peerRoleArn: 'arn:aws:iam::012345678910:role/VpcPeeringRole',
    });
    const template = Template.fromStack(stackA);
    template.hasResourceProperties('AWS::EC2::VPCPeeringConnection', {
      PeerRoleArn: 'arn:aws:iam::012345678910:role/VpcPeeringRole',
      VpcId: {
        'Fn::GetAtt': ['VpcAAD85CA4C', 'VpcId'],
      },
      PeerVpcId: 'mockVpcBId',
      PeerOwnerId: '123456789012',
      PeerRegion: 'us-east-1',
    });
  });

  test('Creates a cross region VPC peering connection', () => {

    const importedVpcC = vpc.VpcV2.fromVpcV2Attributes(stackA, 'VpcB', {
      vpcId: 'mockVpcCId', //cross account stack references are not supported
      vpcCidrBlock: '10.3.0.0/16',
      region: vpcC.env.region,
      ownerAccountId: '123456789012',
    });

    new route.VPCPeeringConnection(stackB, 'TestCrossRegionPeeringConnection', {
      requestorVpc: vpcB,
      acceptorVpc: importedVpcC,
    });

    Template.fromStack(stackB).hasResourceProperties('AWS::EC2::VPCPeeringConnection', {
      VpcId: {
        'Fn::GetAtt': ['VpcB98A08B07', 'VpcId'],
      },
      PeerVpcId: 'mockVpcCId',
      PeerOwnerId: '123456789012',
      PeerRegion: 'us-west-2',
    });
  });

  test('Throws error when peerRoleArn is not provided for cross-account peering', () => {
    expect(() => {
      new route.VPCPeeringConnection(stackA, 'TestCrossAccountPeeringConnection', {
        requestorVpc: vpcA,
        acceptorVpc: vpcB,
      });
    }).toThrow(/Cross account VPC peering requires peerRoleArn/);
  });

  test('Throws error when peerRoleArn is provided for same account peering', () => {
    expect(() => {
      new route.VPCPeeringConnection(stackB, 'TestPeeringConnection', {
        requestorVpc: vpcB,
        acceptorVpc: vpcC,
        peerRoleArn: 'arn:aws:iam::123456789012:role/unnecessary-role',
      });
    }).toThrow(/peerRoleArn is not needed for same account peering/);
  });

  test('CIDR block overlap with secondary CIDR block should throw error', () => {
    expect(() => {
      new route.VPCPeeringConnection(stackA, 'TestPeering', {
        requestorVpc: vpcA,
        acceptorVpc: vpcC,
        peerRoleArn: 'arn:aws:iam::012345678910:role/VpcPeeringRole',
      });
    }).toThrow(/CIDR block should not overlap with each other for establishing a peering connection/);
  });

  test('CIDR block overlap with primary CIDR block should throw error', () => {
    const vpcD = new vpc.VpcV2(stackA, 'VpcD', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.0.0.0/16'),
    });

    expect(() => {
      new route.VPCPeeringConnection(stackA, 'TestPeering', {
        requestorVpc: vpcA,
        acceptorVpc: vpcD,
      });
    }).toThrow(/CIDR block should not overlap with each other for establishing a peering connection/);
  });
});

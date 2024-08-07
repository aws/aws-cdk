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
    new route.Route(stack, 'TestRoute', {
      routeTable: routeTable,
      destination: '0.0.0.0/0',
      target: { gateway: eigw },
    });
    Template.fromStack(stack).templateMatches({
      Resources: {
        // EIGW should be in stack
        TestEIGW4E4CDA8D: {
          Type: 'AWS::EC2::EgressOnlyInternetGateway',
          Properties: {
            VpcId: {
              'Fn::GetAtt': [
                'TestVpcE77CE678', 'VpcId',
              ],
            },
          },
        },
        // Route linking IP to EIGW should be in stack
        TestRoute4CB59404: {
          Type: 'AWS::EC2::Route',
          Properties: {
            DestinationCidrBlock: '0.0.0.0/0',
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
          },
        },
      },
    });
  });

  test('Route to VPN Gateway', () => {
    const vpngw = new route.VPNGateway(stack, 'TestVpnGw', {
      type: VpnConnectionType.IPSEC_1,
      vpc: myVpc,
    });
    new route.Route(stack, 'TestRoute', {
      routeTable: routeTable,
      destination: '0.0.0.0/0',
      target: { gateway: vpngw },
    });
    Template.fromStack(stack).templateMatches({
      Resources: {
        // VPN Gateway should be in stack
        TestVpnGwIGW11AF5344: {
          Type: 'AWS::EC2::VPNGateway',
          Properties: {
            Type: 'ipsec.1',
          },
        },
        // Route linking IP to VPN GW should be in stack
        TestRoute4CB59404: {
          Type: 'AWS::EC2::Route',
          Properties: {
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
          },
        },
        // Route Gateway attachment should be in stack
        TestRouteGWAttachmentDD69361B: {
          Type: 'AWS::EC2::VPCGatewayAttachment',
          Properties: {
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
          },
        },
      },
    });
  }),

  test('Route to VPN Gateway with optional properties', () => {
    new route.VPNGateway(stack, 'TestVpnGw', {
      type: VpnConnectionType.IPSEC_1,
      vpc: myVpc,
      amazonSideAsn: 12345678,
    });
    Template.fromStack(stack).templateMatches({
      Resources: {
        // VPN Gateway should be in stack
        TestVpnGwIGW11AF5344: {
          Type: 'AWS::EC2::VPNGateway',
          Properties: {
            AmazonSideAsn: 12345678,
            Type: 'ipsec.1',
          },
        },
      },
    });
  }),

  test('Route to Internet Gateway', () => {
    const igw = new route.InternetGateway(stack, 'TestIGW', {
      vpc: myVpc,
    });
    new route.Route(stack, 'TestRoute', {
      routeTable: routeTable,
      destination: '0.0.0.0/0',
      target: { gateway: igw },
    });
    Template.fromStack(stack).templateMatches({
      Resources: {
        // Internet Gateway should be in stack
        TestIGW1B4DB37D: {
          Type: 'AWS::EC2::InternetGateway',
        },
        // Route linking IP to IGW should be in stack
        TestRoute4CB59404: {
          Type: 'AWS::EC2::Route',
          Properties: {
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
          },
        },
        // Route Gateway attachment should be in stack
        TestRouteGWAttachmentDD69361B: {
          Type: 'AWS::EC2::VPCGatewayAttachment',
          Properties: {
            InternetGatewayId: {
              'Fn::GetAtt': [
                'TestIGW1B4DB37D', 'InternetGatewayId',
              ],
            },
            VpcId: {
              'Fn::GetAtt': [
                'TestVpcE77CE678', 'VpcId',
              ],
            },
          },
        },
      },
    });
  });

  test('Route to private NAT Gateway', () => {
    const natgw = new route.NatGateway(stack, 'TestNATGW', {
      subnet: mySubnet,
      connectivityType: route.NatConnectivityType.PRIVATE,
      privateIpAddress: '10.0.0.42',
    });
    new route.Route(stack, 'TestRoute', {
      routeTable: routeTable,
      destination: '0.0.0.0/0',
      target: { gateway: natgw },
    });
    Template.fromStack(stack).templateMatches({
      Resources: {
        // NAT Gateway should be in stack
        TestNATGWNATGatewayBE4F6F2D: {
          Type: 'AWS::EC2::NatGateway',
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
        },
        // Route linking private IP to NAT Gateway should be in stack
        TestRoute4CB59404: {
          Type: 'AWS::EC2::Route',
          Properties: {
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
          },
        },
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
    new route.Route(stack, 'TestRoute', {
      routeTable: routeTable,
      destination: '0.0.0.0/0',
      target: { gateway: natgw },
    });
    Template.fromStack(stack).templateMatches({
      Resources: {
        // NAT Gateway should be in stack
        TestNATGWNATGatewayBE4F6F2D: {
          Type: 'AWS::EC2::NatGateway',
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
        },

      },
    });
  });

  test('Route to private NAT Gateway with secondary IP count', () => {
    const natgw = new route.NatGateway(stack, 'TestNATGW', {
      subnet: mySubnet,
      connectivityType: route.NatConnectivityType.PRIVATE,
      privateIpAddress: '10.0.0.42',
      secondaryPrivateIpAddressCount: 2,
    });
    new route.Route(stack, 'TestRoute', {
      routeTable: routeTable,
      destination: '0.0.0.0/0',
      target: { gateway: natgw },
    });
    Template.fromStack(stack).templateMatches({
      Resources: {
        // NAT Gateway should be in stack
        TestNATGWNATGatewayBE4F6F2D: {
          Type: 'AWS::EC2::NatGateway',
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
        },
        // Route linking private IP to NAT Gateway should be in stack
        TestRoute4CB59404: {
          Type: 'AWS::EC2::Route',
          Properties: {
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
          },
        },
      },
    });
  });

  test('Route to public NAT Gateway', () => {
    const natgw = new route.NatGateway(stack, 'TestNATGW', {
      subnet: mySubnet,
    });
    new route.Route(stack, 'TestRoute', {
      routeTable: routeTable,
      destination: '0.0.0.0/0',
      target: { gateway: natgw },
    });
    Template.fromStack(stack).templateMatches({
      Resources: {
        // NAT Gateway should be in stack
        TestNATGWNATGatewayBE4F6F2D: {
          Type: 'AWS::EC2::NatGateway',
          Properties: {
            SubnetId: {
              Ref: 'TestSubnet2A4BE4CA',
            },
          },
          DependsOn: [
            'TestSubnetRouteTableAssociationFE267B30',
          ],
        },
        // Route linking private IP to NAT Gateway should be in stack
        TestRoute4CB59404: {
          Type: 'AWS::EC2::Route',
          Properties: {
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
          },
        },
        // EIP should be created when not provided
        TestNATGWEIP0A279819: {
          Type: 'AWS::EC2::EIP',
          DependsOn: [
            'TestSubnetRouteTableAssociationFE267B30',
          ],
        },
      },
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
    new route.Route(stack, 'TestRoute', {
      routeTable: routeTable,
      destination: '0.0.0.0/0',
      target: { gateway: natgw },
    });
    Template.fromStack(stack).templateMatches({
      Resources: {
        // NAT Gateway should be in stack
        TestNATGWNATGatewayBE4F6F2D: {
          Type: 'AWS::EC2::NatGateway',
          Properties: {
            SubnetId: {
              Ref: 'TestSubnet2A4BE4CA',
            },
          },
          DependsOn: [
            'TestSubnetRouteTableAssociationFE267B30',
          ],
        },
        // Route linking private IP to NAT Gateway should be in stack
        TestRoute4CB59404: {
          Type: 'AWS::EC2::Route',
          Properties: {
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
          },
        },
        // EIP should be in stack
        MyEIP: {
          Type: 'AWS::EC2::EIP',
          Properties: {
            Domain: {
              'Fn::GetAtt': [
                'TestVpcE77CE678',
                'VpcId',
              ],
            },
          },
        },
      },
    });
  });

  test('Route to public NAT Gateway with many parameters', () => {
    const natgw = new route.NatGateway(stack, 'TestNATGW', {
      subnet: mySubnet,
      connectivityType: route.NatConnectivityType.PUBLIC,
      maxDrainDuration: cdk.Duration.seconds(2001),
    });
    new route.Route(stack, 'TestRoute', {
      routeTable: routeTable,
      destination: '0.0.0.0/0',
      target: { gateway: natgw },
    });
    Template.fromStack(stack).templateMatches({
      Resources: {
        // NAT Gateway should be in stack
        TestNATGWNATGatewayBE4F6F2D: {
          Type: 'AWS::EC2::NatGateway',
          Properties: {
            AllocationId: {
              'Fn::GetAtt': [
                'TestNATGWEIP0A279819',
                'AllocationId',
              ],
            },
            ConnectivityType: 'public',
            MaxDrainDurationSeconds: 2001,
            SubnetId: {
              Ref: 'TestSubnet2A4BE4CA',
            },
          },
          DependsOn: [
            'TestSubnetRouteTableAssociationFE267B30',
          ],
        },
        // Route linking private IP to NAT Gateway should be in stack
        TestRoute4CB59404: {
          Type: 'AWS::EC2::Route',
          Properties: {
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
          },
        },
        // EIP should be created when not provided
        TestNATGWEIP0A279819: {
          Type: 'AWS::EC2::EIP',
          DependsOn: [
            'TestSubnetRouteTableAssociationFE267B30',
          ],
        },
      },
    });
  });

  test('Route to DynamoDB Endpoint', () => {
    const dynamodb = new GatewayVpcEndpoint(stack, 'TestDB', {
      vpc: myVpc,
      service: GatewayVpcEndpointAwsService.DYNAMODB,
    });
    new route.Route(stack, 'TestRoute', {
      routeTable: routeTable,
      destination: '0.0.0.0/0',
      target: { endpoint: dynamodb },
    });
    Template.fromStack(stack).templateMatches({
      Resources: {
        // DynamoDB endpoint should be in stack
        TestDB27CDA92F: {
          Type: 'AWS::EC2::VPCEndpoint',
          Properties: {
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
          },
        },
      },
    });
  });

  test('Route to S3 Endpoint', () => {
    const dynamodb = new GatewayVpcEndpoint(stack, 'TestS3', {
      vpc: myVpc,
      service: GatewayVpcEndpointAwsService.S3,
    });
    new route.Route(stack, 'TestRoute', {
      routeTable: routeTable,
      destination: '0.0.0.0/0',
      target: { endpoint: dynamodb },
    });
    Template.fromStack(stack).templateMatches({
      Resources: {
        // S3 endpoint should be in stack
        TestS38FCC715C: {
          Type: 'AWS::EC2::VPCEndpoint',
          Properties: {
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
          },
        },
      },
    });
  });

  test('Route to S3 Express Endpoint', () => {
    const dynamodb = new GatewayVpcEndpoint(stack, 'TestS3E', {
      vpc: myVpc,
      service: GatewayVpcEndpointAwsService.S3_EXPRESS,
    });
    new route.Route(stack, 'TestRoute', {
      routeTable: routeTable,
      destination: '0.0.0.0/0',
      target: { endpoint: dynamodb },
    });
    Template.fromStack(stack).templateMatches({
      Resources: {
        // S3 endpoint should be in stack
        TestS3E055E5994: {
          Type: 'AWS::EC2::VPCEndpoint',
          Properties: {
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
          },
        },
      },
    });
  });

});

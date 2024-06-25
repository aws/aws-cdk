import * as cdk from 'aws-cdk-lib';
import * as vpc from '../lib/vpc-v2';
import * as subnet from '../lib/subnet-v2';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
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
      secondaryAddressBlocks: [vpc.IpAddresses.amazonProvidedIpv6()],
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });
    routeTable = new route.RouteTable(stack, 'TestRouteTable', {
      vpcId: myVpc.vpcId,
    });
    mySubnet = new subnet.SubnetV2(stack, 'TestSubnet', {
      vpc: myVpc,
      availabilityZone: 'us-east-1a',
      cidrBlock: new subnet.Ipv4Cidr('10.0.0.0/24'),
      ipv6CidrBlock: new subnet.Ipv6Cidr(cdk.Fn.select(0, myVpc.ipv6CidrBlocks)),
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      routeTable: routeTable,
    });
  });

  test('Route to EIGW', () => {
    const eigw = new route.EgressOnlyInternetGateway(stack, 'TestEIGW', {
      vpcId: myVpc.vpcId,
    });
    new route.Route(stack, 'TestRoute', {
      routeTable: routeTable,
      destination: vpc.IpAddresses.ipv4('0.0.0.0/0'),
      target: eigw,
    });
    if (mySubnet) {}
    // console.log(Template.fromStack(stack).toJSON().Resources);
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
      }
    });
  });

  test('Route to VPN Gateway', () => {
    const vpngw = new route.VirtualPrivateGateway(stack, 'TestVpnGw', {
      type: 'ipsec.1',
      vpcId: myVpc.vpcId,
    });
    new route.Route(stack, 'TestRoute', {
      routeTable: routeTable,
      destination: vpc.IpAddresses.ipv4('0.0.0.0/0'),
      target: vpngw,
    });
    Template.fromStack(stack).templateMatches({
      Resources: {
        // VPN Gateway should be in stack
        TestVpnGwIGW11AF5344: {
          Type: 'AWS::EC2::VPNGateway',
          Properties: {
            Type: 'ipsec.1'
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
    new route.VirtualPrivateGateway(stack, 'TestVpnGw', {
      type: 'ipsec.1',
      vpcId: myVpc.vpcId,
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
      vpcId: myVpc.vpcId,
    });
    new route.Route(stack, 'TestRoute', {
      routeTable: routeTable,
      destination: vpc.IpAddresses.ipv4('0.0.0.0/0'),
      target: igw,
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
  })
});

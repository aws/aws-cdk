import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { TransitGateway } from '../lib/transit-gateway';
import * as vpc from '../lib/vpc-v2';
import * as subnet from '../lib/subnet-v2';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { TransitGatewayRouteTable } from '../lib/transit-gateway-route-table';
import { TransitGatewayVpcAttachment } from '../lib/transit-gateway-vpc-attachment';
import { TransitGatewayRoute, TransitGatewayBlackholeRoute } from '../lib/transit-gateway-route';

describe('Transit Gateway Route', () => {
  let stack: cdk.Stack;
  let tgw: TransitGateway;
  let myVpc: vpc.VpcV2;
  let mySubnet: subnet.SubnetV2;
  let attachment: TransitGatewayVpcAttachment;
  let routeTable: TransitGatewayRouteTable;

  beforeEach(() => {
    const app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });

    stack = new cdk.Stack(app, 'TransitGatewayRouteTableStack', {
      env: {
        region: 'us-east-1',
      },
    });

    myVpc = new vpc.VpcV2(stack, 'VpcA', {
      primaryAddressBlock: vpc.IpAddresses.ipv4('10.0.0.0/16'),
      secondaryAddressBlocks: [vpc.IpAddresses.ipv4('10.1.0.0/16', { cidrBlockName: 'TempSecondaryBlock' })],
    });

    mySubnet = new subnet.SubnetV2(stack, 'TestSubnet', {
      vpc: myVpc,
      availabilityZone: 'us-east-1a',
      ipv4CidrBlock: new subnet.IpCidr('10.0.0.0/24'),
      subnetType: SubnetType.PRIVATE_WITH_EGRESS,
    });

    tgw = new TransitGateway(stack, 'TransitGateway', {
      defaultRouteTableAssociation: false,
      defaultRouteTablePropagation: false,
    });

    attachment = new TransitGatewayVpcAttachment(stack, 'TransitGatewayVpcAttachment', {
      vpc: myVpc,
      transitGateway: tgw,
      subnets: [mySubnet],
    });

    routeTable = new TransitGatewayRouteTable(stack, 'TransitGatewayRouteTable', {
      transitGateway: tgw,
    });
  });

  describe('TransitGatewayActiveRoute', () => {
    test('creates a route with the correct properties', () => {
      // WHEN
      new TransitGatewayRoute(stack, 'ActiveRoute', {
        transitGatewayAttachment: attachment,
        destinationCidrBlock: '10.1.0.0/16',
        transitGatewayRouteTable: routeTable,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayRoute', {
        Blackhole: false,
        DestinationCidrBlock: '10.1.0.0/16',
        TransitGatewayAttachmentId: {
          'Fn::GetAtt': [
            'TransitGatewayVpcAttachment0B27B76B',
            'Id',
          ],
        },
        TransitGatewayRouteTableId: {
          'Fn::GetAtt': [
            'TransitGatewayRouteTableD2EDBDC1',
            'TransitGatewayRouteTableId',
          ],
        },
      });
    });
  });

  describe('TransitGatewayBlackholeRoute', () => {
    test('creates a blackhole route with the correct properties', () => {
      // WHEN
      new TransitGatewayBlackholeRoute(stack, 'BlackholeRoute', {
        destinationCidrBlock: '10.2.0.0/16',
        transitGatewayRouteTable: routeTable,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayRoute', {
        Blackhole: true,
        DestinationCidrBlock: '10.2.0.0/16',
        TransitGatewayRouteTableId: {
          'Fn::GetAtt': [
            'TransitGatewayRouteTableD2EDBDC1',
            'TransitGatewayRouteTableId',
          ],
        },
      });
    });

    test('does not include TransitGatewayAttachmentId', () => {
      // WHEN
      new TransitGatewayBlackholeRoute(stack, 'BlackholeRoute', {
        destinationCidrBlock: '10.2.0.0/16',
        transitGatewayRouteTable: routeTable,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayRoute', {
        Blackhole: true,
        DestinationCidrBlock: '10.2.0.0/16',
        TransitGatewayAttachmentId: Match.absent(),
      });
    });
  });
});

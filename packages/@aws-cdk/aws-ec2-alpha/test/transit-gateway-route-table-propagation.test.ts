import { Template } from 'aws-cdk-lib/assertions';
import { Stack } from 'aws-cdk-lib/core';
import * as vpc from '../lib';
import { TransitGateway } from '../lib/transit-gateway';
import { ITransitGatewayRouteTable } from '../lib/transit-gateway-route-table';
import { TransitGatewayVpcAttachment } from '../lib/transit-gateway-vpc-attachment';
import { TransitGatewayRouteTablePropagation } from '../lib/transit-gateway-route-table-propagation';
import * as subnet from '../lib/subnet-v2';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';

describe('TransitGatewayRouteTablePropagation', () => {
  let stack: Stack;
  let myVpc: vpc.VpcV2;
  let transitGateway: TransitGateway;
  let routeTable: ITransitGatewayRouteTable;
  let attachment: TransitGatewayVpcAttachment;
  let mySubnet: vpc.SubnetV2;

  beforeEach(() => {
    stack = new Stack();
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

    transitGateway = new TransitGateway(stack, 'TransitGateway', {
      defaultRouteTableAssociation: false,
      defaultRouteTablePropagation: false,
    });

    routeTable = transitGateway.addRouteTable('RouteTable');

    attachment = new TransitGatewayVpcAttachment(stack, 'TransitGatewayVpcAttachment', {
      vpc: myVpc,
      transitGateway: transitGateway,
      subnets: [mySubnet],
    });
  });

  test('creates propagation with required properties', () => {
    // WHEN
    new TransitGatewayRouteTablePropagation(stack, 'TransitGatewayRouteTablePropagation', {
      transitGatewayRouteTable: routeTable,
      transitGatewayVpcAttachment: attachment,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayRouteTablePropagation', {
      TransitGatewayAttachmentId: stack.resolve(attachment.transitGatewayAttachmentId),
      TransitGatewayRouteTableId: stack.resolve(routeTable.routeTableId),
    });
  });
});

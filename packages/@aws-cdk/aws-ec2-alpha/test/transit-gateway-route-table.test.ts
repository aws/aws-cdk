import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { TransitGateway } from '../lib/transit-gateway';
import * as vpc from '../lib/vpc-v2';
import * as subnet from '../lib/subnet-v2';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { TransitGatewayRouteTable } from '../lib/transit-gateway-route-table';
import { TransitGatewayVpcAttachment } from '../lib/transit-gateway-vpc-attachment';

describe('Transit Gateway Route Table', () => {
  let stack: cdk.Stack;
  let tgw: TransitGateway;
  let myVpc: vpc.VpcV2;
  let mySubnet: subnet.SubnetV2;
  let attachment: TransitGatewayVpcAttachment;
  // let rtb1: TransitGatewayRouteTable;

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

    new TransitGatewayRouteTable(stack, 'TransitGatewayRouteTable', {
      transitGateway: tgw,
    });
  });

  test('creates a transit gateway route table', () => {
    Template.fromStack(stack).resourcePropertiesCountIs('AWS::EC2::TransitGatewayRouteTable', {
      TransitGatewayId: {
        'Fn::GetAtt': [
          'TransitGateway11B93D57',
          'Id',
        ],
      },
    }, 2);

    Template.fromStack(stack).templateMatches({
      Resources: {
        TransitGateway11B93D57: {
          Type: 'AWS::EC2::TransitGateway',
          Properties: {
            DefaultRouteTableAssociation: 'disable',
            DefaultRouteTablePropagation: 'disable',
          },
        },
        TransitGatewayDefaultRouteTable608EC117: {
          Type: 'AWS::EC2::TransitGatewayRouteTable',
          Properties: {
            TransitGatewayId: {
              'Fn::GetAtt': [
                'TransitGateway11B93D57',
                'Id',
              ],
            },
          },
        },
        TransitGatewayRouteTableD2EDBDC1: {
          Type: 'AWS::EC2::TransitGatewayRouteTable',
          Properties: {
            TransitGatewayId: {
              'Fn::GetAtt': [
                'TransitGateway11B93D57',
                'Id',
              ],
            },
          },
        },
      },
    });
  });

  test('addRoute method creates a transit gateway active route and adds it to the transit gateway route table', () => {
    tgw.defaultRouteTable.addRoute('TransitGatewayRoute', attachment, '10.0.0.0/16');

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayRoute', {
      Blackhole: false,
      DestinationCidrBlock: '10.0.0.0/16',
      TransitGatewayAttachmentId: {
        'Fn::GetAtt': [
          'TransitGatewayVpcAttachment0B27B76B',
          'Id',
        ],
      },
      TransitGatewayRouteTableId: {
        'Fn::GetAtt': [
          'TransitGatewayDefaultRouteTable608EC117',
          'TransitGatewayRouteTableId',
        ],
      },
    });
  });

  test('addBlackholeRoute method creates a transit gateway blackhole route and adds it to the transit gateway route table', () => {
    tgw.defaultRouteTable.addBlackholeRoute('TransitGatewayRoute', '10.0.0.0/16');

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayRoute', {
      Blackhole: true,
      DestinationCidrBlock: '10.0.0.0/16',
      TransitGatewayRouteTableId: {
        'Fn::GetAtt': [
          'TransitGatewayDefaultRouteTable608EC117',
          'TransitGatewayRouteTableId',
        ],
      },
    });
  });

  test('addAssociation method creates a transit gateway route table association', () => {
    tgw.defaultRouteTable.addAssociation('TransitGatewayRoute', attachment);

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayRouteTableAssociation', {
      TransitGatewayAttachmentId: {
        'Fn::GetAtt': [
          'TransitGatewayVpcAttachment0B27B76B',
          'Id',
        ],
      },
      TransitGatewayRouteTableId: {
        'Fn::GetAtt': [
          'TransitGatewayDefaultRouteTable608EC117',
          'TransitGatewayRouteTableId',
        ],
      },
    });
  });

  test('enablePropagation method creates a transit gateway route table propagation', () => {
    tgw.defaultRouteTable.enablePropagation('TransitGatewayRoute', attachment);

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayRouteTablePropagation', {
      TransitGatewayAttachmentId: {
        'Fn::GetAtt': [
          'TransitGatewayVpcAttachment0B27B76B',
          'Id',
        ],
      },
      TransitGatewayRouteTableId: {
        'Fn::GetAtt': [
          'TransitGatewayDefaultRouteTable608EC117',
          'TransitGatewayRouteTableId',
        ],
      },
    });
  });
});

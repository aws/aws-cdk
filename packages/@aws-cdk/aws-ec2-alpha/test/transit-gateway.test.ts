import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { TransitGateway } from '../lib/transit-gateway';
import * as vpc from '../lib/vpc-v2';
import * as subnet from '../lib/subnet-v2';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';

describe('Transit Gateway with default settings', () => {

  let stack: cdk.Stack;
  let tgw: TransitGateway;
  let myVpc: vpc.VpcV2;
  let mySubnet: subnet.SubnetV2;

  beforeEach(() => {
    const app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });

    stack = new cdk.Stack(app, 'TransitGatewayStack', {
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

    tgw = new TransitGateway(stack, 'TransitGateway');
  });

  test('Creates a transit gateway with all default settings and default route table', () => {
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::EC2::TransitGateway', {
      AutoAcceptSharedAttachments: 'disable',
      DefaultRouteTableAssociation: 'disable',
      DefaultRouteTablePropagation: 'disable',
      DnsSupport: 'enable',
      MulticastSupport: 'disable',
      VpnEcmpSupport: 'enable',
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        TransitGateway11B93D57: {
          Type: 'AWS::EC2::TransitGateway',
          Properties: {
            AutoAcceptSharedAttachments: 'disable',
            DefaultRouteTableAssociation: 'disable',
            DefaultRouteTablePropagation: 'disable',
            DnsSupport: 'enable',
            MulticastSupport: 'disable',
            VpnEcmpSupport: 'enable',
          },
        },
        TransitGatewayDefaultRouteTable608EC117: {
          Type: 'AWS::EC2::TransitGatewayRouteTable',
          Properties: {
            TransitGatewayId: {
              Ref: 'TransitGateway11B93D57',
            },
          },
        },
      },
    });
  });

  test('add route table method should create a second transit gateway route table tha references the transit gateway', () => {
    tgw.addRouteTable('RouteTable2');

    Template.fromStack(stack).templateMatches({
      Resources: {
        TransitGateway11B93D57: {
          Type: 'AWS::EC2::TransitGateway',
          Properties: {
            AutoAcceptSharedAttachments: 'disable',
            DefaultRouteTableAssociation: 'disable',
            DefaultRouteTablePropagation: 'disable',
            DnsSupport: 'enable',
            MulticastSupport: 'disable',
            VpnEcmpSupport: 'enable',
          },
        },
        TransitGatewayDefaultRouteTable608EC117: {
          Type: 'AWS::EC2::TransitGatewayRouteTable',
          Properties: {
            TransitGatewayId: {
              Ref: 'TransitGateway11B93D57',
            },
          },
        },
        TransitGatewayRouteTable2047E2A04: {
          Type: 'AWS::EC2::TransitGatewayRouteTable',
          Properties: {
            TransitGatewayId: {
              Ref: 'TransitGateway11B93D57',
            },
          },
        },
      },
    });
  });

  test('attach vpc method should create an attachment, association and propagation when default association/propagation are enabled', () => {

    tgw.attachVpc('VpcAttachment', myVpc, [mySubnet]);

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayAttachment', {
      SubnetIds: [
        {
          Ref: 'TestSubnet2A4BE4CA',
        },
      ],
      TransitGatewayId: {
        Ref: 'TransitGateway11B93D57',
      },
      VpcId: {
        'Fn::GetAtt': [
          'VpcAAD85CA4C',
          'VpcId',
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayRouteTableAssociation', {
      TransitGatewayAttachmentId: {
        Ref: 'TransitGatewayVpcAttachment3EC29F61',
      },
      TransitGatewayRouteTableId: {
        Ref: 'TransitGatewayDefaultRouteTable608EC117',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayRouteTablePropagation', {
      TransitGatewayAttachmentId: {
        Ref: 'TransitGatewayVpcAttachment3EC29F61',
      },
      TransitGatewayRouteTableId: {
        Ref: 'TransitGatewayDefaultRouteTable608EC117',
      },
    });
  });
});

describe('Transit Gateway with default route table association and propagation disabled', () => {

  let stack: cdk.Stack;
  let tgw: TransitGateway;
  let myVpc: vpc.VpcV2;
  let mySubnet: subnet.SubnetV2;

  beforeEach(() => {
    const app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });

    stack = new cdk.Stack(app, 'TransitGatewayStack', {
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
  });

  test('should create a transit gateway with all default settings and default route table', () => {
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::EC2::TransitGateway', {
      AutoAcceptSharedAttachments: 'disable',
      DefaultRouteTableAssociation: 'disable',
      DefaultRouteTablePropagation: 'disable',
      DnsSupport: 'enable',
      MulticastSupport: 'disable',
      VpnEcmpSupport: 'enable',
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        TransitGateway11B93D57: {
          Type: 'AWS::EC2::TransitGateway',
          Properties: {
            AutoAcceptSharedAttachments: 'disable',
            DefaultRouteTableAssociation: 'disable',
            DefaultRouteTablePropagation: 'disable',
            DnsSupport: 'enable',
            MulticastSupport: 'disable',
            VpnEcmpSupport: 'enable',
          },
        },
        TransitGatewayDefaultRouteTable608EC117: {
          Type: 'AWS::EC2::TransitGatewayRouteTable',
          Properties: {
            TransitGatewayId: {
              Ref: 'TransitGateway11B93D57',
            },
          },
        },
      },
    });
  });

  test('add route table method should create a second transit gateway route table tha references the transit gateway', () => {
    tgw.addRouteTable('RouteTable2');

    Template.fromStack(stack).templateMatches({
      Resources: {
        TransitGateway11B93D57: {
          Type: 'AWS::EC2::TransitGateway',
          Properties: {
            AutoAcceptSharedAttachments: 'disable',
            DefaultRouteTableAssociation: 'disable',
            DefaultRouteTablePropagation: 'disable',
            DnsSupport: 'enable',
            MulticastSupport: 'disable',
            VpnEcmpSupport: 'enable',
          },
        },
        TransitGatewayDefaultRouteTable608EC117: {
          Type: 'AWS::EC2::TransitGatewayRouteTable',
          Properties: {
            TransitGatewayId: {
              Ref: 'TransitGateway11B93D57',
            },
          },
        },
        TransitGatewayRouteTable2047E2A04: {
          Type: 'AWS::EC2::TransitGatewayRouteTable',
          Properties: {
            TransitGatewayId: {
              Ref: 'TransitGateway11B93D57',
            },
          },
        },
      },
    });
  });

  test('attach vpc method should create an attachment and not create an association or propagation when default association/propagation are disabled', () => {

    tgw.attachVpc('VpcAttachment', myVpc, [mySubnet]);

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayAttachment', {
      SubnetIds: [
        {
          Ref: 'TestSubnet2A4BE4CA',
        },
      ],
      TransitGatewayId: {
        Ref: 'TransitGateway11B93D57',
      },
      VpcId: {
        'Fn::GetAtt': [
          'VpcAAD85CA4C',
          'VpcId',
        ],
      },
    });

    Template.fromStack(stack).resourcePropertiesCountIs('AWS::EC2::TransitGatewayRouteTableAssociation', {
      TransitGatewayVpcAttachmentId: {
        Ref: 'TransitGatewayVpcAttachmentTransitGatewayAttachment963F391D',
      },
      TransitGatewayRouteTableId: {
        Ref: 'TransitGatewayDefaultRouteTable608EC117',
      },
    }, 0);

    Template.fromStack(stack).resourcePropertiesCountIs('AWS::EC2::TransitGatewayRouteTablePropagation', {
      TransitGatewayVpcAttachmentId: {
        Ref: 'TransitGatewayVpcAttachmentTransitGatewayAttachment963F391D',
      },
      TransitGatewayRouteTableId: {
        Ref: 'TransitGatewayDefaultRouteTable608EC117',
      },
    }, 0);
  });
});

describe('Transit Gateway with default route table association and propagation disabled', () => {

  let stack: cdk.Stack;
  let tgw: TransitGateway;
  let myVpc: vpc.VpcV2;
  let mySubnet: subnet.SubnetV2;

  beforeEach(() => {
    const app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });

    stack = new cdk.Stack(app, 'TransitGatewayStack', {
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
  });

  test('should create a transit gateway with all default settings and default route table', () => {
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::EC2::TransitGateway', {
      AutoAcceptSharedAttachments: 'disable',
      DefaultRouteTableAssociation: 'disable',
      DefaultRouteTablePropagation: 'disable',
      DnsSupport: 'enable',
      MulticastSupport: 'disable',
      VpnEcmpSupport: 'enable',
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        TransitGateway11B93D57: {
          Type: 'AWS::EC2::TransitGateway',
          Properties: {
            AutoAcceptSharedAttachments: 'disable',
            DefaultRouteTableAssociation: 'disable',
            DefaultRouteTablePropagation: 'disable',
            DnsSupport: 'enable',
            MulticastSupport: 'disable',
            VpnEcmpSupport: 'enable',
          },
        },
        TransitGatewayDefaultRouteTable608EC117: {
          Type: 'AWS::EC2::TransitGatewayRouteTable',
          Properties: {
            TransitGatewayId: {
              Ref: 'TransitGateway11B93D57',
            },
          },
        },
      },
    });
  });

  test('add route table method should create a second transit gateway route table tha references the transit gateway', () => {
    tgw.addRouteTable('RouteTable2');

    Template.fromStack(stack).templateMatches({
      Resources: {
        TransitGateway11B93D57: {
          Type: 'AWS::EC2::TransitGateway',
          Properties: {
            AutoAcceptSharedAttachments: 'disable',
            DefaultRouteTableAssociation: 'disable',
            DefaultRouteTablePropagation: 'disable',
            DnsSupport: 'enable',
            MulticastSupport: 'disable',
            VpnEcmpSupport: 'enable',
          },
        },
        TransitGatewayDefaultRouteTable608EC117: {
          Type: 'AWS::EC2::TransitGatewayRouteTable',
          Properties: {
            TransitGatewayId: {
              Ref: 'TransitGateway11B93D57',
            },
          },
        },
        TransitGatewayRouteTable2047E2A04: {
          Type: 'AWS::EC2::TransitGatewayRouteTable',
          Properties: {
            TransitGatewayId: {
              Ref: 'TransitGateway11B93D57',
            },
          },
        },
      },
    });
  });

  test('attach vpc method should create an attachment and not create an association or propagation', () => {

    tgw.attachVpc('VpcAttachment', myVpc, [mySubnet]);

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayAttachment', {
      SubnetIds: [
        {
          Ref: 'TestSubnet2A4BE4CA',
        },
      ],
      TransitGatewayId: {
        Ref: 'TransitGateway11B93D57',
      },
      VpcId: {
        'Fn::GetAtt': [
          'VpcAAD85CA4C',
          'VpcId',
        ],
      },
    });

    Template.fromStack(stack).resourcePropertiesCountIs('AWS::EC2::TransitGatewayRouteTableAssociation', {
      TransitGatewayAttachmentId: {
        Ref: 'TransitGatewayVpcAttachmentTransitGatewayAttachment963F391D',
      },
      TransitGatewayRouteTableId: {
        Ref: 'TransitGatewayDefaultRouteTable608EC117',
      },
    }, 0);

    Template.fromStack(stack).resourcePropertiesCountIs('AWS::EC2::TransitGatewayRouteTablePropagation', {
      TransitGatewayAttachmentId: {
        Ref: 'TransitGatewayVpcAttachmentTransitGatewayAttachment963F391D',
      },
      TransitGatewayRouteTableId: {
        Ref: 'TransitGatewayDefaultRouteTable608EC117',
      },
    }, 0);
  });

  test('attach vpc method should create an attachment, association and propagation when route tables are passed to the method', () => {

    tgw.attachVpc('VpcAttachment', myVpc, [mySubnet], undefined, tgw.defaultRouteTable, [tgw.defaultRouteTable]);

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayAttachment', {
      SubnetIds: [
        {
          Ref: 'TestSubnet2A4BE4CA',
        },
      ],
      TransitGatewayId: {
        Ref: 'TransitGateway11B93D57',
      },
      VpcId: {
        'Fn::GetAtt': [
          'VpcAAD85CA4C',
          'VpcId',
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayRouteTableAssociation', {
      TransitGatewayAttachmentId: {
        Ref: 'TransitGatewayVpcAttachment3EC29F61',
      },
      TransitGatewayRouteTableId: {
        Ref: 'TransitGatewayDefaultRouteTable608EC117',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::TransitGatewayRouteTablePropagation', {
      TransitGatewayAttachmentId: {
        Ref: 'TransitGatewayVpcAttachment3EC29F61',
      },
      TransitGatewayRouteTableId: {
        Ref: 'TransitGatewayDefaultRouteTable608EC117',
      },
    });
  });
});

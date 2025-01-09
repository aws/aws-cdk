import { CfnTransitGateway, CfnTransitGatewayRouteTable } from 'aws-cdk-lib/aws-ec2';
import { Resource, Tag } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';

export enum TransitGatewayFeatureStatus {
  ENABLE = 'enable',
  DISABLE = 'disable',
}

export interface ITransitGateway {
  readonly transitGatewayId: string;
  readonly transitGatewayArn: string;
}

abstract class TransitGatewayBase extends Resource implements ITransitGateway {
  public abstract readonly transitGatewayId: string;

  public abstract readonly transitGatewayArn: string;

  //   addRouteTable(id: string, tags: Tag[]): TransitGatewayRouteTable {
  //     return new TransitGatewayRouteTable(this, id, props);
  //   }

//   attachVpc(id: string, vpc: IVpc, subnets: ISubnet[]): TransitGatewayAttachment {
//     return new TransitGatewayAttachment(this, id, props);
//   }
}

export interface TransitGatewayProps {
  /**
   * A private Autonomous System Number (ASN) for the Amazon side of a BGP session. The range is 64512 to 65534 for 16-bit ASNs.
   *
   * @default - 64512
   */
  readonly amazonSideAsn?: number;

  /**
   * Enable or disable automatic acceptance of attachment requests.
   *
   * @default - disable (false)
   */
  readonly autoAcceptSharedAttachments?: boolean;

  /**
   * Enable or disable automatic association with the default association route table.
   *
   * @default - disable, a default route table will be created by the CDK instead of by CFN.
   */
  readonly defaultRouteTableAssociation?: boolean;

  /**
   * Enable or disable automatic propagation of routes to the default propagation route table.
   *
   * @default - disable, a default route table will be created by the CDK instead of by CFN.
   */
  readonly defaultRouteTablePropagation?: boolean;

  /**
   * The description of the transit gateway.
   */
  readonly description?: string;

  /**
   * Enable or disable DNS support
   *
   * @default - enable (true)
   */
  readonly dnsSupport?: boolean;

  /**
   * Indicates whether multicast is enabled on the transit gateway
   *
   * @default - disable (false)
   */
  readonly multicastSupport?: boolean;

  /**
   * Enable or disablesecurity group referencing support
   *
   * @default - disable (false)
   */
  readonly securityGroupReferencingSupport?: boolean;

  /**
   * The tags for the transit gateway.
   *
   * @default - none
   */
  readonly tags?: Tag[];

  /**
   * The transit gateway CIDR blocks.
   */
  readonly transitGatewayCidrBlocks?: string[];

  /**
   * Enable or disable Equal Cost Multipath Protocol support
   *
   * @default - enable (true)
   */
  readonly vpnEcmpSupport?: boolean;
}

export class TransitGateway extends TransitGatewayBase {
  public readonly transitGatewayId: string;
  public readonly transitGatewayArn: string;
  public readonly defaultRouteTable: CfnTransitGatewayRouteTable;

  constructor(scope: Construct, id: string, props: TransitGatewayProps) {
    super(scope, id);

    const resource = new CfnTransitGateway(this, id, {
      amazonSideAsn: props.amazonSideAsn ?? 64512,
      autoAcceptSharedAttachments: (props.autoAcceptSharedAttachments ?? false)
        ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
      defaultRouteTableAssociation: (props.defaultRouteTableAssociation ?? false)
        ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
      defaultRouteTablePropagation: (props.defaultRouteTablePropagation ?? false)
        ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
      description: props.description,
      dnsSupport: (props.dnsSupport ?? true) ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
      multicastSupport: (props.multicastSupport ?? false) ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
      vpnEcmpSupport: (props.vpnEcmpSupport ?? false) ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
      tags: props.tags,
    });

    this.transitGatewayId = resource.ref;
    this.transitGatewayArn = this.getResourceArnAttribute(resource.ref, {
      service: 'ec2',
      resource: 'transit-gateway',
      resourceName: this.physicalName,
    });

    // Create the route table we'll use as default
    this.defaultRouteTable = new CfnTransitGatewayRouteTable(this, 'DefaultRouteTable', {
      transitGatewayId: this.transitGatewayId,
      tags: [
        { key: 'Name', value: 'Default' },
      ],
    });
  }
}

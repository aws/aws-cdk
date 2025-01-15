import { CfnTransitGateway, ISubnet, IVpc, RouterType } from 'aws-cdk-lib/aws-ec2';
import { Resource } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { ITransitGatewayRouteTable, TransitGatewayRouteTable } from './transit-gateway-route-table';
import { TransitGatewayVpcAttachment, ITransitGatewayAttachmentOptions } from './transit-gateway-attachment';
import { IRouteTarget } from './route';

export enum TransitGatewayFeatureStatus {
  ENABLE = 'enable',
  DISABLE = 'disable',
}

export interface ITransitGateway {
  readonly transitGatewayId: string;
  readonly transitGatewayArn: string;
  readonly defaultRouteTable: ITransitGatewayRouteTable;
  readonly defaultRouteTableAssociation: boolean;
  readonly defaultRouteTablePropagation: boolean;
}

export interface TransitGatewayProps {
  /**
   * A private Autonomous System Number (ASN) for the Amazon side of a BGP session. The range is 64512 to 65534 for 16-bit ASNs.
   *
   * @default - undefined
   */
  readonly amazonSideAsn?: number;

  /**
   * Enable or disable automatic acceptance of cross-account attachment requests.
   *
   * @default - disable (false)
   */
  readonly autoAcceptSharedAttachments?: boolean;

  /**
   * Enable or disable automatic association with the default association route table.
   *
   * @default - enable
   */
  readonly defaultRouteTableAssociation?: boolean;

  /**
   * Enable or disable automatic propagation of routes to the default propagation route table.
   *
   * @default - enable
   */
  readonly defaultRouteTablePropagation?: boolean;

  /**
   * A route table to be used in place of the default route table.
   *
   * @default - if not specified, a default route table will be created by the CDK instead of by EC2.
   */
  readonly customDefaultRouteTable?: ITransitGatewayRouteTable;

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

abstract class TransitGatewayBase extends Resource implements ITransitGateway, IRouteTarget {
  public abstract readonly routerType: RouterType;
  public abstract readonly routerTargetId: string;
  public abstract readonly transitGatewayId: string;
  public abstract readonly transitGatewayArn: string;
  public abstract readonly defaultRouteTable: TransitGatewayRouteTable;
  public abstract readonly defaultRouteTableAssociation: boolean;
  public abstract readonly defaultRouteTablePropagation: boolean;

  addRouteTable(id: string): TransitGatewayRouteTable {
    return new TransitGatewayRouteTable(this, id, {
      transitGateway: this,
    });
  }

  attachVpc(
    id: string, vpc: IVpc,
    subnets: ISubnet[],
    transitGatewayAttachmentOptions?: ITransitGatewayAttachmentOptions,
  ): TransitGatewayVpcAttachment {
    return new TransitGatewayVpcAttachment(this, id, {
      transitGateway: this,
      vpc: vpc,
      subnets: subnets,
      transitGatewayAttachmentOptions: transitGatewayAttachmentOptions ?? undefined,
    });
  }
}

export class TransitGateway extends TransitGatewayBase {
  public readonly routerType: RouterType;
  public readonly routerTargetId: string;
  public readonly transitGatewayId: string;
  public readonly transitGatewayArn: string;
  public readonly defaultRouteTable: TransitGatewayRouteTable;
  public readonly defaultRouteTableAssociation: boolean;
  public readonly defaultRouteTablePropagation: boolean;

  constructor(scope: Construct, id: string, props?: TransitGatewayProps) {
    super(scope, id);

    const resource = new CfnTransitGateway(this, id, {
      amazonSideAsn: props?.amazonSideAsn ?? undefined,
      autoAcceptSharedAttachments: (props?.autoAcceptSharedAttachments ?? false)
        ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
      // Default Association/Propagation will always be false when creating the L1 to prevent EC2 from creating the default route table.
      // Instead, CDK will create a custom default route table and use the properties to mimic the automatic assocation/propagation behaviour.
      defaultRouteTableAssociation: (props?.defaultRouteTableAssociation ?? false)
        ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
      defaultRouteTablePropagation: (props?.defaultRouteTablePropagation ?? false)
        ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
      description: props?.description,
      dnsSupport: (props?.dnsSupport ?? true) ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
      multicastSupport: (props?.multicastSupport ?? false) ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
      vpnEcmpSupport: (props?.vpnEcmpSupport ?? true) ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
    });

    this.transitGatewayId = resource.ref;
    this.routerTargetId = resource.ref;
    this.routerType = RouterType.TRANSIT_GATEWAY;
    this.transitGatewayArn = this.getResourceArnAttribute(resource.ref, {
      service: 'ec2',
      resource: 'transit-gateway',
      resourceName: this.physicalName,
    });

    this.defaultRouteTable = (props?.customDefaultRouteTable as TransitGatewayRouteTable) ?? new TransitGatewayRouteTable(this, 'DefaultRouteTable', {
      transitGateway: this,
    });

    this.defaultRouteTableAssociation = props?.defaultRouteTableAssociation ?? true;
    this.defaultRouteTablePropagation = props?.defaultRouteTablePropagation ?? true;
  }
}

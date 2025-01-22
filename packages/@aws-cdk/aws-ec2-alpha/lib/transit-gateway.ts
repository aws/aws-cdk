import { CfnTransitGateway, ISubnet, IVpc, RouterType } from 'aws-cdk-lib/aws-ec2';
import { Resource } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { ITransitGatewayRouteTable, TransitGatewayRouteTable } from './transit-gateway-route-table';
import { TransitGatewayVpcAttachment, ITransitGatewayVpcAttachmentOptions } from './transit-gateway-vpc-attachment';
import { IRouteTarget } from './route';
import { TransitGatewayRouteTableAssociation } from './transit-gateway-route-table-association';
import { TransitGatewayRouteTablePropagation } from './transit-gateway-route-table-propagation';

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
    transitGatewayAttachmentOptions?: ITransitGatewayVpcAttachmentOptions,
    associationRouteTable?: ITransitGatewayRouteTable,
    propagationRouteTables?: ITransitGatewayRouteTable[],
  ): TransitGatewayVpcAttachment {
    const attachment = new TransitGatewayVpcAttachment(this, id, {
      transitGateway: this,
      vpc: vpc,
      subnets: subnets,
      transitGatewayVpcAttachmentOptions: transitGatewayAttachmentOptions ?? undefined,
    });

    // If `associationRouteTable` is provided, skip creating the Association only if `associationRouteTable` is the default route table and
    // automatic association (`defaultRouteTableAssociation`) is enabled, as the TransitGatewayRouteTableAttachment's constructor will handle it in that case.
    if (associationRouteTable && !(this.defaultRouteTable === associationRouteTable && this.defaultRouteTableAssociation)) {
      new TransitGatewayRouteTableAssociation(this, `${id}-Assoc-${this.node.addr}`, {
        transitGatewayVpcAttachment: attachment,
        transitGatewayRouteTable: associationRouteTable,
      });
    }

    if (propagationRouteTables) {
      propagationRouteTables.forEach((propagationRouteTable, index) => {
        // If `propagationRouteTable` is provided, skip creating the Propagation only if `propagationRouteTable` is the default route table and
        // automatic propagation (`defaultRouteTablePropagation`) is enabled, as the TransitGatewayRouteTableAttachment's constructor will handle it in that case.
        if (!(this.defaultRouteTable === propagationRouteTable && this.defaultRouteTablePropagation)) {
          new TransitGatewayRouteTablePropagation(this, `${id}-Propagation-${index}`, {
            transitGatewayVpcAttachment: attachment,
            transitGatewayRouteTable: propagationRouteTable,
          });
        }
      });
    }

    return attachment;
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

    this.defaultRouteTable = new TransitGatewayRouteTable(this, 'DefaultRouteTable', {
      transitGateway: this,
    });

    this.defaultRouteTableAssociation = props?.defaultRouteTableAssociation ?? true;
    this.defaultRouteTablePropagation = props?.defaultRouteTablePropagation ?? true;
  }
}

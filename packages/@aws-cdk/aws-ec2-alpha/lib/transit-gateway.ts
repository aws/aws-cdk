import { CfnTransitGateway, RouterType } from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { ITransitGatewayRouteTable, TransitGatewayRouteTable } from './transit-gateway-route-table';
import { TransitGatewayVpcAttachment, AttachVpcOptions, ITransitGatewayVpcAttachment } from './transit-gateway-vpc-attachment';
import { IRouteTarget } from './route';
import { TransitGatewayRouteTableAssociation } from './transit-gateway-route-table-association';
import { TransitGatewayRouteTablePropagation } from './transit-gateway-route-table-propagation';
import { getFeatureStatusDefaultDisable, getFeatureStatusDefaultEnable } from './util';

/**
 * Represents a Transit Gateway.
 */
export interface ITransitGateway extends cdk.IResource {
  /**
   * The unique identifier of the Transit Gateway.
   *
   * This ID is automatically assigned by AWS upon creation of the Transit Gateway
   * and is used to reference it in various configurations and operations.
   * @attribute
   */
  readonly transitGatewayId: string;                                                                                                                                                                      

  /**
   * The Amazon Resource Name (ARN) of the Transit Gateway.
   *
   * The ARN uniquely identifies the Transit Gateway across AWS and is commonly
   * used for permissions and resource tracking.
   * @attribute
   */
  readonly transitGatewayArn: string;

  /**
   * The default route table associated with the Transit Gateway.
   *
   * This route table is created by the CDK and is used to manage the routes
   * for attachments that do not have an explicitly defined route table association.
   */
  readonly defaultRouteTable: ITransitGatewayRouteTable;

  /**
   * Indicates whether new attachments are automatically associated with the default route table.
   *
   * If set to `true`, any VPC or VPN attachment will be automatically associated with
   * the default route table unless otherwise specified.
   */
  readonly defaultRouteTableAssociation: boolean;

  /**
   * Indicates whether route propagation to the default route table is enabled.
   *
   * When set to `true`, routes from attachments will be automatically propagated
   * to the default route table unless propagation is explicitly disabled.
   */
  readonly defaultRouteTablePropagation: boolean;
}

/**
 * Common properties for creating a Transit Gateway resource.
 */
export interface TransitGatewayProps {
  /**
   * Physical name of this Transit Gateway.
   *
   * @default - Assigned by CloudFormation.
   */
  readonly transitGatewayName?: string;

  /**
   * A private Autonomous System Number (ASN) for the Amazon side of a BGP session. The range is 64512 to 65534 for 16-bit ASNs.
   *
   * @default - 64512, assigned by CloudFormation.
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
   * @default - enable (true)
   */
  readonly defaultRouteTableAssociation?: boolean;

  /**
   * Enable or disable automatic propagation of routes to the default propagation route table.
   *
   * @default - enable (true)
   */
  readonly defaultRouteTablePropagation?: boolean;

  /**
   * The description of the transit gateway.
   *
   * @default - no description
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
   *
   * @default - none
   */
  readonly transitGatewayCidrBlocks?: string[];

  /**
   * Enable or disable Equal Cost Multipath Protocol support
   *
   * @default - enable (true)
   */
  readonly vpnEcmpSupport?: boolean;
}

/**
 * A Transit Gateway.
 * @internal
 */
abstract class TransitGatewayBase extends cdk.Resource implements ITransitGateway, IRouteTarget {
  public abstract readonly routerType: RouterType;
  public abstract readonly routerTargetId: string;
  public abstract readonly transitGatewayId: string;
  public abstract readonly transitGatewayArn: string;
  public abstract readonly defaultRouteTable: ITransitGatewayRouteTable;
  public abstract readonly defaultRouteTableAssociation: boolean;
  public abstract readonly defaultRouteTablePropagation: boolean;

  /**
   * Adds a new route table to the Transit Gateway.
   *
   * @returns The created Transit Gateway route table.
   */
  public addRouteTable(id: string): ITransitGatewayRouteTable {
    return new TransitGatewayRouteTable(this, id, {
      transitGateway: this,
    });
  }

  /**
   * Attaches a VPC to the Transit Gateway.
   *
   * @returns The created Transit Gateway VPC attachment.
   */
  public attachVpc(id: string, options: AttachVpcOptions): ITransitGatewayVpcAttachment {
    const attachment = new TransitGatewayVpcAttachment(this, id, {
      transitGateway: this,
      vpc: options.vpc,
      subnets: options.subnets,
      vpcAttachmentOptions: options.vpcAttachmentOptions ?? undefined,
    });

    // If `associationRouteTable` is provided, skip creating the Association only if `associationRouteTable` is the default route table and
    // automatic association (`defaultRouteTableAssociation`) is enabled, as the TransitGatewayRouteTableAttachment's constructor will handle it in that case.
    if (options.associationRouteTable && !(this.defaultRouteTable === options.associationRouteTable && this.defaultRouteTableAssociation)) {
      new TransitGatewayRouteTableAssociation(this, `${id}-Association-${this.node.addr}`, {
        transitGatewayVpcAttachment: attachment,
        transitGatewayRouteTable: options.associationRouteTable,
      });
    }

    if (options.propagationRouteTables) {
      options.propagationRouteTables.forEach((propagationRouteTable, index) => {
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

/**
 * Creates a Transit Gateway.
 *
 * @resource AWS::EC2::TransitGateway
 */
export class TransitGateway extends TransitGatewayBase {
  public readonly routerType: RouterType;
  public readonly routerTargetId: string;
  public readonly transitGatewayId: string;
  public readonly transitGatewayArn: string;
  public readonly defaultRouteTable: ITransitGatewayRouteTable;
  public readonly defaultRouteTableAssociation: boolean;
  public readonly defaultRouteTablePropagation: boolean;

  constructor(scope: Construct, id: string, props: TransitGatewayProps = {}) {
    super(scope, id);

    const resource = new CfnTransitGateway(this, id, {
      amazonSideAsn: props.amazonSideAsn ?? undefined,
      autoAcceptSharedAttachments: getFeatureStatusDefaultDisable(props.autoAcceptSharedAttachments),
      // Default Association/Propagation will always be false when creating the L1 to prevent EC2 from creating the default route table.
      // Instead, CDK will create a custom default route table and use the properties to mimic the automatic assocation/propagation behaviour.
      defaultRouteTableAssociation: getFeatureStatusDefaultDisable(props.defaultRouteTableAssociation),
      defaultRouteTablePropagation: getFeatureStatusDefaultDisable(props.defaultRouteTablePropagation),
      description: props.description,
      dnsSupport: getFeatureStatusDefaultEnable(props.dnsSupport),
      multicastSupport: getFeatureStatusDefaultDisable(props.multicastSupport),
      vpnEcmpSupport: getFeatureStatusDefaultEnable(props.vpnEcmpSupport),
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

    this.defaultRouteTableAssociation = props.defaultRouteTableAssociation ?? true;
    this.defaultRouteTablePropagation = props.defaultRouteTablePropagation ?? true;
  }
}

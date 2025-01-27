import { ITransitGateway } from './transit-gateway';
import { CfnTransitGatewayAttachment, ISubnet, IVpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { TransitGatewayRouteTableAssociation } from './transit-gateway-route-table-association';
import { TransitGatewayRouteTablePropagation } from './transit-gateway-route-table-propagation';
import { ITransitGatewayAttachment, TransitGatewayAttachmentBase } from './transit-gateway-attachment';
import { getFeatureStatusDefaultDisable } from './util';
import { ITransitGatewayRouteTable } from './transit-gateway-route-table';

/**
 * Options for Transit Gateway VPC Attachment
 */
export interface ITransitGatewayVpcAttachmentOptions {
  /**
   * Enable or disable appliance mode support.
   *
   * @default - disable (false)
   */
  readonly applianceModeSupport?: boolean;

  /**
   * Enable or disable DNS support.
   *
   * @default - disable (false)
   */
  readonly dnsSupport?: boolean;

  /**
   * Enable or disable IPv6 support.
   *
   * @default - disable (false)
   */
  readonly ipv6Support?: boolean;

  /**
   * Enables you to reference a security group across VPCs attached to a transit gateway.
   *
   * @default - disable (false)
   */
  readonly securityGroupReferencingSupport?: boolean;
}

/**
 * Represents a Transit Gateway VPC Attachment
 */
export interface ITransitGatewayVpcAttachment extends ITransitGatewayAttachment {
  /**
   * Add additional subnets to this attachment.
   */
  addSubnets(subnets: ISubnet[]): void;

  /**
   * Remove subnets from this attachment.
   */
  removeSubnets(subnets: ISubnet[]): void;
}

/**
 * Base class for Transit Gateway VPC Attachment
 */
interface BaseTransitGatewayVpcAttachmentProps {
  /**
   * A list of one or more subnets to place the attachment in.
   * It is recommended to specify more subnets for better availability.
   */
  readonly subnets: ISubnet[];

  /**
   * A VPC attachment(s) will get assigned to.
   */
  readonly vpc: IVpc;

  /**
   * The VPC attachment options.
   *
   * @default - All options are disabled.
   */
  readonly vpcAttachmentOptions?: ITransitGatewayVpcAttachmentOptions;

  /**
   * Physical name of this Transit Gateway VPC Attachment.
   *
   * @default - Assigned by CloudFormation.
   */
  readonly transitGatewayAttachmentName?: string;
}

/**
 * Common properties for creating a Transit Gateway VPC Attachment resource.
 */
export interface TransitGatewayVpcAttachmentProps extends BaseTransitGatewayVpcAttachmentProps {
  /**
   * The transit gateway this attachment gets assigned to.
   */
  readonly transitGateway: ITransitGateway;
}

/**
 * Options for creating an Attachment via the attachVpc() method
 */
export interface AttachVpcOptions extends BaseTransitGatewayVpcAttachmentProps {
  /**
   * An optional route table to associate with this VPC attachment.
   *
   * @default - No associations will be created unless it is for the default route table and automatic association is enabled.
   */
  readonly associationRouteTable?: ITransitGatewayRouteTable;

  /**
   * A list of optional route tables to propagate routes to.
   *
   * @default - No propagations will be created unless it is for the default route table and automatic propagation is enabled.
   */
  readonly propagationRouteTables?: ITransitGatewayRouteTable[];
}

/**
 * Creates a Transit Gateway VPC Attachment.
 *
 * @resource AWS::EC2::TransitGatewayAttachment
 */
export class TransitGatewayVpcAttachment extends TransitGatewayAttachmentBase {
  public readonly transitGatewayVpcAttachmentId: string;
  private readonly subnets: ISubnet[] = [];
  private transitGatewayVpcAttachment: CfnTransitGatewayAttachment;

  constructor(scope: Construct, id: string, props: TransitGatewayVpcAttachmentProps) {
    super(scope, id);

    const resource = new CfnTransitGatewayAttachment(this, id, {
      subnetIds: props.subnets.map((subnet) => subnet.subnetId),
      transitGatewayId: props.transitGateway.transitGatewayId,
      vpcId: props.vpc.vpcId,
      options: props.vpcAttachmentOptions ? {
        ApplianceModeSupport: getFeatureStatusDefaultDisable(props.vpcAttachmentOptions?.applianceModeSupport),
        DnsSupport: getFeatureStatusDefaultDisable(props.vpcAttachmentOptions?.dnsSupport),
        Ipv6Support: getFeatureStatusDefaultDisable(props.vpcAttachmentOptions?.ipv6Support),
        SecurityGroupReferencingSupport: getFeatureStatusDefaultDisable(props.vpcAttachmentOptions?.securityGroupReferencingSupport),
      } : undefined,
    });

    this.transitGatewayVpcAttachment = resource;
    this.transitGatewayVpcAttachmentId = resource.ref;
    this.subnets = props.subnets;

    if (props.transitGateway.defaultRouteTableAssociation) {
      new TransitGatewayRouteTableAssociation(this, id + 'Association', {
        transitGatewayVpcAttachment: this,
        transitGatewayRouteTable: props.transitGateway.defaultRouteTable,
      });
    }

    if (props.transitGateway.defaultRouteTablePropagation) {
      new TransitGatewayRouteTablePropagation(this, id + 'Propagation', {
        transitGatewayVpcAttachment: this,
        transitGatewayRouteTable: props.transitGateway.defaultRouteTable,
      });
    }
  }

  /**
   * Add additional subnets to this attachment.
   */
  addSubnets(subnets: ISubnet[]): void {
    for (const subnet of subnets) {
      if (this.subnets.some(existing => existing.subnetId === subnet.subnetId)) {
        throw new Error(`Subnet with ID ${subnet.subnetId} is already added to the Attachment ${this.transitGatewayVpcAttachmentId}.`);
      }
      this.subnets.push(subnet);
    }
    this.transitGatewayVpcAttachment.subnetIds = this.subnets.map(subnet => subnet.subnetId);
  }

  /**
   * Remove additional subnets to this attachment.
   */
  removeSubnets(subnets: ISubnet[]): void {
    for (const subnet of subnets) {
      const index = this.subnets.findIndex(existing => existing.subnetId === subnet.subnetId);
      if (index === -1) {
        throw new Error(`Subnet with ID ${subnet.subnetId} does not exist in the Attachment ${this.transitGatewayVpcAttachmentId}.`);
      }
      this.subnets.splice(index, 1);
    }
    this.transitGatewayVpcAttachment.subnetIds = this.subnets.map(subnet => subnet.subnetId);
  }
}

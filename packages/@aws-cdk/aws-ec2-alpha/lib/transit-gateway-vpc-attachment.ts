import { ITransitGateway } from './transit-gateway';
import { CfnTransitGatewayAttachment, ISubnet, IVpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { TransitGatewayRouteTableAssociation } from './transit-gateway-route-table-association';
import { TransitGatewayRouteTablePropagation } from './transit-gateway-route-table-propagation';
import { ITransitGatewayAttachment, TransitGatewayAttachmentBase } from './transit-gateway-attachment';
import { getFeatureStatus } from './util';
import { ITransitGatewayRouteTable } from './transit-gateway-route-table';
import { Annotations } from 'aws-cdk-lib';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';

/**
 * Options for Transit Gateway VPC Attachment.
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
 * Represents a Transit Gateway VPC Attachment.
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
 * Base class for Transit Gateway VPC Attachment.
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
 * Options for creating an Attachment via the attachVpc() method.
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
export class TransitGatewayVpcAttachment extends TransitGatewayAttachmentBase implements ITransitGatewayVpcAttachment {
  public readonly transitGatewayAttachmentId: string;
  private readonly subnets: ISubnet[] = [];

  /**
   * The AWS CloudFormation resource representing the Transit Gateway Attachment.
   */
  private readonly _resource: CfnTransitGatewayAttachment;

  constructor(scope: Construct, id: string, props: TransitGatewayVpcAttachmentProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this._resource = new CfnTransitGatewayAttachment(this, id, {
      subnetIds: props.subnets.map((subnet) => subnet.subnetId),
      transitGatewayId: props.transitGateway.transitGatewayId,
      vpcId: props.vpc.vpcId,
      options: props.vpcAttachmentOptions ? {
        ApplianceModeSupport: getFeatureStatus(props.vpcAttachmentOptions?.applianceModeSupport),
        DnsSupport: getFeatureStatus(props.vpcAttachmentOptions?.dnsSupport),
        Ipv6Support: getFeatureStatus(props.vpcAttachmentOptions?.ipv6Support),
        SecurityGroupReferencingSupport: getFeatureStatus(props.vpcAttachmentOptions?.securityGroupReferencingSupport),
      } : undefined,
    });
    this.node.defaultChild = this._resource;

    this.transitGatewayAttachmentId = this._resource.attrId;
    this.subnets = props.subnets;

    if (props.vpcAttachmentOptions?.dnsSupport && !props.transitGateway.dnsSupport) {
      Annotations.of(this).addWarningV2('@aws-cdk/aws-ec2:transitGatewayDnsSupportMismatch', '\'DnsSupport\' is enabled for the VPC Attachment but disabled on the TransitGateway. The feature will not work unless \'DnsSupport\' is enabled on both.');
    }

    if (props.vpcAttachmentOptions?.securityGroupReferencingSupport && !props.transitGateway.securityGroupReferencingSupport) {
      Annotations.of(this).addWarningV2('@aws-cdk/aws-ec2:transitGatewaySecurityGroupReferencingSupportMismatch', '\'SecurityGroupReferencingSupport\' is enabled for the VPC Attachment but disabled on the TransitGateway. The feature will not work unless \'SecurityGroupReferencingSupport\' is enabled on both.');
    }

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
        throw new Error(`Subnet with ID ${subnet.subnetId} is already added to the Attachment ${this.transitGatewayAttachmentId}.`);
      }
      this.subnets.push(subnet);
    }
    this._resource.subnetIds = this.subnets.map(subnet => subnet.subnetId);
  }

  /**
   * Remove additional subnets to this attachment.
   */
  removeSubnets(subnets: ISubnet[]): void {
    for (const subnet of subnets) {
      const index = this.subnets.findIndex(existing => existing.subnetId === subnet.subnetId);
      if (index === -1) {
        throw new Error(`Subnet with ID ${subnet.subnetId} does not exist in the Attachment ${this.transitGatewayAttachmentId}.`);
      }
      this.subnets.splice(index, 1);
    }
    this._resource.subnetIds = this.subnets.map(subnet => subnet.subnetId);
  }
}

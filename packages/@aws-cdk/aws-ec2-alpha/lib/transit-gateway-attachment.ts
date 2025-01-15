import { IResource, Resource } from 'aws-cdk-lib/core';
import { ITransitGateway, TransitGatewayFeatureStatus } from './transit-gateway';
import { CfnTransitGatewayVpcAttachment, ISubnet, IVpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { TransitGatewayRouteTableAssociation } from './transit-gateway-route-table-association';
import { TransitGatewayRouteTablePropagation } from './transit-gateway-route-table-propagation';

export interface ITransitGatewayAttachment extends IResource {
  /**
   * The ID of the transit gateway attachment.
   * @attribute
   */
  readonly transitGatewayAttachmentId: string;
}

export interface ITransitGatewayAttachmentOptions {
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

export interface TransitGatewayAttachmentProps {
  /**
   * A list of one or more subnets to place the attachment in.
   * It is recommended to specify more subnets for better availability.
   *
   * To add/remove subnetIds, use the addSubnets and removeSubnets methods.
   * Directly modifying this property will cause the attachment to be replaced.
   */
  readonly subnets: ISubnet[];

  /**
   * The transit gateway this attachment gets assigned to.
   */
  readonly transitGateway: ITransitGateway;

  /**
   * A VPC attachment(s) will get assigned to.
   */
  readonly vpc: IVpc;

  /**
   * The VPC attachment options.
   */
  readonly transitGatewayAttachmentOptions?: ITransitGatewayAttachmentOptions;
}

abstract class TransitGatewayAttachmentBase extends Resource implements ITransitGatewayAttachment {
  public abstract readonly transitGatewayAttachmentId: string;
}

export class TransitGatewayVpcAttachment extends TransitGatewayAttachmentBase {
  public readonly transitGatewayAttachmentId: string;
  private transitGatewayAttachment: CfnTransitGatewayVpcAttachment;

  constructor(scope: Construct, id: string, props: TransitGatewayAttachmentProps) {
    super(scope, id);

    const resource = new CfnTransitGatewayVpcAttachment(this, 'TransitGatewayAttachment', {
      subnetIds: props.subnets.map((subnet) => subnet.subnetId),
      transitGatewayId: props.transitGateway.transitGatewayId,
      vpcId: props.vpc.vpcId,
      options: props.transitGatewayAttachmentOptions ? {
        applianceModeSupport: (props.transitGatewayAttachmentOptions?.applianceModeSupport ?? false)
          ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
        dnsSupport: (props.transitGatewayAttachmentOptions?.dnsSupport ?? false)
          ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
        ipv6Support: (props.transitGatewayAttachmentOptions?.ipv6Support ?? false)
          ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
        securityGroupReferencingSupport: (props.transitGatewayAttachmentOptions?.securityGroupReferencingSupport ?? false)
          ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
      } : undefined,
    });

    this.transitGatewayAttachment = resource;
    this.transitGatewayAttachmentId = resource.ref;

    if (props.transitGateway.defaultRouteTableAssociation) {
      new TransitGatewayRouteTableAssociation(this, id, {
        transitGatewayAttachment: this,
        transitGatewayRouteTable: props.transitGateway.defaultRouteTable,
      });
    }

    if (props.transitGateway.defaultRouteTablePropagation) {
      new TransitGatewayRouteTablePropagation(this, id + 'Propagation', {
        transitGatewayAttachment: this,
        transitGatewayRouteTable: props.transitGateway.defaultRouteTable,
      });
    }
  }

  addSubnets(subnets: ISubnet[]): void {
    this.transitGatewayAttachment.addSubnetIds = this.transitGatewayAttachment.addSubnetIds?.concat(subnets.map((subnet) => subnet.subnetId));
  }

  removeSubnets(subnets: ISubnet[]): void {
    this.transitGatewayAttachment.removeSubnetIds = this.transitGatewayAttachment.removeSubnetIds?.concat(subnets.map((subnet) => subnet.subnetId));
  }
}

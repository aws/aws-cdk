import { ITransitGateway, TransitGatewayFeatureStatus } from './transit-gateway';
import { CfnTransitGatewayVpcAttachment, ISubnet, IVpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { TransitGatewayRouteTableAssociation } from './transit-gateway-route-table-association';
import { TransitGatewayRouteTablePropagation } from './transit-gateway-route-table-propagation';
import { ITransitGatewayAttachment, TransitGatewayAttachmentBase } from './transit-gateway-attachment';

export interface ITransitGatewayVpcAttachment extends ITransitGatewayAttachment {}

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

export interface TransitGatewayVpcAttachmentProps {
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
  readonly transitGatewayVpcAttachmentOptions?: ITransitGatewayVpcAttachmentOptions;
}

export class TransitGatewayVpcAttachment extends TransitGatewayAttachmentBase {
  public readonly transitGatewayVpcAttachmentId: string;
  private transitGatewayVpcAttachment: CfnTransitGatewayVpcAttachment;

  constructor(scope: Construct, id: string, props: TransitGatewayVpcAttachmentProps) {
    super(scope, id);

    const resource = new CfnTransitGatewayVpcAttachment(this, id, {
      subnetIds: props.subnets.map((subnet) => subnet.subnetId),
      transitGatewayId: props.transitGateway.transitGatewayId,
      vpcId: props.vpc.vpcId,
      options: props.transitGatewayVpcAttachmentOptions ? {
        applianceModeSupport: (props.transitGatewayVpcAttachmentOptions?.applianceModeSupport ?? false)
          ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
        dnsSupport: (props.transitGatewayVpcAttachmentOptions?.dnsSupport ?? false)
          ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
        ipv6Support: (props.transitGatewayVpcAttachmentOptions?.ipv6Support ?? false)
          ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
        securityGroupReferencingSupport: (props.transitGatewayVpcAttachmentOptions?.securityGroupReferencingSupport ?? false)
          ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
      } : undefined,
    });

    this.transitGatewayVpcAttachment = resource;
    this.transitGatewayVpcAttachmentId = resource.ref;

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

  addSubnets(subnets: ISubnet[]): void {
    this.transitGatewayVpcAttachment.addSubnetIds =
      this.transitGatewayVpcAttachment.addSubnetIds?.concat(subnets.map((subnet) => subnet.subnetId));
  }

  removeSubnets(subnets: ISubnet[]): void {
    this.transitGatewayVpcAttachment.removeSubnetIds =
      this.transitGatewayVpcAttachment.removeSubnetIds?.concat(subnets.map((subnet) => subnet.subnetId));
  }
}

import { IResource, Resource, Tag } from 'aws-cdk-lib/core';
import { ITransitGateway, TransitGatewayFeatureStatus } from './transit-gateway';
import { CfnTransitGatewayAttachment, IVpc, SubnetSelection } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface ITransitGatewayAttachment extends IResource {
  /**
   * The ID of the transit gateway attachment.
   * @attribute
   */
  readonly transitGatewayAttachmentId: string;
}

interface ITransitGatewayAttachmentOptions {
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
   */
  readonly subnets: SubnetSelection;
  // Note: SubnetSelection[] is same as Subnet[] but allows for optional filtering

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

  /**
   * The tags for the transit gateway attachment.
   *
   * @default - none
   */
  readonly tags?: Tag[];
}

abstract class TransitGatewayAttachmentBase extends Resource implements ITransitGatewayAttachment {
  public abstract readonly transitGatewayAttachmentId: string;
}

export class TransitGatewayAttachment extends TransitGatewayAttachmentBase {
  public readonly transitGatewayAttachmentId: string;

  constructor(scope: Construct, id: string, props: TransitGatewayAttachmentProps) {
    super(scope, id);

    const resource = new CfnTransitGatewayAttachment(this, 'TransitGatewayAttachment', {
      subnetIds: props.vpc.selectSubnets(props.subnets).subnetIds,
      transitGatewayId: props.transitGateway.transitGatewayId,
      vpcId: props.vpc.vpcId,
      options: {
        applianceModeSupport: (props.transitGatewayAttachmentOptions?.applianceModeSupport ?? false)
          ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
        dnsSupport: (props.transitGatewayAttachmentOptions?.dnsSupport ?? false)
          ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
        ipv6Support: (props.transitGatewayAttachmentOptions?.ipv6Support ?? false)
          ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
        securityGroupReferencingSupport: (props.transitGatewayAttachmentOptions?.securityGroupReferencingSupport ?? false)
          ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
      },
      tags: props.tags,
    });

    this.transitGatewayAttachmentId = resource.ref;
  }
}
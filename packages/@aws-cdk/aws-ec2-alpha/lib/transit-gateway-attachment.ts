import { IResource, Resource } from 'aws-cdk-lib/core';

export interface ITransitGatewayAttachment extends IResource {
  /**
   * The ID of the transit gateway attachment.
   * @attribute
   */
  readonly transitGatewayVpcAttachmentId: string;
}

export abstract class TransitGatewayAttachmentBase extends Resource implements ITransitGatewayAttachment {
  public abstract readonly transitGatewayVpcAttachmentId: string;
}

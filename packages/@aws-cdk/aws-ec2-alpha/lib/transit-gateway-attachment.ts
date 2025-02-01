import { IResource, Resource } from 'aws-cdk-lib/core';
/**
 * Represents a Transit Gateway Attachment.
 */
export interface ITransitGatewayAttachment extends IResource {
  /**
   * The ID of the transit gateway attachment.
   * @attribute
   */
  readonly transitGatewayAttachmentId: string;
}

/**
 * A Transit Gateway Attachment.
 * @internal
 */
export abstract class TransitGatewayAttachmentBase extends Resource implements ITransitGatewayAttachment {
  public abstract readonly transitGatewayAttachmentId: string;
}

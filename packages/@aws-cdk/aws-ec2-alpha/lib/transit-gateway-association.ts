import { IResource, Resource } from 'aws-cdk-lib/core';

/**
 * Represents a Transit Gateway Route Table Association.
 */
export interface ITransitGatewayAssociation extends IResource {
  /**
   * The ID of the transit gateway route table association.
   * @attribute
   */
  readonly transitGatewayAssociationId: string;
}

/**
 * A Transit Gateway Association.
 * @internal
 */
export abstract class TransitGatewayAssociationBase extends Resource implements ITransitGatewayAssociation {
  public abstract readonly transitGatewayAssociationId: string;
}

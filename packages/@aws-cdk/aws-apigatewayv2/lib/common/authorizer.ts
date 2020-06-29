import { IResource } from '@aws-cdk/core';

/**
 * Defines the contract for an Api Gateway V2 Authorizer.
 */
export interface IAuthorizer extends IResource {
  /**
   * The ID of this API Gateway Api Mapping.
   * @attribute
   */
  readonly authorizerId: string;
}

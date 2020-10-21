import { IResource } from '@aws-cdk/core';
import { HttpAuthorizerType } from '../http';

/**
 * Represents an Authorizer.
 */
export interface IAuthorizer extends IResource {
  /**
   * Id of the Authorizer
   * @attribute
   */
  readonly authorizerId: string

  /**
   * Type of authorizer
   * @attribute
   */
  readonly authorizerType: HttpAuthorizerType
}

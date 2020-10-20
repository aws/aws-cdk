import { IResource } from '@aws-cdk/core';

/**
 * Represents an Authorizer.
 */
export interface IHttpAuthorizer extends IResource {
  /**
   * Id of the Authorizer
   * @attribute
   */
  readonly authorizerId: string

  /**
   * A human friendly name for this Authorizer
   * @attribute
   */
  readonly authorizerName: string
}

/**
 * Reference to an http authorizer
 */
export interface HttpAuthorizerAttributes {
  /**
   * Id of the Authorizer
   */
  readonly authorizerId: string

  /**
   * A human friendly name for this Authorizer
   */
  readonly authorizerName: string
}

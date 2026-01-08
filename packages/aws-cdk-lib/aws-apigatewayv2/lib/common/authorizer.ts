import { IResource } from '../../../core';
import { IAuthorizerRef } from '../apigatewayv2.generated';

/**
 * Represents an Authorizer.
 */
export interface IAuthorizer extends IResource, IAuthorizerRef {
  /**
   * Id of the Authorizer
   * @attribute
   */
  readonly authorizerId: string;
}

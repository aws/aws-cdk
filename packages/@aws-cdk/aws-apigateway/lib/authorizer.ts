import { Construct } from '@aws-cdk/core';
import { AuthorizerBase, TokenAuthorizer, TokenAuthorizerProps } from './authorizers';

/**
 * Represents an API Gateway authorizer.
 */
export interface IAuthorizer {
  /**
   * The authorizer ID.
   * @attribute
   */
  readonly authorizerId: string;
}

/**
 * Base class for all custom authorizers
 */
export class Authorizer {

  /**
   * Return a new token authorizer with the specified properties.
   */
  public static token(scope: Construct, id: string, props: TokenAuthorizerProps): AuthorizerBase {
    return new TokenAuthorizer(scope, id, props);
  }
}
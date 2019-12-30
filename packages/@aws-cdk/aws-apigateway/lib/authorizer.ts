import { AuthorizationType } from './method';

/**
 * Represents an API Gateway authorizer.
 */
export interface IAuthorizer {
  /**
   * The authorizer ID.
   * @attribute
   */
  readonly authorizerId: string;

  /**
   * The required authorization type of this authorizer. If not specified,
   * `authorizationType` is required when the method is defined.
   */
  readonly authorizationType?: AuthorizationType;
}

import { Resource } from '@aws-cdk/core';
import { AuthorizationType } from './method';
import { RestApi } from './restapi';

/**
 * Base class for all custom authorizers
 */
export abstract class Authorizer extends Resource implements IAuthorizer {
  public readonly abstract authorizerId: string;
  public readonly authorizationType = AuthorizationType.CUSTOM;

  /**
   * Called when the authorizer is used from a specific REST API.
   */
  public abstract _attachToApi(restApi: RestApi): void;
}

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

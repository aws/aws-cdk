import { Resource } from '@aws-cdk/core';
import { AuthorizationType } from './method';
import { RestApi } from './restapi';

/**
 * Base class for all custom authorizers
 */
export abstract class Authorizer extends Resource implements IAuthorizer {
  public readonly abstract authorizerId: string;
  public readonly authorizationType?: AuthorizationType = AuthorizationType.CUSTOM;

  /**
   * Called when the authorizer is used from a specific REST API.
   * @internal
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
   * The authorization type of this authorizer.
   */
  readonly authorizationType?: AuthorizationType;
}

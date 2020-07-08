import { Resource, ResourceProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AuthorizationType } from './method';
import { IRestApi } from './restapi';

const AUTHORIZER_SYMBOL = Symbol.for('@aws-cdk/aws-apigateway.Authorizer');

/**
 * Base class for all custom authorizers
 */
export abstract class Authorizer extends Resource implements IAuthorizer {
  /**
   * Return whether the given object is an Authorizer.
   */
  public static isAuthorizer(x: any): x is Authorizer {
    return x !== null && typeof(x) === 'object' && AUTHORIZER_SYMBOL in x;
  }

  public readonly abstract authorizerId: string;
  public readonly authorizationType?: AuthorizationType = AuthorizationType.CUSTOM;

  public constructor(scope: Construct, id: string, props?: ResourceProps) {
    super(scope, id, props);

    Object.defineProperty(this, AUTHORIZER_SYMBOL, { value: true });
  }

  /**
   * Called when the authorizer is used from a specific REST API.
   * @internal
   */
  public abstract _attachToApi(restApi: IRestApi): void;
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

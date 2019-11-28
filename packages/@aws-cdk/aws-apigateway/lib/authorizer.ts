import { Construct, Lazy, Resource, ResourceProps } from '@aws-cdk/core';
import { AuthorizationType, Method } from './method';
import { IRestApi } from './restapi';

const CUSTOM_AUTH_SYMBOL = Symbol.for('@aws-cdk/apigateway.Authorizer');

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
export abstract class Authorizer extends Resource implements IAuthorizer {

  /**
   * Check if the given object is of type CustomAuthorizer
   */
  public static isAuthorizer(x: any): x is Authorizer {
    return x !== null && typeof(x) === 'object' && CUSTOM_AUTH_SYMBOL in x;
  }

  /**
   * The authorizer ID.
   * @attribute
   */
  public abstract readonly authorizerId: string;

  private _restApi?: IRestApi;

  constructor(scope: Construct, id: string, props?: ResourceProps) {
    super(scope, id, props);

    Object.defineProperty(this, CUSTOM_AUTH_SYMBOL, { value: true });
  }

  /**
   * Called when this authorizer needs to be bound to a specific {@link Method}.
   *
   * @returns configuration that may be needed by the caller to record this bind.
   * @throws when this authorizer is already bound to a Method from a different RestApi instance.
   *
   * @internal
   */
  public _bind(method: Method) {
    const restApi = method.restApi;
    if (this._restApi && this._restApi !== restApi) {
      throw new Error(`Cannot attach authorizer [${this.node.uniqueId}] to RestApi [${restApi.node.uniqueId}]. `
        + `Already attached to RestApi [${this._restApi.node.uniqueId}]`);
    }
    this._restApi = restApi;
    return this.authorizerConfig(method);
  }

  /**
   * Returns a lazy that will resolve to the restApiId at the time of synthesis.
   */
  protected get restApiId(): string {
    return Lazy.stringValue({
      produce: () => {
        if (this._restApi) {
          return this._restApi.restApiId;
        } else {
          throw new Error(`LambdaAuthorizer [${this.physicalName}] is not associated with a RestApi construct`);
        }
      }
    });
  }

  /**
   * Configuration returned back to the {@link Method} that it may use to record the bind.
   *
   * @param method the method to which this authorizer is being bound.
   * @returns configuration that may be needed by the caller to record this bind.
   */
  protected abstract authorizerConfig(method: Method): AuthorizerConfig;
}

/**
 * Configuration that the bindee may use as part of the binding operation.
 * See {@link Authorizer#authorizerConfig}.
 */
export interface AuthorizerConfig {
  /**
   * The id of the authorizer
   */
  readonly authorizerId: string;

  /**
   * The AuthorizationType of this authorizer
   */
  readonly authorizationType: AuthorizationType;
}
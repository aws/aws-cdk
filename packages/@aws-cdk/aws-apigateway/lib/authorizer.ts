import { Construct, Lazy, Resource, ResourceProps } from '@aws-cdk/core';
import { IRestApi } from '../lib/restapi';

const CUSTOM_AUTH_SYMBOL = Symbol.for('@aws-cdk/apigateway.CustomAuthorizer');

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
export abstract class CustomAuthorizer extends Resource implements IAuthorizer {

  /**
   * Check if the given object is of type CustomAuthorizer
   */
  public static isCustomAuthorizer(x: any): x is CustomAuthorizer {
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
   * Associate this authorizer to a specific {@link RestApi}.
   * Typically, this is taken care of by the module while defining {@link Method}s via the {@link ResourceBase#addMethod | addMethod()} API call.
   *
   * @throws when a different RestApi is already associated to this authorizer.
   *
   * @internal
   */
  public _bind(restApi: IRestApi) {
    if (this._restApi && this._restApi !== restApi) {
      throw new Error(`Cannot attach authorizer [${this.node.uniqueId}] to RestApi [${restApi.node.uniqueId}]. `
        + `Already attached to RestApi [${this._restApi.node.uniqueId}]`);
    }
    this._restApi = restApi;
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
}
import { Construct, IResource, Resource } from '@aws-cdk/core';

import { Api, IApi } from './api';
import { CfnRouteResponse } from './apigatewayv2.generated';
import { IModel, KnownModelKey } from './model';
import { IRoute } from './route';

/**
 * Defines a set of common response patterns known to the system
 */
export enum KnownRouteResponseKey {
  /**
   * Default response, when no other pattern matches
   */
  DEFAULT = "$default",

  /**
   * Empty response
   */
  EMPTY = "empty",

  /**
   * Error response
   */
  ERROR = "error"
}

/**
 * Defines the contract for an Api Gateway V2 Route Response.
 */
export interface IRouteResponse extends IResource {
}

/**
 * Defines the properties required for defining an Api Gateway V2 Route Response.
 *
 * This interface is used by the helper methods in `Route`
 */
export interface RouteResponseOptions {
  /**
   * The route response parameters.
   *
   * @default - no parameters
   */
  readonly responseParameters?: { [key: string]: string };

  /**
   * The model selection expression for the route response.
   *
   * Supported only for WebSocket APIs.
   *
   * @default - no models
   */
  readonly responseModels?: { [key: string]: IModel | string };

  /**
   * The model selection expression for the route response.
   *
   * Supported only for WebSocket APIs.
   *
   * @default - no selection expression
   */
  readonly modelSelectionExpression?: KnownModelKey | string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Route Response.
 */
export interface RouteResponseProps extends RouteResponseOptions {
  /**
   * Defines the route for this response.
   */
  readonly route: IRoute;

  /**
   * Defines the api for this response.
   */
  readonly api: IApi;

  /**
   * The route response key.
   */
  readonly key: KnownRouteResponseKey | string;
}

/**
 * A response for a route for an API in Amazon API Gateway v2.
 */
export class RouteResponse extends Resource implements IRouteResponse {
  protected resource: CfnRouteResponse;

  constructor(scope: Construct, id: string, props: RouteResponseProps) {
    super(scope, id, {
      physicalName: props.key || id,
    });

    let responseModels: { [key: string]: string } | undefined;
    if (props.responseModels !== undefined) {
      responseModels = Object.assign({}, ...Object.entries(props.responseModels).map((e) => {
        return ({ [e[0]]: (typeof(e[1]) === "string" ? e[1] : e[1].modelName) });
      }));
    }
    this.resource = new CfnRouteResponse(this, 'Resource', {
      ...props,
      apiId: props.api.apiId,
      routeId: props.route.routeId,
      routeResponseKey: props.key,
      responseModels
    });

    if (props.api instanceof Api) {
      if (props.api.latestDeployment) {
        props.api.latestDeployment.addToLogicalId({
          ...props,
          id,
          api: props.api.apiId,
          route: props.route.routeId,
          routeResponseKey: props.key,
          responseModels
        });
        props.api.latestDeployment.registerDependency(this.resource);
      }
    }
  }
}

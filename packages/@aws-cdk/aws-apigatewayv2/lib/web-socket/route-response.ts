import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnRouteResponse } from '../apigatewayv2.generated';
import { IRoute } from '../common/route';

import { IWebSocketApi } from './api';
import { IWebSocketModel } from './model';

/**
 * Defines a set of common response patterns known to the system
 */
export enum WebSocketKnownRouteResponseKey {
  /**
   * Default response, when no other pattern matches
   */
  DEFAULT = '$default',

  /**
   * Empty response
   */
  EMPTY = 'empty',

  /**
   * Error response
   */
  ERROR = 'error'
}

/**
 * Defines the contract for an Api Gateway V2 Route Response.
 */
export interface IWebSocketRouteResponse extends IResource {
  /**
   * The Route Response resource ID.
   * @attribute
   */
  readonly routeResponseId: string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Route Response.
 *
 * This interface is used by the helper methods in `Route`
 */
export interface WebSocketRouteResponseOptions {
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
  readonly responseModels?: { [key: string]: IWebSocketModel };

  /**
   * The model selection expression for the route response.
   *
   * Supported only for WebSocket APIs.
   *
   * @default - no selection expression
   */
  readonly modelSelectionExpression?: string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Route Response.
 */
export interface WebSocketRouteResponseProps extends WebSocketRouteResponseOptions {
  /**
   * Defines the route for this response.
   */
  readonly route: IRoute;

  /**
   * Defines the api for this response.
   */
  readonly api: IWebSocketApi;

  /**
   * The route response key.
   */
  readonly key: string;
}

/**
 * A response for a route for an API in Amazon API Gateway v2.
 *
 * @resource AWS::ApiGatewayV2::RouteResponse
 */
export class WebSocketRouteResponse extends Resource implements IWebSocketRouteResponse {
  /**
   * The Route Response resource ID.
   * @attribute
   */
  public readonly routeResponseId: string;

  protected resource: CfnRouteResponse;

  constructor(scope: Construct, id: string, props: WebSocketRouteResponseProps) {
    super(scope, id, {
      physicalName: props.key || id,
    });

    let responseModels: { [key: string]: string } | undefined;
    if (props.responseModels !== undefined) {
      responseModels = Object.assign({}, ...Object.entries(props.responseModels).map((e) => {
        return ({ [e[0]]: (typeof(e[1]) === 'string' ? e[1] : e[1].modelName) });
      }));
    }

    this.resource = new CfnRouteResponse(this, 'Resource', {
      apiId: props.api.webSocketApiId,
      routeId: props.route.routeId,
      routeResponseKey: props.key,
      responseModels,
      modelSelectionExpression: props.modelSelectionExpression,
      responseParameters: props.responseParameters,
    });

    this.routeResponseId = this.resource.ref;
  }
}
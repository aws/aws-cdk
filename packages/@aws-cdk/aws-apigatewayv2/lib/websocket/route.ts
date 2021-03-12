import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnRoute } from '../apigatewayv2.generated';
import { IRoute } from '../common';
import { IWebSocketApi } from './api';
import { IWebSocketRouteIntegration } from './integration';

/**
 * Represents a Route for an WebSocket API.
 */
export interface IWebSocketRoute extends IRoute {
  /**
   * The WebSocket API associated with this route.
   */
  readonly webSocketApi: IWebSocketApi;

  /**
   * The key to this route.
   * @attribute
   */
  readonly routeKey: string;
}

/**
 * Options used to add route to the API
 */
export interface WebSocketRouteOptions {
  /**
   * The integration to be configured on this route.
   */
  readonly integration: IWebSocketRouteIntegration;
}


/**
 * Properties to initialize a new Route
 */
export interface WebSocketRouteProps extends WebSocketRouteOptions {
  /**
   * the API the route is associated with
   */
  readonly webSocketApi: IWebSocketApi;

  /**
   * The key to this route.
   */
  readonly routeKey: string;
}

/**
 * Route class that creates the Route for API Gateway WebSocket API
 * @resource AWS::ApiGatewayV2::Route
 */
export class WebSocketRoute extends Resource implements IWebSocketRoute {
  public readonly routeId: string;
  public readonly webSocketApi: IWebSocketApi;
  public readonly routeKey: string;

  /**
   * Integration response ID
   */
  public readonly integrationResponseId?: string;

  constructor(scope: Construct, id: string, props: WebSocketRouteProps) {
    super(scope, id);

    this.webSocketApi = props.webSocketApi;
    this.routeKey = props.routeKey;

    const config = props.integration.bind({
      route: this,
      scope: this,
    });

    const integration = props.webSocketApi._addIntegration(this, config);

    const route = new CfnRoute(this, 'Resource', {
      apiId: props.webSocketApi.apiId,
      routeKey: props.routeKey,
      target: `integrations/${integration.integrationId}`,
    });
    this.routeId = route.ref;
  }
}

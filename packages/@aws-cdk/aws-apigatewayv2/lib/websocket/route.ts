import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IWebSocketApi } from './api';
import { IWebSocketRouteAuthorizer, WebSocketNoneAuthorizer } from './authorizer';
import { WebSocketRouteIntegration } from './integration';
import { CfnRoute, CfnRouteResponse } from '../apigatewayv2.generated';
import { IRoute } from '../common';

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
  readonly integration: WebSocketRouteIntegration;

  /**
   * The authorize to this route. You can only set authorizer to a $connect route.
   *
   * @default - No Authorizer
   */
  readonly authorizer?: IWebSocketRouteAuthorizer;

  /**
   * Should the route send a response to the client
   * @default false
   */
  readonly returnResponse?: boolean;

}

/**
 * Properties to initialize a new Route
 */
export interface WebSocketRouteProps extends WebSocketRouteOptions {
  /**
   * The API the route is associated with.
   */
  readonly webSocketApi: IWebSocketApi;

  /**
   * The key to this route.
   */
  readonly routeKey: string;

  /**
   * Whether the route requires an API Key to be provided
   * @default false
   */
  readonly apiKeyRequired?: boolean;
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

    if (props.routeKey != '$connect' && props.authorizer) {
      throw new Error('You can only set a WebSocket authorizer to a $connect route.');
    }

    this.webSocketApi = props.webSocketApi;
    this.routeKey = props.routeKey;

    const config = props.integration._bindToRoute({
      route: this,
      scope: this,
    });

    const authorizer = props.authorizer ?? new WebSocketNoneAuthorizer(); // must be explicitly NONE (not undefined) for stack updates to work correctly
    const authBindResult = authorizer.bind({
      route: this,
      scope: this.webSocketApi instanceof Construct ? this.webSocketApi : this, // scope under the API if it's not imported
    });

    const route = new CfnRoute(this, 'Resource', {
      apiId: props.webSocketApi.apiId,
      apiKeyRequired: props.apiKeyRequired,
      routeKey: props.routeKey,
      target: `integrations/${config.integrationId}`,
      authorizerId: authBindResult.authorizerId,
      authorizationType: authBindResult.authorizationType,
      routeResponseSelectionExpression: props.returnResponse ? '$default' : undefined,
    });
    this.routeId = route.ref;
    if (props.returnResponse) {
      new CfnRouteResponse(this, 'Response', {
        apiId: props.webSocketApi.apiId,
        routeId: route.ref,
        routeResponseKey: '$default',
      });
    }
  }
}

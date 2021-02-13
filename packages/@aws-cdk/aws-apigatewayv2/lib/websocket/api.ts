import * as crypto from 'crypto';
import { IResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnApi } from '../apigatewayv2.generated';
import { WebSocketRouteIntegrationConfig, WebSocketIntegration } from './integration';
import { WebSocketRoute, WebSocketRouteOptions } from './route';
import { WebSocketStage } from './stage';

/**
 * Represents a WebSocket API
 */
export interface IWebSocketApi extends IResource {
  /**
   * The identifier of this API Gateway WebSocket API.
   * @attribute
   */
  readonly webSocketApiId: string;

  /**
   * The default endpoint for an API
   * @attribute
   */
  readonly apiEndpoint: string;

  /**
   * Add a websocket integration
   * @internal
   */
  _addIntegration(config: WebSocketRouteIntegrationConfig): WebSocketIntegration
}

/**
 * Props for WebSocket API
 */
export interface WebSocketApiProps {
  /**
   * Name for the WebSocket API resoruce
   * @default - id of the WebSocketApi construct.
   */
  readonly apiName?: string;

  /**
   * The description of the API.
   * @default - none
   */
  readonly description?: string;

  /**
   * The route selection expression for the API
   * @default '$request.body.action'
   */
  readonly routeSelectionExpression?: string;

  /**
   * The name of the default stage with deployment
   * @default - none
   */
  readonly defaultStageName?: string;
}

/**
 * Create a new API Gateway WebSocket API endpoint.
 * @resource AWS::ApiGatewayV2::Api
 */
export class WebSocketApi extends Resource implements IWebSocketApi {
  public readonly webSocketApiId: string;
  public readonly apiEndpoint: string;

  /**
   * A human friendly name for this WebSocket API. Note that this is different from `webSocketApiId`.
   */
  public readonly webSocketApiName?: string;

  /**
   * default stage of the api resource
   */
  public readonly defaultStage: WebSocketStage | undefined;

  private integrations: Record<string, WebSocketIntegration> = {};

  constructor(scope: Construct, id: string, props?: WebSocketApiProps) {
    super(scope, id);

    this.webSocketApiName = props?.apiName ?? id;

    const resource = new CfnApi(this, 'Resource', {
      name: this.webSocketApiName,
      protocolType: 'WEBSOCKET',
      description: props?.description,
      routeSelectionExpression: props?.routeSelectionExpression ?? '$request.body.action',
    });
    this.webSocketApiId = resource.ref;
    this.apiEndpoint = resource.attrApiEndpoint;

    if (props?.defaultStageName) {
      this.defaultStage = new WebSocketStage(this, 'DefaultStage', {
        webSocketApi: this,
        stageName: props.defaultStageName,
        autoDeploy: true,
      });
    }
  }

  /**
   * @internal
   */
  public _addIntegration(config: WebSocketRouteIntegrationConfig): WebSocketIntegration {
    const stringifiedConfig = JSON.stringify(Stack.of(this).resolve(config));
    const configHash = crypto.createHash('md5').update(stringifiedConfig).digest('hex');

    if (configHash in this.integrations) {
      return this.integrations[configHash];
    }

    const integration = new WebSocketIntegration(this, `WebSocketIntegration-${configHash}`, {
      webSocketApi: this,
      integrationType: config.type,
      integrationUri: config.uri,
    });
    this.integrations[configHash] = integration;

    return integration;
  }

  /**
   * Add a new route
   */
  public addRoute(routeKey: string, options: WebSocketRouteOptions) {
    return new WebSocketRoute(this, `${routeKey}-Route`, {
      webSocketApi: this,
      routeKey,
      ...options,
    });
  }

  /**
   * Add a connect route
   */
  public addConnectRoute(options: WebSocketRouteOptions) {
    return this.addRoute('$connect', options);
  }

  /**
   * Add a disconnect route
   */
  public addDisconnectRoute(options: WebSocketRouteOptions) {
    return this.addRoute('$disconnect', options);
  }

  /**
   * Add a default route
   */
  public addDefaultRoute(options: WebSocketRouteOptions) {
    return this.addRoute('$default', options);
  }
}
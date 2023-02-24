import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IWebSocketApi } from './api';
import { IWebSocketRoute } from './route';
import { CfnIntegration } from '../apigatewayv2.generated';
import { IIntegration } from '../common';

/**
 * Represents an Integration for an WebSocket API.
 */
export interface IWebSocketIntegration extends IIntegration {
  /** The WebSocket API associated with this integration */
  readonly webSocketApi: IWebSocketApi;
}

/**
 * WebSocket Integration Types
 */
export enum WebSocketIntegrationType {
  /**
   * AWS Proxy Integration Type
   */
  AWS_PROXY = 'AWS_PROXY',
  /**
   * Mock Integration Type
   */
  MOCK = 'MOCK'
}

/**
 * The integration properties
 */
export interface WebSocketIntegrationProps {
  /**
   * The WebSocket API to which this integration should be bound.
   */
  readonly webSocketApi: IWebSocketApi;

  /**
   * Integration type
   */
  readonly integrationType: WebSocketIntegrationType;

  /**
   * Integration URI.
   */
  readonly integrationUri: string;
}

/**
 * The integration for an API route.
 * @resource AWS::ApiGatewayV2::Integration
 */
export class WebSocketIntegration extends Resource implements IWebSocketIntegration {
  public readonly integrationId: string;
  public readonly webSocketApi: IWebSocketApi;

  constructor(scope: Construct, id: string, props: WebSocketIntegrationProps) {
    super(scope, id);
    const integ = new CfnIntegration(this, 'Resource', {
      apiId: props.webSocketApi.apiId,
      integrationType: props.integrationType,
      integrationUri: props.integrationUri,
    });
    this.integrationId = integ.ref;
    this.webSocketApi = props.webSocketApi;
  }
}

/**
 * Options to the WebSocketRouteIntegration during its bind operation.
 */
export interface WebSocketRouteIntegrationBindOptions {
  /**
   * The route to which this is being bound.
   */
  readonly route: IWebSocketRoute;

  /**
   * The current scope in which the bind is occurring.
   * If the `WebSocketRouteIntegration` being bound creates additional constructs,
   * this will be used as their parent scope.
   */
  readonly scope: Construct;
}

/**
 * The interface that various route integration classes will inherit.
 */
export abstract class WebSocketRouteIntegration {
  private integration?: WebSocketIntegration;

  /**
   * Initialize an integration for a route on websocket api.
   * @param id id of the underlying `WebSocketIntegration` construct.
   */
  constructor(private readonly id: string) {}

  /**
   * Internal method called when binding this integration to the route.
   * @internal
   */
  public _bindToRoute(options: WebSocketRouteIntegrationBindOptions): { readonly integrationId: string } {
    if (this.integration && this.integration.webSocketApi.node.addr !== options.route.webSocketApi.node.addr) {
      throw new Error('A single integration cannot be associated with multiple APIs.');
    }

    if (!this.integration) {
      const config = this.bind(options);

      this.integration = new WebSocketIntegration(options.scope, this.id, {
        webSocketApi: options.route.webSocketApi,
        integrationType: config.type,
        integrationUri: config.uri,
      });
    }

    return { integrationId: this.integration.integrationId };
  }

  /**
   * Bind this integration to the route.
   */
  public abstract bind(options: WebSocketRouteIntegrationBindOptions): WebSocketRouteIntegrationConfig;
}

/**
 * Config returned back as a result of the bind.
 */
export interface WebSocketRouteIntegrationConfig {
  /**
   * Integration type.
   */
  readonly type: WebSocketIntegrationType;

  /**
   * Integration URI
   */
  readonly uri: string;
}

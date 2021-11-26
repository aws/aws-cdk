import * as crypto from 'crypto';
import { Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnIntegration } from '../apigatewayv2.generated';
import { IIntegration } from '../common';
import { IWebSocketApi } from './api';
import { IWebSocketRoute } from './route';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from '@aws-cdk/core';

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
  AWS_PROXY = 'AWS_PROXY'
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
  readonly scope: CoreConstruct;
}

/**
 * The interface that various route integration classes will inherit.
 */
export abstract class WebSocketRouteIntegration {
  private integration?: WebSocketIntegration;

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

      this.integration = new WebSocketIntegration(options.scope, `WebSocketIntegration-${hash(config)}`, {
        webSocketApi: options.route.webSocketApi,
        integrationType: config.type,
        integrationUri: config.uri,
      });

      function hash(x: any) {
        const stringifiedConfig = JSON.stringify(Stack.of(options.scope).resolve(x));
        const configHash = crypto.createHash('md5').update(stringifiedConfig).digest('hex');
        return configHash;
      }
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

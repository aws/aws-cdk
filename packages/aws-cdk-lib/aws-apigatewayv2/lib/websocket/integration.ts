import { Construct } from 'constructs';
import { IWebSocketApi } from './api';
import { IWebSocketRoute } from './route';
import { CfnIntegration } from '.././index';
import { IRole } from '../../../aws-iam';
import { Resource } from '../../../core';
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
  MOCK = 'MOCK',
  /**
   * AWS Integration Type
   */
  AWS = 'AWS',
}

/**
 * Integration Passthrough Behavior
 */
export enum PassthroughBehavior {
  /**
   * Passes the request body for unmapped content types through to the
   * integration back end without transformation.
   */
  WHEN_NO_MATCH = 'WHEN_NO_MATCH',

  /**
   * Rejects unmapped content types with an HTTP 415 'Unsupported Media Type'
   * response
   */
  NEVER = 'NEVER',

  /**
   * Allows pass-through when the integration has NO content types mapped to
   * templates. However if there is at least one content type defined,
   * unmapped content types will be rejected with the same 415 response.
   */
  WHEN_NO_TEMPLATES = 'WHEN_NO_TEMPLATES',
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

  /**
   * Specifies the integration's HTTP method type.
   *
   * @default - No HTTP method required.
   */
  readonly integrationMethod?: string;

  /**
   * Specifies the IAM role required for the integration.
   *
   * @default - No IAM role required.
   */
  readonly credentialsRole?: IRole;

  /**
   * The request parameters that API Gateway sends with the backend request.
   * Specify request parameters as key-value pairs (string-to-string
   * mappings), with a destination as the key and a source as the value.
   *
   * @default - No request parameters required.
   */
  readonly requestParameters?: { [dest: string]: string };

  /**
   * A map of Apache Velocity templates that are applied on the request
   * payload.
   *
   * ```
   *   { "application/json": "{ \"statusCode\": 200 }" }
   * ```
   *
   * @default - No request templates required.
   */
  readonly requestTemplates?: { [contentType: string]: string };

  /**
   * The template selection expression for the integration.
   *
   * @default - No template selection expression required.
   */
  readonly templateSelectionExpression?: string;

  /**
   * Specifies the pass-through behavior for incoming requests based on the
   * Content-Type header in the request, and the available mapping templates
   * specified as the requestTemplates property on the Integration resource.
   * There are three valid values: WHEN_NO_MATCH, WHEN_NO_TEMPLATES, and
   * NEVER.
   *
   * @default - No passthrough behavior required.
   */
  readonly passthroughBehavior?: PassthroughBehavior;
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
      integrationMethod: props.integrationMethod,
      credentialsArn: props.credentialsRole?.roleArn,
      requestParameters: props.requestParameters,
      requestTemplates: props.requestTemplates,
      passthroughBehavior: props.passthroughBehavior,
      templateSelectionExpression: props.templateSelectionExpression,
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
        integrationMethod: config.method,
        credentialsRole: config.credentialsRole,
        requestTemplates: config.requestTemplates,
        requestParameters: config.requestParameters,
        passthroughBehavior: config.passthroughBehavior,
        templateSelectionExpression: config.templateSelectionExpression,
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

  /**
   * Integration method
   *
   * @default - No integration method.
   */
  readonly method?: string;

  /**
   * Credentials role
   *
   * @default - No role provided.
   */
  readonly credentialsRole?: IRole;

  /**
   * Request template
   *
   * @default - No request template provided.
   */
  readonly requestTemplates?: { [contentType: string]: string };

  /**
   * Request parameters
   *
   * @default - No request parameters provided.
   */
  readonly requestParameters?: { [dest: string]: string };

  /**
   * Template selection expression
   *
   * @default - No template selection expression.
   */
  readonly templateSelectionExpression?: string;

  /**
   * Integration passthrough behaviors.
   *
   * @default - No pass through bahavior.
   */
  readonly passthroughBehavior?: PassthroughBehavior;
}

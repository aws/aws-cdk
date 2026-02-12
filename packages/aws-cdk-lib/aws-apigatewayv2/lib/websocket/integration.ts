import type { Construct } from 'constructs';
import type { IWebSocketApi, IWebSocketApiRef } from './api';
import type { IWebSocketRoute } from './route';
import type { IntegrationReference } from '.././index';
import { CfnIntegration } from '.././index';
import type { IRole } from '../../../aws-iam';
import type { Duration } from '../../../core';
import { Resource } from '../../../core';
import { ValidationError } from '../../../core/lib/errors';
import { addConstructMetadata } from '../../../core/lib/metadata-resource';
import { propertyInjectable } from '../../../core/lib/prop-injectable';
import type { IIntegration } from '../common';

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
 * Integration content handling
 */
export enum ContentHandling {
  /**
   * Converts a request payload from a base64-encoded string to a binary blob.
   */
  CONVERT_TO_BINARY = 'CONVERT_TO_BINARY',

  /**
   * Converts a request payload from a binary blob to a base64-encoded string.
   */
  CONVERT_TO_TEXT = 'CONVERT_TO_TEXT',
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
  readonly webSocketApi: IWebSocketApiRef;

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
   * Specifies how to handle response payload content type conversions.
   *
   * @default - The response payload will be passed through from the integration response to
   * the route response or method response without modification.
   */
  readonly contentHandling?: ContentHandling;

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
   * The maximum amount of time an integration will run before it returns without a response.
   * Must be between 50 milliseconds and 29 seconds.
   *
   * @default Duration.seconds(29)
   */
  readonly timeout?: Duration;

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
@propertyInjectable
export class WebSocketIntegration extends Resource implements IWebSocketIntegration {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-apigatewayv2.WebSocketIntegration';
  public readonly integrationId: string;
  private readonly _webSocketApi: IWebSocketApiRef;

  constructor(scope: Construct, id: string, props: WebSocketIntegrationProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.timeout && !props.timeout.isUnresolved() && (props.timeout.toMilliseconds() < 50 || props.timeout.toMilliseconds() > 29000)) {
      throw new ValidationError('Integration timeout must be between 50 milliseconds and 29 seconds.', scope);
    }

    const integ = new CfnIntegration(this, 'Resource', {
      apiId: props.webSocketApi.apiRef.apiId,
      integrationType: props.integrationType,
      integrationUri: props.integrationUri,
      integrationMethod: props.integrationMethod,
      contentHandlingStrategy: props.contentHandling,
      credentialsArn: props.credentialsRole?.roleArn,
      requestParameters: props.requestParameters,
      requestTemplates: props.requestTemplates,
      passthroughBehavior: props.passthroughBehavior,
      templateSelectionExpression: props.templateSelectionExpression,
      timeoutInMillis: props.timeout?.toMilliseconds(),
    });
    this.integrationId = integ.ref;
    this._webSocketApi = props.webSocketApi;
  }

  public get webSocketApi(): IWebSocketApi {
    const ret = this._webSocketApi as IWebSocketApi;
    if (!!ret.apiEndpoint && !!ret.apiRef) {
      return ret;
    }
    throw new ValidationError(`Input API ${ret.constructor.name} does not implement IWebSocketApi`, this);
  }

  public get integrationRef(): IntegrationReference {
    return {
      apiId: this.webSocketApi.apiRef.apiId,
      integrationId: this.integrationId,
    };
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
      throw new ValidationError('A single integration cannot be associated with multiple APIs.', options.scope);
    }

    if (!this.integration) {
      const config = this.bind(options);

      this.integration = new WebSocketIntegration(options.scope, this.id, {
        webSocketApi: options.route.webSocketApi,
        integrationType: config.type,
        integrationUri: config.uri,
        integrationMethod: config.method,
        contentHandling: config.contentHandling,
        credentialsRole: config.credentialsRole,
        requestTemplates: config.requestTemplates,
        requestParameters: config.requestParameters,
        timeout: config.timeout,
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
   * Specifies how to handle response payload content type conversions.
   *
   * @default - The response payload will be passed through from the integration response to
   * the route response or method response without modification.
   */
  readonly contentHandling?: ContentHandling;

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
   * The maximum amount of time an integration will run before it returns without a response.
   * Must be between 50 milliseconds and 29 seconds.
   *
   * @default Duration.seconds(29)
   */
  readonly timeout?: Duration;

  /**
   * Integration passthrough behaviors.
   *
   * @default - No pass through bahavior.
   */
  readonly passthroughBehavior?: PassthroughBehavior;
}

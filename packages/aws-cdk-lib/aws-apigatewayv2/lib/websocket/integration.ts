import { Construct } from 'constructs';
import { IWebSocketApi } from './api';
import { InternalWebSocketIntegrationResponseProps, WebSocketIntegrationResponse } from './integration-response';
import { IWebSocketRoute } from './route';
import { CfnIntegration } from '.././index';
import { IRole } from '../../../aws-iam';
import { Duration, Names, Resource } from '../../../core';
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
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-mapping-template-reference.html
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
      contentHandlingStrategy: props.contentHandling,
      credentialsArn: props.credentialsRole?.roleArn,
      requestParameters: props.requestParameters,
      requestTemplates: props.requestTemplates,
      passthroughBehavior: props.passthroughBehavior,
      templateSelectionExpression: props.templateSelectionExpression,
      timeoutInMillis: props.timeout?.toMilliseconds(),
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

  /**
   * Should the route send a response to the client
   * @default false
   */
  readonly returnResponse?: boolean;
}

/**
 * The abstract class that all route integration classes will implement.
 */
export abstract class WebSocketRouteIntegration {
  protected integration?: WebSocketIntegration;
  protected config?: WebSocketRouteIntegrationConfig;

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
      this.config = this.bind(options);

      this.integration = new WebSocketIntegration(options.scope, this.id, {
        webSocketApi: options.route.webSocketApi,
        integrationType: this.config.type,
        integrationUri: this.config.uri,
        integrationMethod: this.config.method,
        contentHandling: this.config.contentHandling,
        credentialsRole: this.config.credentialsRole,
        requestTemplates: this.config.requestTemplates,
        requestParameters: this.config.requestParameters,
        timeout: this.config.timeout,
        passthroughBehavior: this.config.passthroughBehavior,
        templateSelectionExpression: this.config.templateSelectionExpression,
      });
    }

    return { integrationId: this.integration.integrationId };
  }

  /**
   * Bind this integration to the route.
   */
  public abstract bind(options: WebSocketRouteIntegrationBindOptions): WebSocketRouteIntegrationConfig;

  /**
   * The WebSocket API identifier
   * @throws an error if this integration has not been bound to a route first
   */
  public get webSocketApiId(): string {
    if (!this.integration) {
      throw new Error('This integration has not been associated to an API route');
    }
    return this.integration.webSocketApi.apiId;
  }

  /**
   * The WebSocket Integration identifier
   * @throws an error if this integration has not been bound to a route first
   */
  public get integrationId(): string {
    if (!this.integration) {
      throw new Error('This integration has not been associated to an API route');
    }

    return this.integration.integrationId;
  }
}

/**
 * The abstract class that two-way communication route integration classes
 * with customized responses will implement.
 */
export abstract class CustomResponseWebSocketRoute extends WebSocketRouteIntegration {
  private responses: InternalWebSocketIntegrationResponseProps[] = [];

  /**
   * Initialize an integration for a route on websocket api.
   * @param id id of the underlying `WebSocketIntegration` construct.
   */
  constructor(id: string) {
    super(id);
  }

  /**
   * Internal method called when binding this integration to the route.
   * @internal
   */
  public _bindToRoute(options: WebSocketRouteIntegrationBindOptions): { readonly integrationId: string } {
    const requiresBinding = !this.integration;
    const result = super._bindToRoute(options);

    if (requiresBinding) {
      // This should never happen, super._bindToRoute must have set up the integration
      if (!this.config || !this.integration) {
        throw new Error('Missing integration setup during WebSocketRouteIntegration._bindToRoute');
      }

      this.responses.push(...this.config.responses ?? []);
      if (this.responses.length && !options.returnResponse) {
        // FIXME change to a warning?
        throw new Error('Setting up integration responses without setting up returnResponse to true will have no effect, and is likely a mistake.');
      }

      this.responses.reduce<{ [key: string]: string }>((acc, props) => {
        if (props.responseKey.key in acc) {
          throw new Error(`Duplicate integration response key: "${props.responseKey.key}"`);
        }

        const key = props.responseKey.key;
        acc[key] = props.responseKey.key;
        return acc;
      }, {});

      for (const responseProps of this.responses) {
        new WebSocketIntegrationResponse(
          options.scope,
          // FIXME any better way to generate a unique id?
          Names.nodeUniqueId(this.integration.node) + slugify(responseProps.responseKey.key) + 'IntegrationResponse',
          { ...responseProps, integration: this },
        );
      }
    }

    return result;
  }

  /**
   * Add a response to this integration
   *
   * @param response The response to add
   */
  addResponse(response: InternalWebSocketIntegrationResponseProps) {
    this.responses.push(response);
  }
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
   * Integration responses configuration
   *
   * @default - No response configuration provided.
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-integration-responses.html
   */
  readonly responses?: InternalWebSocketIntegrationResponseProps[];

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

function slugify(x: string): string {
  return x.replace(/[^a-zA-Z0-9]/g, '');
}
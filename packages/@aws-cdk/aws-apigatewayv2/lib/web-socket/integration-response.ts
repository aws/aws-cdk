import { Construct, IResource, Resource } from '@aws-cdk/core';

import { CfnIntegrationResponse } from '../apigatewayv2.generated';
import { IIntegration } from '../common/integration';

import { IWebSocketApi } from './api';
import { WebSocketContentHandlingStrategy } from './integration';

/**
 * Defines a set of common template patterns known to the system
 */
export class WebSocketIntegrationResponseTemplateSelectionExpressionKey {
  /**
   * Default template, when no other pattern matches
   */
  public static readonly DEFAULT = new WebSocketIntegrationResponseTemplateSelectionExpressionKey('$default');

  /**
   * Empty response
   */
  public static readonly EMPTY = new WebSocketIntegrationResponseTemplateSelectionExpressionKey('empty');

  /**
   * Error response
   */
  public static readonly ERROR = new WebSocketIntegrationResponseTemplateSelectionExpressionKey('error');

  /**
   * Creates a custom selection expression
   * @param value the name of the response template key
   */
  public static custom(value: string): WebSocketIntegrationResponseTemplateSelectionExpressionKey {
    return new WebSocketIntegrationResponseTemplateSelectionExpressionKey(value);
  }

  /**
   * Contains the template key
   */
  private readonly value: string;
  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Returns the current value of the template key
   */
  public toString(): string {
    return this.value;
  }
}

/**
 * Defines a set of common model patterns known to the system
 */
export class WebSocketIntegrationResponseKey {
  /**
   * Default model, when no other pattern matches
   */
  public static readonly DEFAULT = new WebSocketIntegrationResponseKey('$default');

  /**
   * Creates a custom selection expression
   * @param value the name of the model key
   */
  public static custom(value: string): WebSocketIntegrationResponseKey {
    return new WebSocketIntegrationResponseKey(value);
  }

  /**
   * Contains the template key
   */
  private readonly value: string;
  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Returns the current value of the template key
   */
  public toString(): string {
    return this.value;
  }
}

/**
 * Defines the contract for an Api Gateway V2 Deployment.
 */
export interface IWebSocketIntegrationResponse extends IResource {
}

/**
 * Defines the properties required for defining an Api Gateway V2 Integration.
 *
 * This interface is used by the helper methods in `Integration`
 */
export interface WebSocketIntegrationResponseOptions {
  /**
   * Specifies how to handle response payload content type conversions.
   *
   * Supported only for WebSocket APIs.
   *
   * @default - Pass through unmodified
   */
  readonly contentHandlingStrategy?: WebSocketContentHandlingStrategy;

  /**
   * A key-value map specifying response parameters that are passed to the method response from the backend.
   *
   * The key is a method response header parameter name and the mapped value is an integration response header value,
   * a static value enclosed within a pair of single quotes, or a JSON expression from the integration response body.
   *
   * The mapping key must match the pattern of `method.response.header.{name}`, where name is a valid and unique header name.
   *
   * The mapped non-static value must match the pattern of `integration.response.header.{name}` or `integration.response.body.{JSON-expression}`,
   * where `{name}` is a valid and unique response header name and `{JSON-expression}` is a valid JSON expression without the `$` prefix
   *
   * @default - no parameter used
   */
  readonly responseParameters?: { [key: string]: string };

  /**
   * The collection of response templates for the integration response as a string-to-string map of key-value pairs.
   *
   * Response templates are represented as a key/value map, with a content-type as the key and a template as the value.
   *
   * @default - no templates used
   */
  readonly responseTemplates?: { [key: string]: string };

  /**
   * The template selection expression for the integration response.
   *
   * Supported only for WebSocket APIs.
   *
   * @default - no template selected
   */
  readonly templateSelectionExpression?: WebSocketIntegrationResponseTemplateSelectionExpressionKey;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Integration.
 */
export interface WebSocketIntegrationResponseProps extends WebSocketIntegrationResponseOptions {
  /**
   * Defines the api for this response.
   */
  readonly api: IWebSocketApi;

  /**
   * Defines the parent integration for this response.
   */
  readonly integration: IIntegration;

  /**
   * The integration response key.
   */
  readonly key: WebSocketIntegrationResponseKey;
}

/**
 * A response for an integration for an API in Amazon API Gateway v2.
 *
 * @resource AWS::ApiGatewayV2::IntegrationResponse
 */
export class WebSocketIntegrationResponse extends Resource implements IWebSocketIntegrationResponse {
  protected resource: CfnIntegrationResponse;

  constructor(scope: Construct, id: string, props: WebSocketIntegrationResponseProps) {
    super(scope, id);
    this.resource = new CfnIntegrationResponse(this, 'Resource', {
      apiId: props.api.webSocketApiId,
      integrationId: props.integration.integrationId,
      integrationResponseKey: props.key.toString(),
      contentHandlingStrategy: props.contentHandlingStrategy,
      responseParameters: props.responseParameters,
      responseTemplates: props.responseTemplates,
      templateSelectionExpression: props.templateSelectionExpression?.toString(),
    });
  }
}
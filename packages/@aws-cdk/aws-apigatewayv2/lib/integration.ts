import { Construct, Duration, IResource, Resource } from '@aws-cdk/core';

import { IApi } from './api';
import { CfnIntegration } from './apigatewayv2.generated';
import { IntegrationResponse, IntegrationResponseOptions, KnownIntegrationResponseKey } from './integration-response';

/**
 * The type of the network connection to the integration endpoint.
 */
export enum ConnectionType {
  /**
   * Internet connectivity through the public routable internet
   */
  INTERNET = 'INTERNET',

  /**
   * Private connections between API Gateway and resources in a VPC
   */
  VPC_LINK = 'VPC_LINK'
}

/**
 * The integration type of an integration.
 */
export enum IntegrationType {
  /**
   * Integration of the route or method request with an AWS service action, including the Lambda function-invoking action.
   * With the Lambda function-invoking action, this is referred to as the Lambda custom integration.
   * With any other AWS service action, this is known as AWS integration.
   */
  AWS = 'AWS',

  /**
   * Integration of the route or method request with the Lambda function-invoking action with the client request passed through as-is.
   * This integration is also referred to as Lambda proxy integration.
   */
  AWS_PROXY = 'AWS_PROXY',

  /**
   * Integration of the route or method request with an HTTP endpoint.
   * This integration is also referred to as HTTP custom integration.
   */
  HTTP = 'HTTP',

  /**
   * Integration of the route or method request with an HTTP endpoint, with the client request passed through as-is.
   * This is also referred to as HTTP proxy integration.
   */
  HTTP_PROXY = 'HTTP_PROXY',

  /**
   * Integration of the route or method request with API Gateway as a "loopback" endpoint without invoking any backend.
   */
  MOCK = 'MOCK'
}

/**
 * Specifies how to handle response payload content type conversions. Supported values are CONVERT_TO_BINARY and CONVERT_TO_TEXT.
 *
 * If this property is not defined, the response payload will be passed through from the integration response
 * to the route response or method response without modification.
 */
export enum ContentHandlingStrategy {
  /**
   * Converts a response payload from a Base64-encoded string to the corresponding binary blob
   */
  CONVERT_TO_BINARY = 'CONVERT_TO_BINARY',

  /**
   * Converts a response payload from a binary blob to a Base64-encoded string
   */
  CONVERT_TO_TEXT = 'CONVERT_TO_TEXT'
}

/**
 * Specifies the pass-through behavior for incoming requests based on the
 * Content-Type header in the request, and the available mapping templates
 * specified as the requestTemplates property on the Integration resource.
 */
export enum PassthroughBehavior {
  /**
   * Passes the request body for unmapped content types through to the
   * integration backend without transformation
   */
  WHEN_NO_MATCH = 'WHEN_NO_MATCH',
  /**
   * Allows pass-through when the integration has no content types mapped
   * to templates. However, if there is at least one content type defined,
   * unmapped content types will be rejected with an HTTP 415 Unsupported Media Type response
   */
  WHEN_NO_TEMPLATES = 'WHEN_NO_TEMPLATES',
  /**
   * Rejects unmapped content types with an HTTP 415 Unsupported Media Type response
   */
  NEVER = 'NEVER'
}

/**
 * Defines a set of common template patterns known to the system
 */
export enum KnownTemplateKey {
  /**
   * Default template, when no other pattern matches
   */
  DEFAULT = '$default'
}

/**
 * Specifies the integration's HTTP method type (only GET is supported for WebSocket)
 */
export enum HttpApiIntegrationMethod {
  /**
   * All HTTP Methods are supported
   */
  ANY = 'ANY',

  /**
   * GET HTTP Method
   */
  GET = 'GET',

  /**
   * POST HTTP Method
   */
  POST = 'POST',

  /**
   * PUT HTTP Method
   */
  PUT = 'PUT',

  /**
   * DELETE HTTP Method
   */
  DELETE = 'DELETE',

  /**
   * OPTIONS HTTP Method
   */
  OPTIONS = 'OPTIONS',

  /**
   * HEAD HTTP Method
   */
  HEAD = 'HEAD',

  /**
   * PATCH HTTP Method
   */
  PATCH = 'PATCH'
}

/**
 * The TLS configuration for a private integration. If you specify a TLS configuration,
 * private integration traffic uses the HTTPS protocol.
 */
export interface TlsConfig {
  /**
   * If you specify a server name, API Gateway uses it to verify the hostname on
   * the integration's certificate.
   *
   * The server name is also included in the TLS handshake to support
   * Server Name Indication (SNI) or virtual hosting.
   */
  readonly serverNameToVerify: string;
}

/**
 * Defines the contract for an Api Gateway V2 Deployment.
 */
export interface IIntegration extends IResource {
  /**
   * The ID of this API Gateway Integration.
   * @attribute
   */
  readonly integrationId: string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Integration.
 *
 * This interface is used by the helper methods in `Api` and the sub-classes
 */
export interface BaseIntegrationOptions {
  /**
   * The type of the network connection to the integration endpoint.
   *
   * @default 'INTERNET'
   */
  readonly connectionType?: ConnectionType;

  /**
   * Specifies the credentials required for the integration, if any.
   *
   * For AWS integrations, three options are available.
   * - To specify an IAM Role for API Gateway to assume, use the role's Amazon Resource Name (ARN).
   * - To require that the caller's identity be passed through from the request, specify the string `arn:aws:iam::*:user/*`.
   * - To use resource-based permissions on supported AWS services, leave `undefined`.
   *
   * @default - resource-based permissions on supported AWS services
   */
  readonly credentialsArn?: string;

  /**
   * The description of the integration.
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * Custom timeout between 50 and 29,000 milliseconds for WebSocket APIs and between 50 and 30,000 milliseconds for HTTP APIs.
   *
   * @default - timeout is 29 seconds for WebSocket APIs and 30 seconds for HTTP APIs.
   */
  readonly timeout?: Duration;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Integration.
 *
 * This interface is used by the helper methods in `Api` and the sub-classes
 */
export interface IntegrationOptions extends BaseIntegrationOptions {
  /**
   * Specifies how to handle response payload content type conversions.
   *
   * @default - Pass through unmodified
   */
  readonly contentHandlingStrategy?: string;

  /**
   * Specifies the pass-through behavior for incoming requests based on the `Content-Type` header in the request,
   * and the available mapping templates specified as the `requestTemplates` property on the `Integration` resource.
   *
   * @default - the response payload will be passed through from the integration response to the route response or method response unmodified
   */
  readonly passthroughBehavior?: string;

  /**
   * A key-value map specifying request parameters that are passed from the method request to the backend.
   * The key is an integration request parameter name and the associated value is a method request parameter value or static value
   * that must be enclosed within single quotes and pre-encoded as required by the backend.
   *
   * The method request parameter value must match the pattern of `method.request.{location}.{name}`, where `{location}` is
   * `querystring`, `path`, or `header`; and `{name}` must be a valid and unique method request parameter name.
   *
   * @default - no parameter used
   */
  readonly requestParameters?: { [key: string]: string };

  /**
   * Represents a map of Velocity templates that are applied on the request payload based on the value of
   * the `Content-Type` header sent by the client. The content type value is the key in this map, and the
   * template is the value.
   *
   * @default - no templates used
   */
  readonly requestTemplates?: { [key: string]: string };

  /**
   * The template selection expression for the integration.
   *
   * @default - no template selected
   */
  readonly templateSelectionExpression?: string;

  /**
   * The ID of the VPC link for a private integration.
   *
   * @default - don't use a VPC link
   */
  // TODO: readonly connectionId?: string;

  /**
   * Specifies the format of the payload sent to an integration..
   *
   * @default '1.0'
   */
  readonly payloadFormatVersion?: string;

  /**
   * The TlsConfig property specifies the TLS configuration for a private integration.
   * If you specify a TLS configuration, private integration traffic uses the HTTPS protocol.
   *
   * @default - no private TLS configuration
   */
  readonly tlsConfig?: TlsConfig;

  /**
   * Specifies the integration's HTTP method type.
   *
   * @default - 'ANY'
   */
  readonly integrationMethod?: string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Integration.
 *
 * This interface is used by the helper methods in `Api` and the sub-classes
 */
export interface WebSocketApiIntegrationOptions extends BaseIntegrationOptions {
  /**
   * Specifies how to handle response payload content type conversions.
   *
   * @default - Pass through unmodified
   */
  readonly contentHandlingStrategy?: ContentHandlingStrategy | string;

  /**
   * Specifies the pass-through behavior for incoming requests based on the `Content-Type` header in the request,
   * and the available mapping templates specified as the `requestTemplates` property on the `Integration` resource.
   *
   * @default - the response payload will be passed through from the integration response to the route response or method response unmodified
   */
  readonly passthroughBehavior?: PassthroughBehavior | string;

  /**
   * A key-value map specifying request parameters that are passed from the method request to the backend.
   * The key is an integration request parameter name and the associated value is a method request parameter value or static value
   * that must be enclosed within single quotes and pre-encoded as required by the backend.
   *
   * The method request parameter value must match the pattern of `method.request.{location}.{name}`, where `{location}` is
   * `querystring`, `path`, or `header`; and `{name}` must be a valid and unique method request parameter name.
   *
   * @default - no parameter used
   */
  readonly requestParameters?: { [key: string]: string };

  /**
   * Represents a map of Velocity templates that are applied on the request payload based on the value of
   * the `Content-Type` header sent by the client. The content type value is the key in this map, and the
   * template is the value.
   *
   * @default - no templates used
   */
  readonly requestTemplates?: { [key: string]: string };

  /**
   * The template selection expression for the integration.
   *
   * @default - no template selected
   */
  readonly templateSelectionExpression?: KnownTemplateKey | string;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Integration.
 *
 * This interface is used by the helper methods in `Api` and the sub-classes
 */
export interface HttpApiIntegrationOptions extends BaseIntegrationOptions {
  /**
   * The ID of the VPC link for a private integration.
   *
   * @default - don't use a VPC link
   */
  // TODO: readonly connectionId?: string;

  /**
   * Specifies the format of the payload sent to an integration..
   *
   * @default '1.0'
   */
  readonly payloadFormatVersion?: string;

  /**
   * The TlsConfig property specifies the TLS configuration for a private integration.
   * If you specify a TLS configuration, private integration traffic uses the HTTPS protocol.
   *
   * @default - no private TLS configuration
   */
  readonly tlsConfig?: TlsConfig;
}

/**
 * Defines the properties required for defining an Api Gateway V2 Integration.
 */
export interface IntegrationProps extends IntegrationOptions {
  /**
   * Defines the api for this integration.
   */
  readonly api: IApi;

  /**
   * The integration type of an integration.
   */
  readonly type: IntegrationType | string;

  /**
   * For a Lambda integration, specify the URI of a Lambda function.
   * For an HTTP integration, specify a fully-qualified URL.
   * For an HTTP API private integration, specify the ARN of an ALB listener, NLB listener, or AWS Cloud Map service.
   *
   * If you specify the ARN of an AWS Cloud Map service, API Gateway uses `DiscoverInstances` to identify resources.
   *
   * You can use query parameters to target specific resources.
   *
   * For private integrations, all resources must be owned by the same AWS account.
   *
   * This is directly handled by the specialized classes in `integrations/`
   */
  readonly uri: string;
}

/**
 * An integration for an API in Amazon API Gateway v2.
 *
 * Use `addResponse` and `addRoute` to configure integration.
 */
export class Integration extends Resource implements IIntegration {
  /**
   * Creates a new imported API Integration
   *
   * @param scope scope of this imported resource
   * @param id identifier of the resource
   * @param integrationId Identifier of the API
   */
  public static fromIntegrationId(scope: Construct, id: string, integrationId: string): IIntegration {
    class Import extends Resource implements IIntegration {
      public readonly integrationId = integrationId;
    }

    return new Import(scope, id);
  }

  /**
   * The ID of this API Gateway Integration.
   */
  public readonly integrationId: string;

  protected api: IApi;
  protected resource: CfnIntegration;

  constructor(scope: Construct, id: string, props: IntegrationProps) {
    super(scope, id);
    this.api = props.api;
    this.resource = new CfnIntegration(this, 'Resource', {
      integrationType: props.type,
      integrationUri: props.uri,
      // TODO: connectionId : props.connectionId,
      connectionType: props.connectionType,
      contentHandlingStrategy: props.contentHandlingStrategy,
      credentialsArn: props.credentialsArn,
      description: props.description,
      integrationMethod: props.integrationMethod,
      passthroughBehavior: props.passthroughBehavior,
      payloadFormatVersion: props.payloadFormatVersion,
      requestParameters: props.requestParameters,
      requestTemplates: props.requestTemplates,
      templateSelectionExpression: props.templateSelectionExpression,
      tlsConfig: props.tlsConfig,
      timeoutInMillis: (props.timeout ? props.timeout.toMilliseconds() : undefined),
      apiId: props.api.apiId,
    });

    this.integrationId = this.resource.ref;
  }

  /**
   * Creates a new response for this integration.
   *
   * @param key the key (predefined or not) that will select this response
   * @param props the properties for this response
   */
  public addResponse(key: KnownIntegrationResponseKey | string, props?: IntegrationResponseOptions): IntegrationResponse {
    return new IntegrationResponse(this, `Response.${key}`, {
      ...props,
      api: this.api,
      integration: this,
      key,
    });
  }
}
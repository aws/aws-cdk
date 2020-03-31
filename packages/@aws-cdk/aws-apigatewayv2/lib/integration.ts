import { Construct, Duration, IResource, Resource } from '@aws-cdk/core';

import { Api, IApi } from './api';
import { CfnIntegration } from './apigatewayv2.generated';
import { IntegrationResponse, IntegrationResponseOptions, KnownIntegrationResponseKey } from './integration-response';
import { IRoute, KnownRouteKey, Route, RouteOptions } from './route';

/**
 * The type of the network connection to the integration endpoint.
 */
export enum ConnectionType {
  /**
   * Internet connectivity through the public routable internet
   */
  INTERNET = "INTERNET",

  /**
   * Private connections between API Gateway and resources in a VPC
   */
  VPC_LINK = " VPC_LINK"
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
  AWS = "AWS",

  /**
   * Integration of the route or method request with the Lambda function-invoking action with the client request passed through as-is.
   * This integration is also referred to as Lambda proxy integration.
   */
  AWS_PROXY = "AWS_PROXY",

  /**
   * Integration of the route or method request with an HTTP endpoint.
   * This integration is also referred to as HTTP custom integration.
   */
  HTTP = "HTTP",

  /**
   * Integration of the route or method request with an HTTP endpoint, with the client request passed through as-is.
   * This is also referred to as HTTP proxy integration.
   */
  HTTP_PROXY = "HTTP_PROXY",

  /**
   * Integration of the route or method request with API Gateway as a "loopback" endpoint without invoking any backend.
   */
  MOCK = "MOCK"
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
  CONVERT_TO_BINARY = "CONVERT_TO_BINARY",

  /**
   * Converts a response payload from a binary blob to a Base64-encoded string
   */
  CONVERT_TO_TEXT = "CONVERT_TO_TEXT"
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
  WHEN_NO_MATCH = "WHEN_NO_MATCH",
  /**
   * Allows pass-through when the integration has no content types mapped
   * to templates. However, if there is at least one content type defined,
   * unmapped content types will be rejected with an HTTP 415 Unsupported Media Type response
   */
  WHEN_NO_TEMPLATES = "WHEN_NO_TEMPLATES",
  /**
   * Rejects unmapped content types with an HTTP 415 Unsupported Media Type response
   */
  NEVER = "NEVER"
}

/**
 * Defines a set of common template patterns known to the system
 */
export enum KnownTemplateKey {
  /**
   * Default template, when no other pattern matches
   */
  DEFAULT = "$default"
}

/**
 * Specifies the integration's HTTP method type (only GET is supported for WebSocket)
 */
export enum IntegrationMethod {
  /**
   * GET HTTP Method
   *
   * Only method supported for WebSocket
   */
  GET = "GET",

  /**
   * POST HTTP Method
   *
   * Not supported for WebSocket
   */
  POST = "POST",

  /**
   * PUT HTTP Method
   *
   * Not supported for WebSocket
   */
  PUT = "PUT",

  /**
   * DELETE HTTP Method
   *
   * Not supported for WebSocket
   */
  DELETE = "DELETE",

  /**
   * OPTIONS HTTP Method
   *
   * Not supported for WebSocket
   */
  OPTIONS = "OPTIONS",

  /**
   * HEAD HTTP Method
   *
   * Not supported for WebSocket
   */
  HEAD = "HEAD",

  /**
   * PATCH HTTP Method
   *
   * Not supported for WebSocket
   */
  PATCH = "PATCH"
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
export interface IntegrationOptions {
  /**
   * The type of the network connection to the integration endpoint.
   *
   * @default 'INTERNET'
   */
  readonly connectionType?: ConnectionType | string;

  /**
   * The integration type of an integration.
   *
   * @default - Pass through unmodified
   */
  readonly contentHandlingStrategy?: ContentHandlingStrategy | string;

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
   * Supported only for WebSocket APIs
   *
   * @default - no parameter used
   */
  readonly requestParameters?: { [key: string]: string };

  /**
   * Represents a map of Velocity templates that are applied on the request payload based on the value of
   * the `Content-Type` header sent by the client. The content type value is the key in this map, and the
   * template is the value.
   *
   * Supported only for WebSocket APIs.
   *
   * @default - no templates used
   */
  readonly requestTemplates?: { [key: string]: string };

  /**
   * The template selection expression for the integration.
   *
   * Supported only for WebSocket APIs.
   *
   * @default - no template selected
   */
  readonly templateSelectionExpression?: KnownTemplateKey | string;

  /**
   * Custom timeout between 50 and 29,000 milliseconds for WebSocket APIs and between 50 and 30,000 milliseconds for HTTP APIs.
   *
   * @default - timeout is 29 seconds for WebSocket APIs and 30 seconds for HTTP APIs.
   */
  readonly timeout?: Duration;

  /**
   * Specifies the integration's HTTP method type.
   *
   * @default - 'GET'
   */
  readonly integrationMethod?: IntegrationMethod | string;
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
export abstract class Integration extends Resource implements IIntegration {
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
      ...props,
      timeoutInMillis: (props.timeout ? props.timeout.toMilliseconds() : undefined),
      apiId: props.api.apiId,
      integrationType: props.type,
      integrationUri: props.uri
    });

    this.integrationId = this.resource.ref;

    if (props.api instanceof Api) {
      if (props.api.latestDeployment) {
        props.api.latestDeployment.addToLogicalId({
          ...props,
          api: props.api.apiId,
          id,
          integrationType: props.type,
          integrationUri: props.uri
        });
        props.api.latestDeployment.registerDependency(this.resource);
      }
    }
  }

  /**
   * Adds a set of permission for a defined route.
   *
   * This is done automatically for routes created with the helper methods
   *
   * @param _route the route to define for the permissions
   */
  public addPermissionsForRoute(_route: IRoute) {
    // Override to define permissions for this integration
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
      key
    });
  }

  /**
   * Creates a new route for this integration.
   *
   * @param key the route key (predefined or not) that will select this integration
   * @param props the properties for this response
   */
  public addRoute(key: KnownRouteKey | string, props?: RouteOptions): Route {
    const route = new Route(this, `Route.${key}`, {
      ...props,
      api: this.api,
      integration: this,
      key
    });

    this.addPermissionsForRoute(route);

    return route;
  }
}
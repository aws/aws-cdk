import { Construct } from 'constructs';
import { ContentHandling, WebSocketRouteIntegration } from './integration';
import { IResource, Resource } from '../../../core';
import { CfnIntegrationResponse } from '../apigatewayv2.generated';

/**
 * WebSocket integration response key helper class
 */
export class WebSocketIntegrationResponseKey {
  /**
   * Match all responses
   */
  public static default = new WebSocketIntegrationResponseKey('$default');

  /**
   * Match all 2xx responses (HTTP success codes)
   */
  public static success = WebSocketIntegrationResponseKey.fromStatusRegExp(/2\d{2}/.source);

  /**
   * Match all 4xx responses (HTTP client error codes)
   */
  public static clientError = WebSocketIntegrationResponseKey.fromStatusRegExp(/4\d{2}/.source);

  /**
   * Match all 5xx responses (HTTP server error codes)
   */
  public static serverError = WebSocketIntegrationResponseKey.fromStatusRegExp(/5\d{2}/.source);

  /**
   * Generate an integration response key from an HTTP status code
   *
   * @example
   * // Match 403 status code
   * apigwv2.WebSocketIntegrationResponseKey.fromStatusCode(403)
   *
   * @param httpStatusCode HTTP status code of the mapped response
   */
  public static fromStatusCode(httpStatusCode: number): WebSocketIntegrationResponseKey {
    return new WebSocketIntegrationResponseKey(`/${httpStatusCode}/`);

  }

  /**
   * Generate an integration response key from a regular expression matching HTTP status codes
   *
   * @example
   * // Match all 20x status codes
   * apigwv2.WebSocketIntegrationResponseKey.fromStatusRegExp('20\\d')
   *
   * // Match all 4xx status codes, using RegExp
   * apigwv2.WebSocketIntegrationResponseKey.fromStatusRegExp(/4\d{2}/.source)
   *
   * @param httpStatusRegExpStr HTTP status code regular expression string representation
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
   *
   * @throws an error if {@link httpStatusRegExpStr} is not a valid regular expression string
   */
  public static fromStatusRegExp(httpStatusRegExpStr: string): WebSocketIntegrationResponseKey {
    const httpStatusRegExp = new RegExp(httpStatusRegExpStr);

    return new WebSocketIntegrationResponseKey(`/${httpStatusRegExp.source}/`);
  }

  /**
   * WebSocket integration response private constructor
   *
   * @param key The key of the integration response
   */
  private constructor(readonly key: string) {}

  /** String representation of the integration response key */
  public toString(): string {
    return this.key;
  }
}

/**
 * WebSocket integration response properties, used internally for Integration implementations
 * The integration will add itself these props during the bind process
 *
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-integration-responses.html
 */
export interface InternalWebSocketIntegrationResponseProps {
  /**
   * The HTTP status code or regular expression the response will be mapped to
   */
  readonly responseKey: WebSocketIntegrationResponseKey;

  /**
   * The templates that are used to transform the integration response body.
   * Specify templates as key-value pairs, with a content type as the key and
   * a template as the value.
   *
   * @default - No response templates
   */
  readonly responseTemplates?: { [contentType: string]: string };

  /**
   * Specifies how to handle response payload content type conversions.
   *
   * @default - The response payload will be passed through from the integration response to
   * the route response or method response without modification.
   */
  readonly contentHandling?: ContentHandling;

  /**
   * The response parameters from the backend response that API Gateway sends
   * to the method response.
   *
   * Use the destination as the key and the source as the value:
   *
   * - The destination must be an existing response parameter in the
   *   MethodResponse property.
   * - The source must be an existing method request parameter or a static
   *   value. You must enclose static values in single quotation marks and
   *   pre-encode these values based on the destination specified in the
   *   request.
   *
   * @default - No response parameters
   */
  readonly responseParameters?: { [key: string]: string };

  /**
   * The template selection expression for the integration response.
   *
   * @default - No template selection expression
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api-data-transformations.html#apigateway-websocket-api-integration-response-selection-expressions
   */
  readonly templateSelectionExpression?: string;
}

/**
 * WebSocket integration response properties
 *
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-integration-responses.html
 */
export interface WebSocketIntegrationResponseProps extends InternalWebSocketIntegrationResponseProps {
  /**
   * The WebSocket Integration to associate the response with
   */
  readonly integration: WebSocketRouteIntegration;
}

/**
 * Represents an Integration Response for an WebSocket API.
 */
export interface IWebSocketIntegrationResponse extends IResource {
  /** The WebSocket Integration associated with this Response */
  readonly integration: WebSocketRouteIntegration;

  /**
   * Id of the integration response.
   * @attribute
   */
  readonly integrationResponseId: string;
}

/**
 * WebSocket Integration Response resource class
 * @resource AWS::ApiGatewayV2::IntegrationResponse
 */
export class WebSocketIntegrationResponse extends Resource implements IWebSocketIntegrationResponse {
  public readonly integrationResponseId: string;
  public readonly integration: WebSocketRouteIntegration;

  /**
   * Generate an array of WebSocket Integration Response resources from a map
   * and associate them with a given WebSocket Integration
   *
   * @param scope The parent construct
   * @param id The name of the integration response construct
   * @param props The configuration properties to create WebSocket Integration Responses from
   */
  constructor(
    scope: Construct,
    id: string,
    props: WebSocketIntegrationResponseProps,
  ) {
    super(scope, id);
    const { ref } = new CfnIntegrationResponse(this, 'Resource', {
      apiId: props.integration.webSocketApiId,
      integrationId: props.integration.integrationId,
      integrationResponseKey: props.responseKey.key,
      responseTemplates: props.responseTemplates,
      contentHandlingStrategy: props.contentHandling,
      responseParameters: props.responseParameters,
      templateSelectionExpression: props.templateSelectionExpression,
    });
    this.integrationResponseId = ref;
    this.integration = props.integration;
  }
}

import { Construct } from 'constructs';
import { ContentHandling, IWebSocketIntegration } from './integration';
import { IResource, Resource } from '../../../core';
import { CfnIntegrationResponse } from '../apigatewayv2.generated';

/**
 * WebSocket integration response key helper class
 */
export class WebSocketIntegrationResponseKey {
  /**
   * Generate an integration response key from an HTTP status code
   *
   * @example
   * // Match 403 status code
   * WebSocketIntegrationResponseKey.fromStatusCode(403)
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
   * WebSocketIntegrationResponseKey.fromStatusRegExp('/20\d/')
   *
   * @param httpStatusRegExpStr HTTP status code regular expression string representation
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
   */
  public static fromStatusRegExp(httpStatusRegExpStr: string): WebSocketIntegrationResponseKey {
    const httpStatusRegExp = new RegExp(httpStatusRegExpStr);

    if (httpStatusRegExp.flags) {
      throw new Error(
        `RegExp flags are not supported, got '${httpStatusRegExp}', expected '/${httpStatusRegExp.source}/'`,
      );
    }

    return new WebSocketIntegrationResponseKey(`/${httpStatusRegExp.source}/`);
  }

  /**
   * Match all responses
   */
  public static get default(): WebSocketIntegrationResponseKey {
    return new WebSocketIntegrationResponseKey('$default');
  }

  /**
   * Match all 2xx responses (HTTP success codes)
   */
  public static get success(): WebSocketIntegrationResponseKey {
    return WebSocketIntegrationResponseKey.fromStatusRegExp('/2\d{2}/');
  }

  /**
   * Match all 4xx responses (HTTP client error codes)
   */
  public static get clientError(): WebSocketIntegrationResponseKey {
    return WebSocketIntegrationResponseKey.fromStatusRegExp('/4\d{2}/');
  }

  /**
   * Match all 5xx responses (HTTP server error codes)
   */
  public static get serverError(): WebSocketIntegrationResponseKey {
    return WebSocketIntegrationResponseKey.fromStatusRegExp('/5\d{2}/');
  }

  private constructor(readonly key: string) {}
}

/**
 * WebSocket integration response properties
 *
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-integration-responses.html
 */
export interface WebSocketIntegrationResponseProps {
  /**
   * The HTTP status code the response will be mapped to
   */
  readonly responseKey: WebSocketIntegrationResponseKey;

  /**
   * TODO
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
   * TODO
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
 * Represents an Integration Response for an WebSocket API.
 */
export interface IWebSocketIntegrationResponse extends IResource {
  /**
   * The integration the response will be mapped to
   */
  readonly integration: IWebSocketIntegration;

  /**
   * The integration response key.
   */
  readonly responseKey: WebSocketIntegrationResponseKey;
}

/**
 * WebSocket Integration Response resource class
 */
export class WebSocketIntegrationResponse extends Resource implements IWebSocketIntegrationResponse {
  /**
   * Generate an array of WebSocket Integration Response resources from a map
   * and associate them with a given WebSocket Integration
   *
   * @param scope The parent construct
   * @param integration The WebSocket Integration to associate the responses with
   * @param responsesProps The array of properties to create WebSocket Integration Responses from
   */
  public static fromIntegrationResponseMap(
    scope: Construct,
    integration: IWebSocketIntegration,
    responsesProps: WebSocketIntegrationResponseProps[],
  ): WebSocketIntegrationResponse[] {
    return responsesProps.map((responseProps) =>
      new WebSocketIntegrationResponse(scope, integration, responseProps),
    );
  }

  /**
   * The integration response key.
   */
  readonly responseKey: WebSocketIntegrationResponseKey;

  private constructor(
    scope: Construct,
    readonly integration: IWebSocketIntegration,
    props: WebSocketIntegrationResponseProps,
  ) {
    // TODO generate a unique id from integration id + key
    super(scope, '1234');

    new CfnIntegrationResponse(this, 'Resource', {
      apiId: this.integration.webSocketApi.apiId,
      integrationId: this.integration.integrationId,
      integrationResponseKey: props.responseKey.key,
      responseTemplates: props.responseTemplates,
      contentHandlingStrategy: props.contentHandling,
      responseParameters: props.responseParameters,
      templateSelectionExpression: props.templateSelectionExpression,
    });

    this.responseKey = props.responseKey;
  }
}

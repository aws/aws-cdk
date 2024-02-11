import {
  WebSocketRouteIntegration,
  WebSocketIntegrationType,
  WebSocketRouteIntegrationConfig,
  WebSocketRouteIntegrationBindOptions,
  PassthroughBehavior,
} from '../../../aws-apigatewayv2';
import { IRole } from '../../../aws-iam';

/**
 * Props for AWS type integration for an HTTP Api.
 */
export interface WebSocketAwsIntegrationProps {
  /**
   * Integration URI.
   */
  readonly integrationUri: string;

  /**
   * Specifies the integration's HTTP method type.
   */
  readonly integrationMethod: string;

  /**
   * Specifies the credentials role required for the integration.
   *
   * @default - No credential role provided.
   */
  readonly credentialsRole?: IRole;

  /**
   * The request parameters that API Gateway sends with the backend request.
   * Specify request parameters as key-value pairs (string-to-string
   * mappings), with a destination as the key and a source as the value.
   *
   * @default - No request parameter provided to the integration.
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
   * @default - No request template provided to the integration.
   */
  readonly requestTemplates?: { [contentType: string]: string };

  /**
   * The template selection expression for the integration.
   *
   * @default - No template selection expression provided.
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
 * AWS WebSocket AWS Type Integration
 */
export class WebSocketAwsIntegration extends WebSocketRouteIntegration {
  /**
   * @param id id of the underlying integration construct
   */
  constructor(id: string, private readonly props: WebSocketAwsIntegrationProps) {
    super(id);
  }

  bind(_options: WebSocketRouteIntegrationBindOptions): WebSocketRouteIntegrationConfig {
    return {
      type: WebSocketIntegrationType.AWS,
      uri: this.props.integrationUri,
      method: this.props.integrationMethod,
      credentialsRole: this.props.credentialsRole,
      requestParameters: this.props.requestParameters,
      requestTemplates: this.props.requestTemplates,
      passthroughBehavior: this.props.passthroughBehavior,
      templateSelectionExpression: this.props.templateSelectionExpression,
    };
  }
}

import {
  WebSocketRouteIntegration,
  WebSocketIntegrationType,
  WebSocketRouteIntegrationConfig,
  WebSocketRouteIntegrationBindOptions,
} from '../../../aws-apigatewayv2';
import { IRole } from '../../../aws-iam';

/**
 * Props for AWS type integration for an HTTP Api.
 */
export interface WebSocketAwsIntegrationProps {
  /**
   * Integration URI.
   *
   * @default None.
   */
  readonly integrationUri?: string;

  /**
   * Specifies the integration's HTTP method type.
   *
   * @default None.
   */
  readonly integrationMethod?: string;

  /**
   * Specifies the credentials role required for the integration.
   *
   * @default None.
   */
  readonly credentialsRole?: IRole;

  /**
   * The request parameters that API Gateway sends with the backend request.
   * Specify request parameters as key-value pairs (string-to-string
   * mappings), with a destination as the key and a source as the value.
   *
   * @default None.
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
   * @default None.
  */
  readonly requestTemplates?: { [contentType: string]: string };

  /**
   * The template selection expression for the integration.
   *
   * @default None.
   */
  readonly templateSelectionExpression?: string;
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

  bind(options: WebSocketRouteIntegrationBindOptions): WebSocketRouteIntegrationConfig {
    options;

    if (!this.props.integrationUri) {
      throw new Error('integrationUri is required for AWS integration types.');
    }

    return {
      type: WebSocketIntegrationType.AWS,
      uri: this.props.integrationUri,
      method: this.props.integrationMethod,
      credentialsRole: this.props.credentialsRole,
      requestTemplates: this.props.requestTemplates,
      templateSelectionExpression: this.props.templateSelectionExpression,
    };
  }
}

import {
  WebSocketRouteIntegration,
  WebSocketIntegrationType,
  WebSocketRouteIntegrationBindOptions,
  WebSocketRouteIntegrationConfig,
  ContentHandling,
} from '../../../aws-apigatewayv2';
import { ServicePrincipal } from '../../../aws-iam';
import { IFunction } from '../../../aws-lambda';
import { Duration, Stack } from '../../../core';

/**
 * Props for Lambda type integration for a WebSocket Api.
 */
export interface WebSocketLambdaIntegrationProps {
  /**
   * The maximum amount of time an integration will run before it returns without a response.
   * Must be between 50 milliseconds and 29 seconds.
   *
   * @default Duration.seconds(29)
   */
  readonly timeout?: Duration;

  /**
   * Specifies how to handle response payload content type conversions.
   *
   * @default - The response payload will be passed through from the integration response to
   * the route response or method response without modification.
   */
  readonly contentHandling?: ContentHandling;
}

/**
 * Lambda WebSocket Integration
 */
export class WebSocketLambdaIntegration extends WebSocketRouteIntegration {
  private readonly _id: string;

  /**
   * @param id id of the underlying integration construct
   * @param handler the Lambda function handler
   * @param props properties to configure the integration
   */
  constructor(
    id: string,
    private readonly handler: IFunction,
    private readonly props: WebSocketLambdaIntegrationProps = {},
  ) {
    super(id);
    this._id = id;
  }

  bind(options: WebSocketRouteIntegrationBindOptions): WebSocketRouteIntegrationConfig {
    const route = options.route;
    this.handler.addPermission(`${this._id}-Permission`, {
      scope: options.scope,
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
      sourceArn: Stack.of(route).formatArn({
        service: 'execute-api',
        resource: route.webSocketApi.apiId,
        resourceName: `*${route.routeKey}`,
      }),
    });

    const integrationUri = Stack.of(route).formatArn({
      service: 'apigateway',
      account: 'lambda',
      resource: 'path/2015-03-31/functions',
      resourceName: `${this.handler.functionArn}/invocations`,
    });

    return {
      type: WebSocketIntegrationType.AWS_PROXY,
      uri: integrationUri,
      timeout: this.props.timeout,
      contentHandling: this.props.contentHandling,
    };
  }
}

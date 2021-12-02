import {
  WebSocketRouteIntegration,
  WebSocketIntegrationType,
  WebSocketRouteIntegrationBindOptions,
  WebSocketRouteIntegrationConfig,
} from '@aws-cdk/aws-apigatewayv2';
import { ServicePrincipal } from '@aws-cdk/aws-iam';
import { IFunction } from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';

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
  constructor(id: string, private readonly handler: IFunction) {
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
        resourceName: `*/*${route.routeKey}`,
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
    };
  }
}

import {
  WebSocketRouteIntegration,
  WebSocketIntegrationType,
  WebSocketRouteIntegrationBindOptions,
  WebSocketRouteIntegrationConfig,
} from '@aws-cdk/aws-apigatewayv2';
import { ServicePrincipal } from '@aws-cdk/aws-iam';
import { IFunction } from '@aws-cdk/aws-lambda';
import { Names, Stack } from '@aws-cdk/core';

/**
 * Lambda WebSocket Integration props
 */
export interface LambdaWebSocketIntegrationProps {
  /**
   * The handler for this integration.
   */
  readonly handler: IFunction
}

/**
 * Lambda WebSocket Integration
 */
export class LambdaWebSocketIntegration extends WebSocketRouteIntegration {
  constructor(private props: LambdaWebSocketIntegrationProps) {
    super();
  }

  bind(options: WebSocketRouteIntegrationBindOptions): WebSocketRouteIntegrationConfig {
    const route = options.route;
    this.props.handler.addPermission(`${Names.nodeUniqueId(route.node)}-Permission`, {
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
      resourceName: `${this.props.handler.functionArn}/invocations`,
    });

    return {
      type: WebSocketIntegrationType.AWS_PROXY,
      uri: integrationUri,
    };
  }
}

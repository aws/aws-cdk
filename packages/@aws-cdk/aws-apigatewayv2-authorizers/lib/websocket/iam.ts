import {
  WebSocketAuthorizerType,
  WebSocketRouteAuthorizerBindOptions,
  WebSocketRouteAuthorizerConfig,
  IWebSocketRouteAuthorizer,
} from '@aws-cdk/aws-apigatewayv2';

/**
 * Authorize WebSocket API Routes with IAM
 */
export class WebSocketIamAuthorizer implements IWebSocketRouteAuthorizer {
  public bind(
    _options: WebSocketRouteAuthorizerBindOptions,
  ): WebSocketRouteAuthorizerConfig {
    return {
      authorizationType: WebSocketAuthorizerType.IAM,
    };
  }
}

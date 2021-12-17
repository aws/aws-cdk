import {
  HttpAuthorizerType,
  HttpRouteAuthorizerBindOptions,
  HttpRouteAuthorizerConfig,
  IHttpRouteAuthorizer,
} from '@aws-cdk/aws-apigatewayv2';

/**
 * Authorize HTTP API Routes with IAM
 */
export class HttpIamAuthorizer implements IHttpRouteAuthorizer {
  public bind(_options: HttpRouteAuthorizerBindOptions): HttpRouteAuthorizerConfig {
    return {
      authorizationType: HttpAuthorizerType.IAM,
    };
  }
}
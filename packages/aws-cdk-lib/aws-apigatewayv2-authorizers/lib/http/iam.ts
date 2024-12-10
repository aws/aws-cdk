import {
  HttpAuthorizerType,
  HttpRouteAuthorizerBindOptions,
  HttpRouteAuthorizerConfig,
  IHttpRouteAuthorizer,
} from '../../../aws-apigatewayv2';

/**
 * Authorize HTTP API Routes with IAM
 */
export class HttpIamAuthorizer implements IHttpRouteAuthorizer {
  /**
   * The authorizationType used for IAM Authorizer
   */
  public readonly authorizationType = HttpAuthorizerType.IAM;
  public bind(_options: HttpRouteAuthorizerBindOptions): HttpRouteAuthorizerConfig {
    return {
      authorizationType: this.authorizationType,
    };
  }
}

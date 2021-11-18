import { IHttpRouteAuthorizer, HttpRouteAuthorizerBindOptions, HttpRouteAuthorizerConfig } from './authorizer';

/**
 * Authorize HTTP API Routes with IAM
 */
export class HttpIamAuthorizer implements IHttpRouteAuthorizer {
  public bind(_options: HttpRouteAuthorizerBindOptions): HttpRouteAuthorizerConfig {
    return {
      authorizationType: 'AWS_IAM',
    };
  }
}

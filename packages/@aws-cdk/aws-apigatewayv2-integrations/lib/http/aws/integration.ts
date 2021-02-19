import {
  AwsServiceIntegrationSubtype,
  HttpConnectionType,
  HttpIntegrationType,
  HttpRouteIntegrationBindOptions,
  HttpRouteIntegrationConfig,
  IHttpRouteIntegration,
  PayloadFormatVersion,
} from '@aws-cdk/aws-apigatewayv2';

/**
 * The HTTP Private integration resource for HTTP API
 *
 * @internal
 */
export abstract class AwsServiceIntegration implements IHttpRouteIntegration {
  protected connectionType = HttpConnectionType.INTERNET
  protected integrationSubtype?: AwsServiceIntegrationSubtype;
  protected integrationType = HttpIntegrationType.AWS_PROXY;
  protected payloadFormatVersion = PayloadFormatVersion.VERSION_1_0; // 1.0 is required and is the only supported format

  public abstract bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig;
}

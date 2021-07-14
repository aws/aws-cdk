import { HttpIntegrationType, HttpRouteIntegrationBindOptions, HttpRouteIntegrationConfig, IHttpRouteIntegration, PayloadFormatVersion } from '@aws-cdk/aws-apigatewayv2';

export interface EventBridgePutEventsIntegrationProps {
  detail: string;
  detailType: string;
  source: string;
  time?: string;
  eventBus?: string;
  resources?: Array<string>;
  region?: string;
  traceHeader?: string;
}

export class EventBridgePutEventsIntegration implements IHttpRouteIntegration {
  bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    options.route.httpApi
    return {
      type: HttpIntegrationType.LAMBDA_PROXY,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
    }
  }
}
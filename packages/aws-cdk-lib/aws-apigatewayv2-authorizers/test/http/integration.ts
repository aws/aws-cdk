import type { HttpRouteIntegrationBindOptions } from '../../../aws-apigatewayv2';
import { HttpIntegrationType, HttpRouteIntegration, PayloadFormatVersion } from '../../../aws-apigatewayv2';

export class DummyRouteIntegration extends HttpRouteIntegration {
  constructor() {
    super('DummyRouteIntegration');
  }

  public bind(_: HttpRouteIntegrationBindOptions) {
    return {
      payloadFormatVersion: PayloadFormatVersion.VERSION_2_0,
      type: HttpIntegrationType.HTTP_PROXY,
      uri: 'some-uri',
    };
  }
}

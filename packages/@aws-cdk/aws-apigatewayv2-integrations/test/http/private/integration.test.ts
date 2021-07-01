import '@aws-cdk/assert-internal/jest';
import { HttpApi, HttpRoute, HttpRouteIntegrationBindOptions, HttpRouteIntegrationConfig, HttpRouteKey } from '@aws-cdk/aws-apigatewayv2';
import { Stack } from '@aws-cdk/core';
import { HttpPrivateIntegration } from '../../../lib/http/private/integration';

describe('HttpPrivateIntegration', () => {
  test('throws error if both vpcLink and vpc are not passed', () => {
    // GIVEN
    const stack = new Stack();
    class DummyPrivateIntegration extends HttpPrivateIntegration {
      constructor() {
        super();
      }

      public bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
        const vpcLink = this._configureVpcLink(options, {});

        return {
          method: this.httpMethod,
          payloadFormatVersion: this.payloadFormatVersion,
          type: this.integrationType,
          connectionType: this.connectionType,
          connectionId: vpcLink.vpcLinkId,
          uri: 'some-uri',
        };
      }
    }

    // WHEN
    const api = new HttpApi(stack, 'HttpApi');
    expect(() => new HttpRoute(stack, 'HttpProxyPrivateRoute', {
      httpApi: api,
      integration: new DummyPrivateIntegration(),
      routeKey: HttpRouteKey.with('/pets'),
    })).toThrow(/One of vpcLink or vpc should be provided for private integration/);
  });
});

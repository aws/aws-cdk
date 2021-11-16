import { Match, Template } from '@aws-cdk/assertions';
import { HttpApi, HttpIntegrationType, HttpRouteIntegrationBindOptions, IHttpRouteIntegration, PayloadFormatVersion } from '@aws-cdk/aws-apigatewayv2';
import { Stack } from '@aws-cdk/core';
import { HttpIamAuthorizer } from '../../lib';

describe('HttpIamAuthorizer', () => {
  test('default', () => {
    // GIVEN
    const stack = new Stack();
    const api = new HttpApi(stack, 'HttpApi');

    const authorizer = new HttpIamAuthorizer();

    // WHEN
    api.addRoutes({
      integration: new DummyRouteIntegration(),
      path: '/books',
      authorizer,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Route', Match.objectLike({
      RouteKey: 'ANY /books',
      AuthorizationType: 'AWS_IAM',
    }));
  });
});

class DummyRouteIntegration implements IHttpRouteIntegration {
  public bind(_: HttpRouteIntegrationBindOptions) {
    return {
      payloadFormatVersion: PayloadFormatVersion.VERSION_2_0,
      type: HttpIntegrationType.HTTP_PROXY,
      uri: 'some-uri',
    };
  }
}

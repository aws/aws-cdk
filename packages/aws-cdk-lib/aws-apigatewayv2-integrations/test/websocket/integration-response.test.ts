import { Match, Template } from '../../../assertions';
import { ContentHandling, WebSocketApi, WebSocketIntegrationResponseKey, WebSocketIntegrationResponseProps, WebSocketIntegrationType, WebSocketRouteIntegration, WebSocketRouteIntegrationBindOptions, WebSocketRouteIntegrationConfig, WebSocketTwoWayRouteIntegration } from '../../../aws-apigatewayv2';
import * as iam from '../../../aws-iam';
import { Stack } from '../../../core';

interface WebSocketTestRouteIntegrationConfig {
  /**
   * Integration URI.
   */
  readonly integrationUri: string;

  /**
   * Integration responses configuration
   *
   * @default - No response configuration provided.
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-integration-responses.html
   */
  readonly responses?: WebSocketIntegrationResponseProps[];
}

class WebSocketTestIntegration extends WebSocketTwoWayRouteIntegration {
  constructor(id: string, private readonly props: WebSocketTestRouteIntegrationConfig) {
    super(id);
  }

  bind(_options: WebSocketRouteIntegrationBindOptions): WebSocketRouteIntegrationConfig {
    return {
      type: 'TEST' as WebSocketIntegrationType,
      uri: this.props.integrationUri,
      responses: this.props.responses,
    };
  }

  /**
   * Add a response to this integration
   *
   * @param response The response to add
   */
  addResponse(response: WebSocketIntegrationResponseProps) {
    super.addResponse(response);
  }
}

describe('WebSocketIntegrationResponseKey', () => {
  test('constant response key values are correct', () => {
    expect(WebSocketIntegrationResponseKey.default.key).toEqual('$default');
    expect(WebSocketIntegrationResponseKey.success.key).toEqual('/2\\d{2}/');
    expect(WebSocketIntegrationResponseKey.clientError.key).toEqual('/4\\d{2}/');
    expect(WebSocketIntegrationResponseKey.serverError.key).toEqual('/5\\d{2}/');
  });

  test('can generate fromStatusCode', () => {
    // GIVEN
    const { key } = WebSocketIntegrationResponseKey.fromStatusCode(404);

    // THEN
    expect(key).toEqual('/404/');
  });

  test('can generate fromStatusRegExp', () => {
    // GIVEN
    const { key } = WebSocketIntegrationResponseKey.fromStatusRegExp(/4\d{2}/.source);

    // THEN
    expect(key).toEqual('/4\\d{2}/');
  });

  test('fromStatusRegExp throws if invalid RegExp', () => {
    expect(
      () => WebSocketIntegrationResponseKey.fromStatusRegExp('('),
    ).toThrow(/Invalid regular expression/);
  });
});

describe('WebSocketIntegrationRespons', () => {
  test('can set an integration response', () => {
    // GIVEN
    const stack = new Stack();
    const role = new iam.Role(stack, 'MyRole', { assumedBy: new iam.ServicePrincipal('foo') });
    const api = new WebSocketApi(stack, 'Api');

    // THEN
    const integration = new WebSocketTestIntegration('TestIntegration', {
      integrationUri: 'https://example.com',
      responses: [
        { responseKey: WebSocketIntegrationResponseKey.default },
      ],
    });

    api.addRoute('$default', { integration, returnResponse: true });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'TEST',
      IntegrationUri: 'https://example.com',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::IntegrationResponse', {
      ApiId: { Ref: 'ApiF70053CD' },
      IntegrationId: { Ref: 'ApidefaultRouteTestIntegration7AF569F1' },
      IntegrationResponseKey: '$default',
      TemplateSelectionExpression: Match.absent(),
      ContentHandling: Match.absent(),
      ResponseParameters: Match.absent(),
      ResponseTemplates: Match.absent(),
    });
  });

  test('can set custom integration response properties', () => {
    // GIVEN
    const stack = new Stack();
    const role = new iam.Role(stack, 'MyRole', { assumedBy: new iam.ServicePrincipal('foo') });
    const api = new WebSocketApi(stack, 'Api');

    // THEN
    const integration = new WebSocketTestIntegration('TestIntegration', {
      integrationUri: 'https://example.com',
      responses: [
        {
          responseKey: WebSocketIntegrationResponseKey.fromStatusCode(404),
          contentHandling: ContentHandling.CONVERT_TO_BINARY,
          responseParameters: {
            'method.response.header.Accept': "'application/json'",
          },
          templateSelectionExpression: '$default',
          responseTemplates: {
            'application/json': '{ "message": $context.error.message, "statusCode": 404 }',
          },
        },
      ],
    });

    api.addRoute('$default', { integration, returnResponse: true });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'TEST',
      IntegrationUri: 'https://example.com',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::IntegrationResponse', {
      ApiId: { Ref: 'ApiF70053CD' },
      IntegrationId: { Ref: 'ApidefaultRouteTestIntegration7AF569F1' },
      IntegrationResponseKey: '/404/',
      ContentHandlingStrategy: 'CONVERT_TO_BINARY',
      TemplateSelectionExpression: '$default',
      ResponseParameters: {
        'method.response.header.Accept': "'application/json'",
      },
      ResponseTemplates: {
        'application/json': '{ "message": $context.error.message, "statusCode": 404 }',
      },
    });
  });

  test('can add integration responses', () => {
    // GIVEN
    const stack = new Stack();
    const role = new iam.Role(stack, 'MyRole', { assumedBy: new iam.ServicePrincipal('foo') });
    const api = new WebSocketApi(stack, 'Api');

    // THEN
    const integration = new WebSocketTestIntegration('TestIntegration', {
      integrationUri: 'https://example.com',
      responses: [
        { responseKey: WebSocketIntegrationResponseKey.default },
      ],
    });
    integration.addResponse({ responseKey: WebSocketIntegrationResponseKey.clientError });

    api.addRoute('$default', { integration, returnResponse: true });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'TEST',
      IntegrationUri: 'https://example.com',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::IntegrationResponse', {
      ApiId: { Ref: 'ApiF70053CD' },
      IntegrationId: { Ref: 'ApidefaultRouteTestIntegration7AF569F1' },
      IntegrationResponseKey: '$default',
      TemplateSelectionExpression: Match.absent(),
      ContentHandling: Match.absent(),
      ResponseParameters: Match.absent(),
      ResponseTemplates: Match.absent(),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::IntegrationResponse', {
      ApiId: { Ref: 'ApiF70053CD' },
      IntegrationId: { Ref: 'ApidefaultRouteTestIntegration7AF569F1' },
      IntegrationResponseKey: '/4\\d{2}/',
      TemplateSelectionExpression: Match.absent(),
      ContentHandling: Match.absent(),
      ResponseParameters: Match.absent(),
      ResponseTemplates: Match.absent(),
    });
  });

  test('throws if duplicate response key is set', () => {
    // GIVEN
    const stack = new Stack();
    const role = new iam.Role(stack, 'MyRole', { assumedBy: new iam.ServicePrincipal('foo') });
    const api = new WebSocketApi(stack, 'Api');

    // THEN
    const integration = new WebSocketTestIntegration('TestIntegration', {
      integrationUri: 'https://example.com',
      responses: [
        { responseKey: WebSocketIntegrationResponseKey.default },
        { responseKey: WebSocketIntegrationResponseKey.default },
      ],
    });

    // THEN
    expect(
      () => api.addRoute('$default', { integration, returnResponse: true }),
    ).toThrow(/Duplicate integration response key/);
  });

  test('throws if duplicate response key is added', () => {
    // GIVEN
    const stack = new Stack();
    const role = new iam.Role(stack, 'MyRole', { assumedBy: new iam.ServicePrincipal('foo') });
    const api = new WebSocketApi(stack, 'Api');

    // THEN
    const integration = new WebSocketTestIntegration('TestIntegration', {
      integrationUri: 'https://example.com',
      responses: [
        { responseKey: WebSocketIntegrationResponseKey.default },
      ],
    });
    integration.addResponse({ responseKey: WebSocketIntegrationResponseKey.default });

    // THEN
    expect(
      () => api.addRoute('$default', { integration, returnResponse: true }),
    ).toThrow(/Duplicate integration response key/);
  });

  test('throws if returnResponse is not set to true', () => {
    // GIVEN
    const stack = new Stack();
    const role = new iam.Role(stack, 'MyRole', { assumedBy: new iam.ServicePrincipal('foo') });
    const api = new WebSocketApi(stack, 'Api');

    // THEN
    const integration = new WebSocketTestIntegration('TestIntegration', {
      integrationUri: 'https://example.com',
      responses: [
        { responseKey: WebSocketIntegrationResponseKey.default },
      ],
    });

    // THEN
    expect(
      () => api.addRoute('$default', { integration }),
    ).toThrow(/Setting up integration responses without setting up returnResponse to true will have no effect/);
  });
});
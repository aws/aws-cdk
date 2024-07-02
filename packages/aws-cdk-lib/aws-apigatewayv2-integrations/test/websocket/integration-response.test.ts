import { Match, Template } from '../../../assertions';
import { ContentHandling, InternalWebSocketIntegrationResponseProps, WebSocketApi, WebSocketIntegration, WebSocketIntegrationResponse, WebSocketIntegrationResponseKey, WebSocketIntegrationType, WebSocketRouteIntegrationBindOptions, WebSocketRouteIntegrationConfig, CustomResponseWebSocketRoute } from '../../../aws-apigatewayv2';
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
  readonly responses?: InternalWebSocketIntegrationResponseProps[];
}

class WebSocketTestIntegration extends CustomResponseWebSocketRoute {
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
   * @param responseKey The response key to add
   * @param options Optional properties to add to the response
   */
  addResponse(
    responseKey: WebSocketIntegrationResponseKey,
    options: Omit<InternalWebSocketIntegrationResponseProps, 'responseKey'> = {}) {
    super.addResponse(responseKey, options);
  }
}

describe('WebSocketIntegrationResponseKey', () => {
  test('constant response key values are correct', () => {
    expect(WebSocketIntegrationResponseKey.default.key).toEqual('$default');
    expect(WebSocketIntegrationResponseKey.success.key).toEqual('/2\\d{2}/');
    expect(WebSocketIntegrationResponseKey.clientError.key).toEqual('/4\\d{2}/');
    expect(WebSocketIntegrationResponseKey.serverError.key).toEqual('/5\\d{2}/');

    expect(WebSocketIntegrationResponseKey.ok.key).toEqual('/200/');
    expect(WebSocketIntegrationResponseKey.noContent.key).toEqual('/204/');
    expect(WebSocketIntegrationResponseKey.badRequest.key).toEqual('/400/');
    expect(WebSocketIntegrationResponseKey.unauthorized.key).toEqual('/401/');
    expect(WebSocketIntegrationResponseKey.forbidden.key).toEqual('/403/');
    expect(WebSocketIntegrationResponseKey.notFound.key).toEqual('/404/');
    expect(WebSocketIntegrationResponseKey.internalServerError.key).toEqual('/500/');
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

describe('WebSocketIntegrationResponse from constructor', () => {
  test('can create an integration response', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'Api');
    const integration = new WebSocketTestIntegration('TestIntegration', {
      integrationUri: 'https://example.com',
      responses: [
        { responseKey: WebSocketIntegrationResponseKey.default },
      ],
    });
    api.addRoute('$default', { integration, returnResponse: true });

    // WHEN
    new WebSocketIntegrationResponse(stack, 'IntegrationResponse', {
      integration,
      responseKey: WebSocketIntegrationResponseKey.default,
    });

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

  test('throws if addRoute has not been ran', () => {

    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'Api');
    const integration = new WebSocketTestIntegration('TestIntegration', {
      integrationUri: 'https://example.com',
      responses: [
        { responseKey: WebSocketIntegrationResponseKey.default },
      ],
    });

    // THEN
    expect(() =>
      new WebSocketIntegrationResponse(stack, 'IntegrationResponse', {
        integration,
        responseKey: WebSocketIntegrationResponseKey.default,
      }),
    ).toThrow(/This integration has not been associated to an API route/);
  });
});

describe('WebSocketIntegrationResponse from properties', () => {
  test('can set an integration response', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'Api');

    // WHEN
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
    const api = new WebSocketApi(stack, 'Api');

    // WHEN
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
    const api = new WebSocketApi(stack, 'Api');

    // WHEN
    const integration = new WebSocketTestIntegration('TestIntegration', {
      integrationUri: 'https://example.com',
      responses: [
        { responseKey: WebSocketIntegrationResponseKey.default },
      ],
    });
    integration.addResponse(WebSocketIntegrationResponseKey.clientError);

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
    const api = new WebSocketApi(stack, 'Api');

    // WHEN
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

    // WHEN
    const integration = new WebSocketTestIntegration('TestIntegration', {
      integrationUri: 'https://example.com',
      responses: [
        { responseKey: WebSocketIntegrationResponseKey.default },
      ],
    });
    integration.addResponse(WebSocketIntegrationResponseKey.default);

    // THEN
    expect(
      () => api.addRoute('$default', { integration, returnResponse: true }),
    ).toThrow(/Duplicate integration response key/);
  });

  test('throws if returnResponse is not set to true', () => {
    // GIVEN
    const stack = new Stack();
    const api = new WebSocketApi(stack, 'Api');

    // WHEN
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
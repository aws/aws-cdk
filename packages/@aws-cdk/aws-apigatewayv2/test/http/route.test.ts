import { Template } from '@aws-cdk/assertions';
import { Stack, App } from '@aws-cdk/core';
import {
  HttpApi, HttpAuthorizer, HttpAuthorizerType, HttpConnectionType, HttpIntegrationType, HttpMethod, HttpRoute,
  HttpRouteAuthorizerBindOptions, HttpRouteAuthorizerConfig, HttpRouteIntegrationConfig, HttpRouteKey, IHttpRouteAuthorizer, HttpRouteIntegration,
  MappingValue,
  ParameterMapping,
  PayloadFormatVersion,
} from '../../lib';

describe('HttpRoute', () => {
  test('default', () => {
    const stack = new Stack();
    const httpApi = new HttpApi(stack, 'HttpApi');

    new HttpRoute(stack, 'HttpRoute', {
      httpApi,
      integration: new DummyIntegration(),
      routeKey: HttpRouteKey.with('/books', HttpMethod.GET),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Route', {
      ApiId: stack.resolve(httpApi.apiId),
      RouteKey: 'GET /books',
      Target: {
        'Fn::Join': [
          '',
          [
            'integrations/',
            {
              Ref: 'HttpRouteDummyIntegration10F77519',
            },
          ],
        ],
      },
      AuthorizationType: 'NONE',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      ApiId: stack.resolve(httpApi.apiId),
    });
  });

  test('integration is configured correctly', () => {
    const stack = new Stack();
    const httpApi = new HttpApi(stack, 'HttpApi');

    new HttpRoute(stack, 'HttpRoute', {
      httpApi,
      integration: new DummyIntegration(),
      routeKey: HttpRouteKey.with('/books', HttpMethod.GET),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      ApiId: stack.resolve(httpApi.apiId),
      IntegrationType: 'HTTP_PROXY',
      PayloadFormatVersion: '2.0',
      IntegrationUri: 'some-uri',
    });
  });

  test('integration is only configured once if multiple routes are configured with it', () => {
    // GIVEN
    const stack = new Stack();
    const httpApi = new HttpApi(stack, 'HttpApi');
    const integration = new DummyIntegration();

    // WHEN
    new HttpRoute(stack, 'HttpRoute1', {
      httpApi,
      integration,
      routeKey: HttpRouteKey.with('/books', HttpMethod.GET),
    });
    new HttpRoute(stack, 'HttpRoute2', {
      httpApi,
      integration,
      routeKey: HttpRouteKey.with('/books', HttpMethod.POST),
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::Integration', 1);
  });

  test('integration cannot be used across HttpApis', () => {
    // GIVEN
    const integration = new DummyIntegration();

    // WHEN
    const stack = new Stack();
    const httpApi1 = new HttpApi(stack, 'HttpApi1');
    const httpApi2 = new HttpApi(stack, 'HttpApi2');

    new HttpRoute(stack, 'HttpRoute1', {
      httpApi: httpApi1,
      integration,
      routeKey: HttpRouteKey.with('/books', HttpMethod.GET),
    });

    expect(() => new HttpRoute(stack, 'HttpRoute2', {
      httpApi: httpApi2,
      integration,
      routeKey: HttpRouteKey.with('/books', HttpMethod.GET),
    })).toThrow(/cannot be associated with multiple APIs/);
  });

  test('associating integrations in different APIs creates separate AWS::ApiGatewayV2::Integration', () => {
    const stack = new Stack();

    const api = new HttpApi(stack, 'HttpApi');
    api.addRoutes({
      path: '/books',
      integration: new DummyIntegration(),
    });
    api.addRoutes({
      path: '/magazines',
      integration: new DummyIntegration(),
    });

    Template.fromStack(stack).hasResource('AWS::ApiGatewayV2::Integration', 2);
  });

  test('route defined in a separate stack does not create cycles', () => {
    // GIVEN
    const integration = new DummyIntegration();

    // WHEN
    const app = new App();
    const stack1 = new Stack(app, 'ApiStack');
    const httpApi = new HttpApi(stack1, 'HttpApi');

    const stack2 = new Stack(app, 'RouteStack');
    new HttpRoute(stack2, 'HttpRoute1', {
      httpApi,
      integration,
      routeKey: HttpRouteKey.with('/books', HttpMethod.GET),
    });

    // THEN
    Template.fromStack(stack1).resourceCountIs('AWS::ApiGatewayV2::Integration', 0);
    Template.fromStack(stack2).resourceCountIs('AWS::ApiGatewayV2::Integration', 1);
  });

  test('throws when path not start with /', () => {
    const stack = new Stack();
    const httpApi = new HttpApi(stack, 'HttpApi');

    expect(() => new HttpRoute(stack, 'HttpRoute', {
      httpApi,
      integration: new DummyIntegration(),
      routeKey: HttpRouteKey.with('books', HttpMethod.GET),
    })).toThrowError(/A route path must always start with a "\/" and not end with a "\/"/);
  });

  test('throws when path ends with /', () => {
    const stack = new Stack();
    const httpApi = new HttpApi(stack, 'HttpApi');

    expect(() => new HttpRoute(stack, 'HttpRoute', {
      httpApi,
      integration: new DummyIntegration(),
      routeKey: HttpRouteKey.with('/books/', HttpMethod.GET),
    })).toThrowError(/A route path must always start with a "\/" and not end with a "\/"/);
  });

  test('configures private integration correctly when all props are passed', () => {
    // GIVEN
    const stack = new Stack();
    const httpApi = new HttpApi(stack, 'HttpApi');

    class PrivateIntegration extends HttpRouteIntegration {
      public bind(): HttpRouteIntegrationConfig {
        return {
          method: HttpMethod.ANY,
          payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
          type: HttpIntegrationType.HTTP_PROXY,
          connectionId: 'some-connection-id',
          connectionType: HttpConnectionType.VPC_LINK,
          uri: 'some-target-arn',
          secureServerName: 'some-server-name',
          parameterMapping: new ParameterMapping()
            .appendHeader('header2', MappingValue.requestHeader('header1'))
            .removeHeader('header1'),
        };
      }
    }

    // WHEN
    new HttpRoute(stack, 'HttpRoute', {
      httpApi,
      integration: new PrivateIntegration('PrivateIntegration'),
      routeKey: HttpRouteKey.with('/books', HttpMethod.GET),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'HTTP_PROXY',
      ConnectionId: 'some-connection-id',
      ConnectionType: 'VPC_LINK',
      IntegrationMethod: 'ANY',
      IntegrationUri: 'some-target-arn',
      PayloadFormatVersion: '1.0',
      TlsConfig: {
        ServerNameToVerify: 'some-server-name',
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::VpcLink', 0);
  });

  test('configures private integration correctly when parameter mappings are passed', () => {
    // GIVEN
    const stack = new Stack();
    const httpApi = new HttpApi(stack, 'HttpApi');

    class PrivateIntegration extends HttpRouteIntegration {
      public bind(): HttpRouteIntegrationConfig {
        return {
          method: HttpMethod.ANY,
          payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
          type: HttpIntegrationType.HTTP_PROXY,
          uri: 'some-target-arn',
          parameterMapping: new ParameterMapping()
            .appendHeader('header2', MappingValue.requestHeader('header1'))
            .removeHeader('header1'),
        };
      }
    }

    // WHEN
    new HttpRoute(stack, 'HttpRoute', {
      httpApi,
      integration: new PrivateIntegration('PrivateIntegration'),
      routeKey: HttpRouteKey.with('/books', HttpMethod.GET),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      IntegrationType: 'HTTP_PROXY',
      IntegrationMethod: 'ANY',
      IntegrationUri: 'some-target-arn',
      PayloadFormatVersion: '1.0',
      RequestParameters: {
        'append:header.header2': '$request.header.header1',
        'remove:header.header1': '',
      },
    });

    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::VpcLink', 0);
  });

  test('can create route with an authorizer attached', () => {
    const stack = new Stack();
    const httpApi = new HttpApi(stack, 'HttpApi');

    const authorizer = new DummyAuthorizer();

    const route = new HttpRoute(stack, 'HttpRoute', {
      httpApi,
      integration: new DummyIntegration(),
      routeKey: HttpRouteKey.with('/books', HttpMethod.GET),
      authorizer,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Integration', {
      ApiId: stack.resolve(httpApi.apiId),
      IntegrationType: 'HTTP_PROXY',
      PayloadFormatVersion: '2.0',
      IntegrationUri: 'some-uri',
    });

    Template.fromStack(stack).resourceCountIs('AWS::ApiGatewayV2::Authorizer', 1);

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Route', {
      AuthorizerId: stack.resolve(authorizer.bind({ scope: stack, route: route }).authorizerId),
      AuthorizationType: 'JWT',
    });
  });

  test('can attach additional scopes to a route with an authorizer attached', () => {
    const stack = new Stack();
    const httpApi = new HttpApi(stack, 'HttpApi');

    const authorizer = new DummyAuthorizer();

    new HttpRoute(stack, 'HttpRoute', {
      httpApi,
      integration: new DummyIntegration(),
      routeKey: HttpRouteKey.with('/books', HttpMethod.GET),
      authorizer,
      authorizationScopes: ['read:books'],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGatewayV2::Route', {
      AuthorizationScopes: ['read:books'],
    });
  });

  test('should fail when unsupported authorization type is used', () => {
    const stack = new Stack();
    const httpApi = new HttpApi(stack, 'HttpApi');

    const authorizer = new InvalidTypeAuthorizer();

    expect(() => new HttpRoute(stack, 'HttpRoute', {
      httpApi,
      integration: new DummyIntegration(),
      routeKey: HttpRouteKey.with('/books', HttpMethod.GET),
      authorizer,
    })).toThrowError('authorizationType should either be JWT, CUSTOM, or NONE');
  });
});

class DummyIntegration extends HttpRouteIntegration {
  constructor(name?: string) {
    super(name ?? 'DummyIntegration');
  }

  public bind(): HttpRouteIntegrationConfig {
    return {
      type: HttpIntegrationType.HTTP_PROXY,
      payloadFormatVersion: PayloadFormatVersion.VERSION_2_0,
      uri: 'some-uri',
      method: HttpMethod.DELETE,
    };
  }
}

class DummyAuthorizer implements IHttpRouteAuthorizer {
  private authorizer?: HttpAuthorizer;

  public bind(options: HttpRouteAuthorizerBindOptions): HttpRouteAuthorizerConfig {
    if (!this.authorizer) {

      this.authorizer = new HttpAuthorizer(options.scope, 'auth-1234', {
        httpApi: options.route.httpApi,
        identitySource: ['identitysource.1', 'identitysource.2'],
        type: HttpAuthorizerType.JWT,
        jwtAudience: ['audience.1', 'audience.2'],
        jwtIssuer: 'issuer',
      });
    }

    return {
      authorizerId: this.authorizer.authorizerId,
      authorizationType: 'JWT',
    };
  }
}

class InvalidTypeAuthorizer implements IHttpRouteAuthorizer {
  private authorizer?: HttpAuthorizer;

  public bind(options: HttpRouteAuthorizerBindOptions): HttpRouteAuthorizerConfig {
    if (!this.authorizer) {

      this.authorizer = new HttpAuthorizer(options.scope, 'auth-1234', {
        httpApi: options.route.httpApi,
        identitySource: ['identitysource.1', 'identitysource.2'],
        type: HttpAuthorizerType.JWT,
        jwtAudience: ['audience.1', 'audience.2'],
        jwtIssuer: 'issuer',
      });
    }

    return {
      authorizerId: this.authorizer.authorizerId,
      authorizationType: 'Random',
    };
  }
}
import { Match, Template } from '../../assertions';
import * as cert from '../../aws-certificatemanager';
import * as lambda from '../../aws-lambda';
import * as cdk from '../../core';
import * as apigw from '../lib';
import { LambdaRestApi } from '../lib';

describe('lambda api', () => {
  test('LambdaRestApi defines a REST API with Lambda proxy integration', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const handler = new lambda.Function(stack, 'handler', {
      handler: 'index.handler',
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    // WHEN
    const api = new apigw.LambdaRestApi(stack, 'lambda-rest-api', { handler });

    // THEN -- can't customize further
    expect(() => {
      api.root.addResource('cant-touch-this');
    }).toThrow();

    // THEN -- template proxies everything
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: '{proxy+}',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'ANY',
      ResourceId: {
        Ref: 'lambdarestapiproxyE3AE07E3',
      },
      RestApiId: {
        Ref: 'lambdarestapiAAD10924',
      },
      AuthorizationType: 'NONE',
      Integration: {
        IntegrationHttpMethod: 'POST',
        Type: 'AWS_PROXY',
        Uri: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':apigateway:',
              {
                Ref: 'AWS::Region',
              },
              ':lambda:path/2015-03-31/functions/',
              {
                'Fn::GetAtt': [
                  'handlerE1533BD5',
                  'Arn',
                ],
              },
              '/invocations',
            ],
          ],
        },
      },
    });
  });

  test('LambdaRestApi supports function Alias', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const handler = new lambda.Function(stack, 'handler', {
      handler: 'index.handler',
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_LATEST,
    });
    const alias = new lambda.Alias(stack, 'alias', {
      aliasName: 'my-alias',
      version: new lambda.Version(stack, 'version', {
        lambda: handler,
      }),
    });

    // WHEN
    const api = new apigw.LambdaRestApi(stack, 'lambda-rest-api', { handler: alias });

    // THEN -- can't customize further
    expect(() => {
      api.root.addResource('cant-touch-this');
    }).toThrow();

    // THEN -- template proxies everything
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: '{proxy+}',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'ANY',
      ResourceId: {
        Ref: 'lambdarestapiproxyE3AE07E3',
      },
      RestApiId: {
        Ref: 'lambdarestapiAAD10924',
      },
      AuthorizationType: 'NONE',
      Integration: {
        IntegrationHttpMethod: 'POST',
        Type: 'AWS_PROXY',
        Uri: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':apigateway:',
              {
                Ref: 'AWS::Region',
              },
              ':lambda:path/2015-03-31/functions/',
              {
                Ref: 'alias68BF17F5',
              },
              '/invocations',
            ],
          ],
        },
      },
    });
  });

  test('when "proxy" is set to false, users need to define the model', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const handler = new lambda.Function(stack, 'handler', {
      handler: 'index.handler',
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    // WHEN
    const api = new apigw.LambdaRestApi(stack, 'lambda-rest-api', { handler, proxy: false });

    const tasks = api.root.addResource('tasks');
    tasks.addMethod('GET');
    tasks.addMethod('POST');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', Match.not({
      PathPart: '{proxy+}',
    }));

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: 'tasks',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: { Ref: 'lambdarestapitasks224418C8' },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      ResourceId: { Ref: 'lambdarestapitasks224418C8' },
    });
  });

  test('when "proxy" is false, AWS_PROXY is still used', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const handler = new lambda.Function(stack, 'handler', {
      handler: 'index.handler',
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // WHEN
    const api = new apigw.LambdaRestApi(stack, 'lambda-rest-api', { handler, proxy: false });

    const tasks = api.root.addResource('tasks');
    tasks.addMethod('GET');
    tasks.addMethod('POST');

    // THEN
    const template = Template.fromStack(stack);
    // Ensure that all methods have "AWS_PROXY" integrations.
    const methods = template.findResources('AWS::ApiGateway::Method');
    const hasProxyIntegration = Match.objectLike({ Integration: Match.objectLike({ Type: 'AWS_PROXY' }) });
    for (const method of Object.values(methods)) {
      expect(hasProxyIntegration.test(method)).toBeTruthy();
    }
  });

  test('fails if options.defaultIntegration is also set', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const handler = new lambda.Function(stack, 'handler', {
      handler: 'index.handler',
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    expect(() => new apigw.LambdaRestApi(stack, 'lambda-rest-api', {
      handler,
      defaultIntegration: new apigw.HttpIntegration('https://foo/bar'),
    })).toThrow(/Cannot specify \"defaultIntegration\" since Lambda integration is automatically defined/);

    expect(() => new apigw.LambdaRestApi(stack, 'lambda-rest-api', {
      handler,
      defaultIntegration: new apigw.HttpIntegration('https://foo/bar'),
    })).toThrow(/Cannot specify \"defaultIntegration\" since Lambda integration is automatically defined/);
  });

  test('LambdaRestApi defines a REST API with CORS enabled', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const handler = new lambda.Function(stack, 'handler', {
      handler: 'index.handler',
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    // WHEN
    new apigw.LambdaRestApi(stack, 'lambda-rest-api', {
      handler,
      defaultCorsPreflightOptions: {
        allowOrigins: ['https://aws.amazon.com'],
        allowMethods: ['GET', 'PUT'],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: { Ref: 'lambdarestapiproxyE3AE07E3' },
      Integration: {
        IntegrationResponses: [
          {
            ResponseParameters: {
              'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              'method.response.header.Access-Control-Allow-Origin': "'https://aws.amazon.com'",
              'method.response.header.Vary': "'Origin'",
              'method.response.header.Access-Control-Allow-Methods': "'GET,PUT'",
            },
            StatusCode: '204',
          },
        ],
        RequestTemplates: {
          'application/json': '{ statusCode: 200 }',
        },
        Type: 'MOCK',
      },
      MethodResponses: [
        {
          ResponseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Vary': true,
            'method.response.header.Access-Control-Allow-Methods': true,
          },
          StatusCode: '204',
        },
      ],
    });
  });

  test('LambdaRestApi defines a REST API with CORS enabled and defaultMethodOptions', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const handler = new lambda.Function(stack, 'handler', {
      handler: 'index.handler',
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    // WHEN
    new apigw.LambdaRestApi(stack, 'lambda-rest-api', {
      handler,
      defaultMethodOptions: {
        authorizationType: apigw.AuthorizationType.IAM,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: ['https://aws.amazon.com'],
        allowMethods: ['GET', 'PUT'],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'OPTIONS',
      ResourceId: { Ref: 'lambdarestapiproxyE3AE07E3' },
      AuthorizationType: 'NONE',
      AuthorizerId: Match.absent(),
      ApiKeyRequired: false,
      Integration: {
        IntegrationResponses: [
          {
            ResponseParameters: {
              'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              'method.response.header.Access-Control-Allow-Origin': "'https://aws.amazon.com'",
              'method.response.header.Vary': "'Origin'",
              'method.response.header.Access-Control-Allow-Methods': "'GET,PUT'",
            },
            StatusCode: '204',
          },
        ],
        RequestTemplates: {
          'application/json': '{ statusCode: 200 }',
        },
        Type: 'MOCK',
      },
      MethodResponses: [
        {
          ResponseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Vary': true,
            'method.response.header.Access-Control-Allow-Methods': true,
          },
          StatusCode: '204',
        },
      ],
    });
  });

  test('LambdaRestApi allows passing GENERATE_IF_NEEDED as the physical name', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new apigw.LambdaRestApi(stack, 'lambda-rest-api', {
      handler: new lambda.Function(stack, 'handler', {
        handler: 'index.handler',
        code: lambda.Code.fromInline('boom'),
        runtime: lambda.Runtime.NODEJS_LATEST,
      }),
      restApiName: cdk.PhysicalName.GENERATE_IF_NEEDED,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: Match.absent(),
    });
  });

  test('provided integrationOptions are applied', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const handler = new lambda.Function(stack, 'handler', {
      handler: 'index.handler',
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // WHEN
    new apigw.LambdaRestApi(stack, 'lamda-rest-api', {
      handler,
      integrationOptions: {
        timeout: cdk.Duration.seconds(1),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        TimeoutInMillis: 1000,
        Type: 'AWS_PROXY',
      },
    });
  });

  test('setting integrationOptions.proxy to false retains {proxy+} path part', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const handler = new lambda.Function(stack, 'handler', {
      handler: 'index.handler',
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // WHEN
    new apigw.LambdaRestApi(stack, 'lamda-rest-api', {
      handler,
      integrationOptions: {
        proxy: false,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: '{proxy+}',
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Type: 'AWS',
      },
    });
  });

  test('setting deployOptions variable with invalid value throws validation error', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);

    const handler = new lambda.Function(stack, 'handler', {
      handler: 'index.handler',
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const versionAlias = lambda.Version.fromVersionAttributes(stack, 'VersionInfo', {
      lambda: handler,
      version: '${stageVariables.lambdaAlias}',
    });

    new LambdaRestApi(stack, 'RestApi', {
      restApiName: 'my-test-api',
      handler: versionAlias,
      deployOptions: {
        variables: {
          functionName: '$$$',
        },
      },
    });

    expect(() => app.synth()).toThrow('Validation failed with the following errors:\n  [Default/RestApi] Stage variable value $$$ does not match the regex.');
  });
});

describe('LambdaRestApi inherits from RestApi prop injector test ', () => {
  class RestApiPropsInjector implements cdk.IPropertyInjector {
    readonly constructUniqueId: string;

    constructor() {
      this.constructUniqueId = apigw.RestApi.PROPERTY_INJECTION_ID;
    }

    inject(originalProps: apigw.RestApiProps, context: cdk.InjectionContext): apigw.RestApiProps {
      return {
        endpointTypes: [apigw.EndpointType.REGIONAL],
        deploy: false,
        restApiName: 'my-rest-api',
        ...originalProps,
      };
    }
  }

  class LambdaRestApiPropsInjector implements cdk.IPropertyInjector {
    readonly constructUniqueId: string;

    constructor() {
      this.constructUniqueId = LambdaRestApi.PROPERTY_INJECTION_ID;
    }

    inject(originalProps: apigw.LambdaRestApiProps, context: cdk.InjectionContext): apigw.LambdaRestApiProps {
      const domainCert = new cert.Certificate(context.scope, 'cert', {
        domainName: 'amazon.com',
      });
      return {
        domainName: {
          domainName: 'myexample.com',
          certificate: domainCert,
        },
        disableExecuteApiEndpoint: true,
        restApiName: 'my-lambda-rest-api',
        ...originalProps,
      };
    }
  }

  test('Applying LambdaRestApi and RestApi', () => {
    // GIVEN - with Injector
    const app = new cdk.App({
    });
    const stack = new cdk.Stack(app, 'MyStack', {
    });
    const cert1 = new cert.Certificate(stack, 'cert', {
      domainName: 'amazon.com',
    });
    const fn = new lambda.Function(stack, 'MyFunc', {
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromInline('exports.handler = e => {}'),
    });
    new LambdaRestApi(stack, 'MyRestAPI', {
      handler: fn,
      // default from RestApi
      deploy: false,
      endpointTypes: [apigw.EndpointType.REGIONAL],
      // default from LambdaRestApi
      // The restApiName from LambdaRestApiPropsInjector wins
      restApiName: 'my-lambda-rest-api',
      domainName: {
        domainName: 'myexample.com',
        certificate: cert1,
      },
      disableExecuteApiEndpoint: true,
    });
    const template = Template.fromStack(stack).toJSON();

    // WHEN
    const app2 = new cdk.App({
    });
    const stack2 = new cdk.Stack(app2, 'MyStack', {
      propertyInjectors: [
        new RestApiPropsInjector(),
        new LambdaRestApiPropsInjector(),
      ],
    });
    const fn2 = new lambda.Function(stack2, 'MyFunc', {
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromInline('exports.handler = e => {}'),
    });
    new LambdaRestApi(stack2, 'MyRestAPI', {
      handler: fn2,
    });

    // THEN
    Template.fromStack(stack2).templateMatches(
      Match.exact(template),
    );
  });

  test('Applying LambdaRestApi only', () => {
    // GIVEN - with Injector
    const app = new cdk.App({
    });
    const stack = new cdk.Stack(app, 'MyStack', {
    });
    const cert1 = new cert.Certificate(stack, 'cert', {
      domainName: 'amazon.com',
    });
    const fn = new lambda.Function(stack, 'MyFunc', {
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromInline('exports.handler = e => {}'),
    });
    new LambdaRestApi(stack, 'MyRestAPI', {
      handler: fn,
      // default from LambdaRestApi
      // The restApiName from LambdaRestApiPropsInjector wins
      restApiName: 'my-lambda-rest-api',
      domainName: {
        domainName: 'myexample.com',
        certificate: cert1,
      },
      disableExecuteApiEndpoint: true,
    });
    const template = Template.fromStack(stack).toJSON();

    // WHEN
    const app2 = new cdk.App({
    });
    const stack2 = new cdk.Stack(app2, 'MyStack', {
      propertyInjectors: [
        new LambdaRestApiPropsInjector(),
      ],
    });
    const fn2 = new lambda.Function(stack2, 'MyFunc', {
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromInline('exports.handler = e => {}'),
    });
    new LambdaRestApi(stack2, 'MyRestAPI', {
      handler: fn2,
    });

    // THEN
    Template.fromStack(stack2).templateMatches(
      Match.exact(template),
    );
  });

  test('Applying RestApi only', () => {
    // GIVEN - with Injector
    const app = new cdk.App({
    });
    const stack = new cdk.Stack(app, 'MyStack', {
    });
    const fn = new lambda.Function(stack, 'MyFunc', {
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromInline('exports.handler = e => {}'),
    });
    new LambdaRestApi(stack, 'MyRestAPI', {
      handler: fn,
      // default from RestApi
      deploy: false,
      // The restApiName from RestApiPropsInjector wins
      restApiName: 'my-rest-api',
      endpointTypes: [apigw.EndpointType.REGIONAL],
    });
    const template = Template.fromStack(stack).toJSON();

    // WHEN
    const app2 = new cdk.App({
    });
    const stack2 = new cdk.Stack(app2, 'MyStack', {
      propertyInjectors: [
        new RestApiPropsInjector(),
      ],
    });
    const fn2 = new lambda.Function(stack2, 'MyFunc', {
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromInline('exports.handler = e => {}'),
    });
    new LambdaRestApi(stack2, 'MyRestAPI', {
      handler: fn2,
    });

    // THEN
    Template.fromStack(stack2).templateMatches(
      Match.exact(template),
    );
  });
});

import { Match, Template } from '@aws-cdk/assertions';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigw from '../lib';

describe('lambda api', () => {
  test('LambdaRestApi defines a REST API with Lambda proxy integration', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const handler = new lambda.Function(stack, 'handler', {
      handler: 'index.handler',
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_14_X,
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
      runtime: lambda.Runtime.NODEJS_14_X,
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
      runtime: lambda.Runtime.NODEJS_14_X,
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
    const methods = template.findResources('AWS::ApiGateway::Mathod');
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
      runtime: lambda.Runtime.NODEJS_14_X,
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
      runtime: lambda.Runtime.NODEJS_14_X,
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
      runtime: lambda.Runtime.NODEJS_14_X,
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
      ApiKeyRequired: Match.absent(),
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
        runtime: lambda.Runtime.NODEJS_14_X,
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
});

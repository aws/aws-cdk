import { Match, Template } from '../../../assertions';
import * as lambda from '../../../aws-lambda';
import * as cdk from '../../../core';
import * as apigateway from '../../lib';

describe('lambda', () => {
  test('minimal setup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api');
    const handler = new lambda.Function(stack, 'Handler', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'boom',
      code: lambda.Code.fromInline('foo'),
    });

    // WHEN
    const integ = new apigateway.LambdaIntegration(handler);
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
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
                  'Handler886CB40B',
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

  test('"allowTestInvoke" can be used to disallow calling the API from the test UI', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Handler', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromInline('foo'),
      handler: 'index.handler',
    });

    const api = new apigateway.RestApi(stack, 'api');

    // WHEN
    const integ = new apigateway.LambdaIntegration(fn, { allowTestInvoke: false });
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      SourceArn: {
        'Fn::Join': [
          '',
          [
            'arn:', { Ref: 'AWS::Partition' }, ':execute-api:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':',
            { Ref: 'apiC8550315' }, '/', { Ref: 'apiDeploymentStageprod896C8101' }, '/GET/',
          ],
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', Match.not({
      SourceArn: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':execute-api:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':',
            { Ref: 'apiC8550315' },
            '/test-invoke-stage/GET/',
          ],
        ],
      },
    }));
  });

  test('"allowTestInvoke" set to true allows calling the API from the test UI', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Handler', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromInline('foo'),
      handler: 'index.handler',
    });

    const api = new apigateway.RestApi(stack, 'api');

    // WHEN
    const integ = new apigateway.LambdaIntegration(fn, { allowTestInvoke: true });
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      SourceArn: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':execute-api:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':',
            { Ref: 'apiC8550315' },
            '/test-invoke-stage/GET/',
          ],
        ],
      },
    });
  });

  test('"proxy" can be used to disable proxy mode', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Handler', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromInline('foo'),
      handler: 'index.handler',
    });

    const api = new apigateway.RestApi(stack, 'api');

    // WHEN
    const integ = new apigateway.LambdaIntegration(fn, { proxy: false });
    api.root.addMethod('GET', integ);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Type: 'AWS',
      },
    });
  });

  test('when "ANY" is used, lambda permission will include "*" for method', () => {
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api');

    const handler = new lambda.Function(stack, 'MyFunc', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('loo'),
    });

    const target = new apigateway.LambdaIntegration(handler);

    api.root.addMethod('ANY', target);

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      SourceArn: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':execute-api:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':',
            { Ref: 'testapiD6451F70' },
            '/test-invoke-stage/*/',
          ],
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      SourceArn: {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':execute-api:',
            {
              Ref: 'AWS::Region',
            },
            ':',
            {
              Ref: 'AWS::AccountId',
            },
            ':',
            {
              Ref: 'testapiD6451F70',
            },
            '/',
            { Ref: 'testapiDeploymentStageprod5C9E92A4' },
            '/*/',
          ],
        ],
      },
    });
  });

  test('works for imported RestApi', () => {
    const stack = new cdk.Stack();
    const api = apigateway.RestApi.fromRestApiAttributes(stack, 'RestApi', {
      restApiId: 'imported-rest-api-id',
      rootResourceId: 'imported-root-resource-id',
    });

    const handler = new lambda.Function(stack, 'MyFunc', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('loo'),
    });

    api.root.addMethod('ANY', new apigateway.LambdaIntegration(handler));

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      RestApiId: 'imported-rest-api-id',
      ResourceId: 'imported-root-resource-id',
      HttpMethod: 'ANY',
    });
  });

  test('fingerprint is computed when functionName is specified', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const restapi = new apigateway.RestApi(stack, 'RestApi');
    const method = restapi.root.addMethod('ANY');
    const handler = new lambda.Function(stack, 'MyFunc', {
      functionName: 'ThisFunction',
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('loo'),
    });
    const integration = new apigateway.LambdaIntegration(handler);

    // WHEN
    const bindResult = integration.bind(method);

    // THEN
    expect(bindResult?.deploymentToken).toBeDefined();
    expect(bindResult!.deploymentToken).toEqual('{"functionName":"ThisFunction"}');
  });

  test('fingerprint is not computed when functionName is not specified', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const restapi = new apigateway.RestApi(stack, 'RestApi');
    const method = restapi.root.addMethod('ANY');
    const handler = new lambda.Function(stack, 'MyFunc', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('loo'),
    });
    const integration = new apigateway.LambdaIntegration(handler);

    // WHEN
    const bindResult = integration.bind(method);

    // THEN
    expect(bindResult?.deploymentToken).toBeUndefined();
  });

  test('bind works for integration with imported functions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const restapi = new apigateway.RestApi(stack, 'RestApi');
    const method = restapi.root.addMethod('ANY');
    const handler = lambda.Function.fromFunctionArn(stack, 'MyFunc', 'arn:aws:lambda:region:account:function:myfunc');
    const integration = new apigateway.LambdaIntegration(handler);

    // WHEN
    const bindResult = integration.bind(method);

    // the deployment token should be defined since the function name
    // should be a literal string.
    expect(bindResult?.deploymentToken).toEqual(JSON.stringify({ functionName: 'myfunc' }));
  });

  test('handler reused once maintains method-specific permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api');
    const handler = new lambda.Function(stack, 'Handler', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });

    // WHEN - Add one method with the handler
    api.root.addMethod('GET', new apigateway.LambdaIntegration(handler));

    // THEN - Should have method-specific permissions
    const template = Template.fromStack(stack);

    // Should have 2 permissions: 1 method-specific + 1 test invoke
    template.resourceCountIs('AWS::Lambda::Permission', 2);
  });

  test('handler reused twice maintains method-specific permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api');
    const handler = new lambda.Function(stack, 'Handler', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });

    // WHEN - Add two methods with the same handler
    api.root.addMethod('GET', new apigateway.LambdaIntegration(handler));
    api.root.addMethod('POST', new apigateway.LambdaIntegration(handler));

    // THEN - Should still have method-specific permissions (below threshold)
    const template = Template.fromStack(stack);

    // Should have 4 permissions: 2 method-specific + 2 test invoke
    template.resourceCountIs('AWS::Lambda::Permission', 4);
  });

  test('handler reused 6 times consolidates to API-scoped permission', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api');
    const handler = new lambda.Function(stack, 'Handler', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });

    // WHEN - Add 6 methods with the same handler (exceeds threshold of 10 permissions = 5 methods with test invoke)
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'];
    methods.forEach(method => {
      api.root.addMethod(method, new apigateway.LambdaIntegration(handler));
    });

    // THEN - Should consolidate to API-scoped permission
    const template = Template.fromStack(stack);

    // Should have 1 permission: API-scoped (test invoke is removed during consolidation)
    template.resourceCountIs('AWS::Lambda::Permission', 1);

    // Verify the API-scoped permission exists
    template.hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': [
          'Handler886CB40B',
          'Arn',
        ],
      },
      Principal: 'apigateway.amazonaws.com',
      SourceArn: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':execute-api:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':',
            { Ref: 'myapi4C7BF186' },
            '/*/*/*',
          ],
        ],
      },
    });
  });

  test('adding method after consolidation maintains single API-scoped permission', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api');
    const handler = new lambda.Function(stack, 'Handler', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });

    // WHEN - Add 6 methods to trigger consolidation, then add another
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'];
    methods.forEach(method => {
      api.root.addMethod(method, new apigateway.LambdaIntegration(handler));
    });

    // Add another method after consolidation
    api.root.addMethod('OPTIONS', new apigateway.LambdaIntegration(handler));

    // THEN - Should still have only 1 consolidated permission
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Permission', 1);

    // Verify it's still the API-scoped permission
    template.hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': [
          'Handler886CB40B',
          'Arn',
        ],
      },
      Principal: 'apigateway.amazonaws.com',
      SourceArn: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':execute-api:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':',
            { Ref: 'myapi4C7BF186' },
            '/*/*/*',
          ],
        ],
      },
    });
  });

  test('different handlers maintain method-specific permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api');
    const handler1 = new lambda.Function(stack, 'Handler1', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('foo'),
    });
    const handler2 = new lambda.Function(stack, 'Handler2', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('bar'),
    });

    // WHEN - Add methods with different handlers
    const integ1 = new apigateway.LambdaIntegration(handler1);
    api.root.addMethod('GET', integ1);

    const integ2 = new apigateway.LambdaIntegration(handler2);
    api.root.addMethod('POST', integ2);

    // THEN - Each handler should have its own method-specific permissions
    const template = Template.fromStack(stack);

    // Should have 4 permissions total: 2 method-specific + 2 test invoke permissions
    template.resourceCountIs('AWS::Lambda::Permission', 4);

    // Verify handler1 has method-specific permission for GET
    template.hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': [
          'Handler11CDD30AA',
          'Arn',
        ],
      },
      Principal: 'apigateway.amazonaws.com',
      SourceArn: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':execute-api:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':',
            { Ref: 'myapi4C7BF186' },
            '/',
            { Ref: 'myapiDeploymentStageprod298F01AF' },
            '/GET/',
          ],
        ],
      },
    });

    // Verify handler1 has test invoke permission for GET
    template.hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': [
          'Handler11CDD30AA',
          'Arn',
        ],
      },
      Principal: 'apigateway.amazonaws.com',
      SourceArn: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':execute-api:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':',
            { Ref: 'myapi4C7BF186' },
            '/test-invoke-stage/GET/',
          ],
        ],
      },
    });

    // Verify handler2 has method-specific permission for POST
    template.hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': [
          'Handler267EDD214',
          'Arn',
        ],
      },
      Principal: 'apigateway.amazonaws.com',
      SourceArn: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':execute-api:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':',
            { Ref: 'myapi4C7BF186' },
            '/',
            { Ref: 'myapiDeploymentStageprod298F01AF' },
            '/POST/',
          ],
        ],
      },
    });

    // Verify handler2 has test invoke permission for POST
    template.hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: {
        'Fn::GetAtt': [
          'Handler267EDD214',
          'Arn',
        ],
      },
      Principal: 'apigateway.amazonaws.com',
      SourceArn: {
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':execute-api:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            ':',
            { Ref: 'myapi4C7BF186' },
            '/test-invoke-stage/POST/',
          ],
        ],
      },
    });
  });
});

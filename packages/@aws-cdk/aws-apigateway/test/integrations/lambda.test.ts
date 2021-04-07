import '@aws-cdk/assert-internal/jest';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigateway from '../../lib';

describe('lambda', () => {
  test('minimal setup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api');
    const handler = new lambda.Function(stack, 'Handler', {
      runtime: lambda.Runtime.PYTHON_2_7,
      handler: 'boom',
      code: lambda.Code.fromInline('foo'),
    });

    // WHEN
    const integ = new apigateway.LambdaIntegration(handler);
    api.root.addMethod('GET', integ);

    // THEN
    expect(stack).toHaveResource('AWS::ApiGateway::Method', {
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
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('foo'),
      handler: 'index.handler',
    });

    const api = new apigateway.RestApi(stack, 'api');

    // WHEN
    const integ = new apigateway.LambdaIntegration(fn, { allowTestInvoke: false });
    api.root.addMethod('GET', integ);

    // THEN
    expect(stack).toHaveResource('AWS::Lambda::Permission', {
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

    expect(stack).not.toHaveResource('AWS::Lambda::Permission', {
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

  test('"allowTestInvoke" set to true allows calling the API from the test UI', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Handler', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('foo'),
      handler: 'index.handler',
    });

    const api = new apigateway.RestApi(stack, 'api');

    // WHEN
    const integ = new apigateway.LambdaIntegration(fn, { allowTestInvoke: true });
    api.root.addMethod('GET', integ);

    // THEN
    expect(stack).toHaveResource('AWS::Lambda::Permission', {
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
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('foo'),
      handler: 'index.handler',
    });

    const api = new apigateway.RestApi(stack, 'api');

    // WHEN
    const integ = new apigateway.LambdaIntegration(fn, { proxy: false });
    api.root.addMethod('GET', integ);

    // THEN
    expect(stack).toHaveResourceLike('AWS::ApiGateway::Method', {
      Integration: {
        Type: 'AWS',
      },
    });
  });

  test('when "ANY" is used, lambda permission will include "*" for method', () => {
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api');

    const handler = new lambda.Function(stack, 'MyFunc', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('loo'),
    });

    const target = new apigateway.LambdaIntegration(handler);

    api.root.addMethod('ANY', target);

    expect(stack).toHaveResource('AWS::Lambda::Permission', {
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

    expect(stack).toHaveResource('AWS::Lambda::Permission', {
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
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('loo'),
    });

    api.root.addMethod('ANY', new apigateway.LambdaIntegration(handler));

    expect(stack).toHaveResource('AWS::ApiGateway::Method', {
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
      runtime: lambda.Runtime.NODEJS_10_X,
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
      runtime: lambda.Runtime.NODEJS_10_X,
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
});

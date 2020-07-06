import { expect, haveResource, haveResourceLike, not } from '@aws-cdk/assert';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as apigateway from '../lib';

export = {
  'minimal setup'(test: Test) {
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
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
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
    }));
    test.done();
  },

  '"allowTestInvoke" can be used to disallow calling the API from the test UI'(test: Test) {
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
    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      SourceArn: {
        'Fn::Join': [
          '',
          [
            'arn:', { Ref: 'AWS::Partition' }, ':execute-api:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':',
            { Ref: 'apiC8550315' }, '/', { Ref: 'apiDeploymentStageprod896C8101' }, '/GET/',
          ],
        ],
      },
    }));

    expect(stack).to(not(haveResource('AWS::Lambda::Permission', {
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
    })));

    test.done();
  },

  '"proxy" can be used to disable proxy mode'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::ApiGateway::Method', {
      Integration: {
        Type: 'AWS',
      },
    }));

    test.done();
  },

  'when "ANY" is used, lambda permission will include "*" for method'(test: Test) {
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api');

    const handler = new lambda.Function(stack, 'MyFunc', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('loo'),
    });

    const target = new apigateway.LambdaIntegration(handler);

    api.root.addMethod('ANY', target);

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
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
    }));

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
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
    }));

    test.done();
  },

  'works for imported RestApi'(test: Test) {
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

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      RestApiId: 'imported-rest-api-id',
      ResourceId: 'imported-root-resource-id',
      HttpMethod: 'ANY',
    }));

    test.done();
  },

  'fingerprint is computed when functionName is specified'(test: Test) {
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
    test.ok(bindResult?.deploymentToken);
    test.deepEqual(bindResult!.deploymentToken, '{"functionName":"ThisFunction"}');

    test.done();
  },

  'fingerprint is not computed when functionName is not specified'(test: Test) {
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
    test.equals(bindResult?.deploymentToken, undefined);

    test.done();
  },

  'bind works for integration with imported functions'(test: Test) {
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
    test.equal(bindResult?.deploymentToken, JSON.stringify({functionName: 'myfunc'}));

    test.done();
  },

};

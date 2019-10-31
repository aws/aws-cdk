import { expect, haveResource, haveResourceLike, not } from '@aws-cdk/assert';
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import apigateway = require('../lib');

export = {
  'minimal setup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api');
    const handler = new lambda.Function(stack, 'Handler', {
      runtime: lambda.Runtime.PYTHON_2_7,
      handler: 'boom',
      code: lambda.Code.fromInline('foo')
    });

    // WHEN
    const integ = new apigateway.LambdaIntegration(handler);
    api.root.addMethod('GET', integ);

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      Integration: {
        IntegrationHttpMethod: "POST",
        Type: "AWS_PROXY",
        Uri: {
          "Fn::Join": [
            "",
            [
              "arn:",
              {
              Ref: "AWS::Partition"
              },
              ":apigateway:",
              {
              Ref: "AWS::Region"
              },
              ":lambda:path/2015-03-31/functions/",
              {
                "Fn::GetAtt": [
                  "Handler886CB40B",
                  "Arn"
                ]
              },
              "/invocations"
            ]
          ]
        }
      }
    }));
    test.done();
  },

  '"allowTestInvoke" can be used to disallow calling the API from the test UI'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Handler', {
      runtime: lambda.Runtime.NODEJS_8_10,
      code: lambda.Code.fromInline('foo'),
      handler: 'index.handler'
    });

    const api = new apigateway.RestApi(stack, 'api');

    // WHEN
    const integ = new apigateway.LambdaIntegration(fn, { allowTestInvoke: false });
    api.root.addMethod('GET', integ);

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      SourceArn: {
        "Fn::Join": [
          "",
          [
            "arn:", { Ref: "AWS::Partition" }, ":execute-api:", { Ref: "AWS::Region" }, ":", { Ref: "AWS::AccountId" }, ":",
            { Ref: "apiC8550315" }, "/", { Ref: "apiDeploymentStageprod896C8101" }, "/GET/"
          ]
        ]
      }
    }));

    expect(stack).to(not(haveResource('AWS::Lambda::Permission', {
      SourceArn: {
        "Fn::Join": [
          "",
          [
          "arn:",
          { Ref: "AWS::Partition" },
          ":execute-api:",
          { Ref: "AWS::Region" },
          ":",
          { Ref: "AWS::AccountId" },
          ":",
          { Ref: "apiC8550315" },
          "/test-invoke-stage/GET/"
          ]
        ]
      }
    })));

    test.done();
  },

  '"proxy" can be used to disable proxy mode'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Handler', {
      runtime: lambda.Runtime.NODEJS_8_10,
      code: lambda.Code.fromInline('foo'),
      handler: 'index.handler'
    });

    const api = new apigateway.RestApi(stack, 'api');

    // WHEN
    const integ = new apigateway.LambdaIntegration(fn, { proxy: false });
    api.root.addMethod('GET', integ);

    // THEN
    expect(stack).to(haveResourceLike('AWS::ApiGateway::Method', {
      Integration: {
        Type: 'AWS'
      }
    }));

    test.done();
  },

  'when "ANY" is used, lambda permission will include "*" for method'(test: Test) {
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api');

    const handler = new lambda.Function(stack, 'MyFunc', {
      runtime: lambda.Runtime.NODEJS_8_10,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`loo`)
    });

    const target = new apigateway.LambdaIntegration(handler);

    api.root.addMethod('ANY', target);

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      SourceArn: {
        "Fn::Join": [
          "",
          [
          "arn:",
          { Ref: "AWS::Partition" },
          ":execute-api:",
          { Ref: "AWS::Region" },
          ":",
          { Ref: "AWS::AccountId" },
          ":",
          { Ref: "testapiD6451F70" },
          "/test-invoke-stage/*/"
          ]
        ]
        }
    }));

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      SourceArn: {
        "Fn::Join": [
          "",
          [
            "arn:",
            {
              Ref: "AWS::Partition"
            },
            ":execute-api:",
            {
              Ref: "AWS::Region"
            },
            ":",
            {
              Ref: "AWS::AccountId"
            },
            ":",
            {
              Ref: "testapiD6451F70"
            },
            "/",
            { Ref: "testapiDeploymentStageprod5C9E92A4" },
            "/*/"
          ]
        ]
      }
    }));

    test.done();
  },

  'async proxy'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api');
    const handler = new lambda.Function(stack, 'handler', {
      handler: 'index.handler',
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_8_10,
    });

    // WHEN
    const integ = new apigateway.LambdaIntegration(handler, { asyncProxy: true });
    api.root.addMethod('POST', integ);

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
                Ref: 'AWS::Partition'
              },
              ':apigateway:',
              {
                Ref: 'AWS::Region'
              },
              ':lambda:path/2015-03-31/functions/',
              {
                'Fn::GetAtt': [
                  'AsyncProxy9d748b003bcb4d8d9ff1906c16a98164AA3C2064',
                  'Arn'
                ]
              },
              '/invocations'
            ]
          ]
        }
      }
    }));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'handlerE1533BD5',
                'Arn'
              ]
            }
          }
        ],
        Version: '2012-10-17'
      },
    }));

    test.done();
  },

  'cannot use async proxy with proxy set to false'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const handler = new lambda.Function(stack, 'handler', {
      handler: 'index.handler',
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_8_10,
    });

    // THEN
    test.throws(() => new apigateway.LambdaIntegration(handler, {
      asyncProxy: true,
      proxy: false,
    }), /Cannot use `asyncProxy` when `proxy` is set to `false`/);
    test.done();
  },
};

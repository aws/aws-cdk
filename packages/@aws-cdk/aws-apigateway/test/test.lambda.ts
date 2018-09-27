import { expect, haveResource, not } from '@aws-cdk/assert';
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import apigateway = require('../lib');

export = {
  'minimal setup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api');
    const handler = new lambda.Function(stack, 'Handler', {
      runtime: lambda.Runtime.Python27,
      handler: 'boom',
      code: lambda.Code.inline('foo')
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
            "arn",
            ":",
            {
            Ref: "AWS::Partition"
            },
            ":",
            "apigateway",
            ":",
            {
            Ref: "AWS::Region"
            },
            ":",
            "lambda",
            ":",
            "path",
            "/",
            {
            "Fn::Join": [
              "",
              [
              "2015-03-31/functions/",
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
      runtime: lambda.Runtime.NodeJS610,
      code: lambda.Code.inline('foo'),
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
          "arn", ":", { Ref: "AWS::Partition" }, ":", "execute-api", ":", { Ref: "AWS::Region" }, ":", { Ref: "AWS::AccountId" }, ":",
          { Ref: "apiC8550315" }, "/", { "Fn::Join": [ "", [ { Ref: "apiDeploymentStageprod896C8101" }, "/GET/" ] ] }
          ]
        ]
      }
    }));

    expect(stack).to(not(haveResource('AWS::Lambda::Permission', {
      SourceArn: {
        "Fn::Join": [
          "",
          [
          "arn",
          ":",
          { Ref: "AWS::Partition" },
          ":",
          "execute-api",
          ":",
          { Ref: "AWS::Region" },
          ":",
          { Ref: "AWS::AccountId" },
          ":",
          { Ref: "apiC8550315" },
          "/",
          "test-invoke-stage/GET/"
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
      runtime: lambda.Runtime.NodeJS610,
      code: lambda.Code.inline('foo'),
      handler: 'index.handler'
    });

    const api = new apigateway.RestApi(stack, 'api');

    // WHEN
    const integ = new apigateway.LambdaIntegration(fn, { proxy: false });
    api.root.addMethod('GET', integ);

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
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
      runtime: lambda.Runtime.NodeJS610,
      handler: 'index.handler',
      code: lambda.Code.inline(``)
    });

    const target = new apigateway.LambdaIntegration(handler);

    api.root.addMethod('ANY', target);

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      SourceArn: {
        "Fn::Join": [
          "",
          [
          "arn", ":",
          { Ref: "AWS::Partition" },
          ":",
          "execute-api",
          ":",
          { Ref: "AWS::Region" },
          ":",
          { Ref: "AWS::AccountId" },
          ":",
          { Ref: "testapiD6451F70" },
          "/",
          "test-invoke-stage/*/"
          ]
        ]
        }
    }));

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      SourceArn: {
        "Fn::Join": [
          "",
          [
          "arn",
          ":",
          {
            Ref: "AWS::Partition"
          },
          ":",
          "execute-api",
          ":",
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
          {
            "Fn::Join": [
            "",
            [
              {
              Ref: "testapiDeploymentStageprod5C9E92A4"
              },
              "/*/"
            ]
            ]
          }
          ]
        ]
      }
    }));

    test.done();
  }
};

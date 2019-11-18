import { expect, haveResource } from '@aws-cdk/assert';
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import apigw = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'LambdaRestApi defines a REST API with Lambda proxy integration'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const handler = new lambda.Function(stack, 'handler', {
      handler: 'index.handler',
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // WHEN
    const api = new apigw.LambdaRestApi(stack, 'lambda-rest-api', { handler });

    // THEN -- can't customize further
    test.throws(() => {
      api.root.addResource('cant-touch-this');
    });

    // THEN -- template proxies everything
    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      "PathPart": "{proxy+}"
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      "HttpMethod": "ANY",
      "ResourceId": {
        "Ref": "lambdarestapiproxyE3AE07E3"
      },
      "RestApiId": {
        "Ref": "lambdarestapiAAD10924"
      },
      "AuthorizationType": "NONE",
      "Integration": {
        "IntegrationHttpMethod": "POST",
        "Type": "AWS_PROXY",
        "Uri": {
          "Fn::Join": [
            "",
            [
              "arn:",
              {
                "Ref": "AWS::Partition"
              },
              ":apigateway:",
              {
                "Ref": "AWS::Region"
              },
              ":lambda:path/2015-03-31/functions/",
              {
                "Fn::GetAtt": [
                  "handlerE1533BD5",
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

  'LambdaRestApi supports function Alias'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const handler = new lambda.Function(stack, 'handler', {
      handler: 'index.handler',
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_10_X,
    });
    const alias = new lambda.Alias(stack, 'alias', {
      aliasName: 'my-alias',
      version: new lambda.Version(stack, 'version', {
        lambda: handler
      })
    });

    // WHEN
    const api = new apigw.LambdaRestApi(stack, 'lambda-rest-api', { handler: alias });

    // THEN -- can't customize further
    test.throws(() => {
      api.root.addResource('cant-touch-this');
    });

    // THEN -- template proxies everything
    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      "PathPart": "{proxy+}"
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      "HttpMethod": "ANY",
      "ResourceId": {
        "Ref": "lambdarestapiproxyE3AE07E3"
      },
      "RestApiId": {
        "Ref": "lambdarestapiAAD10924"
      },
      "AuthorizationType": "NONE",
      "Integration": {
        "IntegrationHttpMethod": "POST",
        "Type": "AWS_PROXY",
        "Uri": {
          "Fn::Join": [
            "",
            [
              "arn:",
              {
                "Ref": "AWS::Partition"
              },
              ":apigateway:",
              {
                "Ref": "AWS::Region"
              },
              ":lambda:path/2015-03-31/functions/",
              {
                "Ref": "alias68BF17F5"
              },
              "/invocations"
            ]
          ]
        }
      }
    }));

    test.done();
  },

  'when "proxy" is set to false, users need to define the model'(test: Test) {
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
    expect(stack).notTo(haveResource('AWS::ApiGateway::Resource', {
      "PathPart": "{proxy+}"
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      PathPart: 'tasks'
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: { Ref: 'lambdarestapitasks224418C8' }
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      ResourceId: { Ref: 'lambdarestapitasks224418C8' }
    }));

    test.done();
  },

  'fails if options.defaultIntegration is also set'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const handler = new lambda.Function(stack, 'handler', {
      handler: 'index.handler',
      code: lambda.Code.fromInline('boom'),
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    test.throws(() => new apigw.LambdaRestApi(stack, 'lambda-rest-api', {
      handler,
      options: { defaultIntegration: new apigw.HttpIntegration('https://foo/bar') }
    }), /Cannot specify \"defaultIntegration\" since Lambda integration is automatically defined/);

    test.throws(() => new apigw.LambdaRestApi(stack, 'lambda-rest-api', {
      handler,
      defaultIntegration: new apigw.HttpIntegration('https://foo/bar')
    }), /Cannot specify \"defaultIntegration\" since Lambda integration is automatically defined/);

    test.done();
  },
};

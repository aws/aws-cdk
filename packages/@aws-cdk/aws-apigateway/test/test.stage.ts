import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import apigateway = require('../lib');

export = {
  'minimal setup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
    api.root.addMethod('GET');

    // WHEN
    new apigateway.Stage(stack, 'my-stage', { deployment });

    // THEN
    expect(stack).toMatch({
      Resources: {
        testapiD6451F70: {
        Type: "AWS::ApiGateway::RestApi",
        Properties: {
          Name: "test-api"
        }
        },
        testapiGETD8DE4ED1: {
        Type: "AWS::ApiGateway::Method",
        Properties: {
          HttpMethod: "GET",
          ResourceId: {
          "Fn::GetAtt": [
            "testapiD6451F70",
            "RootResourceId"
          ]
          },
          RestApiId: {
          Ref: "testapiD6451F70"
          },
          AuthorizationType: "NONE",
          Integration: {
          Type: "MOCK"
          }
        }
        },
        mydeployment71ED3B4B: {
        Type: "AWS::ApiGateway::Deployment",
        Properties: {
          RestApiId: {
          Ref: "testapiD6451F70"
          }
        }
        },
        mystage7483BE9A: {
        Type: "AWS::ApiGateway::Stage",
        Properties: {
          RestApiId: {
          Ref: "testapiD6451F70"
          },
          DeploymentId: {
          Ref: "mydeployment71ED3B4B"
          },
          StageName: "prod"
        }
        }
      }
    });

    test.done();
  },

  'common method settings can be set at the stage level'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
    api.root.addMethod('GET');

    // WHEN
    new apigateway.Stage(stack, 'my-stage', {
      deployment,
      loggingLevel: apigateway.MethodLoggingLevel.Info,
      throttlingRateLimit: 12
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Stage', {
      MethodSettings: [
        {
        HttpMethod: "*",
        LoggingLevel: "INFO",
        ResourcePath: "/*",
        ThrottlingRateLimit: 12,
        }
      ]
    }));

    test.done();
  },

  'custom method settings can be set by their path'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
    api.root.addMethod('GET');

    // WHEN
    new apigateway.Stage(stack, 'my-stage', {
      deployment,
      loggingLevel: apigateway.MethodLoggingLevel.Info,
      throttlingRateLimit: 12,
      methodOptions: {
        '/goo/bar/GET': {
          loggingLevel: apigateway.MethodLoggingLevel.Error,
        }
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Stage', {
      MethodSettings: [
        {
          HttpMethod: "*",
          LoggingLevel: "INFO",
          ResourcePath: "/*",
          ThrottlingRateLimit: 12
        },
        {
          HttpMethod: "GET",
          LoggingLevel: "ERROR",
          ResourcePath: "/~1goo~1bar"
        }
        ]
    }));

    test.done();
  },

  'default "cacheClusterSize" is 0.5 (if cache cluster is enabled)'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
    api.root.addMethod('GET');

    // WHEN
    new apigateway.Stage(stack, 'my-stage', {
      deployment,
      cacheClusterEnabled: true
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Stage', {
      CacheClusterEnabled: true,
      CacheClusterSize: "0.5"
    }));

    test.done();
  },

  'setting "cacheClusterSize" implies "cacheClusterEnabled"'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
    api.root.addMethod('GET');

    // WHEN
    new apigateway.Stage(stack, 'my-stage', {
      deployment,
      cacheClusterSize: '0.5'
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Stage', {
      CacheClusterEnabled: true,
      CacheClusterSize: "0.5"
    }));

    test.done();
  },

  'fails when "cacheClusterEnabled" is "false" and "cacheClusterSize" is set'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
    api.root.addMethod('GET');

    // THEN
    test.throws(() => new apigateway.Stage(stack, 'my-stage', {
      deployment,
      cacheClusterSize: '0.5',
      cacheClusterEnabled: false
    }), /Cannot set "cacheClusterSize" to 0.5 and "cacheClusterEnabled" to "false"/);

    test.done();
  },

  'if "cachingEnabled" in method settings, implicitly enable cache cluster'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
    api.root.addMethod('GET');

    // WHEN
    new apigateway.Stage(stack, 'my-stage', {
      deployment,
      cachingEnabled: true
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Stage', {
      CacheClusterEnabled: true,
      CacheClusterSize: "0.5",
      MethodSettings: [
      {
        CachingEnabled: true,
        HttpMethod: "*",
        ResourcePath: "/*"
      }
      ],
      StageName: "prod"
    }));

    test.done();
  },

  'if caching cluster is explicitly disabled, do not auto-enable cache cluster when "cachingEnabled" is set in method options'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
    api.root.addMethod('GET');

    // THEN
    test.throws(() => new apigateway.Stage(stack, 'my-stage', {
      cacheClusterEnabled: false,
      deployment,
      cachingEnabled: true
    }), /Cannot enable caching for method \/\*\/\* since cache cluster is disabled on stage/);

    test.done();
  },
};

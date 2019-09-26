import { expect, haveResource } from '@aws-cdk/assert';
import { Stack, Duration } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import apigw = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'ProxyResource defines a "{proxy+}" resource with ANY method'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');

    // WHEN
    new apigw.ProxyResource(stack, 'proxy', {
      parent: api.root,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      "ParentId": {
        "Fn::GetAtt": [
          "apiC8550315",
          "RootResourceId"
        ]
      },
      "PathPart": "{proxy+}",
      "RestApiId": {
        "Ref": "apiC8550315"
      }
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      "HttpMethod": "ANY",
      "ResourceId": {
        "Ref": "proxy3A1DA9C7"
      },
      "RestApiId": {
        "Ref": "apiC8550315"
      },
      "AuthorizationType": "NONE",
      "Integration": {
        "Type": "MOCK"
      }
    }));

    test.done();
  },

  'if "anyMethod" is false, then an ANY method will not be defined'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');

    // WHEN
    const proxy = new apigw.ProxyResource(stack, 'proxy', {
      parent: api.root,
      anyMethod: false
    });

    proxy.addMethod('GET');

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Resource'));
    expect(stack).to(haveResource('AWS::ApiGateway::Method', { "HttpMethod": "GET" }));
    expect(stack).notTo(haveResource('AWS::ApiGateway::Method', { "HttpMethod": "ANY" }));

    test.done();
  },

  'addProxy can be used on any resource to attach a proxy from that route'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api', {
      deploy: false,
      cloudWatchRole: false,
    });

    const v2 = api.root.addResource('v2');
    v2.addProxy();

    expect(stack).toMatch({
      "Resources": {
        "apiC8550315": {
          "Type": "AWS::ApiGateway::RestApi",
          "Properties": {
            "Name": "api"
          }
        },
        "apiv25206B108": {
          "Type": "AWS::ApiGateway::Resource",
          "Properties": {
            "ParentId": {
              "Fn::GetAtt": [
                "apiC8550315",
                "RootResourceId"
              ]
            },
            "PathPart": "v2",
            "RestApiId": {
              "Ref": "apiC8550315"
            }
          }
        },
        "apiv2proxyAEA4DAC8": {
          "Type": "AWS::ApiGateway::Resource",
          "Properties": {
            "ParentId": {
              "Ref": "apiv25206B108"
            },
            "PathPart": "{proxy+}",
            "RestApiId": {
              "Ref": "apiC8550315"
            }
          }
        },
        "apiv2proxyANY889F4CE1": {
          "Type": "AWS::ApiGateway::Method",
          "Properties": {
            "HttpMethod": "ANY",
            "ResourceId": {
              "Ref": "apiv2proxyAEA4DAC8"
            },
            "RestApiId": {
              "Ref": "apiC8550315"
            },
            "AuthorizationType": "NONE",
            "Integration": {
              "Type": "MOCK"
            }
          }
        }
      }
    });

    test.done();
  },

  'if proxy is added to root, proxy methods are automatically duplicated (with integration and options)'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    const proxy = api.root.addProxy({
      anyMethod: false
    });
    const deleteInteg = new apigw.MockIntegration({
      requestParameters: {
        foo: 'bar'
      }
    });

    // WHEN
    proxy.addMethod('DELETE', deleteInteg, {
      operationName: 'DeleteMe'
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'DELETE',
      ResourceId: { Ref: 'apiproxy4EA44110' },
      Integration: {
        RequestParameters: { foo: "bar" },
        Type: 'MOCK'
      },
      OperationName: 'DeleteMe'
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'DELETE',
      ResourceId: { "Fn::GetAtt": ["apiC8550315", "RootResourceId"] },
      Integration: {
        RequestParameters: { foo: "bar" },
        Type: 'MOCK'
      },
      OperationName: 'DeleteMe'
    }));

    test.done();
  },

  'getResource': {

    'root resource': {
      'returns undefined if not found'(test: Test) {
        // GIVEN
        const stack = new Stack();
        const api = new apigw.RestApi(stack, 'MyRestApi');

        // THEN
        test.deepEqual(api.root.getResource('boom'), undefined);
        test.done();
      },

      'returns the resource if found'(test: Test) {
        // GIVEN
        const stack = new Stack();
        const api = new apigw.RestApi(stack, 'MyRestApi');

        // WHEN
        const r1 = api.root.addResource('hello');
        const r2 = api.root.addResource('world');

        // THEN
        test.deepEqual(api.root.getResource('hello'), r1);
        test.deepEqual(api.root.getResource('world'), r2);
        test.done();
      },

      'returns the resource even if it was created using "new"'(test: Test) {
        // GIVEN
        const stack = new Stack();
        const api = new apigw.RestApi(stack, 'MyRestApi');

        // WHEN
        const r1 = new apigw.Resource(stack, 'child', {
          parent: api.root,
          pathPart: 'yello'
        });

        // THEN
        test.deepEqual(api.root.getResource('yello'), r1);
        test.done();
      }

    },

    'non-root': {

      'returns undefined if not found'(test: Test) {
        // GIVEN
        const stack = new Stack();
        const api = new apigw.RestApi(stack, 'MyRestApi');
        const res = api.root.addResource('boom');

        // THEN
        test.deepEqual(res.getResource('child-of-boom'), undefined);
        test.done();
      },

      'returns the resource if found'(test: Test) {
        // GIVEN
        const stack = new Stack();
        const api = new apigw.RestApi(stack, 'MyRestApi');
        const child = api.root.addResource('boom');

        // WHEN
        const r1 = child.addResource('hello');
        const r2 = child.addResource('world');

        // THEN
        test.deepEqual(child.getResource('hello'), r1);
        test.deepEqual(child.getResource('world'), r2);
        test.done();
      },

      'returns the resource even if created with "new"'(test: Test) {
        // GIVEN
        const stack = new Stack();
        const api = new apigw.RestApi(stack, 'MyRestApi');
        const child = api.root.addResource('boom');

        // WHEN
        const r1 = child.addResource('hello');

        const r2 = new apigw.Resource(stack, 'world', {
          parent: child,
          pathPart: 'outside-world'
        });

        // THEN
        test.deepEqual(child.getResource('hello'), r1);
        test.deepEqual(child.getResource('outside-world'), r2);
        test.done();

      }
    },

    'resourceForPath': {

      'empty path or "/" (on root) returns this'(test: Test) {
        // GIVEN
        const stack = new Stack();
        const api = new apigw.RestApi(stack, 'MyRestApi');

        // THEN
        test.deepEqual(api.root.resourceForPath(''), api.root);
        test.deepEqual(api.root.resourceForPath('/'), api.root);
        test.deepEqual(api.root.resourceForPath('///'), api.root);
        test.done();
      },

      'returns a resource for that path'(test: Test) {
        // GIVEN
        const stack = new Stack();
        const api = new apigw.RestApi(stack, 'MyRestApi');

        // WHEN
        const resource = api.root.resourceForPath('/boom/trach');

        // THEN
        test.deepEqual(resource.path, '/boom/trach');
        test.done();
      },

      'resources not created if not needed'(test: Test) {
        // GIVEN
        const stack = new Stack();
        const api = new apigw.RestApi(stack, 'MyRestApi');

        // WHEN
        const trach = api.root.resourceForPath('/boom/trach');
        const bam1 = api.root.resourceForPath('/boom/bam');

        // THEN
        const parent = api.root.getResource('boom');
        test.ok(parent);
        test.deepEqual(parent!.path, '/boom');

        test.same(trach.parentResource, parent);
        test.deepEqual(trach.parentResource!.path, '/boom');

        const bam2 = api.root.resourceForPath('/boom/bam');
        test.same(bam1, bam2);
        test.deepEqual(bam1.parentResource!.path, '/boom');
        test.done();
      }

    }
  },

  'addCorsPreflight': {

    'adds an OPTIONS method to a resource'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'api');
      const resource = api.root.addResource('MyResource');

      // WHEN
      resource.addCorsPreflight({
        allowOrigins: ['https://amazon.com']
      });

      // THEN
      expect(stack).to(haveResource('AWS::ApiGateway::Method', {
        HttpMethod: 'OPTIONS',
        ResourceId: { Ref: 'apiMyResourceD5CDB490' },
        Integration: {
          "IntegrationResponses": [
            {
              "ResponseParameters": {
                "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                "method.response.header.Access-Control-Allow-Origin": "'https://amazon.com'",
                "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'"
              },
              "StatusCode": "204"
            }
          ],
          "RequestTemplates": {
            "application/json": "{ statusCode: 200 }"
          },
          "Type": "MOCK"
        },
        MethodResponses: [
          {
            "ResponseParameters": {
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Origin": true,
              "method.response.header.Access-Control-Allow-Methods": true
            },
            "StatusCode": "204"
          }
        ]
      }));
      test.done();
    },

    'allowCredentials'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'api');
      const resource = api.root.addResource('MyResource');

      // WHEN
      resource.addCorsPreflight({
        allowOrigins: ['https://amazon.com'],
        allowCredentials: true
      });

      // THEN
      expect(stack).to(haveResource('AWS::ApiGateway::Method', {
        HttpMethod: 'OPTIONS',
        ResourceId: { Ref: 'apiMyResourceD5CDB490' },
        Integration: {
          "IntegrationResponses": [
            {
              "ResponseParameters": {
                "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                "method.response.header.Access-Control-Allow-Origin": "'https://amazon.com'",
                "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
                "method.response.header.Access-Control-Allow-Credentials": "'true'"
              },
              "StatusCode": "204"
            }
          ],
          "RequestTemplates": {
            "application/json": "{ statusCode: 200 }"
          },
          "Type": "MOCK"
        },
        MethodResponses: [
          {
            "ResponseParameters": {
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Origin": true,
              "method.response.header.Access-Control-Allow-Methods": true,
              "method.response.header.Access-Control-Allow-Credentials": true
            },
            "StatusCode": "204"
          }
        ]
      }));
      test.done();
    },

    'allowMethods'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'api');
      const resource = api.root.addResource('MyResource');

      // WHEN
      resource.addCorsPreflight({
        allowOrigins: ['https://aws.amazon.com'],
        allowMethods: ['GET', 'PUT']
      });

      // THEN
      expect(stack).to(haveResource('AWS::ApiGateway::Method', {
        HttpMethod: 'OPTIONS',
        ResourceId: { Ref: 'apiMyResourceD5CDB490' },
        Integration: {
          "IntegrationResponses": [
            {
              "ResponseParameters": {
                "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                "method.response.header.Access-Control-Allow-Origin": "'https://aws.amazon.com'",
                "method.response.header.Access-Control-Allow-Methods": "'GET,PUT'",
              },
              "StatusCode": "204"
            }
          ],
          "RequestTemplates": {
            "application/json": "{ statusCode: 200 }"
          },
          "Type": "MOCK"
        },
        MethodResponses: [
          {
            "ResponseParameters": {
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Origin": true,
              "method.response.header.Access-Control-Allow-Methods": true,
            },
            "StatusCode": "204"
          }
        ]
      }));
      test.done();
    },

    'allowMethods ANY will expand to all supported methods'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'api');
      const resource = api.root.addResource('MyResource');

      // WHEN
      resource.addCorsPreflight({
        allowOrigins: ['https://aws.amazon.com'],
        allowMethods: ['ANY']
      });

      // THEN
      expect(stack).to(haveResource('AWS::ApiGateway::Method', {
        HttpMethod: 'OPTIONS',
        ResourceId: { Ref: 'apiMyResourceD5CDB490' },
        Integration: {
          "IntegrationResponses": [
            {
              "ResponseParameters": {
                "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                "method.response.header.Access-Control-Allow-Origin": "'https://aws.amazon.com'",
                "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
              },
              "StatusCode": "204"
            }
          ],
          "RequestTemplates": {
            "application/json": "{ statusCode: 200 }"
          },
          "Type": "MOCK"
        },
        MethodResponses: [
          {
            "ResponseParameters": {
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Origin": true,
              "method.response.header.Access-Control-Allow-Methods": true,
            },
            "StatusCode": "204"
          }
        ]
      }));
      test.done();
    },

    'allowMethods ANY cannot be used with any other method'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'api');
      const resource = api.root.addResource('MyResource');

      // THEN
      test.throws(() => resource.addCorsPreflight({
        allowOrigins: ['https://aws.amazon.com'],
        allowMethods: ['ANY', 'PUT']
      }), /ANY cannot be used with any other method. Received: ANY,PUT/);

      test.done();
    },

    'statusCode can be used to set the response status code'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'api');
      const resource = api.root.addResource('MyResource');

      // WHEN
      resource.addCorsPreflight({
        allowOrigins: ['https://aws.amazon.com'],
        statusCode: 200
      });

      // THEN
      expect(stack).to(haveResource('AWS::ApiGateway::Method', {
        HttpMethod: 'OPTIONS',
        ResourceId: { Ref: 'apiMyResourceD5CDB490' },
        Integration: {
          "IntegrationResponses": [
            {
              "ResponseParameters": {
                "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                "method.response.header.Access-Control-Allow-Origin": "'https://aws.amazon.com'",
                "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
              },
              "StatusCode": "200"
            }
          ],
          "RequestTemplates": {
            "application/json": "{ statusCode: 200 }"
          },
          "Type": "MOCK"
        },
        MethodResponses: [
          {
            "ResponseParameters": {
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Origin": true,
              "method.response.header.Access-Control-Allow-Methods": true,
            },
            "StatusCode": "200"
          }
        ]
      }));
      test.done();
    },

    'allowOrigins must contain at least one origin'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'api');
      const resource = api.root.addResource('MyResource');

      // WHEN
      test.throws(() => resource.addCorsPreflight({
        allowOrigins: []
      }), /allowOrigins must contain at least one origin/);

      test.done();
    },

    'allowOrigins can be used to specify multiple origins'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'api');
      const resource = api.root.addResource('MyResource');

      // WHEN
      resource.addCorsPreflight({
        allowOrigins: ['https://twitch.tv', 'https://amazon.com', 'https://aws.amazon.com']
      });

      // THEN
      expect(stack).to(haveResource('AWS::ApiGateway::Method', {
        HttpMethod: 'OPTIONS',
        ResourceId: { Ref: 'apiMyResourceD5CDB490' },
        Integration: {
          "IntegrationResponses": [
            {
              "ResponseParameters": {
                "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                "method.response.header.Access-Control-Allow-Origin": "'https://twitch.tv'",
                "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'"
              },
              "ResponseTemplates": {
                "application/json": "#set($origin = $input.params(\"Origin\"))\n#if($origin == \"\") #set($origin = $input.params(\"origin\")) #end\n#if($origin.matches(\"https://amazon.com\") || $origin.matches(\"https://aws.amazon.com\"))\n  #set($context.responseOverride.header.Access-Control-Allow-Origin = $origin)\n#end"
              },
              "StatusCode": "204"
            }
          ],
          "RequestTemplates": {
            "application/json": "{ statusCode: 200 }"
          },
          "Type": "MOCK"
        },
        MethodResponses: [
          {
            "ResponseParameters": {
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Origin": true,
              "method.response.header.Access-Control-Allow-Methods": true
            },
            "StatusCode": "204"
          }
        ]
      }));
      test.done();
    },

    'maxAge can be used to specify Access-Control-Max-Age'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'api');
      const resource = api.root.addResource('MyResource');

      // WHEN
      resource.addCorsPreflight({
        allowOrigins: ['https://amazon.com'],
        maxAge: Duration.minutes(60)
      });

      // THEN
      expect(stack).to(haveResource('AWS::ApiGateway::Method', {
        HttpMethod: 'OPTIONS',
        ResourceId: { Ref: 'apiMyResourceD5CDB490' },
        Integration: {
          "IntegrationResponses": [
            {
              "ResponseParameters": {
                "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                "method.response.header.Access-Control-Allow-Origin": "'https://amazon.com'",
                "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
                "method.response.header.Access-Control-Max-Age": `'${60 * 60}'`
              },
              "StatusCode": "204"
            }
          ],
          "RequestTemplates": {
            "application/json": "{ statusCode: 200 }"
          },
          "Type": "MOCK"
        },
        MethodResponses: [
          {
            "ResponseParameters": {
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Origin": true,
              "method.response.header.Access-Control-Allow-Methods": true,
              "method.response.header.Access-Control-Max-Age": true
            },
            "StatusCode": "204"
          }
        ]
      }));
      test.done();
    },

    'disableCache will set Max-Age to -1'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'api');
      const resource = api.root.addResource('MyResource');

      // WHEN
      resource.addCorsPreflight({
        allowOrigins: ['https://amazon.com'],
        disableCache: true
      });

      // THEN
      expect(stack).to(haveResource('AWS::ApiGateway::Method', {
        HttpMethod: 'OPTIONS',
        ResourceId: { Ref: 'apiMyResourceD5CDB490' },
        Integration: {
          "IntegrationResponses": [
            {
              "ResponseParameters": {
                "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                "method.response.header.Access-Control-Allow-Origin": "'https://amazon.com'",
                "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
                "method.response.header.Access-Control-Max-Age": `'-1'`
              },
              "StatusCode": "204"
            }
          ],
          "RequestTemplates": {
            "application/json": "{ statusCode: 200 }"
          },
          "Type": "MOCK"
        },
        MethodResponses: [
          {
            "ResponseParameters": {
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Origin": true,
              "method.response.header.Access-Control-Allow-Methods": true,
              "method.response.header.Access-Control-Max-Age": true
            },
            "StatusCode": "204"
          }
        ]
      }));
      test.done();
    },

    'maxAge and disableCache are mutually exclusive'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'api');
      const resource = api.root.addResource('MyResource');

      // THEN
      test.throws(() => resource.addCorsPreflight({
        allowOrigins: ['https://amazon.com'],
        disableCache: true,
        maxAge: Duration.seconds(10)
      }), /The options "maxAge" and "disableCache" are mutually exclusive/);

      test.done();
    }
  }
};

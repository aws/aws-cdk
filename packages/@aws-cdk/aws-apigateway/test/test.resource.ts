import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import apigw = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'ProxyResource defines a "{proxy+}" resource with ANY method'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
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
    const stack = new cdk.Stack();
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
    const stack = new cdk.Stack();
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
      ResourceId: { "Fn::GetAtt": [ "apiC8550315", "RootResourceId" ] },
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
  }
};

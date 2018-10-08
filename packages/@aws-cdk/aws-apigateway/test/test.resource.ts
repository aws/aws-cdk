import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
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
  }
};
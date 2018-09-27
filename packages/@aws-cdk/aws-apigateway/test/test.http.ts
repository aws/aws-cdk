import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import apigateway = require('../lib');

export = {
  'minimal setup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api');

    // WHEN
    const integ = new apigateway.HttpIntegration('http://foo/bar');

    api.root.addMethod('GET', integ);

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      Integration: {
        IntegrationHttpMethod: "GET",
        Type: "HTTP_PROXY",
        Uri: "http://foo/bar"
      }
    }));

    test.done();
  },

  'options can be passed via props'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api');

    // WHEN
    const integ = new apigateway.HttpIntegration('http://foo/bar', {
      httpMethod: 'POST',
      proxy: false,
      options: {
        cacheNamespace: 'hey'
      }
    });

    api.root.addMethod('GET', integ);

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      Integration: {
        CacheNamespace: "hey",
        IntegrationHttpMethod: "POST",
        Type: "HTTP",
        Uri: "http://foo/bar"
      }
    }));

    test.done();
  }
};

import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { Test } from "nodeunit";
import apigateway = require('../lib');

export = {
  'default setup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new apigateway.ApiKey(stack, 'my-api-key');

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::ApiKey', undefined, ResourcePart.CompleteDefinition));
    // should have an api key with no props defined.

    test.done();
  },

  'specify props for apiKey'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: true, deployOptions: { stageName: 'test' } });
    api.root.addMethod('GET'); // api must have atleast one method.

    // WHEN
    new apigateway.ApiKey(stack, 'test-api-key', {
      customerId: 'test-customer',
      resources: [api]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::ApiKey', {
      CustomerId: 'test-customer',
      StageKeys: [
        {
          RestApiId: { Ref: "testapiD6451F70" },
          StageName: { Ref: "testapiDeploymentStagetest5869DF71" }
        }
      ]
    }));

    test.done();
  }
};

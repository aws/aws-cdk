import { expect, haveResource, haveResourceLike, ResourcePart } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as apigateway from '../lib';

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
      resources: [api],
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::ApiKey', {
      CustomerId: 'test-customer',
      StageKeys: [
        {
          RestApiId: { Ref: 'testapiD6451F70' },
          StageName: { Ref: 'testapiDeploymentStagetest5869DF71' },
        },
      ],
    }));

    test.done();
  },

  'use an imported api key'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: true, deployOptions: { stageName: 'test' } });
    api.root.addMethod('GET'); // api must have atleast one method.

    // WHEN
    const importedKey = apigateway.ApiKey.fromApiKeyId(stack, 'imported', 'KeyIdabc');
    api.addUsagePlan('plan', {
      apiKey: importedKey,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ApiGateway::UsagePlanKey', {
      KeyId: 'KeyIdabc',
      KeyType: 'API_KEY',
      UsagePlanId: {
        Ref: 'testapiplan1B111AFF',
      },
    }));
    test.done();
  },
};

import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as apigateway from '../lib';

const API_KEY_RESOURCE_TYPE = 'AWS::ApiGateway::ApiKey';
const USAGE_PLAN_RESOURCE_TYPE = 'AWS::ApiGateway::UsagePlan';
const USAGE_PLAN_KEY_RESOURCE_TYPE = 'AWS::ApiGateway::UsagePlanKey';

export = {
  'default setup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api', { cloudWatchRole: false, deploy: false });
    api.root.addMethod('GET'); // Need at least one method on the api

    // WHEN
    new apigateway.RateLimitedApiKey(stack, 'my-api-key');

    // THEN
    // should have an api key with no props defined.
    expect(stack).to(haveResource(API_KEY_RESOURCE_TYPE, undefined, ResourcePart.CompleteDefinition));
    // should not have a usage plan.
    expect(stack).notTo(haveResource(USAGE_PLAN_RESOURCE_TYPE));
    // should not have a usage plan key.
    expect(stack).notTo(haveResource(USAGE_PLAN_KEY_RESOURCE_TYPE));

    test.done();
  },

  'only api key is created when rate limiting properties are not provided'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: true, deployOptions: { stageName: 'test' } });
    api.root.addMethod('GET'); // api must have atleast one method.

    // WHEN
    new apigateway.RateLimitedApiKey(stack, 'test-api-key', {
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
    // should not have a usage plan.
    expect(stack).notTo(haveResource(USAGE_PLAN_RESOURCE_TYPE));
    // should not have a usage plan key.
    expect(stack).notTo(haveResource(USAGE_PLAN_KEY_RESOURCE_TYPE));

    test.done();
  },

  'api key and usage plan are created and linked when rate limiting properties are provided'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: true, deployOptions: { stageName: 'test' } });
    api.root.addMethod('GET'); // api must have atleast one method.

    // WHEN
    new apigateway.RateLimitedApiKey(stack, 'test-api-key', {
      customerId: 'test-customer',
      resources: [api],
      quota: {
        limit: 10000,
        period: apigateway.Period.MONTH,
      },
    });

    // THEN
    // should have an api key
    expect(stack).to(haveResource('AWS::ApiGateway::ApiKey', {
      CustomerId: 'test-customer',
      StageKeys: [
        {
          RestApiId: { Ref: 'testapiD6451F70' },
          StageName: { Ref: 'testapiDeploymentStagetest5869DF71' },
        },
      ],
    }));
    // should have a usage plan with specified quota.
    expect(stack).to(haveResource(USAGE_PLAN_RESOURCE_TYPE, {
      Quota: {
        Limit: 10000,
        Period: 'MONTH',
      },
    }, ResourcePart.Properties));
    // should have a usage plan key linking the api key and usage plan
    expect(stack).to(haveResource(USAGE_PLAN_KEY_RESOURCE_TYPE, {
      KeyId: {
        Ref: 'testapikey998028B6',
      },
      KeyType: 'API_KEY',
      UsagePlanId: {
        Ref: 'testapikeyUsagePlanResource66DB63D6',
      },
    }, ResourcePart.Properties));

    test.done();
  },
};
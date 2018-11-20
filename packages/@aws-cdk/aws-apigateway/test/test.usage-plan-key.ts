import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import apigateway = require('../lib');

const RESOURCE_TYPE = 'AWS::ApiGateway::UsagePlanKey';

export = {
  'default setup'(test: Test) {
    const stack = new cdk.Stack();
    const usagePlan: apigateway.UsagePlan = new apigateway.UsagePlan(stack, 'my-usage-plan', {
      name: 'Basic',
    });
    const apiKey: apigateway.ApiKey = new apigateway.ApiKey(stack, 'my-api-key');

    new apigateway.UsagePlanKey(stack, 'my-usage-plan-key', {
      apiKey,
      usagePlan
    });

    expect(stack).to(haveResource(RESOURCE_TYPE, {
      KeyId: {
        Ref: 'myapikey1B052F70'
      },
      KeyType: 'API_KEY',
      UsagePlanId: {
        Ref: 'myusageplan23AA1E32'
      }
    }, ResourcePart.Properties));

    test.done();
  }
};

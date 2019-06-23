import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { Test } from "nodeunit";
import apigateway = require('../lib');

const RESOURCE_TYPE = 'AWS::ApiGateway::UsagePlan';
export = {
  'default setup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api', { cloudWatchRole: false, deploy: false });
    api.root.addMethod('GET'); // Need at least one method on the api
    const usagePlanName = 'Pro';
    const usagePlanDescription = 'Pro Usage Plan with no throttling limits';

    // WHEN
    new apigateway.UsagePlan(stack, 'my-usage-plan', {
      name: usagePlanName,
      description: usagePlanDescription
    });

    // THEN
    expect(stack).to(haveResource(RESOURCE_TYPE, {
      UsagePlanName: usagePlanName,
      Description: usagePlanDescription
    }, ResourcePart.Properties));

    test.done();
  },

  'usage plan with throttling limits'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api', { cloudWatchRole: false, deploy: true, deployOptions: { stageName: 'test' } });
    const method: apigateway.Method = api.root.addMethod('GET'); // Need at least one method on the api
    const usagePlanName = 'Basic';
    const usagePlanDescription = 'Basic Usage Plan with no throttling limits';

    // WHEN
    new apigateway.UsagePlan(stack, 'my-usage-plan', {
      name: usagePlanName,
      description: usagePlanDescription,
      apiStages: [
        {
          stage: api.deploymentStage,
          throttle: [
            {
              method,
              throttle: {
                burstLimit: 20,
                rateLimit: 10
              }
            }
          ]
        }
      ]
    });

    // THEN
    expect(stack).to(haveResource(RESOURCE_TYPE, {
      UsagePlanName: usagePlanName,
      Description: usagePlanDescription,
      ApiStages: [
        {
          ApiId: {
            Ref: 'myapi4C7BF186'
          },
          Stage: {
            Ref: 'myapiDeploymentStagetest4A4AB65E'
          },
          Throttle: {
            '//GET': {
              BurstLimit: 20,
              RateLimit: 10
            }
          }
        }
      ]
    }, ResourcePart.Properties));

    test.done();

  },

  'usage plan with quota limits'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new apigateway.UsagePlan(stack, 'my-usage-plan', {
      quota: {
        limit: 10000,
        period: apigateway.Period.MONTH
      }
    });

    // THEN
    expect(stack).to(haveResource(RESOURCE_TYPE, {
      Quota: {
        Limit: 10000,
        Period: 'MONTH'
      }
    }, ResourcePart.Properties));

    test.done();

  },

  'UsagePlanKey'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const usagePlan: apigateway.UsagePlan = new apigateway.UsagePlan(stack, 'my-usage-plan', {
      name: 'Basic',
    });
    const apiKey: apigateway.ApiKey = new apigateway.ApiKey(stack, 'my-api-key');

    // WHEN
    usagePlan.addApiKey(apiKey);

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::UsagePlanKey', {
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

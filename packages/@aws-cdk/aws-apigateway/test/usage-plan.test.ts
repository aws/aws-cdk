import { Template } from '@aws-cdk/assertions';
import { testFutureBehavior } from '@aws-cdk/cdk-build-tools/lib/feature-flag';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as apigateway from '../lib';

const RESOURCE_TYPE = 'AWS::ApiGateway::UsagePlan';
describe('usage plan', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api', { cloudWatchRole: false, deploy: false });
    api.root.addMethod('GET'); // Need at least one method on the api
    const usagePlanName = 'Pro';
    const usagePlanDescription = 'Pro Usage Plan with no throttling limits';

    // WHEN
    new apigateway.UsagePlan(stack, 'my-usage-plan', {
      name: usagePlanName,
      description: usagePlanDescription,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(RESOURCE_TYPE, {
      UsagePlanName: usagePlanName,
      Description: usagePlanDescription,
    });
  });

  test('usage plan with integer throttling limits', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api', { cloudWatchRole: false, deploy: true, deployOptions: { stageName: 'test' } });
    const method: apigateway.Method = api.root.addMethod('GET'); // Need at least one method on the api
    const usagePlanName = 'Basic';
    const usagePlanDescription = 'Basic Usage Plan with integer throttling limits';

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
                rateLimit: 10,
              },
            },
          ],
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(RESOURCE_TYPE, {
      UsagePlanName: usagePlanName,
      Description: usagePlanDescription,
      ApiStages: [
        {
          ApiId: {
            Ref: 'myapi4C7BF186',
          },
          Stage: {
            Ref: 'myapiDeploymentStagetest4A4AB65E',
          },
          Throttle: {
            '//GET': {
              BurstLimit: 20,
              RateLimit: 10,
            },
          },
        },
      ],
    });
  });

  test('usage plan with integer and float throttling limits', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api', { cloudWatchRole: false, deploy: true, deployOptions: { stageName: 'test' } });
    const method: apigateway.Method = api.root.addMethod('GET'); // Need at least one method on the api
    const usagePlanName = 'Basic';
    const usagePlanDescription = 'Basic Usage Plan with integer and float throttling limits';

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
                rateLimit: 10.5,
              },
            },
          ],
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(RESOURCE_TYPE, {
      UsagePlanName: usagePlanName,
      Description: usagePlanDescription,
      ApiStages: [
        {
          ApiId: {
            Ref: 'myapi4C7BF186',
          },
          Stage: {
            Ref: 'myapiDeploymentStagetest4A4AB65E',
          },
          Throttle: {
            '//GET': {
              BurstLimit: 20,
              RateLimit: 10.5,
            },
          },
        },
      ],
    });
  });

  test('usage plan with blocked methods', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'my-api', { cloudWatchRole: false, deploy: true, deployOptions: { stageName: 'test' } });
    const method: apigateway.Method = api.root.addMethod('GET'); // Need at least one method on the api
    const usagePlanName = 'Basic';
    const usagePlanDescription = 'Basic Usage Plan with throttling limits';

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
                burstLimit: 0,
                rateLimit: 0,
              },
            },
          ],
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(RESOURCE_TYPE, {
      UsagePlanName: usagePlanName,
      Description: usagePlanDescription,
      ApiStages: [
        {
          ApiId: {
            Ref: 'myapi4C7BF186',
          },
          Stage: {
            Ref: 'myapiDeploymentStagetest4A4AB65E',
          },
          Throttle: {
            '//GET': {
              BurstLimit: 0,
              RateLimit: 0,
            },
          },
        },
      ],
    });
  });

  test('usage plan with quota limits', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new apigateway.UsagePlan(stack, 'my-usage-plan', {
      quota: {
        limit: 10000,
        period: apigateway.Period.MONTH,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(RESOURCE_TYPE, {
      Quota: {
        Limit: 10000,
        Period: 'MONTH',
      },
    });
  });

  describe('UsagePlanKey', () => {

    test('default', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const usagePlan: apigateway.UsagePlan = new apigateway.UsagePlan(stack, 'my-usage-plan', {
        name: 'Basic',
      });
      const apiKey: apigateway.ApiKey = new apigateway.ApiKey(stack, 'my-api-key');

      // WHEN
      usagePlan.addApiKey(apiKey);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::UsagePlanKey', {
        KeyId: {
          Ref: 'myapikey1B052F70',
        },
        KeyType: 'API_KEY',
        UsagePlanId: {
          Ref: 'myusageplan23AA1E32',
        },
      });
    });


    test('imported', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const usagePlan: apigateway.IUsagePlan = apigateway.UsagePlan.fromUsagePlanId(stack, 'my-usage-plan', 'imported-id');
      const apiKey: apigateway.ApiKey = new apigateway.ApiKey(stack, 'my-api-key');

      // WHEN
      usagePlan.addApiKey(apiKey);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::UsagePlanKey', {
        KeyId: {
          Ref: 'myapikey1B052F70',
        },
        KeyType: 'API_KEY',
        UsagePlanId: 'imported-id',
      });
    });

    test('multiple keys', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const usagePlan = new apigateway.UsagePlan(stack, 'my-usage-plan');
      const apiKey1 = new apigateway.ApiKey(stack, 'my-api-key-1', {
        apiKeyName: 'my-api-key-1',
      });
      const apiKey2 = new apigateway.ApiKey(stack, 'my-api-key-2', {
        apiKeyName: 'my-api-key-2',
      });

      // WHEN
      usagePlan.addApiKey(apiKey1);
      usagePlan.addApiKey(apiKey2);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
        Name: 'my-api-key-1',
      });
      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
        Name: 'my-api-key-2',
      });
      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::UsagePlanKey', {
        KeyId: {
          Ref: 'myapikey11F723FC7',
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::UsagePlanKey', {
        KeyId: {
          Ref: 'myapikey2ABDEF012',
        },
      });
    });

    test('overrideLogicalId', () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app);
      const usagePlan: apigateway.UsagePlan = new apigateway.UsagePlan(stack, 'my-usage-plan', { name: 'Basic' });
      const apiKey: apigateway.ApiKey = new apigateway.ApiKey(stack, 'my-api-key');

      // WHEN
      usagePlan.addApiKey(apiKey, { overrideLogicalId: 'mylogicalid' });

      // THEN
      const template = app.synth().getStackByName(stack.stackName).template;
      const logicalIds = Object.entries(template.Resources)
        .filter(([_, v]) => (v as any).Type === 'AWS::ApiGateway::UsagePlanKey')
        .map(([k, _]) => k);
      expect(logicalIds).toEqual(['mylogicalid']);
    });

    describe('future flag: @aws-cdk/aws-apigateway:usagePlanKeyOrderInsensitiveId', () => {
      const flags = { [cxapi.APIGATEWAY_USAGEPLANKEY_ORDERINSENSITIVE_ID]: true };

      testFutureBehavior('UsagePlanKeys have unique logical ids', flags, cdk.App, (app) => {
        // GIVEN
        const stack = new cdk.Stack(app, 'my-stack');
        const usagePlan = new apigateway.UsagePlan(stack, 'my-usage-plan');
        const apiKey1 = new apigateway.ApiKey(stack, 'my-api-key-1', {
          apiKeyName: 'my-api-key-1',
        });
        const apiKey2 = new apigateway.ApiKey(stack, 'my-api-key-2', {
          apiKeyName: 'my-api-key-2',
        });

        // WHEN
        usagePlan.addApiKey(apiKey1);
        usagePlan.addApiKey(apiKey2);

        // THEN
        const template = app.synth().getStackByName(stack.stackName).template;
        const logicalIds = Object.entries(template.Resources)
          .filter(([_, v]) => (v as any).Type === 'AWS::ApiGateway::UsagePlanKey')
          .map(([k, _]) => k);

        expect(logicalIds).toEqual([
          'myusageplanUsagePlanKeyResourcemystackmyapikey1EE9AA1B359121274',
          'myusageplanUsagePlanKeyResourcemystackmyapikey2B4E8EB1456DC88E9',
        ]);
      });
    });
  });
});

import { Template } from '../../../assertions';
import * as cdk from '../../../core';
import {
  ApiKey, IUsagePlan,
  Period,
  UsagePlan,
  WebSocketApi,
  WebSocketStage,
} from '../../lib';

const RESOURCE_TYPE = 'AWS::ApiGateway::UsagePlan';
describe('usage plan', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const usagePlanName = 'Pro';
    const usagePlanDescription = 'Pro Usage Plan with no throttling limits';

    // WHEN
    new UsagePlan(stack, 'my-usage-plan', {
      usagePlanName: usagePlanName,
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
    const api = new WebSocketApi(stack, 'my-api');
    const stage = new WebSocketStage(stack, 'Stage', {
      webSocketApi: api,
      stageName: 'dev',
    });
    const usagePlanName = 'Basic';
    const usagePlanDescription = 'Basic Usage Plan with integer throttling limits';

    // WHEN
    new UsagePlan(stack, 'my-usage-plan', {
      usagePlanName: usagePlanName,
      description: usagePlanDescription,
      apiStages: [
        {
          stage: stage,
        },
      ],
      throttle:
        {
          burstLimit: 20,
          rateLimit: 10,
        },
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
          Stage: 'dev',
        },
      ],
      Throttle: {
        BurstLimit: 20,
        RateLimit: 10,
      },
    });
  });

  test('usage plan with integer and float throttling limits', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new WebSocketApi(stack, 'my-api');
    const stage = new WebSocketStage(stack, 'Stage', {
      webSocketApi: api,
      stageName: 'dev',
    });
    const usagePlanName = 'Basic';
    const usagePlanDescription = 'Basic Usage Plan with integer and float throttling limits';

    // WHEN
    new UsagePlan(stack, 'my-usage-plan', {
      usagePlanName: usagePlanName,
      description: usagePlanDescription,
      apiStages: [
        {
          stage: stage,
        },
      ],
      throttle: {
        burstLimit: 20,
        rateLimit: 10.5,
      },
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
          Stage: 'dev',
        },
      ],
      Throttle: {
        BurstLimit: 20,
        RateLimit: 10.5,
      },
    });
  });

  test('usage plan with zero throttling limits', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new WebSocketApi(stack, 'my-api');
    const stage = new WebSocketStage(stack, 'Stage', {
      webSocketApi: api,
      stageName: 'dev',
    });
    const usagePlanName = 'Basic';
    const usagePlanDescription = 'Basic Usage Plan with throttling limits';

    // WHEN
    new UsagePlan(stack, 'my-usage-plan', {
      usagePlanName: usagePlanName,
      description: usagePlanDescription,
      apiStages: [
        {
          stage: stage,
        },
      ],
      throttle: {
        burstLimit: 0,
        rateLimit: 0,
      },
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
          Stage: 'dev',
        },
      ],
      Throttle: {
        BurstLimit: 0,
        RateLimit: 0,
      },
    });
  });

  test('usage plan with quota limits', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new UsagePlan(stack, 'my-usage-plan', {
      quota: {
        limit: 10000,
        period: Period.MONTH,
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

  test('addApiStage adds a new API stage to existing usage plan', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new WebSocketApi(stack, 'my-api');
    const stage = new WebSocketStage(stack, 'Stage', {
      webSocketApi: api,
      stageName: 'dev',
    });
    const usagePlanName = 'Basic';
    const usagePlanDescription = 'Basic Usage Plan with apiStage';

    const usagePlan = new UsagePlan(stack, 'my-usage-plan', {
      usagePlanName: usagePlanName,
      description: usagePlanDescription,
    });

    // WHEN
    usagePlan.addApiStage({
      api: api,
      stage: stage,
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
          Stage: 'dev',
        },
      ],
    });
  });

  test('addApiStage adds multiple API stages', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api1 = new WebSocketApi(stack, 'my-api1');
    const api2 = new WebSocketApi(stack, 'my-api2');

    const stage1 = new WebSocketStage(stack, 'stage1', {
      webSocketApi: api1,
      stageName: 'dev',
    });

    const stage2 = new WebSocketStage(stack, 'stage2', {
      webSocketApi: api2,
      stageName: 'prod',
    });

    const usagePlanName = 'Basic';

    const usagePlan = new UsagePlan(stack, 'my-usage-plan', {
      usagePlanName: usagePlanName,
    });

    // WHEN
    usagePlan.addApiStage({
      api: api1,
      stage: stage1,
    });

    usagePlan.addApiStage({
      api: api2,
      stage: stage2,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(RESOURCE_TYPE, {
      UsagePlanName: usagePlanName,
      ApiStages: [
        {
          ApiId: {
            Ref: 'myapi166D33951',
          },
          Stage: 'dev',
        },
        {
          ApiId: {
            Ref: 'myapi2270C63BF',
          },
          Stage: 'prod',
        },
      ],
    });
  });

  test('addApiStage combines with constructor apiStages (different apis)', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api1 = new WebSocketApi(stack, 'api1');
    const api2 = new WebSocketApi(stack, 'api2');

    const stage1 = new WebSocketStage(stack, 'stage1', {
      webSocketApi: api1,
      stageName: 'dev',
    });

    const stage2 = new WebSocketStage(stack, 'stage2', {
      webSocketApi: api2,
      stageName: 'prod',
    });

    const usagePlanName = 'Basic';

    const usagePlan = new UsagePlan(stack, 'my-usage-plan', {
      usagePlanName: usagePlanName,
      apiStages: [
        {
          api: api1,
          stage: stage1,
        },
      ],
    });

    // WHEN
    usagePlan.addApiStage({
      api: api2,
      stage: stage2,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(RESOURCE_TYPE, {
      UsagePlanName: usagePlanName,
      ApiStages: [
        {
          ApiId: {
            Ref: 'api1A91238E2',
          },
          Stage: 'dev',
        },
        {
          ApiId: {
            Ref: 'api2C4850CEA',
          },
          Stage: 'prod',
        },
      ],
    });
  });

  test('addApiStage combines with constructor apiStages (same api)', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new WebSocketApi(stack, 'my-api');

    const stage1 = new WebSocketStage(stack, 'stage1', {
      webSocketApi: api,
      stageName: 'dev',
    });

    const stage2 = new WebSocketStage(stack, 'stage2', {
      webSocketApi: api,
      stageName: 'prod',
    });

    const usagePlanName = 'Basic';

    const usagePlan = new UsagePlan(stack, 'my-usage-plan', {
      usagePlanName: usagePlanName,
      apiStages: [
        {
          api: api,
          stage: stage1,
        },
      ],
    });

    // WHEN
    usagePlan.addApiStage({
      api: api,
      stage: stage2,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(RESOURCE_TYPE, {
      UsagePlanName: usagePlanName,
      ApiStages: [
        {
          ApiId: {
            Ref: 'myapi4C7BF186',
          },
          Stage: 'dev',
        },
        {
          ApiId: {
            Ref: 'myapi4C7BF186',
          },
          Stage: 'prod',
        },
      ],
    });
  });

  test('add UsagePlan and ApiKey to an imported stage', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new WebSocketApi(stack, 'my-api');
    const importedStage = WebSocketStage.fromWebSocketStageAttributes(stack, 'imported-stage', {
      stageName: 'my-imported-stage',
      api: api,
    });

    const usagePlan: UsagePlan = new UsagePlan(stack, 'my-usage-plan', {
      apiStages: [{ api: api, stage: importedStage }],
      usagePlanName: 'Basic',
    });

    const apiKey: ApiKey = new ApiKey(stack, 'my-api-key');

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

    Template.fromStack(stack).hasResourceProperties(RESOURCE_TYPE, {
      UsagePlanName: 'Basic',
      ApiStages: [
        {
          ApiId: {
            Ref: 'myapi4C7BF186',
          },
          Stage: 'my-imported-stage',
        },
      ],
    });
  });

  describe('UsagePlanKey', () => {
    test('default', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const usagePlan: UsagePlan = new UsagePlan(stack, 'my-usage-plan', {
        usagePlanName: 'Basic',
      });
      const apiKey: ApiKey = new ApiKey(stack, 'my-api-key');

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
      const usagePlan: IUsagePlan = UsagePlan.fromUsagePlanId(stack, 'my-usage-plan', 'imported-id');
      const apiKey: ApiKey = new ApiKey(stack, 'my-api-key');

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
      const usagePlan = new UsagePlan(stack, 'my-usage-plan');
      const apiKey1 = new ApiKey(stack, 'my-api-key-1', {
        apiKeyName: 'my-api-key-1',
      });
      const apiKey2 = new ApiKey(stack, 'my-api-key-2', {
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
      const usagePlan: UsagePlan = new UsagePlan(stack, 'my-usage-plan', { usagePlanName: 'Basic' });
      const apiKey: ApiKey = new ApiKey(stack, 'my-api-key');

      // WHEN
      usagePlan.addApiKey(apiKey, { overrideLogicalId: 'mylogicalid' });

      // THEN
      const template = app.synth().getStackByName(stack.stackName).template;
      const logicalIds = Object.entries(template.Resources)
        .filter(([_, v]) => (v as any).Type === 'AWS::ApiGateway::UsagePlanKey')
        .map(([k, _]) => k);
      expect(logicalIds).toEqual(['mylogicalid']);
    });

    test('UsagePlanKeys have unique logical ids', () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'my-stack');
      const usagePlan = new UsagePlan(stack, 'my-usage-plan');
      const apiKey1 = new ApiKey(stack, 'my-api-key-1', {
        apiKeyName: 'my-api-key-1',
      });
      const apiKey2 = new ApiKey(stack, 'my-api-key-2', {
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

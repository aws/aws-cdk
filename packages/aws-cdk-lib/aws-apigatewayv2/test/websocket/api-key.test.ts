import { Match, Template } from '../../../assertions';
import * as iam from '../../../aws-iam';
import * as cdk from '../../../core';
import { ApiKey, WebSocketApi, WebSocketStage, UsagePlan, RateLimitedApiKey, Period } from '../../lib';

describe('api key', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ApiKey(stack, 'my-api-key');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Enabled: true,
    });
  });

  test('enabled flag is respected', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ApiKey(stack, 'my-api-key', {
      enabled: false,
      value: 'arandomstringwithmorethantwentycharacters',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Enabled: false,
      Value: 'arandomstringwithmorethantwentycharacters',
    });
  });

  test('specify props for apiKey', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ApiKey(stack, 'test-api-key', {
      apiKeyName: 'my-api-key',
      customerId: 'test-customer',
      generateDistinctId: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Name: 'my-api-key',
      CustomerId: 'test-customer',
      GenerateDistinctId: true,
    });
  });

  test('add description to apiKey', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new ApiKey(stack, 'my-api-key', {
      description: 'The most secret api key',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Description: 'The most secret api key',
    });
  });

  test('use an imported api key', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const importedKey = ApiKey.fromApiKeyId(stack, 'imported', 'KeyIdabc');
    const usagePlan = new UsagePlan(stack, 'plan');
    usagePlan.addApiKey(importedKey);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::UsagePlanKey', {
      KeyId: 'KeyIdabc',
      KeyType: 'API_KEY',
      UsagePlanId: {
        Ref: 'planA4660BD9',
      },
    });
  });

  test('grantRead', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const user = new iam.User(stack, 'User');

    // WHEN
    const apiKey = new ApiKey(stack, 'test-api-key', {
      customerId: 'test-customer',
    });
    apiKey.grantRead(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'apigateway:GET',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':apigateway:',
                  {
                    Ref: 'AWS::Region',
                  },
                  '::/apikeys/',
                  {
                    Ref: 'testapikeyE093E501',
                  },
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('grantWrite', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const user = new iam.User(stack, 'User');

    // WHEN
    const apiKey = new ApiKey(stack, 'test-api-key', {
      customerId: 'test-customer',
    });
    apiKey.grantWrite(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'apigateway:POST',
              'apigateway:PUT',
              'apigateway:PATCH',
              'apigateway:DELETE',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':apigateway:',
                  {
                    Ref: 'AWS::Region',
                  },
                  '::/apikeys/',
                  {
                    Ref: 'testapikeyE093E501',
                  },
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('grantReadWrite', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const user = new iam.User(stack, 'User');

    // WHEN
    const apiKey = new ApiKey(stack, 'test-api-key', {
      customerId: 'test-customer',
    });
    apiKey.grantReadWrite(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'apigateway:GET',
              'apigateway:POST',
              'apigateway:PUT',
              'apigateway:PATCH',
              'apigateway:DELETE',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':apigateway:',
                  {
                    Ref: 'AWS::Region',
                  },
                  '::/apikeys/',
                  {
                    Ref: 'testapikeyE093E501',
                  },
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  describe('rate limited', () => {
    test('default setup', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      new RateLimitedApiKey(stack, 'my-api-key');

      // THEN
      // should have an api key with no props defined.
      Template.fromStack(stack).hasResource('AWS::ApiGateway::ApiKey', Match.anyValue());
      // should not have a usage plan.
      Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::UsagePlan', 0);
      // should not have a usage plan key.
      Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::UsagePlanKey', 0);
    });

    test('only api key is created when rate limiting properties are not provided', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const api = new WebSocketApi(stack, 'test-api');
      const stage = WebSocketStage.fromWebSocketStageAttributes(stack, 'Stage', {
        api: api,
        stageName: 'MyStage',
      });

      // WHEN
      new RateLimitedApiKey(stack, 'test-api-key', {
        customerId: 'test-customer',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
        CustomerId: 'test-customer',
      });
      // should not have a usage plan.
      Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::UsagePlan', 0);
      // should not have a usage plan key.
      Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::UsagePlanKey', 0);
    });

    test('api key and usage plan are created and linked when rate limiting properties are provided', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const api = new WebSocketApi(stack, 'test-api');
      const stage = WebSocketStage.fromWebSocketStageAttributes(stack, 'Stage', {
        api: api,
        stageName: 'MyStage',
      });

      // WHEN
      new RateLimitedApiKey(stack, 'test-api-key', {
        customerId: 'test-customer',
        apiStages: [{
          api: api,
          stage: stage,
        }],
        quota: {
          limit: 10000,
          offset: 1,
          period: Period.MONTH,
        },
        throttle: {
          rateLimit: 100,
          burstLimit: 200,
        },
      });

      // THEN
      // should have an api key
      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
        CustomerId: 'test-customer',
      });

      // should have a usage plan with specified quota.
      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::UsagePlan', {
        ApiStages: [
          {
            ApiId: {
              Ref: 'testapiD6451F70',
            },
            Stage: 'MyStage',
          },
        ],
        Quota: {
          Limit: 10000,
          Offset: 1,
          Period: 'MONTH',
        },
        Throttle: {
          RateLimit: 100,
          BurstLimit: 200,
        },
      });

      // should have a usage plan key linking the api key and usage plan
      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::UsagePlanKey', {
        KeyId: {
          Ref: 'testapikey998028B6',
        },
        KeyType: 'API_KEY',
        UsagePlanId: {
          Ref: 'testapikeyUsagePlanResource66DB63D6',
        },
      });
    });
  });
});

import { Match, Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as apigateway from '../lib';

describe('api key', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new apigateway.ApiKey(stack, 'my-api-key');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Enabled: true,
    });
  });


  test('enabled flag is respected', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new apigateway.ApiKey(stack, 'my-api-key', {
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
    const api = new apigateway.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: true,
      deployOptions: { stageName: 'test' },
    });
    api.root.addMethod('GET'); // api must have atleast one method.

    // WHEN
    new apigateway.ApiKey(stack, 'test-api-key', {
      customerId: 'test-customer',
      resources: [api],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
      CustomerId: 'test-customer',
      StageKeys: [
        {
          RestApiId: { Ref: 'testapiD6451F70' },
          StageName: { Ref: 'testapiDeploymentStagetest5869DF71' },
        },
      ],
    });
  });

  test('add description to apiKey', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api');
    api.root.addMethod('GET'); // api must have atleast one method.

    // WHEN
    api.addApiKey('my-api-key', {
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
    const api = new apigateway.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: true,
      deployOptions: { stageName: 'test' },
    });
    api.root.addMethod('GET'); // api must have atleast one method.

    // WHEN
    const importedKey = apigateway.ApiKey.fromApiKeyId(stack, 'imported', 'KeyIdabc');
    const usagePlan = api.addUsagePlan('plan');
    usagePlan.addApiKey(importedKey);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::UsagePlanKey', {
      KeyId: 'KeyIdabc',
      KeyType: 'API_KEY',
      UsagePlanId: {
        Ref: 'testapiplan1B111AFF',
      },
    });
  });

  test('grantRead', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const user = new iam.User(stack, 'User');
    const api = new apigateway.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: true,
      deployOptions: { stageName: 'test' },
    });
    api.root.addMethod('GET'); // api must have atleast one method.

    // WHEN
    const apiKey = new apigateway.ApiKey(stack, 'test-api-key', {
      customerId: 'test-customer',
      resources: [api],
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
    const api = new apigateway.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: true,
      deployOptions: { stageName: 'test' },
    });
    api.root.addMethod('GET'); // api must have atleast one method.

    // WHEN
    const apiKey = new apigateway.ApiKey(stack, 'test-api-key', {
      customerId: 'test-customer',
      resources: [api],
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
    const api = new apigateway.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: true,
      deployOptions: { stageName: 'test' },
    });
    api.root.addMethod('GET'); // api must have atleast one method.

    // WHEN
    const apiKey = new apigateway.ApiKey(stack, 'test-api-key', {
      customerId: 'test-customer',
      resources: [api],
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
      const api = new apigateway.RestApi(stack, 'my-api', { cloudWatchRole: false, deploy: false });
      api.root.addMethod('GET'); // Need at least one method on the api

      // WHEN
      new apigateway.RateLimitedApiKey(stack, 'my-api-key');

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
      const api = new apigateway.RestApi(stack, 'test-api', {
        cloudWatchRole: false,
        deploy: true,
        deployOptions: { stageName: 'test' },
      });
      api.root.addMethod('GET'); // api must have atleast one method.

      // WHEN
      new apigateway.RateLimitedApiKey(stack, 'test-api-key', {
        customerId: 'test-customer',
        resources: [api],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
        CustomerId: 'test-customer',
        StageKeys: [
          {
            RestApiId: { Ref: 'testapiD6451F70' },
            StageName: { Ref: 'testapiDeploymentStagetest5869DF71' },
          },
        ],
      });
      // should not have a usage plan.
      Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::UsagePlan', 0);
      // should not have a usage plan key.
      Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::UsagePlanKey', 0);
    });

    test('api key and usage plan are created and linked when rate limiting properties are provided', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const api = new apigateway.RestApi(stack, 'test-api', {
        cloudWatchRole: false,
        deploy: true,
        deployOptions: { stageName: 'test' },
      });
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
      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
        CustomerId: 'test-customer',
        StageKeys: [
          {
            RestApiId: { Ref: 'testapiD6451F70' },
            StageName: { Ref: 'testapiDeploymentStagetest5869DF71' },
          },
        ],
      });
      // should have a usage plan with specified quota.
      Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::UsagePlan', {
        Quota: {
          Limit: 10000,
          Period: 'MONTH',
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

import { expect, haveResource, haveResourceLike, ResourcePart } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
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

  'grantRead'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const user = new iam.User(stack, 'User');
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: true, deployOptions: { stageName: 'test' } });
    api.root.addMethod('GET'); // api must have atleast one method.

    // WHEN
    const apiKey = new apigateway.ApiKey(stack, 'test-api-key', {
      customerId: 'test-customer',
      resources: [api],
    });
    apiKey.grantRead(user);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
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
    }));

    test.done();
  },

  'grantWrite'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const user = new iam.User(stack, 'User');
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: true, deployOptions: { stageName: 'test' } });
    api.root.addMethod('GET'); // api must have atleast one method.

    // WHEN
    const apiKey = new apigateway.ApiKey(stack, 'test-api-key', {
      customerId: 'test-customer',
      resources: [api],
    });
    apiKey.grantWrite(user);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
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
    }));

    test.done();
  },

  'grantReadWrite'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const user = new iam.User(stack, 'User');
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: true, deployOptions: { stageName: 'test' } });
    api.root.addMethod('GET'); // api must have atleast one method.

    // WHEN
    const apiKey = new apigateway.ApiKey(stack, 'test-api-key', {
      customerId: 'test-customer',
      resources: [api],
    });
    apiKey.grantReadWrite(user);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
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
    }));

    test.done();
  },

  'rate limited': {
    'default setup'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const api = new apigateway.RestApi(stack, 'my-api', { cloudWatchRole: false, deploy: false });
      api.root.addMethod('GET'); // Need at least one method on the api

      // WHEN
      new apigateway.RateLimitedApiKey(stack, 'my-api-key');

      // THEN
      // should have an api key with no props defined.
      expect(stack).to(haveResource('AWS::ApiGateway::ApiKey', undefined, ResourcePart.CompleteDefinition));
      // should not have a usage plan.
      expect(stack).notTo(haveResource('AWS::ApiGateway::UsagePlan'));
      // should not have a usage plan key.
      expect(stack).notTo(haveResource('AWS::ApiGateway::UsagePlanKey'));

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
      expect(stack).notTo(haveResource('AWS::ApiGateway::UsagePlan'));
      // should not have a usage plan key.
      expect(stack).notTo(haveResource('AWS::ApiGateway::UsagePlanKey'));

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
      expect(stack).to(haveResource('AWS::ApiGateway::UsagePlan', {
        Quota: {
          Limit: 10000,
          Period: 'MONTH',
        },
      }, ResourcePart.Properties));
      // should have a usage plan key linking the api key and usage plan
      expect(stack).to(haveResource('AWS::ApiGateway::UsagePlanKey', {
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
  },
};

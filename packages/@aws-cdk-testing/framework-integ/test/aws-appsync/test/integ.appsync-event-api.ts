import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'appsync-event-api-stack');

const userPool = new cognito.UserPool(stack, 'Pool', {
  userPoolName: 'myPool',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const authorizer = new lambda.Function(stack, 'AuthorizerFunction', {
  runtime: lambda.Runtime.NODEJS_18_X,
  code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log("Authorization event:", JSON.stringify(event));

          const isAuthorized = true;
          if (isAuthorized) {
            return {
              isAuthorized: true,
              resolverContext: {
                userId: 'user-id-example'
              }
            };
          } else {
            return {
              isAuthorized: false
            };
          }
        };
      `),
  handler: 'index.handler',
});

const api = new appsync.Api(stack, 'EventApi', {
  apiName: 'my-event-api',
  ownerContact: 'test-owner-contact',
  authProvider: [
    {
      authorizationType: appsync.AuthorizationType.API_KEY,
    },
    {
      authorizationType: appsync.AuthorizationType.USER_POOL,
      userPoolConfig: {
        userPool,
        defaultAction: appsync.UserPoolDefaultAction.ALLOW,
      },
    },
    {
      authorizationType: appsync.AuthorizationType.IAM,
    },
    {
      authorizationType: appsync.AuthorizationType.LAMBDA,
      lambdaAuthorizerConfig: {
        handler: authorizer,
      },
    },
  ],
  connectionAuthModes: [
    appsync.AuthorizationType.API_KEY,
  ],
  defaultPublishAuthModes: [
    appsync.AuthorizationType.USER_POOL,
  ],
  defaultSubscribeAuthModes: [
    appsync.AuthorizationType.IAM,
  ],
  logConfig: {
    excludeVerboseContent: false,
    fieldLogLevel: appsync.FieldLogLevel.ERROR,
  },
});

new appsync.ChannelNamespace(stack, 'ChannelNamespace', {
  api,
  publishAuthModes: [appsync.AuthorizationType.LAMBDA],
  subscribeAuthModes: [appsync.AuthorizationType.LAMBDA],
  code: appsync.Code.fromAsset(path.join(
    __dirname,
    'integ-assets',
    'appsync-js-channel-namespace-handler.js',
  )),
});

api.addChannelNamespace('AnotherChannelNamespace', {
  channelNamespaceName: 'AnotherChannelNamespace',
  code: appsync.Code.fromInline(`
        export function onPublish(ctx) {
          return ctx.events.filter((event) => event.payload.odds > 0)
        }
      `),
});

new IntegTest(app, 'appsync-event-api', {
  testCases: [stack],
});

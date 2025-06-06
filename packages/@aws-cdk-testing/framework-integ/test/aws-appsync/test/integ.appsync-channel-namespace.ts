import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { Construct } from 'constructs';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class EventApiChannelNamespaceStack extends cdk.Stack {
  public readonly eventApi: appsync.EventApi;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const authorizer = new lambda.Function(this, 'AuthorizerFunction', {
      runtime: STANDARD_NODEJS_RUNTIME,
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

    const lambdaProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.LAMBDA,
      lambdaAuthorizerConfig: {
        handler: authorizer,
      },
    };

    const iamProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.IAM,
    };

    const api = new appsync.EventApi(this, 'EventApi', {
      apiName: 'api-channel-namespace-test',
      ownerContact: 'test-owner-contact',
      authorizationConfig: {
        authProviders: [
          lambdaProvider,
          iamProvider,
        ],
      },
      logConfig: {
        fieldLogLevel: appsync.AppSyncFieldLogLevel.ERROR,
      },
    });
    this.eventApi = api;

    new appsync.ChannelNamespace(this, 'ChannelNamespace', {
      api,
      authorizationConfig: {
        publishAuthModeTypes: [
          appsync.AppSyncAuthorizationType.LAMBDA,
        ],
        subscribeAuthModeTypes: [
          appsync.AppSyncAuthorizationType.LAMBDA,
        ],
      },
      code: appsync.Code.fromAsset(path.join(
        __dirname,
        'integ-assets',
        'appsync-js-channel-namespace-handler.js',
      )),
    });

    api.addChannelNamespace('AnotherChannelNamespace', {
      code: appsync.Code.fromInline(`
            export function onPublish(ctx) {
              return ctx.events.filter((event) => event.payload.odds > 0)
            }
          `),
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new EventApiChannelNamespaceStack(app, 'EventApiChannelNamespaceStack');

new IntegTest(app, 'appsync-event-api-channel-namespace', {
  testCases: [stack],
});

new cdk.CfnOutput(stack, 'AWS AppSync Events HTTP endpoint', { value: stack.eventApi.httpDns });
new cdk.CfnOutput(stack, 'AWS AppSync Events Realtime endpoint', { value: stack.eventApi.realtimeDns });

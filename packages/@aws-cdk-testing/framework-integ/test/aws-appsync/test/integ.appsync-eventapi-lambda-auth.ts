import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class EventApiLambdaAuthStack extends cdk.Stack {
  public readonly eventApi: appsync.EventApi;
  public readonly lambdaTestFn: nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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

    this.eventApi = new appsync.EventApi(this, 'EventApiLambdaAuth', {
      apiName: 'api-iam-auth-test',
      ownerContact: 'test-owner-contact',
      authorizationConfig: {
        authProviders: [
          lambdaProvider,
        ],
      },
    });

    this.eventApi.addChannelNamespace('default');

    const lambdaConfig: nodejs.NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: {
        EVENT_API_REALTIME_URL: `wss://${this.eventApi.realtimeDns}/event/realtime`,
        EVENT_API_HTTP_URL: `https://${this.eventApi.httpDns}/event`,
      },
      bundling: {
        bundleAwsSDK: true,
      },
      entry: path.join(__dirname, 'integ-assets/eventapi-grant-assertion/index.js'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(15),
    };

    this.lambdaTestFn = new nodejs.NodejsFunction(this, 'LambdaConfigTestFunction', lambdaConfig);
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new EventApiLambdaAuthStack(app, 'EventApiLambdaAuthStack');

const integTest = new IntegTest(app, 'appsync-event-api-lambda-auth', {
  testCases: [stack],
});

// Validate subscribe works with API Key auth
integTest.assertions.invokeFunction({
  functionName: stack.lambdaTestFn.functionName,
  payload: JSON.stringify({
    action: 'subscribe',
    channel: 'default',
    authMode: 'LAMBDA',
    authToken: 'validtoken', // only valid value
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 200,
    msg: 'subscribe_success',
  }),
}));

// Validate publish works
integTest.assertions.invokeFunction({
  functionName: stack.lambdaTestFn.functionName,
  payload: JSON.stringify({
    action: 'publish',
    channel: 'default',
    authMode: 'LAMBDA',
    authToken: 'validtoken',
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 200,
    msg: 'publish_success',
  }),
}));

new cdk.CfnOutput(stack, 'AWS AppSync Events HTTP endpoint', { value: stack.eventApi.httpDns });
new cdk.CfnOutput(stack, 'AWS AppSync Events Realtime endpoint', { value: stack.eventApi.realtimeDns });

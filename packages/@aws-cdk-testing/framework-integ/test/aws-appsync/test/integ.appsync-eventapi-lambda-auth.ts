import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class EventApiLambdaAuthStack extends cdk.Stack {
  public readonly eventApi: appsync.EventApi;
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
  }
}

const app = new cdk.App();
const stack = new EventApiLambdaAuthStack(app, 'EventApiLambdaAuthStack');

new IntegTest(app, 'appsync-event-api-lambda-auth', {
  testCases: [stack],
});

new cdk.CfnOutput(stack, 'AWS AppSync Events HTTP endpoint', { value: stack.eventApi.httpDns });
new cdk.CfnOutput(stack, 'AWS AppSync Events Realtime endpoint', { value: stack.eventApi.realtimeDns });

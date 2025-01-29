import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class EventApiCognitoAuthStack extends cdk.Stack {
  public readonly eventApi: appsync.EventApi;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'Pool', {
      userPoolName: 'myPool',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const cognitoProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.USER_POOL,
      cognitoConfig: {
        userPool: userPool,
      },
    };

    this.eventApi = new appsync.EventApi(this, 'EventApiCognitoAuth', {
      apiName: 'api-cognito-auth-test',
      authorizationConfig: {
        authProviders: [
          cognitoProvider,
        ],
      },
    });
  }
}

const app = new cdk.App();
const stack = new EventApiCognitoAuthStack(app, 'EventApiCognitoAuthStack');

new IntegTest(app, 'appsync-event-api-cognito-auth', {
  testCases: [stack],
});

new cdk.CfnOutput(stack, 'AWS AppSync Events HTTP endpoint', { value: stack.eventApi.httpDns });
new cdk.CfnOutput(stack, 'AWS AppSync Events Realtime endpoint', { value: stack.eventApi.realtimeDns });

import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class EventApiIamAuthStack extends cdk.Stack {
  public readonly eventApi: appsync.EventApi;

  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const iamProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.IAM,
    };

    this.eventApi = new appsync.EventApi(this, 'EventApiIamAuth', {
      apiName: 'api-iam-auth-test',
      authorizationConfig: {
        authProviders: [
          iamProvider,
        ],
      },
    });
  }
}

const app = new cdk.App();
const stack = new EventApiIamAuthStack(app, 'EventApiIamAuthStack');

new IntegTest(app, 'appsync-event-api-iam-auth', {
  testCases: [stack],
});

new cdk.CfnOutput(stack, 'AWS AppSync Events HTTP endpoint', { value: stack.eventApi.httpDns });
new cdk.CfnOutput(stack, 'AWS AppSync Events Realtime endpoint', { value: stack.eventApi.realtimeDns });

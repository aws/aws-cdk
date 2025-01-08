import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class EventApiApiKeyAuthStack extends cdk.Stack {
  public readonly eventApi: appsync.EventApi;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiKeyProvider: appsync.AppSyncAuthProvider = {
      authorizationType: appsync.AppSyncAuthorizationType.API_KEY,
    };

    this.eventApi = new appsync.EventApi(this, 'event-api', {
      apiName: 'event-api',
      authorizationConfig: {
        authProviders: [
          apiKeyProvider,
        ],
      },
    });
  }
};

const app = new cdk.App();
const stack = new EventApiApiKeyAuthStack(app, 'EventApiApiKeyAuthStack');

new IntegTest(app, 'appsync-event-api-api-key-auth', {
  testCases: [stack],
});
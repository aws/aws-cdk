import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class EventApiCognitoAuthStack extends cdk.Stack {
  public readonly eventApi: appsync.EventApi;
  public readonly lambdaTestFn: nodejs.NodejsFunction;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'Pool', {
      userPoolName: 'myPool',
      selfSignUpEnabled: true,
      autoVerify: { email: true },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const client = userPool.addClient('lambda-app-client', {
      preventUserExistenceErrors: true,
      authFlows: {
        adminUserPassword: true,
      },
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

    this.eventApi.addChannelNamespace('default');

    const lambdaConfig: nodejs.NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: {
        EVENT_API_REALTIME_URL: `wss://${this.eventApi.realtimeDns}/event/realtime`,
        EVENT_API_HTTP_URL: `https://${this.eventApi.httpDns}/event`,
        USER_POOL_ID: userPool.userPoolId,
        CLIENT_ID: client.userPoolClientId,
      },
      bundling: {
        bundleAwsSDK: true,
      },
      entry: path.join(__dirname, 'integ-assets/eventapi-grant-assertion/index.js'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(15),
    };

    this.lambdaTestFn = new nodejs.NodejsFunction(this, 'CognitoConfigTestFunction', lambdaConfig);
    userPool.grant(this.lambdaTestFn,
      'cognito-idp:SignUp',
      'cognito-idp:AdminConfirmSignUp',
      'cognito-idp:AdminDeleteUser',
      'cognito-idp:AdminInitiateAuth',
    );
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new EventApiCognitoAuthStack(app, 'EventApiCognitoAuthStack');

const integTest = new IntegTest(app, 'appsync-event-api-cognito-auth', {
  testCases: [stack],
});

// Validate publish works with Cognito auth
integTest.assertions.invokeFunction({
  functionName: stack.lambdaTestFn.functionName,
  payload: JSON.stringify({
    action: 'publish',
    channel: 'default',
    authMode: 'USER_POOL',
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 200,
    msg: 'publish_success',
  }),
}));

// Validate subscribe works with Cognito auth
integTest.assertions.invokeFunction({
  functionName: stack.lambdaTestFn.functionName,
  payload: JSON.stringify({
    action: 'subscribe',
    channel: 'default',
    authMode: 'USER_POOL',
  }),
}).expect(ExpectedResult.objectLike({
  Payload: JSON.stringify({
    statusCode: 200,
    msg: 'subscribe_success',
  }),
}));

new cdk.CfnOutput(stack, 'AWS AppSync Events HTTP endpoint', { value: stack.eventApi.httpDns });
new cdk.CfnOutput(stack, 'AWS AppSync Events Realtime endpoint', { value: stack.eventApi.realtimeDns });

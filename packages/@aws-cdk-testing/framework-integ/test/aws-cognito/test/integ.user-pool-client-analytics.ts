import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Effect, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import * as pinpoint from 'aws-cdk-lib/aws-pinpoint';

const app = new App();
const stack = new Stack(app, 'AwsCognito');

const userPool = new UserPool(stack, 'Pool', {
  removalPolicy: RemovalPolicy.DESTROY,
});

const pinpointApp = new pinpoint.CfnApp(stack, 'PinpointApp', {
  name: 'cognito-analytics-app',
});

const pinpointRole = new Role(stack, 'PinpointRole', {
  assumedBy: new ServicePrincipal('cognito-idp.amazonaws.com'),
});

pinpointRole.addToPolicy(new PolicyStatement({
  effect: Effect.ALLOW,
  actions: [
    'mobiletargeting:UpdateEndpoint',
    'mobiletargeting:PutEvents',
  ],
  resources: [pinpointApp.attrArn],
}));

new UserPoolClient(stack, 'Client', {
  userPool,
  analytics: {
    applicationArn: pinpointApp.attrArn,
    applicationId: pinpointApp.ref,
    externalId: stack.stackId,
    roleArn: pinpointRole.roleArn,
    userDataShared: true,
  },
});

new IntegTest(app, 'AwsCognitoUserPoolClientAnalytics', {
  testCases: [stack],
});

app.synth();

import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnApp } from 'aws-cdk-lib/aws-pinpoint';
import { Construct } from 'constructs';

/**
 * To set analytics config to UserPoolClient with Application ARN
 */
class TestStack extends Stack {
  public readonly userPool: UserPool;
  public readonly client: UserPoolClient;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const pinpointApp = new CfnApp(this, 'PinpointApp', {
      name: 'SamplePinpointApp',
    });
    pinpointApp.applyRemovalPolicy(RemovalPolicy.DESTROY);

    this.userPool = new UserPool(this, 'Pool', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.client = this.userPool.addClient('Client', {
      generateSecret: true,
      analytics: {
        application: pinpointApp,
      },
    });
  }
}

/**
 * To set analytics config to UserPoolClient with Application ID, External ID, and Role ARN
 */
class TestStack2 extends Stack {
  public readonly userPool: UserPool;
  public readonly client: UserPoolClient;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const pinpointApp = new CfnApp(this, 'PinpointApp', {
      name: 'SamplePinpointApp',
    });
    pinpointApp.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const role = new Role(this, 'Role', {
      assumedBy: new ServicePrincipal('cognito-idp.amazonaws.com'),
    });
    role.addToPolicy(new PolicyStatement({
      actions: ['mobiletargeting:*'],
      resources: ['*'],
    }));

    this.userPool = new UserPool(this, 'Pool', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.client = this.userPool.addClient('client', {
      generateSecret: true,
      analytics: {
        applicationId: pinpointApp.ref,
        externalId: role.roleId,
        role,
      },
    });
  }
}

const app = new App();
const testCase = new TestStack(app, 'IntegUserPoolClientAnalytics');
const testCase2 = new TestStack2(app, 'IntegUserPoolClientAnalytics2');

const integ = new IntegTest(app, 'integ-user-pool-client-test', {
  testCases: [testCase, testCase2],
  regions: ['us-east-1'],
});

// NOTE: assertion test for TestStack
const resp1 = integ.assertions.awsApiCall('CognitoIdentityServiceProvider', 'describeUserPoolClient', {
  UserPoolId: testCase.userPool.userPoolId,
  ClientId: testCase.client.userPoolClientId,
});
resp1.assertAtPath('UserPoolClient.AnalyticsConfiguration.ApplicationArn', ExpectedResult.stringLikeRegexp('.*:apps/.*'));

// NOTE: assertion test for TestStack2
const resp2 = integ.assertions.awsApiCall('CognitoIdentityServiceProvider', 'describeUserPoolClient', {
  UserPoolId: testCase2.userPool.userPoolId,
  ClientId: testCase2.client.userPoolClientId,
});
resp2.assertAtPath('UserPoolClient.AnalyticsConfiguration.ApplicationId', ExpectedResult.stringLikeRegexp('.*'));
resp2.assertAtPath('UserPoolClient.AnalyticsConfiguration.RoleArn', ExpectedResult.stringLikeRegexp('arn:aws:iam::.*:role/.*'));
resp2.assertAtPath('UserPoolClient.AnalyticsConfiguration.ExternalId', ExpectedResult.stringLikeRegexp('.*'));

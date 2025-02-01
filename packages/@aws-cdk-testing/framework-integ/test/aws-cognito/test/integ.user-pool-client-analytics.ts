import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnApp } from 'aws-cdk-lib/aws-pinpoint';
import { Construct } from 'constructs';

/**
 * To set analytics config to UserPoolClient with Application ARN
 */
class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const pinpointApp = new CfnApp(this, 'PinpointApp', {
      name: 'SamplePinpointApp',
    });
    pinpointApp.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const userPool = new UserPool(this, 'Pool', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    userPool.addClient('Client', {
      generateSecret: true,
      analytics: {
        applicationArn: pinpointApp.attrArn,
      },
    });
  }
}

/**
 * To set analytics config to UserPoolClient with Application ID, External ID, and Role ARN
 */
class TestStack2 extends Stack {
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

    const userPool = new UserPool(this, 'Pool', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    userPool.addClient('client', {
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

new IntegTest(app, 'integ-user-pool-client-test', {
  testCases: [testCase, testCase2],
  regions: ['us-east-1'],
});

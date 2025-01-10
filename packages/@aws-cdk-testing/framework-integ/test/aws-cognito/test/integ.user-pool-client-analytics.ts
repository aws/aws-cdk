import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack, RemovalPolicy, Fn } from 'aws-cdk-lib';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnApp } from 'aws-cdk-lib/aws-pinpoint';
import { Construct } from 'constructs';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const pinpointApp = new CfnApp(this, 'pinpointApp', {
      name: 'MyPinpointApp',
    });
    pinpointApp.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const userpool = new UserPool(this, 'pool', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    userpool.addClient('client', {
      generateSecret: true,
      analyticsConfig: {
        applicationArn: pinpointApp.attrArn,
      },
    });
  }
}

class TestStack2 extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const pinpointApp = new CfnApp(this, 'pinpointApp', {
      name: 'MyPinpointApp',
    });
    pinpointApp.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const role = new Role(this, 'role', {
      assumedBy: new ServicePrincipal('cognito-idp.amazonaws.com'),
    });
    role.addToPolicy(
      new PolicyStatement({
        actions: ['mobiletargeting:UpdateEndpoint', 'mobiletargeting:PutEvents'],
        // arn:aws:mobiletargeting:us-east-1:123456789012:apps/12345678-1234-1234-1234-123456789012/*
        resources: [Fn.join('/', [pinpointApp.attrArn, '*'])],
      }),
    );

    const userpool = new UserPool(this, 'pool', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    userpool.addClient('client', {
      generateSecret: true,
      analyticsConfig: {
        applicationId: pinpointApp.ref,
        externalId: role.roleId,
        roleArn: role.roleArn,
      },
    });
  }
}

const app = new App();
const testCase = new TestStack(app, 'integ-user-pool-client');
const testCase2 = new TestStack2(app, 'integ-user-pool-client-2');

new IntegTest(app, 'integ-user-pool-client-test', {
  testCases: [testCase, testCase2],
  regions: ['us-east-1'],
});

import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import * as cxapi from 'aws-cdk-lib/cx-api';

/**
 * Stack with feature flag disabled (default) - client secret should not be logged
 */
class TestStackSecretNotLogged extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const userpool = new UserPool(this, 'pool', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const client = userpool.addClient('client', { generateSecret: true });
    const secret = new secretsmanager.Secret(this, 'secret', {
      secretStringValue: client.userPoolClientSecret,
    });

    new CfnOutput(this, 'ClientSecretName', {
      value: secret.secretName,
    });
  }
}

/**
 * Stack with feature flag enabled - client secret would be logged
 */
class TestStackSecretLogged extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    // Set the feature flag to true to allow logging client secret
    this.node.setContext(cxapi.LOG_USER_POOL_CLIENT_SECRET_VALUE, true);
    const userpool = new UserPool(this, 'pool', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const client = userpool.addClient('client', { generateSecret: true });
    const secret = new secretsmanager.Secret(this, 'secret', {
      secretStringValue: client.userPoolClientSecret,
    });

    new CfnOutput(this, 'ClientSecretName', {
      value: secret.secretName,
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCaseNotLogged = new TestStackSecretNotLogged(app, 'integ-user-pool-client-secret-not-logged');
const testCaseLogged = new TestStackSecretLogged(app, 'integ-user-pool-client-secret-logged');

new IntegTest(app, 'integ-user-pool-client-secret-test', {
  testCases: [testCaseNotLogged, testCaseLogged],
});

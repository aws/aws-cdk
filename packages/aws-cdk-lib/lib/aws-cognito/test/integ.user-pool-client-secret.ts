import * as secretsmanager from '../../aws-secretsmanager';
import { App, CfnOutput, RemovalPolicy, Stack } from '../../core';
import { IntegTest } from '../../integ-tests';
import { Construct } from 'constructs';
import { UserPool } from '../lib';

class TestStack extends Stack {
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

const app = new App();
const testCase = new TestStack(app, 'integ-user-pool-client-secret');

new IntegTest(app, 'integ-user-pool-client-secret-test', {
  testCases: [testCase],
});

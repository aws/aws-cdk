import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { UserPool } from 'aws-cdk-lib/aws-cognito';

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

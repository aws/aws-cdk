import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { UserPool } from 'aws-cdk-lib/aws-cognito';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const userpool = new UserPool(this, 'pool', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    userpool.addClient('client', {
      generateSecret: true,
      enablePropagateAdditionalUserContextData: true,
    });
  }
}

const app = new App();
const testCase = new TestStack(app, 'integ-user-pool-client-enable-propagate-additional-data');

new IntegTest(app, 'integ-user-pool-client-enable-propagate-additional-data-test', {
  testCases: [testCase],
});

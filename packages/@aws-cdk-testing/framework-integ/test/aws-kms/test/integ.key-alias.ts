import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Key } from 'aws-cdk-lib/aws-kms';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: App) {
    super(scope, 'TestStack');
    // The alias inherits the key's removal policy, so DESTROY here ensures the
    // tokenized alias is cleaned up with the stack rather than orphaned.
    new Key(this, 'key', {
      alias: `MyKey${this.account}`,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

const app = new App();
const stack = new TestStack(app);

new IntegTest(app, 'kms-key-alias-tokenized', {
  testCases: [stack],
});

app.synth();

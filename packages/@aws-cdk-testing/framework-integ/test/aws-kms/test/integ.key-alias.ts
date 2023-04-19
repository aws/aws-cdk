import { App, Stack } from 'aws-cdk-lib';
import { Key } from 'aws-cdk-lib/aws-kms';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: App) {
    super(scope, 'TestStack');
    new Key(this, 'key', {
      alias: `MyKey${this.account}`,
    });
  }
}

const app = new App();
const stack = new TestStack(app);

new IntegTest(app, 'kms-key-alias-tokenized', {
  testCases: [stack],
});

app.synth();

import { App, RemovalPolicy, Stack, Intrinsic } from 'aws-cdk-lib';
import { Key } from 'aws-cdk-lib/aws-kms';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();

const stack = new Stack(app, 'aws-cdk-kms-key-tokenized');
const token = new Intrinsic('token');

new Key(stack, 'MyKey', {
  removalPolicy: RemovalPolicy.DESTROY,
  alias: `MyKey${token}`,
});

new IntegTest(app, 'aws-cdk-kms-key-tokenized-test', {
  testCases: [stack],
});

app.synth();

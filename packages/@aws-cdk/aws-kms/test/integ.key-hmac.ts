import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Key, KeySpec } from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-cdk-kms-1');

new Key(stack, 'HmacKey', {
  keySpec: KeySpec.HMAC_512,
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'hmac-test', {
  testCases: [stack],
});

app.synth();
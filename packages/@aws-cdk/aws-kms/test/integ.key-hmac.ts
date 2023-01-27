import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Key, KeySpec, KeyUsage } from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-cdk-kms-hmac');

new Key(stack, 'MyHmacKey', {
  removalPolicy: RemovalPolicy.DESTROY,
  keyUsage: KeyUsage.GENERATE_VERIFY_MAC,
  keySpec: KeySpec.HMAC_512,
});

new IntegTest(app, 'HmacIntegTest', {
  testCases: [
    stack,
  ],
});

app.synth();



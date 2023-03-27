import { AccountRootPrincipal, Role } from '@aws-cdk/aws-iam';
import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Key, KeySpec, KeyUsage } from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-cdk-kms-hmac');

const role = new Role(stack, 'Role', {
  assumedBy: new AccountRootPrincipal(),
});

const key = new Key(stack, 'MyHmacKey', {
  removalPolicy: RemovalPolicy.DESTROY,
  keyUsage: KeyUsage.GENERATE_VERIFY_MAC,
  keySpec: KeySpec.HMAC_512,
});

key.grantGenerateMac(role);
key.grantVerifyMac(role);

new IntegTest(app, 'HmacIntegTest', {
  testCases: [
    stack,
  ],
});

app.synth();



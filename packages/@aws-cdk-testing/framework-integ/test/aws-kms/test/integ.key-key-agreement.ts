import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Key, KeySpec, KeyUsage } from 'aws-cdk-lib/aws-kms';

const app = new App();

const stack = new Stack(app, 'aws-cdk-kms-key-agreement');

new Key(stack, 'MyKeyAgreementKey', {
  removalPolicy: RemovalPolicy.DESTROY,
  keyUsage: KeyUsage.KEY_AGREEMENT,
  keySpec: KeySpec.ECC_NIST_P256,
});

new IntegTest(app, 'KeyAgreementIntegTest', {
  testCases: [
    stack,
  ],
});

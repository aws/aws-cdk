import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Key, KeySpec, KeyUsage } from 'aws-cdk-lib/aws-kms';

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


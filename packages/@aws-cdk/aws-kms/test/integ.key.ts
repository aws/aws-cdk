import * as iam from '@aws-cdk/aws-iam';
import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import { Key, KeySpec, KeyUsage } from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-cdk-kms-1');

const key = new Key(stack, 'MyKey', { removalPolicy: RemovalPolicy.DESTROY });

key.addToResourcePolicy(new iam.PolicyStatement({
  resources: ['*'],
  actions: ['kms:encrypt'],
  principals: [new iam.ArnPrincipal(stack.account)],
}));

key.addAlias('alias/bar');

new Key(stack, 'AsymmetricKey', {
  keySpec: KeySpec.ECC_NIST_P256,
  keyUsage: KeyUsage.SIGN_VERIFY,
  removalPolicy: RemovalPolicy.DESTROY,
});

app.synth();

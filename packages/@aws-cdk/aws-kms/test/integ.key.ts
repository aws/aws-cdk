import { PolicyStatement } from '@aws-cdk/aws-iam';
import iam = require('@aws-cdk/aws-iam');
import { App, Stack } from '@aws-cdk/cdk';
import { Key } from '../lib';

const app = new App();

const stack = new Stack(app, `aws-cdk-kms-1`);

const key = new Key(stack, 'MyKey', { retain: false });

key.addToResourcePolicy(new PolicyStatement({
  resources: ['*'],
  actions: ['kms:encrypt'],
  principals: [new iam.ArnPrincipal(stack.account)]
}));

key.addAlias('alias/bar');

app.synth();

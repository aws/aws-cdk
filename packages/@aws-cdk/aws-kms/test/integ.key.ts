import { PolicyStatement } from '@aws-cdk/aws-iam';
import { App, AwsAccountId, Stack } from '@aws-cdk/cdk';
import { EncryptionKey } from '../lib';

const app = new App();

const stack = new Stack(app, `aws-cdk-kms-1`);

const key = new EncryptionKey(stack, 'MyKey');

key.addToResourcePolicy(new PolicyStatement()
  .addAllResources()
  .addAction('kms:encrypt')
  .addAwsPrincipal(new AwsAccountId(stack).toString()));

key.addAlias('alias/bar');

app.run();

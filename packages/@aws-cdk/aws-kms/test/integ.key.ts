import { App, AwsAccountId, PolicyStatement, Stack } from '@aws-cdk/cdk';
import { EncryptionKey } from '../lib';

const app = new App(process.argv);

const stack = new Stack(app, `aws-cdk-kms-1`);

const key = new EncryptionKey(stack, 'MyKey');

key.addToResourcePolicy(new PolicyStatement()
  .addAllResources()
  .addAction('kms:encrypt')
  .addAwsPrincipal(new AwsAccountId().toString()));

key.addAlias('alias/bar');

process.stdout.write(app.run());

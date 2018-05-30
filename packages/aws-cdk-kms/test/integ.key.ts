import { App, AwsAccountId, PolicyStatement, Stack } from 'aws-cdk';
import { EncryptionKey } from '..';

const app = new App(process.argv);

const stack = new Stack(app, `aws-cdk-kms-1`);

const key = new EncryptionKey(stack, 'MyKey');

key.addToResourcePolicy(new PolicyStatement()
    .addResource('*')
    .addAction('kms:encrypt')
    .addAwsPrincipal(new AwsAccountId()));

key.addAlias('alias/foo');
key.addAlias('alias/bar');

process.stdout.write(app.run());

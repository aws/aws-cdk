import cdk = require('@aws-cdk/cdk');
import secretsmanager = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-integ');

/// !show
const loginSecret = new secretsmanager.SecretString(stack, 'Secret', { secretId: 'SomeLogin', });

// DO NOT ACTUALLY DO THIS, as this will expose your secret.
// This code only exists to show how the secret would be used.
new cdk.Output(stack, 'SecretUsername', { value: loginSecret.jsonFieldValue('username') });
new cdk.Output(stack, 'SecretPassword', { value: loginSecret.jsonFieldValue('password') });
/// !hide

app.run();
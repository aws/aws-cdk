import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import secretsmanager = require('../lib');

class ExampleStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    /// !show
    const loginSecret = secretsmanager.Secret.fromSecretAttributes(this, 'Secret', {
      secretArn: 'SomeLogin'
    });

    new iam.User(this, 'User', {
      // Get the 'password' field from the secret that looks like
      // { "username": "XXXX", "password": "YYYY" }
      password: loginSecret.secretJsonValue('password')
    });
    /// !hide

  }
}

const app = new cdk.App();
new ExampleStack(app, 'aws-cdk-secret-integ');
app.run();
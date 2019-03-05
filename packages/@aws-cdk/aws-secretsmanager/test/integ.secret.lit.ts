import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import secretsManager = require('../lib');

class SecretsManagerStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const role = new iam.Role(this, 'TestRole', { assumedBy: new iam.AccountRootPrincipal() });

    /// !show
    const secret = new secretsManager.Secret(this, 'Secret');
    secret.grantRead(role);

    new iam.User(this, 'User', {
      password: secret.stringValue
    });
    /// !hide
  }
}

const app = new cdk.App();
new SecretsManagerStack(app, 'Integ-SecretsManager-Secret');
app.run();

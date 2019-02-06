import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import secretsManager = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Integ-SecretsManager-Secret');
const role = new iam.Role(stack, 'TestRole', { assumedBy: new iam.AccountRootPrincipal() });

/// !show
const secret = new secretsManager.Secret(stack, 'Secret');
secret.grantRead(role);
/// !hide

app.run();

import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const secret = new secretsmanager.Secret(this, 'Secret');
    secret.addReplicaRegion('eu-central-1');
  }
}

const app = new cdk.App();
new TestStack(app, 'cdk-integ-secrets-replica');
app.synth();

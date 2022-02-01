import * as cdk from '@aws-cdk/core';
import * as secretsmanager from '../lib';

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

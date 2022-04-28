import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const secret = new secretsmanager.Secret(this, 'Secret');

    secret.addRotationSchedule('Schedule', {
      hostedRotation: secretsmanager.HostedRotation.mysqlSingleUser(),
    });
  }
}

const app = new cdk.App();
new TestStack(app, 'cdk-integ-secret-hosted-rotation');
app.synth();

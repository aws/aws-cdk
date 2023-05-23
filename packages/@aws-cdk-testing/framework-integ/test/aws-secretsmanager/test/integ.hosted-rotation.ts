import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const secret = new secretsmanager.Secret(this, 'Secret');
    secret.addRotationSchedule('Schedule', {
      hostedRotation: secretsmanager.HostedRotation.mysqlSingleUser(),
    });

    const customSecret = new secretsmanager.Secret(this, 'CustomSecret', {
      generateSecretString: {
        excludeCharacters: '&@/',
      },
    });
    customSecret.addRotationSchedule('Schedule', {
      hostedRotation: secretsmanager.HostedRotation.mysqlSingleUser(),
      rotateImmediatelyOnUpdate: false,
    });
  }
}

const app = new cdk.App();
new TestStack(app, 'cdk-integ-secret-hosted-rotation');
app.synth();

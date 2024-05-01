import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const key = new kms.Key(this, 'Key', { removalPolicy: cdk.RemovalPolicy.DESTROY });

    const secret = new secretsmanager.Secret(this, 'Secret', {
      encryptionKey: key,
    });

    secret.addRotationSchedule('Schedule', {
      rotationLambda: new lambda.Function(this, 'Lambda', {
        runtime: STANDARD_NODEJS_RUNTIME,
        handler: 'index.handler',
        code: lambda.Code.fromInline('NOOP'),
      }),
      automaticallyAfter: cdk.Duration.hours(4),
    });
  }
}

const app = new cdk.App();

const stack = new TestStack(app, 'cdk-integ-secret-lambda-rotation');

new integ.IntegTest(app, 'cdk-integ-secret-lambda-rotation-test', {
  testCases: [stack],
});

app.synth();

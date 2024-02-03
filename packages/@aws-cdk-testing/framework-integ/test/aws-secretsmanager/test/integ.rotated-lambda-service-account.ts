import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

export class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    const secret = new secretsmanager.Secret(this, 'Secret');
    const fn = new lambda.Function(this, 'Lambda', {
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromInline('NOOP'),
    });
    secret.addRotationSchedule('Schedule', {
      rotationLambda: fn,
    });
  }
}
const app = new cdk.App();
new integ.IntegTest(app, 'cdk-integ-secret-rotated-service-account', {
  testCases: [new TestStack(app, 'cdk-integ-secret-rotated-service-account-stack', {})],
});

import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as secretsmanager from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const secretFromCompleteArn = secretsmanager.Secret.fromSecretCompleteArn(this, 'Secret', 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret-f3gDy9');
    new lambda.Function(this, 'LambdaFunction', {
      code: lambda.Code.fromInline('foo'),
      handler: 'bar',
      runtime: lambda.Runtime.NODEJS,
      memorySize: cdk.Token.asNumber(secretFromCompleteArn.secretValueFromJson('memorySizeKey')),
    });
  }
}

const app = new cdk.App();
new TestStack(app, 'cdk-integ-secrets-fromArn');
app.synth();
import { Template } from '../../assertions';
import * as sm from '../../aws-secretsmanager';
import * as cdk from '../../core';
import * as lambda from '../lib';

describe('params and secrets', () => {
  test('can provide arn to enable params and secrets', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const secret = new sm.Secret(stack, 'Secret');
    const layerArn = 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4';

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: {
        paramsAndSecretsVersion: lambda.ParamsAndSecretsLayerVersion.fromParamsAndSecretsVersionArn(layerArn),
        secret,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [layerArn],
    });
    expect(() => app.synth()).not.toThrow();
  });

  test('can specify x86_64 architecture', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', { env: { account: '123456789012', region: 'us-west-2' } });
    const secret = new sm.Secret(app, 'Secret');

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: {
        paramsAndSecretsVersion: lambda.ParamsAndSecretsLayerVersion.FOR_X86_64,
        secret,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: ['arn:aws:lambda:us-west-2:345057560386:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4'],
    });
    expect(() => app.synth()).not.toThrow();
  });

  test('can specify arm64 architecture', () => {

  });

  test('role has kms:Decrypt for secret with encryption key', () => {

  });
});

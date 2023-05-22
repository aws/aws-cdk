import { Template } from '../../assertions';
import * as kms from '../../aws-kms';
import * as sm from '../../aws-secretsmanager';
import * as cdk from '../../core';
import * as lambda from '../lib';

function verifyRoleHasCorrectPolicies(stack: cdk.Stack) {
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    ManagedPolicyArns: [
      {
        'Fn::Join': [
          '',
          [
            'arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
          ],
        ],
      },
    ],
  });
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'secretsmanager:GetSecretValue',
          Effect: 'Allow',
          Resource: {
            Ref: 'SecretA720EF05',
          },
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'FunctionServiceRoleDefaultPolicy2F49994A',
    Roles: [
      {
        Ref: 'FunctionServiceRole675BB04A',
      },
    ],
  });
}

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
        layerVersion: lambda.ParamsAndSecretsLayerVersion.fromVersionArn(layerArn),
        secret,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [layerArn],
    });
    verifyRoleHasCorrectPolicies(stack);
    expect(() => app.synth()).not.toThrow();
  });

  test('can specify x86_64 architecture in non-agnostic stack', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', { env: { account: '123456789012', region: 'us-west-2' } });
    const secret = new sm.Secret(stack, 'Secret');

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: {
        layerVersion: lambda.ParamsAndSecretsLayerVersion.FOR_X86_64,
        secret,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: ['arn:aws:lambda:us-west-2:345057560386:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4'],
    });
    verifyRoleHasCorrectPolicies(stack);
    expect(() => app.synth()).not.toThrow();
  });

  test('can specify x86_64 architecture in agnostic stack', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const secret = new sm.Secret(stack, 'Secret');

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: {
        layerVersion: lambda.ParamsAndSecretsLayerVersion.FOR_X86_64,
        secret,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [
        {
          'Fn::FindInMap': [
            'ParamsandsecretslayerMap',
            {
              Ref: 'AWS::Region',
            },
            'x86x64',
          ],
        },
      ],
    });
    verifyRoleHasCorrectPolicies(stack);
    expect(() => app.synth()).not.toThrow();
  });

  test('can specify arm64 architecture in non-agnostic stack', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', { env: { account: '123456789012', region: 'us-west-2' } });
    const secret = new sm.Secret(stack, 'Secret');

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: {
        layerVersion: lambda.ParamsAndSecretsLayerVersion.FOR_ARM_64,
        secret,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: ['arn:aws:lambda:us-west-2:345057560386:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:4'],
    });
    verifyRoleHasCorrectPolicies(stack);
    expect(() => app.synth()).not.toThrow();
  });

  test('can specify arm64 architecture in agnostic stack', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const secret = new sm.Secret(stack, 'Secret');

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: {
        layerVersion: lambda.ParamsAndSecretsLayerVersion.FOR_ARM_64,
        secret,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
      Layers: [
        {
          'Fn::FindInMap': [
            'ParamsandsecretslayerMap',
            {
              Ref: 'AWS::Region',
            },
            'arm64',
          ],
        },
      ],
    });
    verifyRoleHasCorrectPolicies(stack);
    expect(() => app.synth()).not.toThrow();
  });

  test('role has kms:Decrypt for secret with encryption key', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const encryptionKey = new kms.Key(stack, 'Key');
    const secret = new sm.Secret(stack, 'Secret', { encryptionKey });

    // WHEN
    new lambda.Function (stack, 'Function', {
      functionName: 'lambda-function',
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      paramsAndSecrets: {
        layerVersion: lambda.ParamsAndSecretsLayerVersion.FOR_ARM_64,
        secret,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'secretsmanager:GetSecretValue',
            Effect: 'Allow',
            Resource: {
              Ref: 'SecretA720EF05',
            },
          },
          {
            Action: 'kms:Decrypt',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'Key961B73FD',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'FunctionServiceRoleDefaultPolicy2F49994A',
      Roles: [
        {
          Ref: 'FunctionServiceRole675BB04A',
        },
      ],
    });
  });

  test('can create two functions in a region agnostic stack with the same version', () => {

  });

  test('can create two functions with different architectures in agnostic stack', () => {

  });

  test('throws if arm64 is not available in region', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', { env: { account: '123456789012', region: 'eu-central-2' } });
    const secret = new sm.Secret(stack, 'Secret');

    // WHEN/THEN
    expect(() => {
      new lambda.Function (stack, 'Function', {
        functionName: 'lambda-function',
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        paramsAndSecrets: {
          layerVersion: lambda.ParamsAndSecretsLayerVersion.FOR_ARM_64,
          secret,
        },
      });
    }).toThrow('Parameters and Secrets Extension is not supported in region eu-central-2 for arm64 architecture');
  });
});

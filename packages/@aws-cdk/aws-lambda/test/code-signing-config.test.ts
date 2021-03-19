import '@aws-cdk/assert/jest';
import * as signer from '@aws-cdk/aws-signer';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

let app: cdk.App;
let stack: cdk.Stack;
beforeEach( () => {
  app = new cdk.App( {} );
  stack = new cdk.Stack( app );
} );

describe('code signing config', () => {
  test('default', () => {
    const platform = signer.Platform.AWS_LAMBDA_SHA384_ECDSA;
    const signingProfile = new signer.SigningProfile(stack, 'SigningProfile', { platform });
    new lambda.CodeSigningConfig(stack, 'CodeSigningConfig', {
      signingProfiles: [signingProfile],
    });

    expect(stack).toHaveResource('AWS::Lambda::CodeSigningConfig', {
      AllowedPublishers: {
        SigningProfileVersionArns: [{
          'Fn::GetAtt': [
            'SigningProfile2139A0F9',
            'ProfileVersionArn',
          ],
        }],
      },
      CodeSigningPolicies: {
        UntrustedArtifactOnDeployment: 'Warn',
      },
    });
  });

  test('with multiple signing profiles', () => {
    const signingProfile1 = new signer.SigningProfile(stack, 'SigningProfile1', { platform: signer.Platform.AWS_LAMBDA_SHA384_ECDSA });
    const signingProfile2 = new signer.SigningProfile(stack, 'SigningProfile2', { platform: signer.Platform.AMAZON_FREE_RTOS_DEFAULT });
    const signingProfile3 = new signer.SigningProfile(stack, 'SigningProfile3', { platform: signer.Platform.AWS_IOT_DEVICE_MANAGEMENT_SHA256_ECDSA });
    new lambda.CodeSigningConfig(stack, 'CodeSigningConfig', {
      signingProfiles: [signingProfile1, signingProfile2, signingProfile3],
    });

    expect(stack).toHaveResource('AWS::Lambda::CodeSigningConfig', {
      AllowedPublishers: {
        SigningProfileVersionArns: [
          {
            'Fn::GetAtt': [
              'SigningProfile1D4191686',
              'ProfileVersionArn',
            ],
          },
          {
            'Fn::GetAtt': [
              'SigningProfile2E013C934',
              'ProfileVersionArn',
            ],
          },
          {
            'Fn::GetAtt': [
              'SigningProfile3A38DE231',
              'ProfileVersionArn',
            ],
          },
        ],
      },
    });
  });

  test('with description and with untrustedArtifactOnDeployment of "ENFORCE"', () => {
    const platform = signer.Platform.AWS_LAMBDA_SHA384_ECDSA;
    const signingProfile = new signer.SigningProfile(stack, 'SigningProfile', { platform });
    new lambda.CodeSigningConfig(stack, 'CodeSigningConfig', {
      signingProfiles: [signingProfile],
      untrustedArtifactOnDeployment: lambda.UntrustedArtifactOnDeployment.ENFORCE,
      description: 'test description',
    });

    expect(stack).toHaveResource('AWS::Lambda::CodeSigningConfig', {
      CodeSigningPolicies: {
        UntrustedArtifactOnDeployment: 'Enforce',
      },
      Description: 'test description',
    });
  });

  test('import does not create any resources', () => {
    const codeSigningConfigId = 'aaa-xxxxxxxxxx';
    const codeSigningConfigArn = `arn:aws:lambda:::code-signing-config:${codeSigningConfigId}`;
    const codeSigningConfig = lambda.CodeSigningConfig.fromCodeSigningConfigArn(stack, 'Imported', codeSigningConfigArn );

    expect(codeSigningConfig.codeSigningConfigArn).toBe(codeSigningConfigArn);
    expect(codeSigningConfig.codeSigningConfigId).toBe(codeSigningConfigId);
    expect(stack).toCountResources('AWS::Lambda::CodeSigningConfig', 0);
  });

  test('fail import with malformed code signing config arn', () => {
    const codeSigningConfigArn = 'arn:aws:lambda:::code-signing-config';

    expect(() => lambda.CodeSigningConfig.fromCodeSigningConfigArn(stack, 'Imported', codeSigningConfigArn ) ).toThrow(/ARN must be in the format/);
  });
});

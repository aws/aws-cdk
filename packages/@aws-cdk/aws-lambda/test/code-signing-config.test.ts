import '@aws-cdk/assert/jest';
import * as signer from '@aws-cdk/aws-signer';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

const EXAMPLE_PLATFORM_ID = 'AWSLambda-SHA384-ECDSA';

let app: cdk.App;
let stack: cdk.Stack;
beforeEach( () => {
  app = new cdk.App( {} );
  stack = new cdk.Stack( app );
} );

describe('code signing config', () => {
  test('default', () => {
    const platformId = EXAMPLE_PLATFORM_ID;
    const signingProfile = new signer.SigningProfile(stack, 'SigningProfile', { platformId });
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
        UntrustedArtifactOnDeployment: lambda.UntrustedArtifactOnDeployment.WARN,
      },
    });
  });

  test('with multiple signing profiles', () => {
    const platformId = EXAMPLE_PLATFORM_ID;
    const signingProfile1 = new signer.SigningProfile(stack, 'SigningProfile1', { platformId });
    const signingProfile2 = new signer.SigningProfile(stack, 'SigningProfile2', { platformId });
    const signingProfile3 = new signer.SigningProfile(stack, 'SigningProfile3', { platformId });
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
      CodeSigningPolicies: {
        UntrustedArtifactOnDeployment: lambda.UntrustedArtifactOnDeployment.WARN,
      },
    });
  });

  test('with description and with untrustedArtifactOnDeployment of "ENFORCE"', () => {
    const platformId = EXAMPLE_PLATFORM_ID;
    const signingProfile = new signer.SigningProfile(stack, 'SigningProfile', { platformId });
    new lambda.CodeSigningConfig(stack, 'CodeSigningConfig', {
      signingProfiles: [signingProfile],
      untrustedArtifactOnDeployment: lambda.UntrustedArtifactOnDeployment.ENFORCE,
      description: 'test description',
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
        UntrustedArtifactOnDeployment: lambda.UntrustedArtifactOnDeployment.ENFORCE,
      },
      Description: 'test description',
    });
  });

  test('import dose not create any resources', () => {
    const codeSigningConfigId = 'aaa-xxxxxxxxxx';
    const codeSigningConfigArn = `arn:aws:lambda:::code-signing-config:${codeSigningConfigId}`;
    const codeSigningConfig = lambda.CodeSigningConfig.fromCodeSigningConfigArn(stack, 'Imported', codeSigningConfigArn );

    expect(codeSigningConfig.codeSigningConfigArn).toBe(codeSigningConfigArn);
    expect(codeSigningConfig.codeSigningConfigId).toBe(codeSigningConfigId);
    expect(stack).toMatchTemplate({});
  });
});

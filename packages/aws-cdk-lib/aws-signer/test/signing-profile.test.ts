import { Match, Template } from '../../assertions';
import * as cdk from '../../core';
import * as cxapi from '../../cx-api';
import * as signer from '../lib';

let app: cdk.App;
let stack: cdk.Stack;

function createApp(context: { [key: string]: any } = {}) {
  return new cdk.App({
    context,
  });
}

beforeEach(() => {
  app = createApp();
  stack = new cdk.Stack(app);
});

describe('signing profile', () => {
  test('default - no profile name provided', () => {
    const platform = signer.Platform.AWS_LAMBDA_SHA384_ECDSA;
    new signer.SigningProfile(stack, 'SigningProfile', { platform });

    Template.fromStack(stack).hasResourceProperties('AWS::Signer::SigningProfile', {
      PlatformId: platform.platformId,
      SignatureValidityPeriod: {
        Type: 'MONTHS',
        Value: 135,
      },
    });

    // Verify that ProfileName is not included when signingProfileName is not provided
    Template.fromStack(stack).hasResource('AWS::Signer::SigningProfile', {
      Properties: {
        ProfileName: Match.absent(),
      },
    });
  });

  test('feature flag behavior with different contexts', () => {
    // Test with feature flag explicitly enabled
    const appEnabled = createApp({
      [cxapi.SIGNER_PROFILE_NAME_PASSED_TO_CFN]: true,
    });
    const stackEnabled = new cdk.Stack(appEnabled);

    new signer.SigningProfile(stackEnabled, 'SigningProfile', {
      platform: signer.Platform.AWS_LAMBDA_SHA384_ECDSA,
      signingProfileName: 'explicit-enabled-profile',
    });

    Template.fromStack(stackEnabled).hasResourceProperties('AWS::Signer::SigningProfile', {
      ProfileName: 'explicit-enabled-profile',
    });

    // Test with feature flag explicitly disabled
    const appDisabled = createApp({
      [cxapi.SIGNER_PROFILE_NAME_PASSED_TO_CFN]: false,
    });
    const stackDisabled = new cdk.Stack(appDisabled);

    new signer.SigningProfile(stackDisabled, 'SigningProfile', {
      platform: signer.Platform.AWS_LAMBDA_SHA384_ECDSA,
      signingProfileName: 'explicit-disabled-profile',
    });

    Template.fromStack(stackDisabled).hasResource('AWS::Signer::SigningProfile', {
      Properties: {
        ProfileName: Match.absent(),
      },
    });
  });

  test('default with signature validity period', () => {
    const platform = signer.Platform.AWS_LAMBDA_SHA384_ECDSA;
    new signer.SigningProfile(stack, 'SigningProfile', {
      platform,
      signatureValidity: cdk.Duration.days(7),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Signer::SigningProfile', {
      PlatformId: platform.platformId,
      SignatureValidityPeriod: {
        Type: 'DAYS',
        Value: 7,
      },
    });
  });

  test('default with some tags', () => {
    const platform = signer.Platform.AWS_LAMBDA_SHA384_ECDSA;
    const signing = new signer.SigningProfile(stack, 'SigningProfile', { platform });

    cdk.Tags.of(signing).add('tag1', 'value1');
    cdk.Tags.of(signing).add('tag2', 'value2');
    cdk.Tags.of(signing).add('tag3', '');

    Template.fromStack(stack).hasResourceProperties('AWS::Signer::SigningProfile', {
      PlatformId: platform.platformId,
      SignatureValidityPeriod: {
        Type: 'MONTHS',
        Value: 135,
      },
      Tags: [
        {
          Key: 'tag1',
          Value: 'value1',
        },
        {
          Key: 'tag2',
          Value: 'value2',
        },
        {
          Key: 'tag3',
          Value: '',
        },
      ],
    });
  });

  test('default container registries with notation platform', () => {
    const platform = signer.Platform.NOTATION_OCI_SHA384_ECDSA;
    new signer.SigningProfile(stack, 'SigningProfile', { platform });

    Template.fromStack(stack).hasResourceProperties('AWS::Signer::SigningProfile', {
      PlatformId: platform.platformId,
      SignatureValidityPeriod: {
        Type: 'MONTHS',
        Value: 135,
      },
    });
  });

  test('with signing profile name - feature flag enabled', () => {
    // Create app with feature flag explicitly enabled
    const testApp = createApp({
      [cxapi.SIGNER_PROFILE_NAME_PASSED_TO_CFN]: true,
    });
    const testStack = new cdk.Stack(testApp);

    const platform = signer.Platform.AWS_LAMBDA_SHA384_ECDSA;
    new signer.SigningProfile(testStack, 'SigningProfile', {
      platform,
      signingProfileName: 'my-signing-profile',
    });

    // Check that the ProfileName is included in the template
    Template.fromStack(testStack).hasResource('AWS::Signer::SigningProfile', {
      Properties: {
        PlatformId: platform.platformId,
        ProfileName: 'my-signing-profile',
        SignatureValidityPeriod: {
          Type: 'MONTHS',
          Value: 135,
        },
      },
      Type: 'AWS::Signer::SigningProfile',
    });
  });

  test('with signing profile name - feature flag disabled', () => {
    // Create app with feature flag disabled
    const testApp = createApp({
      [cxapi.SIGNER_PROFILE_NAME_PASSED_TO_CFN]: false,
    });
    const testStack = new cdk.Stack(testApp);

    const platform = signer.Platform.AWS_LAMBDA_SHA384_ECDSA;
    new signer.SigningProfile(testStack, 'SigningProfile', {
      platform,
      signingProfileName: 'my-signing-profile',
    });

    // Verify that ProfileName is not included when feature flag is disabled
    Template.fromStack(testStack).hasResource('AWS::Signer::SigningProfile', {
      Properties: {
        PlatformId: platform.platformId,
        ProfileName: Match.absent(),
        SignatureValidityPeriod: {
          Type: 'MONTHS',
          Value: 135,
        },
      },
    });
  });

  describe('import', () => {
    test('from signingProfileProfileName and signingProfileProfileVersion', () => {
      const signingProfileName = 'test';
      const signingProfileVersion = 'xxxxxxxx';
      const signingProfile = signer.SigningProfile.fromSigningProfileAttributes(stack, 'Imported', {
        signingProfileName,
        signingProfileVersion,
      });

      expect(stack.resolve(signingProfile.signingProfileArn)).toStrictEqual(
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':signer:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              `://signing-profiles/${signingProfileName}`,
            ],
          ],
        },
      );
      expect(stack.resolve(signingProfile.signingProfileVersionArn)).toStrictEqual({
        'Fn::Join': [
          '',
          [
            'arn:',
            { Ref: 'AWS::Partition' },
            ':signer:',
            { Ref: 'AWS::Region' },
            ':',
            { Ref: 'AWS::AccountId' },
            `://signing-profiles/${signingProfileName}/${signingProfileVersion}`,
          ],
        ],
      });
      Template.fromStack(stack).templateMatches({});
    });
  });
});

import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as signer from '../lib';

const EXAMPLE_PLATFORM_ID = 'AWSLambda-SHA384-ECDSA';

let app: cdk.App;
let stack: cdk.Stack;
beforeEach( () => {
  app = new cdk.App( {} );
  stack = new cdk.Stack( app );
} );

describe('signing profile', () => {
  test( 'default', () => {
    const platformId = EXAMPLE_PLATFORM_ID;
    new signer.SigningProfile( stack, 'SigningProfile', { platformId } );

    expect(stack).toHaveResource('AWS::Signer::SigningProfile', {
      PlatformId: platformId,
      SignatureValidityPeriod: {
        Type: 'MONTHS',
        Value: 135,
      },
    });
  });

  test( 'default with signature validity period', () => {
    const platformId = EXAMPLE_PLATFORM_ID;
    new signer.SigningProfile( stack, 'SigningProfile', {
      platformId,
      signatureValidityPeriod: cdk.Duration.days( 7 ),
    } );

    expect(stack).toHaveResource('AWS::Signer::SigningProfile', {
      PlatformId: platformId,
      SignatureValidityPeriod: {
        Type: 'DAYS',
        Value: 7,
      },
    });
  });

  test( 'default with some tags', () => {
    const platformId = EXAMPLE_PLATFORM_ID;
    const signing = new signer.SigningProfile( stack, 'SigningProfile', { platformId } );

    cdk.Tags.of(signing).add('tag1', 'value1');
    cdk.Tags.of(signing).add('tag2', 'value2');
    cdk.Tags.of(signing).add('tag3', '');

    expect(stack).toHaveResource('AWS::Signer::SigningProfile', {
      PlatformId: platformId,
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

  describe('import', () => {
    test('from signingProfileProfileName and signingProfileProfileVersion', () => {
      const signingProfileProfileName = 'test';
      const signingProfileProfileVersion = 'xxxxxxxx';
      const signingProfile = signer.SigningProfile.fromSigningProfileAttributes(stack, 'Imported', {
        signingProfileProfileName,
        signingProfileProfileVersion,
      });

      expect(signingProfile.signingProfileArn).toBe(
        `arn:\${Token[AWS.Partition.3]}:signer:\${Token[AWS.Region.4]}:\${Token[AWS.AccountId.0]}://signing-profiles/${signingProfileProfileName}`,
      );
      expect(signingProfile.signingProfileProfileVersionArn).toBe(
        `arn:\${Token[AWS.Partition.3]}:signer:\${Token[AWS.Region.4]}:\${Token[AWS.AccountId.0]}://signing-profiles/${signingProfileProfileName}/${signingProfileProfileVersion}`,
      );
      expect(stack).toMatchTemplate({});
    });
  } );
});

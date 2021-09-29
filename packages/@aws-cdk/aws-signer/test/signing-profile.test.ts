import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as signer from '../lib';

let app: cdk.App;
let stack: cdk.Stack;
beforeEach( () => {
  app = new cdk.App( {} );
  stack = new cdk.Stack( app );
} );

describe('signing profile', () => {
  test( 'default', () => {
    const platform = signer.Platform.AWS_LAMBDA_SHA384_ECDSA;
    new signer.SigningProfile( stack, 'SigningProfile', { platform } );

    Template.fromStack(stack).hasResourceProperties('AWS::Signer::SigningProfile', {
      PlatformId: platform.platformId,
      SignatureValidityPeriod: {
        Type: 'MONTHS',
        Value: 135,
      },
    });
  });

  test( 'default with signature validity period', () => {
    const platform = signer.Platform.AWS_LAMBDA_SHA384_ECDSA;
    new signer.SigningProfile( stack, 'SigningProfile', {
      platform,
      signatureValidity: cdk.Duration.days( 7 ),
    } );

    Template.fromStack(stack).hasResourceProperties('AWS::Signer::SigningProfile', {
      PlatformId: platform.platformId,
      SignatureValidityPeriod: {
        Type: 'DAYS',
        Value: 7,
      },
    });
  });

  test( 'default with some tags', () => {
    const platform = signer.Platform.AWS_LAMBDA_SHA384_ECDSA;
    const signing = new signer.SigningProfile( stack, 'SigningProfile', { platform } );

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
  } );
});

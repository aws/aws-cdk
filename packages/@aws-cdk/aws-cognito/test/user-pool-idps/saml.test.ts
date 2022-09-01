import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { ProviderAttribute, UserPool, UserPoolIdentityProviderSaml } from '../../lib';

describe('UserPoolIdentityProvider', () => {
  describe('saml', () => {
    test('metadata URL', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderSaml(stack, 'userpoolidp', {
        userPool: pool,
        metadataUrl: 'https://my-metadata-url.com',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'userpoolidp',
        ProviderType: 'SAML',
        ProviderDetails: {
          MetadataURL: 'https://my-metadata-url.com',
          IDPSignout: false,
        },
      });
    });

    test('metadata file', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderSaml(stack, 'userpoolidp', {
        userPool: pool,
        metadataFile: 'my-file-contents',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'userpoolidp',
        ProviderType: 'SAML',
        ProviderDetails: {
          MetadataFile: 'my-file-contents',
          IDPSignout: false,
        },
      });
    });

    test('idpSignout', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderSaml(stack, 'userpoolidp', {
        userPool: pool,
        metadataFile: 'my-file-contents',
        idpSignout: true,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'userpoolidp',
        ProviderType: 'SAML',
        ProviderDetails: {
          MetadataFile: 'my-file-contents',
          IDPSignout: true,
        },
      });
    });

    test('registered with user pool', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      const provider = new UserPoolIdentityProviderSaml(stack, 'userpoolidp', {
        userPool: pool,
        metadataFile: 'my-file-contents',
      });

      // THEN
      expect(pool.identityProviders).toContain(provider);
    });

    test('attribute mapping', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderSaml(stack, 'userpoolidp', {
        userPool: pool,
        metadataFile: 'my-file-contents',
        attributeMapping: {
          familyName: ProviderAttribute.other('family_name'),
          givenName: ProviderAttribute.other('given_name'),
          custom: {
            customAttr1: ProviderAttribute.other('email'),
            customAttr2: ProviderAttribute.other('sub'),
          },
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        AttributeMapping: {
          family_name: 'family_name',
          given_name: 'given_name',
          customAttr1: 'email',
          customAttr2: 'sub',
        },
      });
    });

    test('with provider name', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderSaml(stack, 'userpoolidp', {
        userPool: pool,
        name: 'my-provider',
        metadataFile: 'my-file-contents',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'my-provider',
      });
    });

    test('throws with invalid provider name', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // THEN
      expect(() => new UserPoolIdentityProviderSaml(stack, 'userpoolidp', {
        userPool: pool,
        name: 'xy',
        metadataFile: 'my-file-contents',
      })).toThrow(/Expected provider name to be between 3 and 32 characters/);
    });

    test('throws when neither metadataUrl nor metadataFile is provided', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // THEN
      expect(() => new UserPoolIdentityProviderSaml(stack, 'userpoolidp', {
        userPool: pool,
      })).toThrow(/Specify exactly one of metadataUrl and metadataFile/);
    });

    test('throws when both metadataUrl and metadataFile are provided', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // THEN
      expect(() => new UserPoolIdentityProviderSaml(stack, 'userpoolidp', {
        userPool: pool,
        metadataUrl: 'https://my-metadata-url.com',
        metadataFile: 'my-file-contents',
      })).toThrow(/Specify exactly one of metadataUrl and metadataFile/);
    });

    test('generates a valid name when unique id is too short', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderSaml(stack, 'xy', {
        userPool: pool,
        metadataFile: 'my-file-contents',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'xysaml',
      });
    });

    test('generates a valid name when unique id is too long', () => {
      // GIVEN
      const stack = new Stack();
      const pool = new UserPool(stack, 'userpool');

      // WHEN
      new UserPoolIdentityProviderSaml(stack, `${'saml'.repeat(10)}xyz`, {
        userPool: pool,
        metadataFile: 'my-file-contents',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolIdentityProvider', {
        ProviderName: 'samlsamlsamlsamllsamlsamlsamlxyz',
      });
    });
  });
});

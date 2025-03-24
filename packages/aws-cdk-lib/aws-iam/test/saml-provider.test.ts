import { Template } from '../../assertions';
import { Stack } from '../../core';
import { SamlAssertionEncryptionMode, SamlMetadataDocument, SamlProvider, SamlPrivateKey } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('SAML provider', () => {
  new SamlProvider(stack, 'Provider', {
    metadataDocument: SamlMetadataDocument.fromXml('document'),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::SAMLProvider', {
    SamlMetadataDocument: 'document',
  });
});

test('SAML provider name', () => {
  new SamlProvider(stack, 'Provider', {
    metadataDocument: SamlMetadataDocument.fromXml('document'),
    name: 'provider-name',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::SAMLProvider', {
    SamlMetadataDocument: 'document',
    Name: 'provider-name',
  });
});

test('throws with invalid name', () => {
  expect(() => new SamlProvider(stack, 'Provider', {
    name: 'invalid name',
    metadataDocument: SamlMetadataDocument.fromXml('document'),
  })).toThrow(/Invalid SAML provider name/);
});

test('SAML provider with private key', () => {
  // GIVEN
  const privateKey = 'private-key-content';

  // WHEN
  new SamlProvider(stack, 'Provider', {
    metadataDocument: SamlMetadataDocument.fromXml('document'),
    privateKey,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::SAMLProvider', {
    SamlMetadataDocument: 'document',
    AddPrivateKey: 'private-key-content',
  });
});

test('SAML provider with encryption mode allowed', () => {
  // GIVEN
  const encryptionMode = SamlAssertionEncryptionMode.ALLOWED;

  // WHEN
  new SamlProvider(stack, 'Provider', {
    metadataDocument: SamlMetadataDocument.fromXml('document'),
    encryptionMode,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::SAMLProvider', {
    SamlMetadataDocument: 'document',
    AssertionEncryptionMode: 'Allowed',
  });
});

test('SAML provider with encryption mode required', () => {
  // GIVEN
  const encryptionMode = SamlAssertionEncryptionMode.REQUIRED;

  // WHEN
  new SamlProvider(stack, 'Provider', {
    metadataDocument: SamlMetadataDocument.fromXml('document'),
    encryptionMode,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::SAMLProvider', {
    SamlMetadataDocument: 'document',
    AssertionEncryptionMode: 'Required',
  });
});

test('SAML provider with existing private keys', () => {
  // GIVEN
  const existingPrivateKeys: SamlPrivateKey[] = [
    {
      keyId: 'key1',
      timestamp: '2023-01-01T12:00:00Z',
    },
    {
      keyId: 'key2',
      timestamp: '2023-02-01T12:00:00Z',
    },
  ];

  // WHEN
  new SamlProvider(stack, 'Provider', {
    metadataDocument: SamlMetadataDocument.fromXml('document'),
    existingPrivateKeys,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::SAMLProvider', {
    SamlMetadataDocument: 'document',
    PrivateKeyList: [
      {
        KeyId: 'key1',
        Timestamp: '2023-01-01T12:00:00Z',
      },
      {
        KeyId: 'key2',
        Timestamp: '2023-02-01T12:00:00Z',
      },
    ],
  });
});

test('SAML provider with remove private key ID', () => {
  // GIVEN
  const removePrivateKeyId = 'key-to-remove';

  // WHEN
  new SamlProvider(stack, 'Provider', {
    metadataDocument: SamlMetadataDocument.fromXml('document'),
    removePrivateKeyId,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::SAMLProvider', {
    SamlMetadataDocument: 'document',
    RemovePrivateKey: 'key-to-remove',
  });
});

test('SAML provider with all new properties', () => {
  // GIVEN
  const privateKey = 'private-key-content';
  const encryptionMode = SamlAssertionEncryptionMode.REQUIRED;
  const existingPrivateKeys: SamlPrivateKey[] = [
    {
      keyId: 'key1',
      timestamp: '2023-01-01T12:00:00Z',
    },
  ];
  const removePrivateKeyId = 'key-to-remove';

  // WHEN
  new SamlProvider(stack, 'Provider', {
    metadataDocument: SamlMetadataDocument.fromXml('document'),
    privateKey,
    encryptionMode,
    existingPrivateKeys,
    removePrivateKeyId,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::SAMLProvider', {
    SamlMetadataDocument: 'document',
    AddPrivateKey: 'private-key-content',
    AssertionEncryptionMode: 'Required',
    PrivateKeyList: [
      {
        KeyId: 'key1',
        Timestamp: '2023-01-01T12:00:00Z',
      },
    ],
    RemovePrivateKey: 'key-to-remove',
  });
});

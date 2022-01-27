import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { SamlMetadataDocument, SamlProvider } from '../lib';

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

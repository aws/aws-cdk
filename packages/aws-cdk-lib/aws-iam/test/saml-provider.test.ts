import { Template } from '../../assertions';
import { Stack } from '../../core';
import { SamlMetadataDocument, SamlProvider } from '../lib';

const dummySamlMetadata = '<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://idp.example.com">' + 'x'.repeat(1000) + '</md:EntityDescriptor>';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('SAML provider', () => {
  new SamlProvider(stack, 'Provider', {
    metadataDocument: SamlMetadataDocument.fromXml(dummySamlMetadata),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::SAMLProvider', {
    SamlMetadataDocument: dummySamlMetadata,
  });
});

test('SAML provider name', () => {
  new SamlProvider(stack, 'Provider', {
    metadataDocument: SamlMetadataDocument.fromXml(dummySamlMetadata),
    name: 'provider-name',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::SAMLProvider', {
    SamlMetadataDocument: dummySamlMetadata,
    Name: 'provider-name',
  });
});

test('throws with invalid name', () => {
  expect(() => new SamlProvider(stack, 'Provider', {
    name: 'invalid name',
    metadataDocument: SamlMetadataDocument.fromXml(dummySamlMetadata),
  })).toThrow(/Invalid SAML provider name/);
});

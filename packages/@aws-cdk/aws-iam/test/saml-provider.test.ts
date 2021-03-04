import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import { SamlProvider } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('SAML provider', () => {
  new SamlProvider(stack, 'Provider', {
    metadataDocument: 'document',
  });

  expect(stack).toHaveResource('AWS::IAM::SAMLProvider', {
    SamlMetadataDocument: 'document',
  });
});

test('throws with invalid name', () => {
  expect(() => new SamlProvider(stack, 'Provider', {
    name: 'invalid name',
    metadataDocument: 'document',
  })).toThrow(/Invalid SAML provider name/);
});

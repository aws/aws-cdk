import { Template } from '../../assertions';
import { App, Stack, Token } from '../../core';
import * as iam from '../lib';

const arnOfProvider =
  'arn:aws:iam::1234567:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/someid';

describe('OidcProvider resource', () => {
  test('"OIDCProviderArn" resolves to the ref', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const provider = new iam.OidcProviderNative(stack, 'MyProvider', {
      url: 'https://openid-endpoint',
      thumbprints: ['thumbprint'],
    });

    // THEN
    expect(stack.resolve(provider.oidcProviderArn)).toStrictEqual({
      Ref: 'MyProvider730BA1C8',
    });
  });

  test('static fromOidcProviderArn can be used to import a provider', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const provider = iam.OidcProviderNative.fromOidcProviderArn(
      stack,
      'MyProvider',
      arnOfProvider,
    );

    // THEN
    expect(stack.resolve(provider.oidcProviderArn)).toStrictEqual(
      arnOfProvider,
    );
  });

  test('thumbprint list and client ids can be specified', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new iam.OidcProviderNative(stack, 'MyProvider', {
      url: 'https://my-url',
      clientIds: ['client1', 'client2'],
      thumbprints: ['thumb1'],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::OIDCProvider', {
      Url: 'https://my-url',
      ClientIdList: ['client1', 'client2'],
      ThumbprintList: ['thumb1'],
    });
  });
});

describe('OIDC issuer', () => {
  test('extract issuer properly in the new provider', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const provider = new iam.OidcProviderNative(stack, 'MyProvider', {
      url: 'https://my-issuer',
      thumbprints: ['thumb1'],
    });

    // THEN
    expect(stack.resolve(provider.oidcProviderIssuer)).toStrictEqual({
      'Fn::Select': [
        1,
        { 'Fn::Split': [':oidc-provider/', { Ref: 'MyProvider730BA1C8' }] },
      ],
    });
  });

  test('extract issuer properly in a literal imported provider', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const provider = iam.OidcProviderNative.fromOidcProviderArn(
      stack,
      'MyProvider',
      arnOfProvider,
    );

    // THEN
    expect(stack.resolve(provider.oidcProviderIssuer)).toStrictEqual(
      'oidc.eks.us-east-1.amazonaws.com/id/someid',
    );
  });

  test('extract issuer properly in a Token imported provider', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const provider = iam.OidcProviderNative.fromOidcProviderArn(
      stack,
      'MyProvider',
      Token.asString({ Ref: 'ARN' }),
    );

    // THEN
    expect(stack.resolve(provider.oidcProviderIssuer)).toStrictEqual({
      'Fn::Select': [1, { 'Fn::Split': [':oidc-provider/', { Ref: 'ARN' }] }],
    });
  });
});

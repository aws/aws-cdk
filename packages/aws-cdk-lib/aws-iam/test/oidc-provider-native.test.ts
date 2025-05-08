import { Template } from '../../assertions';
import { Stack, Token } from '../../core';
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
      thumbprints: ['a909502dd82ae41433e6f83886b00d4277a32a7b'],
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
      thumbprints: ['a909502dd82ae41433e6f83886b00d4277a32a7b'],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::OIDCProvider', {
      Url: 'https://my-url',
      ClientIdList: ['client1', 'client2'],
      ThumbprintList: ['a909502dd82ae41433e6f83886b00d4277a32a7b'],
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
      thumbprints: ['a909502dd82ae41433e6f83886b00d4277a32a7b'],
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

describe('ValidationError checks', () => {
  test('URL property must begin with https://', () => {
    // GIVEN
    const stack = new Stack();

    expect(() =>
      // WHEN
      new iam.OidcProviderNative(stack, 'SomeProvider', {
        url: 'https://example.com',
      }),
      // THEN
    ).not.toThrow();

    expect(() =>
      new iam.OidcProviderNative(stack, 'SomeOtherProvider', {
        url: 'http://example.com',
      }),
    ).toThrow('The URL of the identity provider must start with https://');
  });

  test('maximum allowed number of clientIds is 100', () => {
    // GIVEN
    const stack = new Stack();

    expect(() => {
      // WHEN
      new iam.OidcProviderNative(stack, 'SomeProvider', {
        url: 'https://example.com',
        clientIds: new Array(100).fill('clientId'),
      });
      // THEN
    }).not.toThrow();

    expect(() => {
      // WHEN
      new iam.OidcProviderNative(stack, 'SomeOtherProvider', {
        url: 'https://example.com',
        clientIds: new Array(101).fill('clientId'),
      });
      // THEN
    }).toThrow('The maximum number of clients that can be registered is 100');
  });

  test('clientId max length is 255', () => {
    // GIVEN
    const stack = new Stack();

    expect(() => {
      // WHEN
      new iam.OidcProviderNative(stack, 'SomeProvider', {
        url: 'https://example.com',
        clientIds: new Array(10).fill('c').map((x) => x.repeat(255)),
      });
      // THEN
    }).not.toThrow();

    expect(() => {
      // WHEN
      new iam.OidcProviderNative(stack, 'SomeOtherProvider', {
        url: 'https://example.com',
        clientIds: new Array(10).fill('c').map((x) => x.repeat(256)),
      });
      // THEN
    }).toThrow('The maximum length of a client ID is 255 characters');
  });

  test('thumbprints[] is optional, but if provided, must be 5 or less', () => {
    // GIVEN
    const stack = new Stack();

    expect(() => {
      // WHEN
      new iam.OidcProviderNative(stack, 'SomeProvider', {
        url: 'https://example.com',
        thumbprints: new Array(5).fill('a909502dd82ae41433e6f83886b00d4277a32a7b'),
      });
      // THEN
    }).not.toThrow();

    expect(() => {
      // WHEN
      new iam.OidcProviderNative(stack, 'SomeOtherProvider', {
        url: 'https://example.com',
        thumbprints: new Array(6).fill('a909502dd82ae41433e6f83886b00d4277a32a7b'),
      });
      // THEN
    }).toThrow('The maximum number of thumbprints is 5');
  });

  test('The length of a thumbprint must be 40 characters', () => {
    // GIVEN
    const stack = new Stack();

    expect(() => {
      // WHEN
      new iam.OidcProviderNative(stack, 'SomeProvider', {
        url: 'https://example.com',
        thumbprints: new Array(5).fill('a909502dd82ae41433e6f83886b00d4277a32a7b'),
      });
      // THEN
    }).not.toThrow();

    expect(() => {
      // WHEN
      new iam.OidcProviderNative(stack, 'SomeOtherProvider', {
        url: 'https://otherexample.com',
        thumbprints: new Array(5).fill('111'),
      });
      // THEN
    }).toThrow('The length of a thumbprint must be 40 characters');

    expect(() => {
      // WHEN
      new iam.OidcProviderNative(stack, 'NewProvider', {
        url: 'https://newexample.com',
        thumbprints: new Array(5).fill('1').map((x) => x.repeat(41)),
      });
      // THEN
    }).toThrow('The length of a thumbprint must be 40 characters');
  });

  test('All thumbprints must in hexadecimal format', () => {
    // GIVEN
    const stack = new Stack();

    expect(() => {
      // WHEN
      new iam.OidcProviderNative(stack, 'SomeProvider', {
        url: 'https://example.com',
        thumbprints: new Array(5).fill('g909502dd82ae41433e6f83886b00d4277a32a7b'),
      });

      // THEN
    }).toThrow('All thumbprints must be in hexadecimal format');
  });
});

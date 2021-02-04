import * as path from 'path';
import '@aws-cdk/assert/jest';
import { expect as expectStack } from '@aws-cdk/assert';
import { App, Stack } from '@aws-cdk/core';
import { Key, PublicKey } from '../lib';

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAudf8/iNkQgdvjEdm6xYS
JAyxd/kGTbJfQNg9YhInb7TSm0dGu0yx8yZ3fnpmxuRPqJIlaVr+fT4YRl71gEYa
dlhHmnVegyPNjP9dNqZ7zwNqMEPOPnS/NOHbJj1KYKpn1f8pPNycQ5MQCntKGnSj
6fc+nbcC0joDvGz80xuy1W4hLV9oC9c3GT26xfZb2jy9MVtA3cppNuTwqrFi3t6e
0iGpraxZlT5wewjZLpQkngqYr6s3aucPAZVsGTEYPo4nD5mswmtZOm+tgcOrivtD
/3sD/qZLQ6c5siqyS8aTraD6y+VXugujfarTU65IeZ6QAUbLMsWuZOIi5Jn8zAwx
NQIDAQAB
-----END PUBLIC KEY-----`;

describe('PublicKey', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'testregion' },
    });
  });

  test('import existing key group by id', () => {
    const publicKeyId = 'K36X4X2EO997HM';
    const pubKey = PublicKey.fromPublicKeyId(stack, 'MyPublicKey', publicKeyId);
    expect(pubKey.publicKeyId).toEqual(publicKeyId);
  });

  test('inline key', () => {
    new PublicKey(stack, 'MyPublicKey', {
      encodedKey: Key.fromInline(publicKey),
    });
  });

  test('key from filesystem', () => {
    new PublicKey(stack, 'MyPublicKey', {
      encodedKey: Key.fromFile(path.join(__dirname, 'pem/pubkey-good.test.pem')),
    });
  });

  test('minimal example', () => {
    new PublicKey(stack, 'MyPublicKey', {
      encodedKey: Key.fromInline(publicKey),
    });

    expectStack(stack).toMatch({
      Resources: {
        MyPublicKey78071F3D: {
          Type: 'AWS::CloudFront::PublicKey',
          Properties: {
            PublicKeyConfig: {
              CallerReference: 'c872d91ae0d2943aad25d4b31f1304d0a62c658ace',
              EncodedKey: publicKey,
              Name: 'StackMyPublicKey36EDA6AB',
            },
          },
        },
      },
    });
  });

  test('maximum example', () => {
    new PublicKey(stack, 'MyPublicKey', {
      publicKeyName: 'pub-key',
      encodedKey: Key.fromInline(publicKey),
      comment: 'Key expiring on 1/1/1984',
    });

    expectStack(stack).toMatch({
      Resources: {
        MyPublicKey78071F3D: {
          Type: 'AWS::CloudFront::PublicKey',
          Properties: {
            PublicKeyConfig: {
              CallerReference: 'c872d91ae0d2943aad25d4b31f1304d0a62c658ace',
              Comment: 'Key expiring on 1/1/1984',
              EncodedKey: publicKey,
              Name: 'pub-key',
            },
          },
        },
      },
    });
  });

  test('bad key example', () => {
    expect(() => new PublicKey(stack, 'MyPublicKey', {
      publicKeyName: 'pub-key',
      encodedKey: Key.fromInline('bad-key'),
      comment: 'Key expiring on 1/1/1984',
    })).toThrow(/Public key must be in PEM format [(]with the BEGIN\/END PUBLIC KEY lines[)]; got (.*?)/);
  });

  test('good public key example', () => {
    new PublicKey(stack, 'MyPublicKey', {
      encodedKey: Key.fromFile(path.join(__dirname, 'pem/pubkey-good.test.pem')),
    });

    expectStack(stack).toMatch({
      Resources: {
        MyPublicKey78071F3D: {
          Type: 'AWS::CloudFront::PublicKey',
          Properties: {
            PublicKeyConfig: {
              CallerReference: 'c872d91ae0d2943aad25d4b31f1304d0a62c658ace',
              EncodedKey: publicKey,
              Name: 'StackMyPublicKey36EDA6AB',
            },
          },
        },
      },
    });
  });

  test('bad public key example', () => {
    expect(() => new PublicKey(stack, 'MyPublicKey', {
      encodedKey: Key.fromFile(path.join(__dirname, 'pem/pubkey-bad.test.pem')),
    })).toThrow(/Public key must be in PEM format [(]with the BEGIN\/END PUBLIC KEY lines[)]; got (.*?)/);
  });

  test('empty key example', () => {
    expect(() => new PublicKey(stack, 'MyPublicKey', {
      encodedKey: Key.fromInline(''),
    })).toThrow(/Encoded key inline value cannot be empty/);
  });

  test('large key example', () => {
    expect(() => new PublicKey(stack, 'MyPublicKey', {
      encodedKey: Key.fromFile(path.join(__dirname, 'pem/pubkey-large.test.pem')),
    })).toThrow(/Encoded key inline value is too large, must be <= 4096 but is (.*?)/);
  });
});
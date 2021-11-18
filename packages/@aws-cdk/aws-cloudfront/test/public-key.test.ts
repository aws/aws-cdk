import '@aws-cdk/assert-internal/jest';
import { expect as expectStack } from '@aws-cdk/assert-internal';
import { App, Stack } from '@aws-cdk/core';
import { PublicKey } from '../lib';

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

  test('minimal example', () => {
    new PublicKey(stack, 'MyPublicKey', {
      encodedKey: publicKey,
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
      encodedKey: publicKey,
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
      encodedKey: 'bad-key',
      comment: 'Key expiring on 1/1/1984',
    })).toThrow(/Public key must be in PEM format [(]with the BEGIN\/END PUBLIC KEY lines[)]; got (.*?)/);
  });
});
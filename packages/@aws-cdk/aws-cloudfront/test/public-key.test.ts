import '@aws-cdk/assert/jest';
import { App, Stack } from '@aws-cdk/core';
import { PublicKey } from '../lib';

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
    const publicKey = PublicKey.fromPublicKeyId(stack, 'MyPublicKey', publicKeyId);
    expect(publicKey.publicKeyId).toEqual(publicKeyId);
  });

  test('minimal example', () => {
    new PublicKey(stack, 'MyPublicKey', {
      encodedKey: 'encoded-key',
    });

    expect(stack).toHaveResource('AWS::CloudFront::PublicKey', {
      PublicKeyConfig: {
        Name: 'StackMyPublicKey36EDA6AB',
        CallerReference: 'c872d91ae0d2943aad25d4b31f1304d0a62c658ace',
        EncodedKey: 'encoded-key',
      },
    });
  });

  test('maximum example', () => {
    new PublicKey(stack, 'MyPublicKey', {
      publicKeyName: 'pub-key',
      encodedKey: 'encoded-key',
      comment: 'Key expiring on 1/1/1984',
    });

    expect(stack).toHaveResource('AWS::CloudFront::PublicKey', {
      PublicKeyConfig: {
        Name: 'pub-key',
        CallerReference: 'c872d91ae0d2943aad25d4b31f1304d0a62c658ace',
        EncodedKey: 'encoded-key',
        Comment: 'Key expiring on 1/1/1984',
      },
    });
  });
});
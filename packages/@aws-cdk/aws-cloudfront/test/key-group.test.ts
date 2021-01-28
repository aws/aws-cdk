import '@aws-cdk/assert/jest';
import { App, Stack } from '@aws-cdk/core';
import { KeyGroup, PublicKey } from '../lib';

describe('KeyGroup', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'testregion' },
    });
  });

  test('import existing key group by id', () => {
    const keyGroupId = '344f6fe5-7ce5-4df0-a470-3f14177c549c';
    const keyGroup = KeyGroup.fromKeyGroupId(stack, 'MyKeyGroup', keyGroupId);
    expect(keyGroup.keyGroupId).toEqual(keyGroupId);
  });

  test('minimal example', () => {
    new KeyGroup(stack, 'MyKeyGroup', {
      items: [
        new PublicKey(stack, 'MyPublicKey', {
          encodedKey: 'encoded-key',
        }),
      ],
    });

    expect(stack).toHaveResource('AWS::CloudFront::KeyGroup', {
      KeyGroupConfig: {
        Name: 'StackMyKeyGroupC9D82374',
        Items: [
          {
            Ref: 'MyPublicKey78071F3D',
          },
        ],
      },
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
    new KeyGroup(stack, 'MyKeyGroup', {
      keyGroupName: 'AcmeKeyGroup',
      comment: 'Key group created on 1/1/1984',
      items: [
        new PublicKey(stack, 'MyPublicKey', {
          publicKeyName: 'pub-key',
          encodedKey: 'encoded-key',
          comment: 'Key expiring on 1/1/1984',
        }),
      ],
    });

    expect(stack).toHaveResource('AWS::CloudFront::KeyGroup', {
      KeyGroupConfig: {
        Name: 'AcmeKeyGroup',
        Comment: 'Key group created on 1/1/1984',
        Items: [
          {
            Ref: 'MyPublicKey78071F3D',
          },
        ],
      },
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

  test('multiple keys example', () => {
    new KeyGroup(stack, 'MyKeyGroup', {
      keyGroupName: 'AcmeKeyGroup',
      comment: 'Key group created on 1/1/1984',
      items: [
        new PublicKey(stack, 'MyPublicKey1', {
          publicKeyName: 'Bingo-Key',
          encodedKey: 'encoded-key',
          comment: 'Key expiring on 1/1/1984',
        }),
        new PublicKey(stack, 'MyPublicKey2', {
          publicKeyName: 'Rolly-Key',
          encodedKey: 'encoded-key',
          comment: 'Key expiring on 1/1/1984',
        }),
      ],
    });

    expect(stack).toHaveResource('AWS::CloudFront::KeyGroup', {
      KeyGroupConfig: {
        Name: 'AcmeKeyGroup',
        Comment: 'Key group created on 1/1/1984',
        Items: [
          {
            Ref: 'MyPublicKey153715628',
          },
          {
            Ref: 'MyPublicKey23469100D',
          },
        ],
      },
    });

    expect(stack).toHaveResource('AWS::CloudFront::PublicKey', {
      PublicKeyConfig: {
        Name: 'Bingo-Key',
        CallerReference: 'c81ef73d09656cdf6d0893f1bfb461fa3c13d1b3bb',
        EncodedKey: 'encoded-key',
        Comment: 'Key expiring on 1/1/1984',
      },
    });

    expect(stack).toHaveResource('AWS::CloudFront::PublicKey', {
      PublicKeyConfig: {
        Name: 'Rolly-Key',
        CallerReference: 'c8730c508b0cf6227f78d85a808a7e2eb2561375ea',
        EncodedKey: 'encoded-key',
        Comment: 'Key expiring on 1/1/1984',
      },
    });
  });
});
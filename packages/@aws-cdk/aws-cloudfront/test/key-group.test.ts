import { Template } from '@aws-cdk/assertions';
import { App, Stack } from '@aws-cdk/core';
import { KeyGroup, PublicKey } from '../lib';

const publicKey1 = `-----BEGIN PUBLIC KEY-----
FIRST_KEYgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAudf8/iNkQgdvjEdm6xYS
JAyxd/kGTbJfQNg9YhInb7TSm0dGu0yx8yZ3fnpmxuRPqJIlaVr+fT4YRl71gEYa
dlhHmnVegyPNjP9dNqZ7zwNqMEPOPnS/NOHbJj1KYKpn1f8pPNycQ5MQCntKGnSj
6fc+nbcC0joDvGz80xuy1W4hLV9oC9c3GT26xfZb2jy9MVtA3cppNuTwqrFi3t6e
0iGpraxZlT5wewjZLpQkngqYr6s3aucPAZVsGTEYPo4nD5mswmtZOm+tgcOrivtD
/3sD/qZLQ6c5siqyS8aTraD6y+VXugujfarTU65IeZ6QAUbLMsWuZOIi5Jn8zAwx
NQIDAQAB
-----END PUBLIC KEY-----`;

const publicKey2 = `-----BEGIN PUBLIC KEY-----
SECOND_KEYkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAudf8/iNkQgdvjEdm6xYS
JAyxd/kGTbJfQNg9YhInb7TSm0dGu0yx8yZ3fnpmxuRPqJIlaVr+fT4YRl71gEYa
dlhHmnVegyPNjP9dNqZ7zwNqMEPOPnS/NOHbJj1KYKpn1f8pPNycQ5MQCntKGnSj
6fc+nbcC0joDvGz80xuy1W4hLV9oC9c3GT26xfZb2jy9MVtA3cppNuTwqrFi3t6e
0iGpraxZlT5wewjZLpQkngqYr6s3aucPAZVsGTEYPo4nD5mswmtZOm+tgcOrivtD
/3sD/qZLQ6c5siqyS8aTraD6y+VXugujfarTU65IeZ6QAUbLMsWuZOIi5Jn8zAwx
NQIDAQAB
-----END PUBLIC KEY-----`;

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
          encodedKey: publicKey1,
        }),
      ],
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyPublicKey78071F3D: {
          Type: 'AWS::CloudFront::PublicKey',
          Properties: {
            PublicKeyConfig: {
              CallerReference: 'c872d91ae0d2943aad25d4b31f1304d0a62c658ace',
              EncodedKey: publicKey1,
              Name: 'StackMyPublicKey36EDA6AB',
            },
          },
        },
        MyKeyGroupAF22FD35: {
          Type: 'AWS::CloudFront::KeyGroup',
          Properties: {
            KeyGroupConfig: {
              Items: [
                {
                  Ref: 'MyPublicKey78071F3D',
                },
              ],
              Name: 'StackMyKeyGroupC9D82374',
            },
          },
        },
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
          encodedKey: publicKey1,
          comment: 'Key expiring on 1/1/1984',
        }),
      ],
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyPublicKey78071F3D: {
          Type: 'AWS::CloudFront::PublicKey',
          Properties: {
            PublicKeyConfig: {
              CallerReference: 'c872d91ae0d2943aad25d4b31f1304d0a62c658ace',
              EncodedKey: publicKey1,
              Name: 'pub-key',
              Comment: 'Key expiring on 1/1/1984',
            },
          },
        },
        MyKeyGroupAF22FD35: {
          Type: 'AWS::CloudFront::KeyGroup',
          Properties: {
            KeyGroupConfig: {
              Items: [
                {
                  Ref: 'MyPublicKey78071F3D',
                },
              ],
              Name: 'AcmeKeyGroup',
              Comment: 'Key group created on 1/1/1984',
            },
          },
        },
      },
    });
  });

  test('multiple keys example', () => {
    new KeyGroup(stack, 'MyKeyGroup', {
      keyGroupName: 'AcmeKeyGroup',
      comment: 'Key group created on 1/1/1984',
      items: [
        new PublicKey(stack, 'BingoKey', {
          publicKeyName: 'Bingo-Key',
          encodedKey: publicKey1,
          comment: 'Key expiring on 1/1/1984',
        }),
        new PublicKey(stack, 'RollyKey', {
          publicKeyName: 'Rolly-Key',
          encodedKey: publicKey2,
          comment: 'Key expiring on 1/1/1984',
        }),
      ],
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        BingoKeyCBEC786C: {
          Type: 'AWS::CloudFront::PublicKey',
          Properties: {
            PublicKeyConfig: {
              CallerReference: 'c847cb3dc23f619c0a1e400a44afaf1060d27a1d1a',
              EncodedKey: publicKey1,
              Name: 'Bingo-Key',
              Comment: 'Key expiring on 1/1/1984',
            },
          },
        },
        RollyKey83F8BC5B: {
          Type: 'AWS::CloudFront::PublicKey',
          Properties: {
            PublicKeyConfig: {
              CallerReference: 'c83a16945c386bf6cd88a3aaa1aa603eeb4b6c6c57',
              EncodedKey: publicKey2,
              Name: 'Rolly-Key',
              Comment: 'Key expiring on 1/1/1984',
            },
          },
        },
        MyKeyGroupAF22FD35: {
          Type: 'AWS::CloudFront::KeyGroup',
          Properties: {
            KeyGroupConfig: {
              Items: [
                {
                  Ref: 'BingoKeyCBEC786C',
                },
                {
                  Ref: 'RollyKey83F8BC5B',
                },
              ],
              Name: 'AcmeKeyGroup',
              Comment: 'Key group created on 1/1/1984',
            },
          },
        },
      },
    });
  });
});

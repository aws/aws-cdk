import { exactlyMatchTemplate, expect } from '@aws-cdk/assert';
import { App, PolicyDocument, PolicyStatement, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { EncryptionKey } from '../lib';

export = {
  'default key'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    new EncryptionKey(stack, 'MyKey');

    expect(app.synthesizeStack(stack.name)).to(exactlyMatchTemplate({
      Resources: {
      MyKey6AB29FA6: {
        Type: "AWS::KMS::Key",
        Properties: {
        KeyPolicy: {
          Statement: [
          {
            Action: [
            "kms:Create*",
            "kms:Describe*",
            "kms:Enable*",
            "kms:List*",
            "kms:Put*",
            "kms:Update*",
            "kms:Revoke*",
            "kms:Disable*",
            "kms:Get*",
            "kms:Delete*",
            "kms:ScheduleKeyDeletion",
            "kms:CancelKeyDeletion"
            ],
            Effect: "Allow",
            Principal: {
            AWS: {
              "Fn::Join": [
              "",
              [
                "arn:",
                {
                Ref: "AWS::Partition"
                },
                ":iam::",
                {
                Ref: "AWS::AccountId"
                },
                ":root"
              ]
              ]
            }
            },
            Resource: "*"
          }
          ],
          Version: "2012-10-17"
        }
        },
        DeletionPolicy: "Retain"
      }
      }
    }));
    test.done();
  },

  'default with some permission'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');

    const key = new EncryptionKey(stack, 'MyKey');
    const p = new PolicyStatement().addAllResources().addAction('kms:encrypt');
    p.addAwsPrincipal('arn');
    key.addToResourcePolicy(p);

    expect(app.synthesizeStack(stack.name)).to(exactlyMatchTemplate({
      Resources: {
        MyKey6AB29FA6: {
        Type: "AWS::KMS::Key",
        Properties: {
          KeyPolicy: {
          Statement: [
            {
            Action: [
              "kms:Create*",
              "kms:Describe*",
              "kms:Enable*",
              "kms:List*",
              "kms:Put*",
              "kms:Update*",
              "kms:Revoke*",
              "kms:Disable*",
              "kms:Get*",
              "kms:Delete*",
              "kms:ScheduleKeyDeletion",
              "kms:CancelKeyDeletion"
            ],
            Effect: "Allow",
            Principal: {
              AWS: {
              "Fn::Join": [
                "",
                [
                "arn:",
                {
                  Ref: "AWS::Partition"
                },
                ":iam::",
                {
                  Ref: "AWS::AccountId"
                },
                ":root"
                ]
              ]
              }
            },
            Resource: '*'
            },
            {
            Action: "kms:encrypt",
            Effect: "Allow",
            Principal: {
              AWS: "arn"
            },
            Resource: "*"
            }
          ],
          Version: "2012-10-17"
          }
        },
        DeletionPolicy: "Retain"
        }
      }
      }));

    test.done();
  },

  'key with some options'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');

    const key = new EncryptionKey(stack, 'MyKey', {
      enableKeyRotation: true,
      enabled: false
    });
    const p = new PolicyStatement().addAllResources().addAction('kms:encrypt');
    p.addAwsPrincipal('arn');
    key.addToResourcePolicy(p);

    expect(app.synthesizeStack(stack.name)).to(exactlyMatchTemplate({
      Resources: {
        MyKey6AB29FA6: {
        Type: "AWS::KMS::Key",
        Properties: {
          Enabled: false,
          EnableKeyRotation: true,
          KeyPolicy: {
          Statement: [
            {
            Action: [
              "kms:Create*",
              "kms:Describe*",
              "kms:Enable*",
              "kms:List*",
              "kms:Put*",
              "kms:Update*",
              "kms:Revoke*",
              "kms:Disable*",
              "kms:Get*",
              "kms:Delete*",
              "kms:ScheduleKeyDeletion",
              "kms:CancelKeyDeletion"
            ],
            Effect: "Allow",
            Principal: {
              AWS: {
              "Fn::Join": [
                "",
                [
                "arn:",
                {
                  Ref: "AWS::Partition"
                },
                ":iam::",
                {
                  Ref: "AWS::AccountId"
                },
                ":root"
                ]
              ]
              }
            },
            Resource: '*'
            },
            {
            Action: "kms:encrypt",
            Effect: "Allow",
            Principal: {
              AWS: "arn"
            },
            Resource: "*"
            }
          ],
          Version: "2012-10-17"
          }
        },
        DeletionPolicy: "Retain"
        }
      }
      }));

    test.done();
  },

  'addAlias creates an alias'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');

    const key = new EncryptionKey(stack, 'MyKey', {
      enableKeyRotation: true,
      enabled: false
    });

    const alias = key.addAlias('alias/xoo');
    test.ok(alias.aliasName);

    test.deepEqual(app.synthesizeStack(stack.name).template, {
      Resources: {
      MyKey6AB29FA6: {
        Type: "AWS::KMS::Key",
        Properties: {
        EnableKeyRotation: true,
        Enabled: false,
        KeyPolicy: {
          Statement: [
          {
            Action: [
            "kms:Create*",
            "kms:Describe*",
            "kms:Enable*",
            "kms:List*",
            "kms:Put*",
            "kms:Update*",
            "kms:Revoke*",
            "kms:Disable*",
            "kms:Get*",
            "kms:Delete*",
            "kms:ScheduleKeyDeletion",
            "kms:CancelKeyDeletion"
            ],
            Effect: "Allow",
            Principal: {
            AWS: {
              "Fn::Join": [
              "",
              [
                "arn:",
                {
                Ref: "AWS::Partition"
                },
                ":iam::",
                {
                Ref: "AWS::AccountId"
                },
                ":root"
              ]
              ]
            }
            },
            Resource: "*"
          }
          ],
          Version: "2012-10-17"
        }
        },
        DeletionPolicy: "Retain"
      },
      MyKeyAlias1B45D9DA: {
        Type: "AWS::KMS::Alias",
        Properties: {
        AliasName: "alias/xoo",
        TargetKeyId: {
          "Fn::GetAtt": [
          "MyKey6AB29FA6",
          "Arn"
          ]
        }
        }
      }
      }
    });

    test.done();
  },

  'import/export can be used to bring in an existing key'(test: Test) {
    const stack1 = new Stack();
    const policy = new PolicyDocument();
    policy.addStatement(new PolicyStatement().addAllResources());
    const myKey = new EncryptionKey(stack1, 'MyKey', { policy });
    const exportedKeyRef = myKey.export();

    expect(stack1).toMatch({
      Resources: {
      MyKey6AB29FA6: {
        Type: "AWS::KMS::Key",
        Properties: {
        KeyPolicy: {
          Statement: [
          {
            Effect: "Allow",
            Resource: "*"
          }
          ],
          Version: "2012-10-17"
        }
        },
        DeletionPolicy: "Retain"
      }
      },
      Outputs: {
      MyKeyKeyArn317F1332: {
        Export: {
        Name: "MyKeyKeyArn317F1332"
        }
      }
      }
    });

    const stack2 = new Stack();
    const myKeyImported = EncryptionKey.import(stack2, 'MyKeyImported', exportedKeyRef);

    // addAlias can be called on imported keys.
    myKeyImported.addAlias('alias/hello');

    expect(stack2).toMatch({
      Resources: {
      MyKeyImportedAliasB1C5269F: {
        Type: "AWS::KMS::Alias",
        Properties: {
        AliasName: "alias/hello",
        TargetKeyId: {
          "Fn::ImportValue": "MyKeyKeyArn317F1332"
        }
        }
      }
      }
    });

    test.done();
  },

  'addToResourcePolicy allowNoOp and there is no policy': {
    'succeed if set to true (default)'(test: Test) {
      const stack = new Stack();

      const key = EncryptionKey.import(stack, 'Imported', { keyArn: 'foo/bar' });

      key.addToResourcePolicy(new PolicyStatement().addAllResources().addAction('*'));

      test.done();
    },

    'fails if set to false'(test: Test) {

      const stack = new Stack();

      const key = EncryptionKey.import(stack, 'Imported', { keyArn: 'foo/bar' });

      test.throws(() =>
        key.addToResourcePolicy(new PolicyStatement().addAllResources().addAction('*'), /* allowNoOp */ false),
        'Unable to add statement to IAM resource policy for KMS key: "foo/bar"');

      test.done();

    }
  }
};

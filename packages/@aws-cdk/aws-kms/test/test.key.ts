import { exactlyMatchTemplate, expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import { PolicyStatement, User } from '@aws-cdk/aws-iam';
import { App, RemovalPolicy, Stack, Tag } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Key } from '../lib';

export = {
  'default key'(test: Test) {
    const stack = new Stack();

    new Key(stack, 'MyKey');

    expect(stack).to(exactlyMatchTemplate({
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
        DeletionPolicy: "Retain",
        UpdateReplacePolicy: "Retain"
      }
      }
    }));
    test.done();
  },

  'default with no retention'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    new Key(stack, 'MyKey', { removalPolicy: RemovalPolicy.DESTROY });

    expect(stack).to(haveResource('AWS::KMS::Key', { DeletionPolicy: "Delete", UpdateReplacePolicy: "Delete" }, ResourcePart.CompleteDefinition));
    test.done();
  },

  'default with some permission'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');

    const key = new Key(stack, 'MyKey');
    const p = new PolicyStatement({ resources: ['*'], actions: ['kms:encrypt'] });
    p.addArnPrincipal('arn');
    key.addToResourcePolicy(p);

    expect(stack).to(exactlyMatchTemplate({
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
        DeletionPolicy: "Retain",
        UpdateReplacePolicy: "Retain",
        }
      }
      }));

    test.done();
  },

  'key with some options'(test: Test) {
    const stack = new Stack();

    const key = new Key(stack, 'MyKey', {
      enableKeyRotation: true,
      enabled: false,
    });
    const p = new PolicyStatement({ resources: ['*'], actions: ['kms:encrypt'] });
    p.addArnPrincipal('arn');
    key.addToResourcePolicy(p);

    key.node.applyAspect(new Tag('tag1', 'value1'));
    key.node.applyAspect(new Tag('tag2', 'value2'));
    key.node.applyAspect(new Tag('tag3', ''));

    expect(stack).to(exactlyMatchTemplate({
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
            },
            Enabled: false,
            EnableKeyRotation: true,
            Tags: [
              {
                Key: "tag1",
                Value: "value1"
              },
              {
                Key: "tag2",
                Value: "value2"
              },
              {
                Key: "tag3",
                Value: ""
              }
            ]
          },
          DeletionPolicy: "Retain",
          UpdateReplacePolicy: "Retain",
        }
      }
    }));

    test.done();
  },

  'addAlias creates an alias'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');

    const key = new Key(stack, 'MyKey', {
      enableKeyRotation: true,
      enabled: false
    });

    const alias = key.addAlias('alias/xoo');
    test.ok(alias.aliasName);

    expect(stack).toMatch({
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
          DeletionPolicy: "Retain",
          UpdateReplacePolicy: "Retain",
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

  'grant decrypt on a key'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const key = new Key(stack, 'Key');
    const user = new User(stack, 'User');

    // WHEN
    key.grantDecrypt(user);

    // THEN
    expect(stack).to(haveResource('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [
          // This one is there by default
          {
            // tslint:disable-next-line:max-line-length
            Action: [ "kms:Create*", "kms:Describe*", "kms:Enable*", "kms:List*", "kms:Put*", "kms:Update*", "kms:Revoke*", "kms:Disable*", "kms:Get*", "kms:Delete*", "kms:ScheduleKeyDeletion", "kms:CancelKeyDeletion" ],
            Effect: "Allow",
            Principal: { AWS: { "Fn::Join": [ "", [ "arn:", { Ref: "AWS::Partition" }, ":iam::", { Ref: "AWS::AccountId" }, ":root" ] ] } },
            Resource: "*"
          },
          // This is the interesting one
          {
            Action: "kms:Decrypt",
            Effect: "Allow",
            Principal: { AWS: { "Fn::GetAtt": [ "User00B015A1", "Arn" ] } },
            Resource: "*"
          }
        ],
        Version: "2012-10-17"
      }
    }));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: "kms:Decrypt",
            Effect: "Allow",
            Resource: { "Fn::GetAtt": [ "Key961B73FD", "Arn" ] }
          }
        ],
        Version: "2012-10-17"
      },
    }));

    test.done();
  },

  'import/export can be used to bring in an existing key'(test: Test) {
    const stack2 = new Stack();
    const myKeyImported = Key.fromKeyArn(stack2, 'MyKeyImported', 'arn:of:key');

    // addAlias can be called on imported keys.
    myKeyImported.addAlias('alias/hello');

    expect(stack2).toMatch({
      Resources: {
        MyKeyImportedAliasB1C5269F: {
          Type: "AWS::KMS::Alias",
          Properties: {
            AliasName: "alias/hello",
            TargetKeyId: 'arn:of:key'
          }
        }
      }
    });

    test.done();
  },

  'addToResourcePolicy allowNoOp and there is no policy': {
    'succeed if set to true (default)'(test: Test) {
      const stack = new Stack();

      const key = Key.fromKeyArn(stack, 'Imported', 'foo/bar');

      key.addToResourcePolicy(new PolicyStatement({ resources: ['*'], actions: ['*'] }));

      test.done();
    },

    'fails if set to false'(test: Test) {

      const stack = new Stack();

      const key = Key.fromKeyArn(stack, 'Imported', 'foo/bar');

      test.throws(() =>
        key.addToResourcePolicy(new PolicyStatement({ resources: ['*'], actions: ['*'] }), /* allowNoOp */ false),
        'Unable to add statement to IAM resource policy for KMS key: "foo/bar"');

      test.done();

    }
  }
};

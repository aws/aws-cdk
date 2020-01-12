import {
  exactlyMatchTemplate,
  expect,
  haveResource,
  haveResourceLike,
  ResourcePart,
  SynthUtils
} from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import { App, CfnOutput, RemovalPolicy, Stack, Tag } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Key } from '../lib';

// tslint:disable:object-literal-key-quotes

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
            "kms:CancelKeyDeletion",
            "kms:GenerateDataKey"
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
    const p = new iam.PolicyStatement({ resources: ['*'], actions: ['kms:encrypt'] });
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
              "kms:CancelKeyDeletion",
              "kms:GenerateDataKey"
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
    const p = new iam.PolicyStatement({ resources: ['*'], actions: ['kms:encrypt'] });
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
                    "kms:CancelKeyDeletion",
                    "kms:GenerateDataKey"
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
                    "kms:CancelKeyDeletion",
                    "kms:GenerateDataKey"
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

  'can run multiple addAlias'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');

    const key = new Key(stack, 'MyKey', {
      enableKeyRotation: true,
      enabled: false
    });

    const alias1 = key.addAlias('alias/alias1');
    const alias2 = key.addAlias('alias/alias2');
    test.ok(alias1.aliasName);
    test.ok(alias2.aliasName);

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
                    "kms:CancelKeyDeletion",
                    "kms:GenerateDataKey"
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
            AliasName: "alias/alias1",
            TargetKeyId: {
              "Fn::GetAtt": [
                "MyKey6AB29FA6",
                "Arn"
              ]
            }
          }
        },
        MyKeyAliasaliasalias2EC56BD3E: {
          Type: "AWS::KMS::Alias",
          Properties: {
            AliasName: "alias/alias2",
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
    const user = new iam.User(stack, 'User');

    // WHEN
    key.grantDecrypt(user);

    // THEN
    expect(stack).to(haveResource('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [
          // This one is there by default
          {
            // tslint:disable-next-line:max-line-length
            Action: [ "kms:Create*", "kms:Describe*", "kms:Enable*", "kms:List*", "kms:Put*", "kms:Update*", "kms:Revoke*", "kms:Disable*", "kms:Get*", "kms:Delete*", "kms:ScheduleKeyDeletion", "kms:CancelKeyDeletion", "kms:GenerateDataKey" ],
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

  'grant for a principal in a dependent stack works correctly'(test: Test) {
    const app = new App();

    const principalStack = new Stack(app, 'PrincipalStack');
    const principal = new iam.Role(principalStack, 'Role', {
      assumedBy: new iam.AnyPrincipal(),
    });

    const keyStack = new Stack(app, 'KeyStack');
    const key = new Key(keyStack, 'Key');

    principalStack.addDependency(keyStack);

    key.grantEncrypt(principal);

    expect(keyStack).to(haveResourceLike('AWS::KMS::Key', {
      "KeyPolicy": {
        "Statement": [
          {
            // owning account management permissions - we don't care about them in this test
          },
          {
            "Action": [
              "kms:Encrypt",
              "kms:ReEncrypt*",
              "kms:GenerateDataKey*",
            ],
            "Effect": "Allow",
            "Principal": {
              "AWS": {
                "Fn::Join": ["", [
                  "arn:",
                  { "Ref": "AWS::Partition" },
                  ":iam::",
                  { "Ref": "AWS::AccountId" },
                  ":root",
                ]],
              },
            },
            "Resource": "*",
          },
        ],
      },
    }));

    test.done();
  },

  'keyId resolves to a Ref'(test: Test) {
    const stack = new Stack();
    const key = new Key(stack, 'MyKey');

    new CfnOutput(stack, 'Out', {
      value: key.keyId,
    });

    const template = SynthUtils.synthesize(stack).template.Outputs;

    test.deepEqual(template, {
      "Out": {
        "Value": {
          "Ref": "MyKey6AB29FA6",
        },
      },
    });

    test.done();
  },

  'imported keys': {
    'throw an error when providing something that is not a valid key ARN'(test: Test) {
      const stack = new Stack();

      test.throws(() => {
        Key.fromKeyArn(stack, 'Imported', 'arn:aws:kms:us-east-1:123456789012:key');
      }, /KMS key ARN must be in the format 'arn:aws:kms:<region>:<account>:key\/<keyId>', got: 'arn:aws:kms:us-east-1:123456789012:key'/);

      test.done();
    },

    'can have aliases added to them'(test: Test) {
      const stack2 = new Stack();
      const myKeyImported = Key.fromKeyArn(stack2, 'MyKeyImported',
        'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');

      // addAlias can be called on imported keys.
      myKeyImported.addAlias('alias/hello');

      test.equal(myKeyImported.keyId, '12345678-1234-1234-1234-123456789012');

      expect(stack2).toMatch({
        Resources: {
          MyKeyImportedAliasB1C5269F: {
            Type: "AWS::KMS::Alias",
            Properties: {
              AliasName: "alias/hello",
              TargetKeyId: "arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012"
            }
          }
        }
      });

      test.done();
    },

    'addToResourcePolicy allowNoOp and there is no policy': {
      'succeed if set to true (default)'(test: Test) {
        const stack = new Stack();

        const key = Key.fromKeyArn(stack, 'Imported',
          'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');

        key.addToResourcePolicy(new iam.PolicyStatement({ resources: ['*'], actions: ['*'] }));

        test.done();
      },

      'fails if set to false'(test: Test) {
        const stack = new Stack();

        const key = Key.fromKeyArn(stack, 'Imported',
          'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');

        test.throws(() => {
          key.addToResourcePolicy(new iam.PolicyStatement({ resources: ['*'], actions: ['*'] }), /* allowNoOp */ false);
        }, 'Unable to add statement to IAM resource policy for KMS key: "foo/bar"');

        test.done();
      },
    },
  },
};

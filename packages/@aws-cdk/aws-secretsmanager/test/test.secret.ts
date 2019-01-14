import { expect, haveResource, matchTemplate } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import secretsmanager = require('../lib');

export = {
  'create inline secret string'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new secretsmanager.Secret(stack, 'Secret', {
      secretString: 'Shhh-secret!'
    });

    // THEN
    expect(stack).to(haveResource('AWS::SecretsManager::Secret', {
      SecretString: 'Shhh-secret!'
    }));

    test.done();
  },

  'create generated secret string'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new secretsmanager.Secret(stack, 'Secret', {
      generateSecretString: {}
    });

    // THEN
    expect(stack).to(haveResource('AWS::SecretsManager::Secret', {
      GenerateSecretString: {}
    }));

    test.done();
  },

  'cannot create a secret without either generateSecretString or secretString'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => new secretsmanager.Secret(stack, 'Secret', {}),
                /Either secretString or generateSecretString must be specified, but not both./);
    test.done();
  },

  'cannot create a secret with both generateSecretString or secretString'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => new secretsmanager.Secret(stack, 'Secret', { secretString: '', generateSecretString: {} }),
                /Either secretString or generateSecretString must be specified, but not both./);
    test.done();
  },

  'grantRead'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const key = new kms.EncryptionKey(stack, 'KMS');
    const secret = new secretsmanager.Secret(stack, 'Secret', { encryptionKey: key, secretString: 'Shhh!' });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountRootPrincipal() });

    // WHEN
    secret.grantRead(role);

    // THEN
    // tslint:disable:object-literal-key-quotes
    expect(stack).to(matchTemplate({
      "Resources": {
        "KMS6B14D45A": {
          "Type": "AWS::KMS::Key",
          "Properties": {
            "KeyPolicy": {
              "Statement": [
                {
                  "Action": [
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
                  "Effect": "Allow",
                  "Principal": {
                    "AWS": {
                      "Fn::Join": [
                        "",
                        [
                          "arn:",
                          {
                            "Ref": "AWS::Partition"
                          },
                          ":iam::",
                          {
                            "Ref": "AWS::AccountId"
                          },
                          ":root"
                        ]
                      ]
                    }
                  },
                  "Resource": "*"
                },
                {
                  "Action": "kms:Decrypt",
                  "Condition": {
                    "StringEquals": {
                      "kms:ViaService": {
                        "Fn::Join": [
                          "",
                          [
                            "secretsmanager.",
                            {
                              "Ref": "AWS::Region"
                            },
                            ".amazonaws.com"
                          ]
                        ]
                      }
                    }
                  },
                  "Effect": "Allow",
                  "Principal": {
                    "AWS": {
                      "Fn::GetAtt": [
                        "Role1ABCC5F0",
                        "Arn"
                      ]
                    }
                  },
                  "Resource": "*"
                }
              ],
              "Version": "2012-10-17"
            }
          },
          "DeletionPolicy": "Retain"
        },
        "SecretA720EF05": {
          "Type": "AWS::SecretsManager::Secret",
          "Properties": {
            "KmsKeyId": {
              "Fn::GetAtt": [
                "KMS6B14D45A",
                "Arn"
              ]
            },
            "SecretString": "Shhh!"
          }
        },
        "Role1ABCC5F0": {
          "Type": "AWS::IAM::Role",
          "Properties": {
            "AssumeRolePolicyDocument": {
              "Statement": [
                {
                  "Action": "sts:AssumeRole",
                  "Effect": "Allow",
                  "Principal": {
                    "AWS": {
                      "Fn::Join": [
                        "",
                        [
                          "arn:",
                          {
                            "Ref": "AWS::Partition"
                          },
                          ":iam::",
                          {
                            "Ref": "AWS::AccountId"
                          },
                          ":root"
                        ]
                      ]
                    }
                  }
                }
              ],
              "Version": "2012-10-17"
            }
          }
        },
        "RoleDefaultPolicy5FFB7DAB": {
          "Type": "AWS::IAM::Policy",
          "Properties": {
            "PolicyDocument": {
              "Statement": [
                {
                  "Action": "secretsmanager:GetSecretValue",
                  "Effect": "Allow",
                  "Resource": {
                    "Ref": "SecretA720EF05"
                  }
                }
              ],
              "Version": "2012-10-17"
            },
            "PolicyName": "RoleDefaultPolicy5FFB7DAB",
            "Roles": [
              {
                "Ref": "Role1ABCC5F0"
              }
            ]
          }
        }
      }
    }));
    // tslint:enable:object-literal-key-quotes
    test.done();
  },
};

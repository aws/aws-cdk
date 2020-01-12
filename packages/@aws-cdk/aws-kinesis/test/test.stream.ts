import { expect } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { App, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Stream, StreamEncryption } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
  'default stream'(test: Test) {
    const stack = new Stack();

    new Stream(stack, 'MyStream');

    expect(stack).toMatch({
      "Resources": {
        "MyStream5C050E93": {
          "Type": "AWS::Kinesis::Stream",
          "Properties": {
            "RetentionPeriodHours": 24,
            "ShardCount": 1
          }
        }
      }
    });

    test.done();
  },

  'stream from attributes'(test: Test) {
    const stack = new Stack();

    const s = Stream.fromStreamAttributes(stack, 'MyStream', {
      streamArn: 'arn:aws:kinesis:region:account-id:stream/stream-name'
    });

    test.equals(s.streamArn, 'arn:aws:kinesis:region:account-id:stream/stream-name');

    test.done();
  },

  "uses explicit shard count"(test: Test) {
    const stack = new Stack();

    new Stream(stack, 'MyStream', {
      shardCount: 2
    });

    expect(stack).toMatch({
      "Resources": {
        "MyStream5C050E93": {
          "Type": "AWS::Kinesis::Stream",
          "Properties": {
            "RetentionPeriodHours": 24,
            "ShardCount": 2
          }
        }
      }
    });

    test.done();
  },
  "uses explicit retention period"(test: Test) {
    const stack = new Stack();

    new Stream(stack, 'MyStream', {
      retentionPeriodHours: 168
    });

    expect(stack).toMatch({
      "Resources": {
        "MyStream5C050E93": {
          "Type": "AWS::Kinesis::Stream",
          "Properties": {
            "RetentionPeriodHours": 168,
            "ShardCount": 1
          }
        }
      }
    });

    test.done();
  },
  "retention period must be between 24 and 168 hours"(test: Test) {
    test.throws({
      block: () => {
        new Stream(new Stack(), 'MyStream', {
          retentionPeriodHours: 169
        });
      },
      message: "retentionPeriodHours must be between 24 and 168 hours"
    });

    test.throws({
      block: () => {
        new Stream(new Stack(), 'MyStream', {
          retentionPeriodHours: 23
        });
      },
      message: "retentionPeriodHours must be between 24 and 168 hours"
    });

    test.done();
  },
  "auto-creates KMS key if encryption type is KMS but no key is provided"(test: Test) {
    const stack = new Stack();

    new Stream(stack, 'MyStream', {
      encryption: StreamEncryption.KMS
    });

    expect(stack).toMatch({
      "Resources": {
        "MyStreamKey76F3300E": {
          "Type": "AWS::KMS::Key",
          "Properties": {
            "Description": "Created by MyStream",
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
                    "kms:CancelKeyDeletion",
                    "kms:GenerateDataKey"
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
                }
              ],
              "Version": "2012-10-17"
            }
          },
          "DeletionPolicy": "Retain",
          "UpdateReplacePolicy": "Retain"
        },
        "MyStream5C050E93": {
          "Type": "AWS::Kinesis::Stream",
          "Properties": {
            "RetentionPeriodHours": 24,
            "ShardCount": 1,
            "StreamEncryption": {
              "EncryptionType": "KMS",
              "KeyId": {
                "Fn::GetAtt": [
                  "MyStreamKey76F3300E",
                  "Arn"
                ]
              }
            }
          }
        }
      }
    });

    test.done();
  },
  "uses explicit KMS key if encryption type is KMS and a key is provided"(test: Test) {
    const stack = new Stack();

    const explicitKey = new kms.Key(stack, 'ExplicitKey', {
      description: `Explicit Key`
    });

    new Stream(stack, 'MyStream', {
      encryption: StreamEncryption.KMS,
      encryptionKey: explicitKey
    });

    expect(stack).toMatch({
      "Resources": {
        "ExplicitKey7DF42F37": {
          "Type": "AWS::KMS::Key",
          "Properties": {
            "Description": "Explicit Key",
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
                    "kms:CancelKeyDeletion",
                    "kms:GenerateDataKey"
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
                }
              ],
              "Version": "2012-10-17"
            }
          },
          "DeletionPolicy": "Retain",
          "UpdateReplacePolicy": "Retain"
        },
        "MyStream5C050E93": {
          "Type": "AWS::Kinesis::Stream",
          "Properties": {
            "RetentionPeriodHours": 24,
            "ShardCount": 1,
            "StreamEncryption": {
              "EncryptionType": "KMS",
              "KeyId": {
                "Fn::GetAtt": [
                  "ExplicitKey7DF42F37",
                  "Arn"
                ]
              }
            }
          }
        }
      }
    });

    test.done();
  },
  "permissions": {
    "with encryption": {
      "grantRead creates and attaches a policy with read only access to Stream and EncryptionKey"(test: Test) {
        const stack = new Stack();
        const stream = new Stream(stack, 'MyStream', {
          encryption: StreamEncryption.KMS
        });

        const user = new iam.User(stack, "MyUser");
        stream.grantRead(user);

        expect(stack).toMatch({
          "Resources": {
            "MyStreamKey76F3300E": {
              "Type": "AWS::KMS::Key",
              "Properties": {
                "Description": "Created by MyStream",
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
                        "kms:CancelKeyDeletion",
                        "kms:GenerateDataKey"
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
                      "Effect": "Allow",
                      "Principal": {
                        "AWS": {
                          "Fn::GetAtt": [
                            "MyUserDC45028B",
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
              "DeletionPolicy": "Retain",
              "UpdateReplacePolicy": "Retain"
            },
            "MyStream5C050E93": {
              "Type": "AWS::Kinesis::Stream",
              "Properties": {
                "RetentionPeriodHours": 24,
                "ShardCount": 1,
                "StreamEncryption": {
                  "EncryptionType": "KMS",
                  "KeyId": {
                    "Fn::GetAtt": [
                      "MyStreamKey76F3300E",
                      "Arn"
                    ]
                  }
                }
              }
            },
            "MyUserDC45028B": {
              "Type": "AWS::IAM::User"
            },
            "MyUserDefaultPolicy7B897426": {
              "Type": "AWS::IAM::Policy",
              "Properties": {
                "PolicyDocument": {
                  "Statement": [
                    {
                      "Action": [
                        "kinesis:DescribeStream",
                        "kinesis:GetRecords",
                        "kinesis:GetShardIterator"
                      ],
                      "Effect": "Allow",
                      "Resource": {
                        "Fn::GetAtt": [
                          "MyStream5C050E93",
                          "Arn"
                        ]
                      }
                    },
                    {
                      "Action": "kms:Decrypt",
                      "Effect": "Allow",
                      "Resource": {
                        "Fn::GetAtt": [
                          "MyStreamKey76F3300E",
                          "Arn"
                        ]
                      }
                    }
                  ],
                  "Version": "2012-10-17"
                },
                "PolicyName": "MyUserDefaultPolicy7B897426",
                "Users": [
                  {
                    "Ref": "MyUserDC45028B"
                  }
                ]
              }
            }
          }
        });

        test.done();
      },
      "grantWrite creates and attaches a policy with write only access to Stream and EncryptionKey"(test: Test) {
        const stack = new Stack();
        const stream = new Stream(stack, 'MyStream', {
          encryption: StreamEncryption.KMS
        });

        const user = new iam.User(stack, "MyUser");
        stream.grantWrite(user);

        expect(stack).toMatch({
          "Resources": {
            "MyStreamKey76F3300E": {
              "Type": "AWS::KMS::Key",
              "Properties": {
                "Description": "Created by MyStream",
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
                        "kms:CancelKeyDeletion",
                        "kms:GenerateDataKey"
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
                      "Action": [
                        "kms:Encrypt",
                        "kms:ReEncrypt*",
                        "kms:GenerateDataKey*"
                      ],
                      "Effect": "Allow",
                      "Principal": {
                        "AWS": {
                          "Fn::GetAtt": [
                            "MyUserDC45028B",
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
              "DeletionPolicy": "Retain",
              "UpdateReplacePolicy": "Retain"
            },
            "MyStream5C050E93": {
              "Type": "AWS::Kinesis::Stream",
              "Properties": {
                "RetentionPeriodHours": 24,
                "ShardCount": 1,
                "StreamEncryption": {
                  "EncryptionType": "KMS",
                  "KeyId": {
                    "Fn::GetAtt": [
                      "MyStreamKey76F3300E",
                      "Arn"
                    ]
                  }
                }
              }
            },
            "MyUserDC45028B": {
              "Type": "AWS::IAM::User"
            },
            "MyUserDefaultPolicy7B897426": {
              "Type": "AWS::IAM::Policy",
              "Properties": {
                "PolicyDocument": {
                  "Statement": [
                    {
                      "Action": [
                        "kinesis:DescribeStream",
                        "kinesis:PutRecord",
                        "kinesis:PutRecords"
                      ],
                      "Effect": "Allow",
                      "Resource": {
                        "Fn::GetAtt": [
                          "MyStream5C050E93",
                          "Arn"
                        ]
                      }
                    },
                    {
                      "Action": [
                        "kms:Encrypt",
                        "kms:ReEncrypt*",
                        "kms:GenerateDataKey*",
                      ],
                      "Effect": "Allow",
                      "Resource": {
                        "Fn::GetAtt": [
                          "MyStreamKey76F3300E",
                          "Arn"
                        ]
                      }
                    }
                  ],
                  "Version": "2012-10-17"
                },
                "PolicyName": "MyUserDefaultPolicy7B897426",
                "Users": [
                  {
                    "Ref": "MyUserDC45028B"
                  }
                ]
              }
            }
          }
        });

        test.done();
      },
      "grantReadWrite creates and attaches a policy with access to Stream and EncryptionKey"(test: Test) {
        const stack = new Stack();
        const stream = new Stream(stack, 'MyStream', {
          encryption: StreamEncryption.KMS
        });

        const user = new iam.User(stack, "MyUser");
        stream.grantReadWrite(user);

        expect(stack).toMatch({
          "Resources": {
            "MyStreamKey76F3300E": {
              "Type": "AWS::KMS::Key",
              "Properties": {
                "Description": "Created by MyStream",
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
                        "kms:CancelKeyDeletion",
                        "kms:GenerateDataKey"
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
                      "Action": [
                        "kms:Decrypt",
                        "kms:Encrypt",
                        "kms:ReEncrypt*",
                        "kms:GenerateDataKey*"
                      ],
                      "Effect": "Allow",
                      "Principal": {
                        "AWS": {
                          "Fn::GetAtt": [
                            "MyUserDC45028B",
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
              "DeletionPolicy": "Retain",
              "UpdateReplacePolicy": "Retain"
            },
            "MyStream5C050E93": {
              "Type": "AWS::Kinesis::Stream",
              "Properties": {
                "RetentionPeriodHours": 24,
                "ShardCount": 1,
                "StreamEncryption": {
                  "EncryptionType": "KMS",
                  "KeyId": {
                    "Fn::GetAtt": [
                      "MyStreamKey76F3300E",
                      "Arn"
                    ]
                  }
                }
              }
            },
            "MyUserDC45028B": {
              "Type": "AWS::IAM::User"
            },
            "MyUserDefaultPolicy7B897426": {
              "Type": "AWS::IAM::Policy",
              "Properties": {
                "PolicyDocument": {
                  "Statement": [
                    {
                      "Action": [
                        "kinesis:DescribeStream",
                        "kinesis:GetRecords",
                        "kinesis:GetShardIterator",
                        "kinesis:PutRecord",
                        "kinesis:PutRecords"
                      ],
                      "Effect": "Allow",
                      "Resource": {
                        "Fn::GetAtt": [
                          "MyStream5C050E93",
                          "Arn"
                        ]
                      }
                    },
                    {
                      "Action": [
                        "kms:Decrypt",
                        "kms:Encrypt",
                        "kms:ReEncrypt*",
                        "kms:GenerateDataKey*"
                      ],
                      "Effect": "Allow",
                      "Resource": {
                        "Fn::GetAtt": [
                          "MyStreamKey76F3300E",
                          "Arn"
                        ]
                      }
                    }
                  ],
                  "Version": "2012-10-17"
                },
                "PolicyName": "MyUserDefaultPolicy7B897426",
                "Users": [
                  {
                    "Ref": "MyUserDC45028B"
                  }
                ]
              }
            }
          }
        });

        test.done();
      }
    },
    "with no encryption": {
      "grantRead creates and associates a policy with read only access to Stream"(test: Test) {
        const stack = new Stack();
        const stream = new Stream(stack, 'MyStream');

        const user = new iam.User(stack, "MyUser");
        stream.grantRead(user);

        expect(stack).toMatch({
          "Resources": {
            "MyStream5C050E93": {
              "Type": "AWS::Kinesis::Stream",
              "Properties": {
                "RetentionPeriodHours": 24,
                "ShardCount": 1
              }
            },
            "MyUserDC45028B": {
              "Type": "AWS::IAM::User"
            },
            "MyUserDefaultPolicy7B897426": {
              "Type": "AWS::IAM::Policy",
              "Properties": {
                "PolicyDocument": {
                  "Statement": [
                    {
                      "Action": [
                        "kinesis:DescribeStream",
                        "kinesis:GetRecords",
                        "kinesis:GetShardIterator"
                      ],
                      "Effect": "Allow",
                      "Resource": {
                        "Fn::GetAtt": [
                          "MyStream5C050E93",
                          "Arn"
                        ]
                      }
                    }
                  ],
                  "Version": "2012-10-17"
                },
                "PolicyName": "MyUserDefaultPolicy7B897426",
                "Users": [
                  {
                    "Ref": "MyUserDC45028B"
                  }
                ]
              }
            }
          }
        });

        test.done();
      },
      "grantWrite creates and attaches a policy with write only access to Stream"(test: Test) {
        const stack = new Stack();
        const stream = new Stream(stack, 'MyStream');

        const user = new iam.User(stack, "MyUser");
        stream.grantWrite(user);

        expect(stack).toMatch({
          "Resources": {
            "MyStream5C050E93": {
              "Type": "AWS::Kinesis::Stream",
              "Properties": {
                "RetentionPeriodHours": 24,
                "ShardCount": 1
              }
            },
            "MyUserDC45028B": {
              "Type": "AWS::IAM::User"
            },
            "MyUserDefaultPolicy7B897426": {
              "Type": "AWS::IAM::Policy",
              "Properties": {
                "PolicyDocument": {
                  "Statement": [
                    {
                      "Action": [
                        "kinesis:DescribeStream",
                        "kinesis:PutRecord",
                        "kinesis:PutRecords"
                      ],
                      "Effect": "Allow",
                      "Resource": {
                        "Fn::GetAtt": [
                          "MyStream5C050E93",
                          "Arn"
                        ]
                      }
                    }
                  ],
                  "Version": "2012-10-17"
                },
                "PolicyName": "MyUserDefaultPolicy7B897426",
                "Users": [
                  {
                    "Ref": "MyUserDC45028B"
                  }
                ]
              }
            }
          }
        });

        test.done();
      },
      "greatReadWrite creates and attaches a policy with write only access to Stream"(test: Test) {
        const stack = new Stack();
        const stream = new Stream(stack, 'MyStream');

        const user = new iam.User(stack, "MyUser");
        stream.grantReadWrite(user);

        expect(stack).toMatch({
          "Resources": {
            "MyStream5C050E93": {
              "Type": "AWS::Kinesis::Stream",
              "Properties": {
                "RetentionPeriodHours": 24,
                "ShardCount": 1
              }
            },
            "MyUserDC45028B": {
              "Type": "AWS::IAM::User"
            },
            "MyUserDefaultPolicy7B897426": {
              "Type": "AWS::IAM::Policy",
              "Properties": {
                "PolicyDocument": {
                  "Statement": [
                    {
                      "Action": [
                        "kinesis:DescribeStream",
                        "kinesis:GetRecords",
                        "kinesis:GetShardIterator",
                        "kinesis:PutRecord",
                        "kinesis:PutRecords"
                      ],
                      "Effect": "Allow",
                      "Resource": {
                        "Fn::GetAtt": [
                          "MyStream5C050E93",
                          "Arn"
                        ]
                      }
                    }
                  ],
                  "Version": "2012-10-17"
                },
                "PolicyName": "MyUserDefaultPolicy7B897426",
                "Users": [
                  {
                    "Ref": "MyUserDC45028B"
                  }
                ]
              }
            }
          }
        });

        test.done();
      }
    }
  },
  "cross-stack permissions": {
    "no encryption"(test: Test) {
      const app = new App();
      const stackA = new Stack(app, 'stackA');
      const streamFromStackA = new Stream(stackA, 'MyStream');

      const stackB = new Stack(app, 'stackB');
      const user = new iam.User(stackB, 'UserWhoNeedsAccess');
      streamFromStackA.grantRead(user);

      expect(stackA).toMatch({
        "Resources": {
          "MyStream5C050E93": {
            "Type": "AWS::Kinesis::Stream",
            "Properties": {
              "RetentionPeriodHours": 24,
              "ShardCount": 1
            }
          }
        },
        "Outputs": {
          "ExportsOutputFnGetAttMyStream5C050E93Arn4ABF30CD": {
            "Value": {
              "Fn::GetAtt": [
                "MyStream5C050E93",
                "Arn"
              ]
            },
            "Export": {
              "Name": "stackA:ExportsOutputFnGetAttMyStream5C050E93Arn4ABF30CD"
            }
          }
        }
      });

      expect(stackB).toMatch({
        "Resources": {
          "UserWhoNeedsAccessF8959C3D": {
            "Type": "AWS::IAM::User"
          },
          "UserWhoNeedsAccessDefaultPolicy6A9EB530": {
            "Type": "AWS::IAM::Policy",
            "Properties": {
              "PolicyDocument": {
                "Statement": [
                  {
                    "Action": [
                      "kinesis:DescribeStream",
                      "kinesis:GetRecords",
                      "kinesis:GetShardIterator"
                    ],
                    "Effect": "Allow",
                    "Resource": {
                      "Fn::ImportValue": "stackA:ExportsOutputFnGetAttMyStream5C050E93Arn4ABF30CD"
                    }
                  }
                ],
                "Version": "2012-10-17"
              },
              "PolicyName": "UserWhoNeedsAccessDefaultPolicy6A9EB530",
              "Users": [
                {
                  "Ref": "UserWhoNeedsAccessF8959C3D"
                }
              ]
            }
          }
        }
      });

      test.done();
    },
    "fails with encryption due to cyclic dependency"(test: Test) {
      const app = new App();
      const stackA = new Stack(app, 'stackA');
      const streamFromStackA = new Stream(stackA, 'MyStream', {
        encryption: StreamEncryption.KMS
      });

      const stackB = new Stack(app, 'stackB');
      const user = new iam.User(stackB, 'UserWhoNeedsAccess');
      streamFromStackA.grantRead(user);

      test.throws(() => app.synth(), /'stackB' depends on 'stackA'/);
      test.done();
    }
  }
};

import { expect } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { Stream, StreamEncryption } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
  'default stream'(test: Test) {
    const stack = new cdk.Stack();

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
  "uses explicit shard count"(test: Test) {
    const stack = new cdk.Stack();

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
    const stack = new cdk.Stack();

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
        new Stream(new cdk.Stack(), 'MyStream', {
          retentionPeriodHours: 169
        });
      },
      message: "retentionPeriodHours must be between 24 and 168 hours"
    });

    test.throws({
      block: () => {
        new Stream(new cdk.Stack(), 'MyStream', {
          retentionPeriodHours: 23
        });
      },
      message: "retentionPeriodHours must be between 24 and 168 hours"
    });

    test.done();
  },
  "auto-creates KMS key if encryption type is KMS but no key is provided"(test: Test) {
    const stack = new cdk.Stack();

    new Stream(stack, 'MyStream', {
      encryption: StreamEncryption.Kms
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
                }
              ],
              "Version": "2012-10-17"
            }
          },
          "DeletionPolicy": "Retain"
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
    const stack = new cdk.Stack();

    const explicitKey = new kms.EncryptionKey(stack, 'ExplicitKey', {
      description: `Explicit Key`
    });

    new Stream(stack, 'MyStream', {
      encryption: StreamEncryption.Kms,
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
                }
              ],
              "Version": "2012-10-17"
            }
          },
          "DeletionPolicy": "Retain"
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
        const stack = new cdk.Stack();
        const stream = new Stream(stack, 'MyStream', {
          encryption: StreamEncryption.Kms
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
                    }
                  ],
                  "Version": "2012-10-17"
                }
              },
              "DeletionPolicy": "Retain"
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
        const stack = new cdk.Stack();
        const stream = new Stream(stack, 'MyStream', {
          encryption: StreamEncryption.Kms
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
                    }
                  ],
                  "Version": "2012-10-17"
                }
              },
              "DeletionPolicy": "Retain"
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
                        "kms:GenerateDataKey",
                        "kms:Encrypt"
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
        const stack = new cdk.Stack();
        const stream = new Stream(stack, 'MyStream', {
          encryption: StreamEncryption.Kms
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
                    }
                  ],
                  "Version": "2012-10-17"
                }
              },
              "DeletionPolicy": "Retain"
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
                        "kms:GenerateDataKey",
                        "kms:Encrypt"
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
        const stack = new cdk.Stack();
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
        const stack = new cdk.Stack();
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
        const stack = new cdk.Stack();
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
      const stackA = new cdk.Stack();
      const streamFromStackA = new Stream(stackA, 'MyStream');
      const refToStreamFromStackA = streamFromStackA.export();

      const stackB = new cdk.Stack();
      const user = new iam.User(stackB, 'UserWhoNeedsAccess');
      const theStreamFromStackAAsARefInStackB = Stream.import(stackB, 'RefToStreamFromStackA', refToStreamFromStackA);
      theStreamFromStackAAsARefInStackB.grantRead(user);

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
          "MyStreamStreamArn495BAFC1": {
            "Value": {
              "Fn::GetAtt": [
                "MyStream5C050E93",
                "Arn"
              ]
            },
            "Export": {
              "Name": "MyStreamStreamArn495BAFC1"
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
                    "Fn::ImportValue": "MyStreamStreamArn495BAFC1"
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
    "with encryption"(test: Test) {
      const stackA = new cdk.Stack();
      const streamFromStackA = new Stream(stackA, 'MyStream', {
        encryption: StreamEncryption.Kms
      });
      const refToStreamFromStackA = streamFromStackA.export();

      const stackB = new cdk.Stack();
      const user = new iam.User(stackB, 'UserWhoNeedsAccess');
      const theStreamFromStackAAsARefInStackB = Stream.import(stackB, 'RefToStreamFromStackA', refToStreamFromStackA);
      theStreamFromStackAAsARefInStackB.grantRead(user);

      expect(stackA).toMatch({
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
                  }
                ],
                "Version": "2012-10-17"
              }
            },
            "DeletionPolicy": "Retain"
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
        },
        "Outputs": {
          "MyStreamKeyKeyArn967BCB03": {
            "Export": {
              "Name": "MyStreamKeyKeyArn967BCB03"
            }
          },
          "MyStreamStreamArn495BAFC1": {
            "Value": {
              "Fn::GetAtt": [
                "MyStream5C050E93",
                "Arn"
              ]
            },
            "Export": {
              "Name": "MyStreamStreamArn495BAFC1"
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
                      "Fn::ImportValue": "MyStreamStreamArn495BAFC1"
                    }
                  },
                  {
                    "Action": "kms:Decrypt",
                    "Effect": "Allow",
                    "Resource": {
                      "Fn::ImportValue": "MyStreamKeyKeyArn967BCB03"
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
    }
  }
};

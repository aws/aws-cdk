import { expect } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import path = require('path');
import { FileAsset, ZipDirectoryAsset } from '../lib/asset';

export = {
    'simple use case'(test: Test)  {
        const stack = new cdk.Stack();
        const dirPath = path.join(__dirname, 'sample-asset-directory');
        const asset = new ZipDirectoryAsset(stack, 'MyAsset', {
            path: dirPath
        });

        // verify that metadata contains an "aws:cdk:asset" entry with
        // the correct information
        const entry = asset.metadata.find(m => m.type === 'aws:cdk:asset');
        test.ok(entry, 'found metadata entry');
        test.deepEqual(entry!.data, {
            path: dirPath,
            packaging: 'zip',
            s3BucketParameter: 'MyAssetS3Bucket68C9B344',
            s3KeyParameter: 'MyAssetS3ObjectKeyC07605E4'
        });

        // verify that now the template contains two parameters for this asset
        expect(stack).toMatch({
          Parameters: {
            MyAssetS3Bucket68C9B344: {
              Type: "String",
              Description: 'S3 bucket for asset "MyAsset"'
            },
            MyAssetS3ObjectKeyC07605E4: {
              Type: "String",
              Description: 'S3 object for asset "MyAsset"'
            }
          }
        });

        test.done();
    },

    '"file" assets'(test: Test) {
        const stack = new cdk.Stack();
        const filePath = path.join(__dirname, 'file-asset.txt');
        const asset = new FileAsset(stack, 'MyAsset', { path: filePath });
        const entry = asset.metadata.find(m => m.type === 'aws:cdk:asset');
        test.ok(entry, 'found metadata entry');
        test.deepEqual(entry!.data, {
            path: filePath,
            packaging: 'file',
            s3BucketParameter: 'MyAssetS3Bucket68C9B344',
            s3KeyParameter: 'MyAssetS3ObjectKeyC07605E4'
        });

        expect(stack).toMatch({
          Parameters: {
            MyAssetS3Bucket68C9B344: {
              Type: "String",
              Description: 'S3 bucket for asset "MyAsset"'
            },
            MyAssetS3ObjectKeyC07605E4: {
              Type: "String",
              Description: 'S3 object for asset "MyAsset"'
            }
          }
        });

        test.done();
    },

    '"readers" or "grantRead" can be used to grant read permissions on the asset to a principal'(test: Test) {
        const stack = new cdk.Stack();
        const user = new iam.User(stack, 'MyUser');
        const group = new iam.Group(stack, 'MyGroup');

        const asset = new ZipDirectoryAsset(stack, 'MyAsset', {
            path: path.join(__dirname, 'sample-asset-directory'),
            readers: [ user ]
        });

        asset.grantRead(group);

        expect(stack).toMatch({
          Resources: {
            MyUserDC45028B: {
              Type: "AWS::IAM::User"
            },
            MyUserDefaultPolicy7B897426: {
              Type: "AWS::IAM::Policy",
              Properties: {
                PolicyDocument: {
                  Statement: [
                    {
                      Action: [
                        "s3:GetObject*",
                        "s3:GetBucket*",
                        "s3:List*"
                      ],
                      Effect: "Allow",
                      Resource: [
                        {
                          "Fn::Join": [
                            "",
                            [
                              "arn",
                              ":",
                              {
                                Ref: "AWS::Partition"
                              },
                              ":",
                              "s3",
                              ":",
                              "",
                              ":",
                              "",
                              ":",
                              {
                                Ref: "MyAssetS3Bucket68C9B344"
                              }
                            ]
                          ]
                        },
                        {
                          "Fn::Join": [
                            "",
                            [
                              {
                                "Fn::Join": [
                                  "",
                                  [
                                    "arn",
                                    ":",
                                    {
                                      Ref: "AWS::Partition"
                                    },
                                    ":",
                                    "s3",
                                    ":",
                                    "",
                                    ":",
                                    "",
                                    ":",
                                    {
                                      Ref: "MyAssetS3Bucket68C9B344"
                                    }
                                  ]
                                ]
                              },
                              "/",
                              {
                                Ref: "MyAssetS3ObjectKeyC07605E4"
                              }
                            ]
                          ]
                        }
                      ]
                    }
                  ],
                  Version: "2012-10-17"
                },
                PolicyName: "MyUserDefaultPolicy7B897426",
                Users: [
                  {
                    Ref: "MyUserDC45028B"
                  }
                ]
              }
            },
            MyGroupCBA54B1B: {
              Type: "AWS::IAM::Group"
            },
            MyGroupDefaultPolicy72C41231: {
              Type: "AWS::IAM::Policy",
              Properties: {
                Groups: [
                  {
                    Ref: "MyGroupCBA54B1B"
                  }
                ],
                PolicyDocument: {
                  Statement: [
                    {
                      Action: [
                        "s3:GetObject*",
                        "s3:GetBucket*",
                        "s3:List*"
                      ],
                      Effect: "Allow",
                      Resource: [
                        {
                          "Fn::Join": [
                            "",
                            [
                              "arn",
                              ":",
                              {
                                Ref: "AWS::Partition"
                              },
                              ":",
                              "s3",
                              ":",
                              "",
                              ":",
                              "",
                              ":",
                              {
                                Ref: "MyAssetS3Bucket68C9B344"
                              }
                            ]
                          ]
                        },
                        {
                          "Fn::Join": [
                            "",
                            [
                              {
                                "Fn::Join": [
                                  "",
                                  [
                                    "arn",
                                    ":",
                                    {
                                      Ref: "AWS::Partition"
                                    },
                                    ":",
                                    "s3",
                                    ":",
                                    "",
                                    ":",
                                    "",
                                    ":",
                                    {
                                      Ref: "MyAssetS3Bucket68C9B344"
                                    }
                                  ]
                                ]
                              },
                              "/",
                              {
                                Ref: "MyAssetS3ObjectKeyC07605E4"
                              }
                            ]
                          ]
                        }
                      ]
                    }
                  ],
                  Version: "2012-10-17"
                },
                PolicyName: "MyGroupDefaultPolicy72C41231"
              }
            }
          },
          Parameters: {
            MyAssetS3Bucket68C9B344: {
              Type: "String",
              Description: "S3 bucket for asset \"MyAsset\""
            },
            MyAssetS3ObjectKeyC07605E4: {
              Type: "String",
              Description: "S3 object for asset \"MyAsset\""
            }
          }
        });

        test.done();
    },
    'fails if directory not found'(test: Test) {
        const stack = new cdk.Stack();
        test.throws(() => new ZipDirectoryAsset(stack, 'MyDirectory', {
            path: '/path/not/found/' + Math.random() * 999999
        }));
        test.done();
    }
};

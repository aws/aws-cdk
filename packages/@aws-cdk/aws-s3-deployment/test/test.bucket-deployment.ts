import { countResources, expect, haveResource } from '@aws-cdk/assert';
import cloudfront = require('@aws-cdk/aws-cloudfront');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import path = require('path');
import s3deploy = require('../lib');
import { CacheControl, Expires, ServerSideEncryption, StorageClass } from '../lib';

/* eslint-disable max-len */
/* eslint-disable quote-props */

export = {
  'deploy from local directory asset'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');

    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket,
    });

    // THEN
    expect(stack).to(haveResource('Custom::CDKBucketDeployment', {
      "ServiceToken": {
        "Fn::GetAtt": [
          "CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C81C01536",
          "Arn"
        ]
      },
      "SourceBucketNames": [{
        "Ref": "AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3Bucket9CD8B20A"
      }],
      "SourceObjectKeys": [{
        "Fn::Join": [
          "",
          [
            {
              "Fn::Select": [
                0,
                {
                  "Fn::Split": [
                    "||",
                    {
                      "Ref": "AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3VersionKeyA58D380C"
                    }
                  ]
                }
              ]
            },
            {
              "Fn::Select": [
                1,
                {
                  "Fn::Split": [
                    "||",
                    {
                      "Ref": "AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3VersionKeyA58D380C"
                    }
                  ]
                }
              ]
            }
          ]
        ]
      }],
      "DestinationBucketName": {
        "Ref": "DestC383B82A"
      }
    }));
    test.done();
  },

  'deploy from local directory assets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');

    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
      sources: [
        s3deploy.Source.asset(path.join(__dirname, 'my-website')),
        s3deploy.Source.asset(path.join(__dirname, 'my-website-second'))
      ],
      destinationBucket: bucket,
    });

    // THEN
    expect(stack).to(haveResource('Custom::CDKBucketDeployment', {
      "ServiceToken": {
        "Fn::GetAtt": [
          "CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C81C01536",
          "Arn"
        ]
      },
      "SourceBucketNames": [
        {
          "Ref": "AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3Bucket9CD8B20A"
        },
        {
          "Ref": "AssetParametersa94977ede0211fd3b45efa33d6d8d1d7bbe0c5a96d977139d8b16abfa96fe9cbS3Bucket99793559"
        }
      ],
      "SourceObjectKeys": [
        {
          "Fn::Join": [
            "",
            [
              {
                "Fn::Select": [
                  0,
                  {
                    "Fn::Split": [
                      "||",
                      {
                        "Ref": "AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3VersionKeyA58D380C"
                      }
                    ]
                  }
                ]
              },
              {
                "Fn::Select": [
                  1,
                  {
                    "Fn::Split": [
                      "||",
                      {
                        "Ref": "AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3VersionKeyA58D380C"
                      }
                    ]
                  }
                ]
              }
            ]
          ]
        },
        {
          "Fn::Join": [
            "",
            [
              {
                "Fn::Select": [
                  0,
                  {
                    "Fn::Split": [
                      "||",
                      {
                        "Ref": "AssetParametersa94977ede0211fd3b45efa33d6d8d1d7bbe0c5a96d977139d8b16abfa96fe9cbS3VersionKeyD9ACE665"
                      }
                    ]
                  }
                ]
              },
              {
                "Fn::Select": [
                  1,
                  {
                    "Fn::Split": [
                      "||",
                      {
                        "Ref": "AssetParametersa94977ede0211fd3b45efa33d6d8d1d7bbe0c5a96d977139d8b16abfa96fe9cbS3VersionKeyD9ACE665"
                      }
                    ]
                  }
                ]
              }
            ]
          ]
        }
      ],
      "DestinationBucketName": {
        "Ref": "DestC383B82A"
      }
    }));
    test.done();
  },

  'fails if local asset is a non-zip file'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');

    // THEN
    test.throws(() => new s3deploy.BucketDeployment(stack, 'Deploy', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website', 'index.html'))],
      destinationBucket: bucket,
    }), /Asset path must be either a \.zip file or a directory/);

    test.done();
  },

  'deploy from a local .zip file'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');

    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
      destinationBucket: bucket,
    });

    test.done();
  },

  'retainOnDelete can be used to retain files when resource is deleted'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');

    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
      destinationBucket: bucket,
      retainOnDelete: true,
    });

    expect(stack).to(haveResource('Custom::CDKBucketDeployment', {
      RetainOnDelete: true
    }));

    test.done();
  },

  'object metadata can be given'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');

    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
      destinationBucket: bucket,
      metadata: { "A": "1", "b": "2" },
      contentType: "text/html",
      contentLanguage: "en",
      storageClass: StorageClass.INTELLIGENT_TIERING,
      contentDisposition: "inline",
      serverSideEncryption: ServerSideEncryption.AES_256,
      cacheControl: [CacheControl.setPublic(), CacheControl.maxAge(cdk.Duration.hours(1))],
      expires: Expires.after(cdk.Duration.hours(12))
    });

    // THEN
    expect(stack).to(haveResource('Custom::CDKBucketDeployment', {
      UserMetadata: { 'x-amzn-meta-a': '1', 'x-amzn-meta-b': '2' },
      SystemMetadata: {
        'content-type': 'text/html',
        'content-language': 'en',
        'content-disposition': 'inline',
        'storage-class': 'INTELLIGENT_TIERING',
        'server-side-encryption': 'AES256',
        'cache-control': 'public, max-age=3600',
        'expires': new Date(Date.now() + 12 * 60 * 60 * 1000).toUTCString()
      }
    }));

    test.done();
  },

  'distribution can be used to provide a CloudFront distribution for invalidation'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    const distribution = new cloudfront.CloudFrontWebDistribution(stack, 'Distribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket
          },
          behaviors: [{ isDefaultBehavior: true }]
        }
      ]
    });

    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/images/*']
    });

    expect(stack).to(haveResource('Custom::CDKBucketDeployment', {
      DistributionId: {
        "Ref": "DistributionCFDistribution882A7313"
      },
      DistributionPaths: ['/images/*']
    }));

    test.done();
  },

  'invalidation can happen without distributionPaths provided'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    const distribution = new cloudfront.CloudFrontWebDistribution(stack, 'Distribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket
          },
          behaviors: [{ isDefaultBehavior: true }]
        }
      ]
    });

    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
      destinationBucket: bucket,
      distribution,
    });

    expect(stack).to(haveResource('Custom::CDKBucketDeployment', {
      DistributionId: {
        "Ref": "DistributionCFDistribution882A7313"
      },
    }));

    test.done();
  },

  'fails if distribution paths provided but not distribution ID'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');

    // THEN
    test.throws(() => new s3deploy.BucketDeployment(stack, 'Deploy', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website', 'index.html'))],
      destinationBucket: bucket,
      distributionPaths: ['/images/*']
    }), /Distribution must be specified if distribution paths are specified/);

    test.done();
  },

  'lambda execution role gets permissions to read from the source bucket and read/write in destination'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const source = new s3.Bucket(stack, 'Source');
    const bucket = new s3.Bucket(stack, 'Dest');

    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
      sources: [s3deploy.Source.bucket(source, 'file.zip')],
      destinationBucket: bucket,
    });

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      "PolicyDocument": {
        "Statement": [
          {
            "Action": [
              "s3:GetObject*",
              "s3:GetBucket*",
              "s3:List*"
            ],
            "Effect": "Allow",
            "Resource": [
              {
                "Fn::GetAtt": [
                  "Source71E471F1",
                  "Arn"
                ]
              },
              {
                "Fn::Join": [
                  "",
                  [
                    {
                      "Fn::GetAtt": [
                        "Source71E471F1",
                        "Arn"
                      ]
                    },
                    "/*"
                  ]
                ]
              }
            ]
          },
          {
            "Action": [
              "s3:GetObject*",
              "s3:GetBucket*",
              "s3:List*",
              "s3:DeleteObject*",
              "s3:PutObject*",
              "s3:Abort*"
            ],
            "Effect": "Allow",
            "Resource": [
              {
                "Fn::GetAtt": [
                  "DestC383B82A",
                  "Arn"
                ]
              },
              {
                "Fn::Join": [
                  "",
                  [
                    {
                      "Fn::GetAtt": [
                        "DestC383B82A",
                        "Arn"
                      ]
                    },
                    "/*"
                  ]
                ]
              }
            ]
          }
        ],
        "Version": "2012-10-17"
      },
      "PolicyName": "CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRoleDefaultPolicy88902FDF",
      "Roles": [
        {
          "Ref": "CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265"
        }
      ]
    }));
    test.done();
  },

  'memoryLimit can be used to specify the memory limit for the deployment resource handler'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');

    // WHEN

    // we define 3 deployments with 2 different memory configurations

    new s3deploy.BucketDeployment(stack, 'Deploy256-1', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket,
      memoryLimit: 256
    });

    new s3deploy.BucketDeployment(stack, 'Deploy256-2', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket,
      memoryLimit: 256
    });

    new s3deploy.BucketDeployment(stack, 'Deploy1024', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket,
      memoryLimit: 1024
    });

    // THEN

    // we expect to find only two handlers, one for each configuration

    expect(stack).to(countResources('AWS::Lambda::Function', 2));
    expect(stack).to(haveResource('AWS::Lambda::Function', { MemorySize: 256 }));
    expect(stack).to(haveResource('AWS::Lambda::Function', { MemorySize: 1024 }));
    test.done();
  },

  'deployment allows custom role to be supplied'(test: Test) {

    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');
    const existingRole = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazon.com')
    });

    // WHEN
    new s3deploy.BucketDeployment(stack, 'DeployWithRole', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
      destinationBucket: bucket,
      role: existingRole
    });

    // THEN
    expect(stack).to(countResources('AWS::IAM::Role', 1));
    expect(stack).to(countResources('AWS::Lambda::Function', 1));
    expect(stack).to(haveResource('AWS::Lambda::Function', {
      "Role": {
        "Fn::GetAtt": [
          "Role1ABCC5F0",
          "Arn"
        ]
      }
    }));
    test.done();
  }
};
